#!/usr/bin/env python3
"""
Extract content.js → YAML files for Pass'âge
Reads assets/js/content.js and generates:
  - content/modules/{modid}.yaml  (one per module)
  - content/lexique.yaml
"""

import re
import os
import sys

# ── helpers ──────────────────────────────────────────────────────────────────

def write_yaml_file(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f"  wrote {path}")


def yaml_str(s):
    """Return a safe YAML scalar for a simple string (double-quoted)."""
    if s is None:
        return '""'
    # escape backslash first, then double-quotes
    escaped = s.replace('\\', '\\\\').replace('"', '\\"')
    return f'"{escaped}"'


def yaml_block_body(body_text, indent=4):
    """Return a YAML literal block scalar for HTML body content."""
    pad = ' ' * indent
    # Make sure no trailing spaces on lines, keep all content as-is
    lines = body_text.split('\n')
    # Remove first and last lines if they are empty (template literal convention)
    if lines and lines[0].strip() == '':
        lines = lines[1:]
    if lines and lines[-1].strip() == '':
        lines = lines[:-1]
    # Escape any backticks in HTML (shouldn't exist, but be safe)
    result_lines = [pad + line for line in lines]
    return '|\n' + '\n'.join(result_lines)


# ── parsing ──────────────────────────────────────────────────────────────────

def read_content_js():
    path = os.path.join(os.path.dirname(__file__), 'assets/js/content.js')
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()


def extract_modules_block(src):
    """Return the text between 'const MODULES = [' and the matching '];'"""
    start = src.index('const MODULES = [')
    # Find the matching ]; by counting brackets
    pos = start + len('const MODULES = [')
    depth = 1
    while depth > 0 and pos < len(src):
        c = src[pos]
        if c == '[':
            depth += 1
        elif c == ']':
            depth -= 1
        pos += 1
    return src[start:pos]


def extract_lexique_block(src):
    """Return the text between 'const LEXIQUE = {' and matching '};'"""
    start = src.index('const LEXIQUE = {')
    pos = start + len('const LEXIQUE = {')
    depth = 1
    while depth > 0 and pos < len(src):
        c = src[pos]
        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
        pos += 1
    return src[start:pos]


# ── template-literal body extractor ──────────────────────────────────────────

def extract_template_body(src, start_pos):
    """
    Given that src[start_pos] == '`', extract the full template literal body.
    Returns (body_text, end_pos) where end_pos is right after the closing backtick.
    Handles nested ${...} expressions by skipping them.
    """
    assert src[start_pos] == '`', f"Expected backtick at {start_pos}"
    pos = start_pos + 1
    body = []
    while pos < len(src):
        c = src[pos]
        if c == '`':
            return ''.join(body), pos + 1
        elif c == '\\':
            # escape sequence inside template literal
            body.append(src[pos:pos+2])
            pos += 2
        elif c == '$' and pos + 1 < len(src) and src[pos+1] == '{':
            # Template expression — skip (these shouldn't exist in our content)
            depth = 1
            body.append('${')
            pos += 2
            while pos < len(src) and depth > 0:
                if src[pos] == '{':
                    depth += 1
                elif src[pos] == '}':
                    depth -= 1
                if depth > 0:
                    body.append(src[pos])
                pos += 1
            body.append('}')
        else:
            body.append(c)
            pos += 1
    raise ValueError(f"Unterminated template literal starting at {start_pos}")


# ── Section parser ────────────────────────────────────────────────────────────

def parse_string_value(src, pos):
    """
    Parse a JS string value starting at pos (which should be ', ", or `).
    Returns (string_value, end_pos).
    """
    quote = src[pos]
    if quote == '`':
        body, end = extract_template_body(src, pos)
        return body, end
    # single or double quoted
    pos += 1
    chars = []
    while pos < len(src):
        c = src[pos]
        if c == '\\':
            nc = src[pos+1]
            if nc == 'n':
                chars.append('\n')
            elif nc == 't':
                chars.append('\t')
            elif nc == "'":
                chars.append("'")
            elif nc == '"':
                chars.append('"')
            elif nc == '\\':
                chars.append('\\')
            else:
                chars.append(nc)
            pos += 2
        elif c == quote:
            return ''.join(chars), pos + 1
        else:
            chars.append(c)
            pos += 1
    raise ValueError(f"Unterminated string at {pos}")


