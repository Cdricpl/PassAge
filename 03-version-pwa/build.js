#!/usr/bin/env node
/**
 * build.js — Pass'âge content builder
 *
 * Reads YAML sources from content/modules/*.yaml and content/lexique.yaml,
 * generates the JS arrays for MODULES and LEXIQUE, injects them into
 * content/content.template.js, and writes assets/js/content.js.
 *
 * Also bumps the version suffix in:
 *   - assets/js/content.js
 *   - index.html
 *   - service-worker.js (also bumps the VERSION constant)
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// ── paths ─────────────────────────────────────────────────────────────────────
const ROOT      = __dirname;
const TEMPLATE  = path.join(ROOT, 'content', 'content.template.js');
const OUT       = path.join(ROOT, 'assets', 'js', 'content.js');
const MOD_DIR   = path.join(ROOT, 'content', 'modules');
const LEX_FILE  = path.join(ROOT, 'content', 'lexique.yaml');

// Canonical module order
const MODULE_ORDER = [
  'majeur', 'admin', 'argent', 'etudes', 'travail',
  'logement', 'vie', 'loisirs', 'sante', 'urgence'
];

// ── helpers ───────────────────────────────────────────────────────────────────

/**
 * Escape any backtick or ${...} inside an HTML body string so it can safely
 * be placed inside a JS template literal.
 */
function escapeTemplateLiteral(s) {
  // Escape backticks and template expression starts
  return s.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

/**
 * Generate the JS source for a single module object.
 */
function moduleToJs(mod) {
  const lines = [];
  lines.push('    {');
  lines.push(`      id: ${JSON.stringify(mod.id)},`);
  lines.push(`      title: ${JSON.stringify(mod.title)},`);
  lines.push(`      subtitle: ${JSON.stringify(mod.subtitle)},`);
  lines.push(`      color: ${JSON.stringify(mod.color)},`);
  lines.push(`      icon: ICONS.${mod.icon},`);
  lines.push(`      objective: ${JSON.stringify(mod.objective)},`);
  lines.push(`      source: ${JSON.stringify(mod.source)},`);
  lines.push('      sections: [');

  for (const sec of mod.sections) {
    lines.push('        {');
    lines.push(`          id: ${JSON.stringify(sec.id)},`);
    lines.push(`          title: ${JSON.stringify(sec.title)},`);
    lines.push(`          summary: ${JSON.stringify(sec.summary)},`);

    if (sec.linkTo) {
      // redirect section — no body
      lines.push(`          linkTo: ${JSON.stringify(sec.linkTo)}`);
    } else {
      // normal section — may have extra metadata fields
      if (sec.source !== undefined) {
        lines.push(`          source: ${JSON.stringify(sec.source)},`);
      }
      if (sec.lastChecked !== undefined) {
        lines.push(`          lastChecked: ${JSON.stringify(sec.lastChecked)},`);
      }
      if (sec.disclaimer !== undefined) {
        lines.push(`          disclaimer: ${JSON.stringify(sec.disclaimer)},`);
      }
      if (sec.status !== undefined) {
        lines.push(`          status: ${JSON.stringify(sec.status)},`);
      }
      if (sec.reviewedBy !== undefined) {
        lines.push(`          reviewedBy: ${JSON.stringify(sec.reviewedBy)},`);
      }
      if (sec.internalNotes !== undefined) {
        lines.push(`          internalNotes: ${JSON.stringify(sec.internalNotes)},`);
      }

      // body as template literal
      const bodyRaw = sec.body || '';
      // The YAML literal block scalar strips leading newline; we want to
      // preserve the structure. Trim trailing whitespace on each line but
      // keep the content otherwise.
      const bodyEscaped = escapeTemplateLiteral(bodyRaw);
      lines.push(`          body: \`\n${bodyEscaped}\``);
    }

    lines.push('        },');
  }

  lines.push('      ]');
  lines.push('    }');
  return lines.join('\n');
}

/**
 * Generate the JS source for the LEXIQUE object.
 */
function lexiqueToJs(lex) {
  const lines = [];
  lines.push('{');
  for (const [key, refs] of Object.entries(lex)) {
    const refsJs = refs.map(r => JSON.stringify(r)).join(', ');
    lines.push(`    ${JSON.stringify(key)}: [${refsJs}],`);
  }
  lines.push('  }');
  return lines.join('\n');
}

// ── version bump ──────────────────────────────────────────────────────────────

/**
 * Read the current version string "YYYY-MM-DD-NN" from content.js
 * (pattern: content.js?v=...) and return the bumped version.
 */
function bumpVersion(currentContent) {
  const m = currentContent.match(/content\.js\?v=([\w-]+)/);
  if (!m) {
    // Fallback: use today's date with suffix -01
    const today = new Date().toISOString().slice(0, 10);
    return `${today}-01`;
  }
  const ver = m[1]; // e.g. "2026-06-03-09"
  const parts = ver.split('-');
  if (parts.length >= 4) {
    const num = parseInt(parts[parts.length - 1], 10);
    parts[parts.length - 1] = String(num + 1).padStart(2, '0');
    return parts.join('-');
  }
  // Append -02 if no trailing number
  return `${ver}-02`;
}

function applyVersionBump(filePath, oldVer, newVer) {
  let src = fs.readFileSync(filePath, 'utf8');
  const updated = src.replaceAll(oldVer, newVer);
  if (updated === src) {
    console.warn(`  [warn] no version token "${oldVer}" found in ${path.relative(ROOT, filePath)}`);
  } else {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`  bumped version in ${path.relative(ROOT, filePath)}`);
  }
}