def parse_js_object(src, start_pos):
    """
    Parse a JS object literal { ... } starting at start_pos.
    Returns (dict_of_known_keys, end_pos).
    Handles: id, title, subtitle, summary, lastChecked, linkTo, body, icon, objective, source, color.
    """
    assert src[start_pos] == '{', f"Expected {{ at {start_pos}, got {src[start_pos:start_pos+10]!r}"
    pos = start_pos + 1
    result = {}

    while pos < len(src):
        # skip whitespace and commas
        while pos < len(src) and src[pos] in ' \t\n\r,':
            pos += 1

        if pos >= len(src) or src[pos] == '}':
            return result, pos + 1

        # read key
        if src[pos] in ("'", '"'):
            key, pos = parse_string_value(src, pos)
        elif src[pos].isalpha() or src[pos] == '_':
            # bare identifier
            end = pos
            while end < len(src) and (src[end].isalnum() or src[end] == '_'):
                end += 1
            key = src[pos:end]
            pos = end
        else:
            # Skip unknown token
            pos += 1
            continue

        # skip whitespace
        while pos < len(src) and src[pos] in ' \t\n\r':
            pos += 1

        # expect ':'
        if pos >= len(src) or src[pos] != ':':
            continue
        pos += 1

        # skip whitespace
        while pos < len(src) and src[pos] in ' \t\n\r':
            pos += 1

        # read value
        if pos >= len(src):
            break

        c = src[pos]
        if c in ("'", '"', '`'):
            val, pos = parse_string_value(src, pos)
            result[key] = val
        elif src[pos:pos+5] == 'ICONS':
            # ICONS.something
            dot_pos = src.index('.', pos)
            end = dot_pos + 1
            while end < len(src) and (src[end].isalnum() or src[end] == '_' or src[end] == '-'):
                end += 1
            icon_name = src[dot_pos+1:end]
            result[key] = f'ICONS.{icon_name}'
            pos = end
        elif c == '[':
            # array value — skip for now (sections handled separately)
            depth = 1
            pos += 1
            while pos < len(src) and depth > 0:
                if src[pos] == '[':
                    depth += 1
                elif src[pos] == ']':
                    depth -= 1
                pos += 1
            # We don't store arrays here
        elif c == '{':
            # nested object — skip
            depth = 1
            pos += 1
            while pos < len(src) and depth > 0:
                if src[pos] == '{':
                    depth += 1
                elif src[pos] == '}':
                    depth -= 1
                pos += 1
        else:
            # unquoted value (true/false/number/identifier)
            end = pos
            while end < len(src) and src[end] not in ' \t\n\r,}':
                end += 1
            val = src[pos:end].strip()
            result[key] = val
            pos = end

    return result, pos


def parse_sections(src, sections_start):
    """
    Parse the sections array starting at sections_start (which points to '[').
    Returns list of section dicts.
    """
    assert src[sections_start] == '[', f"Expected [ at {sections_start}"
    pos = sections_start + 1
    sections = []

    while pos < len(src):
        # skip whitespace and commas
        while pos < len(src) and src[pos] in ' \t\n\r,':
            pos += 1

        if pos >= len(src) or src[pos] == ']':
            return sections, pos + 1

        if src[pos] == '{':
            section, pos = parse_js_object(src, pos)
            if section:
                sections.append(section)
        else:
            pos += 1

    return sections, pos


def parse_module(src, mod_start):
    """
    Parse a module object { id: ..., sections: [...], ... }
    Returns (module_dict, end_pos).
    module_dict has keys: id, title, subtitle, color, icon, objective, source, sections
    """
    assert src[mod_start] == '{', f"Expected {{ at {mod_start}"
    pos = mod_start + 1
    module = {}
    sections = []

    while pos < len(src):
        # skip whitespace and commas
        while pos < len(src) and src[pos] in ' \t\n\r,':
            pos += 1

        if pos >= len(src) or src[pos] == '}':
            module['sections'] = sections
            return module, pos + 1

        # read key
        if src[pos] in ("'", '"'):
            key, pos = parse_string_value(src, pos)
        elif src[pos].isalpha() or src[pos] == '_':
            end = pos
            while end < len(src) and (src[end].isalnum() or src[end] == '_'):
                end += 1
            key = src[pos:end]
            pos = end
        else:
            pos += 1
            continue

        # skip whitespace
        while pos < len(src) and src[pos] in ' \t\n\r':
            pos += 1

        # expect ':'
        if pos >= len(src) or src[pos] != ':':
            continue
        pos += 1

        # skip whitespace
        while pos < len(src) and src[pos] in ' \t\n\r':
            pos += 1

        if pos >= len(src):
            break

        c = src[pos]

        if key == 'sections':
            if c == '[':
                sections, pos = parse_sections(src, pos)
        elif c in ("'", '"', '`'):
            val, pos = parse_string_value(src, pos)
            module[key] = val
        elif src[pos:pos+5] == 'ICONS':
            dot_pos = src.index('.', pos)
            end = dot_pos + 1
            while end < len(src) and (src[end].isalnum() or src[end] == '_' or src[end] == '-'):
                end += 1
            icon_name = src[dot_pos+1:end]
            module[key] = f'ICONS.{icon_name}'
            pos = end
        elif c == '[':
            # skip array (relatedModules etc.)
            depth = 1
            pos += 1
            while pos < len(src) and depth > 0:
                if src[pos] == '[':
                    depth += 1
                elif src[pos] == ']':
                    depth -= 1
                pos += 1
        elif c == '{':
            depth = 1
            pos += 1
            while pos < len(src) and depth > 0:
                if src[pos] == '{':
                    depth += 1
                elif src[pos] == '}':
                    depth -= 1
                pos += 1
        else:
            end = pos
            while end < len(src) and src[end] not in ' \t\n\r,}':
                end += 1
            module[key] = src[pos:end].strip()
            pos = end

    module['sections'] = sections
    return module, pos


def parse_all_modules(modules_block):
    """Parse the full MODULES array block."""
    # Find the opening '[' of the array
    start = modules_block.index('[')
    pos = start + 1
    modules = []

    while pos < len(modules_block):
        while pos < len(modules_block) and modules_block[pos] in ' \t\n\r,':
            pos += 1

        if pos >= len(modules_block) or modules_block[pos] == ']':
            break

        if modules_block[pos] == '{':
            mod, pos = parse_module(modules_block, pos)
            if mod.get('id'):
                modules.append(mod)
        else:
            pos += 1

    return modules


def parse_lexique(lexique_block):
    """
    Parse the LEXIQUE object block.
    Returns dict of { key: [list of paths] }
    """
    # Find opening '{'
    start = lexique_block.index('{')
    pos = start + 1
    result = {}

    while pos < len(lexique_block):
        while pos < len(lexique_block) and lexique_block[pos] in ' \t\n\r,':
            pos += 1

        if pos >= len(lexique_block) or lexique_block[pos] == '}':
            break

        # skip comment lines
        if lexique_block[pos:pos+2] == '//':
            end = lexique_block.index('\n', pos)
            pos = end + 1
            continue

        # read key
        if lexique_block[pos] in ("'", '"'):
            key, pos = parse_string_value(lexique_block, pos)
        else:
            pos += 1
            continue

        # skip whitespace
        while pos < len(lexique_block) and lexique_block[pos] in ' \t\n\r':
            pos += 1

        if lexique_block[pos] != ':':
            continue
        pos += 1

        while pos < len(lexique_block) and lexique_block[pos] in ' \t\n\r':
            pos += 1

        # read array of strings
        if lexique_block[pos] != '[':
            continue
        pos += 1

        paths = []
        while pos < len(lexique_block):
            while pos < len(lexique_block) and lexique_block[pos] in ' \t\n\r,':
                pos += 1
            if lexique_block[pos] == ']':
                pos += 1
                break
            if lexique_block[pos] in ("'", '"'):
                val, pos = parse_string_value(lexique_block, pos)
                paths.append(val)
            else:
                pos += 1

        result[key] = paths

    return result