// ── main ──────────────────────────────────────────────────────────────────────

function main() {
  console.log('Pass\'âge build.js — generating content.js from YAML sources…\n');

  // 1. Read all module YAML files in canonical order
  const modules = [];
  for (const modId of MODULE_ORDER) {
    const modFile = path.join(MOD_DIR, `${modId}.yaml`);
    if (!fs.existsSync(modFile)) {
      console.error(`ERROR: missing module file: ${modFile}`);
      process.exit(1);
    }
    const raw = fs.readFileSync(modFile, 'utf8');
    const mod = yaml.load(raw);
    modules.push(mod);
    console.log(`  loaded module: ${modId} (${mod.sections ? mod.sections.length : 0} sections)`);
  }

  // 2. Read lexique YAML
  const lexRaw  = fs.readFileSync(LEX_FILE, 'utf8');
  const lexique = yaml.load(lexRaw);
  console.log(`  loaded lexique: ${Object.keys(lexique).length} entries\n`);

  // 3. Generate JS snippets
  const modulesJs = '[\n' + modules.map(moduleToJs).join(',\n\n') + '\n  ]';
  const lexiqueJs = lexiqueToJs(lexique);

  // 4. Read template and replace placeholders
  const template = fs.readFileSync(TEMPLATE, 'utf8');
  let output = template
    .replace('/* MODULES_PLACEHOLDER */', modulesJs)
    .replace('/* LEXIQUE_PLACEHOLDER */', lexiqueJs);

  // 5. Determine version bump
  // Read old version from index.html (the canonical source for the version token)
  let oldVer = null;
  let newVer = null;
  const indexHtml = path.join(ROOT, 'index.html');
  if (fs.existsSync(indexHtml)) {
    const indexContent = fs.readFileSync(indexHtml, 'utf8');
    const m = indexContent.match(/content\.js\?v=([\w-]+)/);
    if (m) {
      oldVer = m[1];
      const parts = oldVer.split('-');
      if (parts.length >= 4) {
        const num = parseInt(parts[parts.length - 1], 10);
        parts[parts.length - 1] = String(num + 1).padStart(2, '0');
        newVer = parts.join('-');
      } else {
        newVer = `${oldVer}-02`;
      }
    }
  }
  if (!newVer) {
    const today = new Date().toISOString().slice(0, 10);
    newVer = `${today}-01`;
  }
  console.log(`  version: ${oldVer || '(none)'} → ${newVer}`);

  // 6. Write content.js (with GENERATED comment at top)
  // The template already starts with the GENERATED comment
  fs.writeFileSync(OUT, output, 'utf8');
  console.log(`  wrote ${path.relative(ROOT, OUT)}`);

  // 7. Bump version in index.html and service-worker.js
  // (content.js itself doesn't contain the version token — it's referenced externally)
  if (oldVer) {
    applyVersionBump(path.join(ROOT, 'index.html'), oldVer, newVer);
    applyVersionBump(path.join(ROOT, 'service-worker.js'), oldVer, newVer);
  } else {
    console.log('  (no old version found — skipping version bump in other files)');
  }

  // 8. Summary
  const totalSections = modules.reduce((n, m) => n + (m.sections ? m.sections.length : 0), 0);
  console.log(`\nDone. ${modules.length} modules, ${totalSections} sections, ${Object.keys(lexique).length} lexique entries.`);
  console.log(`Output: ${OUT}`);
}

main();