# ── YAML generation ───────────────────────────────────────────────────────────

def module_to_yaml(mod):
    lines = []

    mod_id = mod.get('id', '')
    lines.append(f"id: {mod_id}")
    lines.append(f"title: {yaml_str(mod.get('title', ''))}")
    lines.append(f"subtitle: {yaml_str(mod.get('subtitle', ''))}")
    lines.append(f"color: {mod.get('color', mod_id)}")

    # icon: ICONS.xxx → extract "xxx"
    icon_val = mod.get('icon', '')
    if icon_val.startswith('ICONS.'):
        icon_name = icon_val[6:]
    else:
        icon_name = icon_val
    lines.append(f"icon: {icon_name}")

    lines.append(f"objective: {yaml_str(mod.get('objective', ''))}")
    lines.append(f"source: {yaml_str(mod.get('source', ''))}")
    lines.append("sections:")

    for section in mod.get('sections', []):
        sec_id = section.get('id', '')
        lines.append(f"  - id: {sec_id}")
        lines.append(f"    title: {yaml_str(section.get('title', ''))}")
        lines.append(f"    summary: {yaml_str(section.get('summary', ''))}")

        if 'linkTo' in section:
            lines.append(f"    linkTo: {section['linkTo']}")
        else:
            if 'lastChecked' in section:
                lines.append(f"    lastChecked: {yaml_str(section['lastChecked'])}")

            # Extra optional fields
            for field in ('source', 'disclaimer', 'status', 'reviewedBy', 'internalNotes'):
                if field in section:
                    lines.append(f"    {field}: {yaml_str(section[field])}")

            body = section.get('body', '')
            if body:
                lines.append(f"    body: {yaml_block_body(body, indent=6)}")
            else:
                lines.append(f"    body: \"\"")

    return '\n'.join(lines) + '\n'


def lexique_to_yaml(lex):
    lines = []
    for key, paths in lex.items():
        # keys are already plain strings
        # Use double-quoted key to be safe with special chars
        lines.append(f"{yaml_str(key)}:")
        for path in paths:
            lines.append(f"  - {path}")
    return '\n'.join(lines) + '\n'


# ── main ──────────────────────────────────────────────────────────────────────

def main():
    print("Reading content.js...")
    src = read_content_js()

    print("Extracting MODULES block...")
    modules_block = extract_modules_block(src)
    modules = parse_all_modules(modules_block)
    print(f"  Found {len(modules)} modules")

    module_order = ['admin', 'argent', 'etudes', 'travail', 'logement', 'vie', 'loisirs', 'sante', 'urgence']

    base_dir = os.path.dirname(__file__)
    modules_dir = os.path.join(base_dir, 'content', 'modules')
    os.makedirs(modules_dir, exist_ok=True)

    for mod in modules:
        mod_id = mod.get('id', 'unknown')
        sections = mod.get('sections', [])
        print(f"  Module {mod_id}: {len(sections)} sections")
        yaml_text = module_to_yaml(mod)
        out_path = os.path.join(modules_dir, f"{mod_id}.yaml")
        write_yaml_file(out_path, yaml_text)

    print("Extracting LEXIQUE block...")
    lexique_block = extract_lexique_block(src)
    lex = parse_lexique(lexique_block)
    print(f"  Found {len(lex)} lexique entries")

    lex_path = os.path.join(base_dir, 'content', 'lexique.yaml')
    write_yaml_file(lex_path, lexique_to_yaml(lex))

    print("Done!")


if __name__ == '__main__':
    main()
