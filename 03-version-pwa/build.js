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
const ROOT         = __dirname;
const TEMPLATE     = path.join(ROOT, 'content', 'content.template.js');
const OUT          = path.join(ROOT, 'assets', 'js', 'content.js');
const MOD_DIR      = path.join(ROOT, 'content', 'modules');
const LEX_FILE     = path.join(ROOT, 'content', 'lexique.yaml');
const APROPOS_FILE = path.join(ROOT, 'content', 'apropos.yaml');

// Canonical module order
const MODULE_ORDER = [
  'admin', 'argent', 'etudes', 'travail',
  'logement', 'vie', 'loisirs', 'sante', 'placement', 'urgence'
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

// ── validation ────────────────────────────────────────────────────────────────

/**
 * Validate the loaded content before generating anything.
 * Returns an array of human-readable error strings (empty = all good).
 * Checks: required fields, duplicate ids, known icons/colors, balanced HTML
 * tags, internal #/fiche/ links, linkTo targets, and lexique paths.
 */
function validateContent(modules, lexique, template) {
  const errors = [];
  const selfClosing = new Set(['br', 'hr', 'img', 'input', 'meta', 'link']);

  // Icon keys defined in the template's ICONS object
  const iconKeys = new Set();
  const iconBlock = template.match(/const ICONS = \{([\s\S]*?)\n  \};/);
  if (iconBlock) {
    for (const m of iconBlock[1].matchAll(/^\s*(\w+):/gm)) iconKeys.add(m[1]);
  }

  // Redirect sources defined in the template's REDIRECTS object
  const validPaths = new Set();
  for (const m of template.matchAll(/'([\w-]+\/[\w-]+)':\s*'[\w-]+\/[\w-]+'/g)) {
    validPaths.add(m[1]);
  }

  // First pass: collect every module/section path, check structure
  for (const mod of modules) {
    if (!mod.id || !mod.title) errors.push(`module "${mod.id || '?'}": id ou title manquant`);
    if (mod.icon && iconKeys.size && !iconKeys.has(mod.icon)) {
      errors.push(`module "${mod.id}": icône inconnue "${mod.icon}"`);
    }
    if (mod.color && !MODULE_ORDER.includes(mod.color)) {
      errors.push(`module "${mod.id}": couleur inconnue "${mod.color}"`);
    }
    const seen = new Set();
    for (const sec of mod.sections || []) {
      if (!sec.id || !sec.title || !sec.summary) {
        errors.push(`${mod.id}/${sec.id || '?'}: id, title ou summary manquant`);
      }
      if (seen.has(sec.id)) errors.push(`${mod.id}/${sec.id}: id de section dupliqué`);
      seen.add(sec.id);
      if (!sec.linkTo && !sec.body) errors.push(`${mod.id}/${sec.id}: ni body ni linkTo`);
      validPaths.add(`${mod.id}/${sec.id}`);
    }
  }

  // Second pass: HTML balance, hrefs, linkTo targets
  for (const mod of modules) {
    for (const sec of mod.sections || []) {
      if (sec.linkTo) {
        if (!validPaths.has(sec.linkTo)) {
          errors.push(`${mod.id}/${sec.id}: linkTo cassé → ${sec.linkTo}`);
        }
        continue;
      }
      const body = sec.body || '';
      const stack = [];
      for (const m of body.matchAll(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*?(\/?)>/g)) {
        const tag = m[1].toLowerCase();
        if (selfClosing.has(tag) || m[2] === '/') continue;
        if (m[0][1] === '/') {
          if (stack[stack.length - 1] === tag) stack.pop();
          else errors.push(`${mod.id}/${sec.id}: balise fermante </${tag}> inattendue`);
        } else {
          stack.push(tag);
        }
      }
      if (stack.length) {
        errors.push(`${mod.id}/${sec.id}: balises non fermées [${stack.join(', ')}]`);
      }
      for (const m of body.matchAll(/href="([^"]+)"/g)) {
        const h = m[1];
        if (h.startsWith('#/fiche/')) {
          if (!validPaths.has(h.slice(8))) {
            errors.push(`${mod.id}/${sec.id}: lien interne cassé → ${h}`);
          }
        } else if (!h.startsWith('http') && !h.startsWith('#/') && !h.startsWith('tel:')) {
          errors.push(`${mod.id}/${sec.id}: href suspect → ${h}`);
        }
      }
    }
  }

  // Lexique paths must resolve
  for (const [key, refs] of Object.entries(lexique)) {
    for (const r of refs || []) {
      if (!validPaths.has(r)) errors.push(`lexique "${key}": chemin cassé → ${r}`);
    }
  }

  return errors;
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
  console.log(`  loaded lexique: ${Object.keys(lexique).length} entries`);

  // 2b. Read apropos YAML
  const apropos = yaml.load(fs.readFileSync(APROPOS_FILE, 'utf8'));
  console.log(`  loaded apropos: ${(apropos.sources || []).length} source groups\n`);

  // 3. Validate content before generating anything
  const template = fs.readFileSync(TEMPLATE, 'utf8');
  const errors = validateContent(modules, lexique, template);
  if (errors.length) {
    console.error(`\nERREUR — ${errors.length} problème(s) détecté(s), build annulé :\n`);
    for (const e of errors) console.error(`  ✗ ${e}`);
    process.exit(1);
  }
  console.log('  validation: OK (HTML, liens internes, lexique, icônes, couleurs)\n');

  // 4. Generate JS snippets and replace placeholders
  const modulesJs = '[\n' + modules.map(moduleToJs).join(',\n\n') + '\n  ]';
  const lexiqueJs = lexiqueToJs(lexique);
  let output = template
    .replace('/* MODULES_PLACEHOLDER */', modulesJs)
    .replace('/* LEXIQUE_PLACEHOLDER */', lexiqueJs)
    .replace('/* APROPOS_PLACEHOLDER */', JSON.stringify(apropos, null, 4));

  // 5. Determine version bump
  // oldVer is read from the repo's index.html (never updated back to repo).
  // newVer is always a fresh timestamp so each CI build produces a unique URL
  // and the browser/SW always fetches new content.
  let oldVer = null;
  const indexHtml = path.join(ROOT, 'index.html');
  if (fs.existsSync(indexHtml)) {
    const m = fs.readFileSync(indexHtml, 'utf8').match(/content\.js\?v=([\w-]+)/);
    if (m) oldVer = m[1];
  }
  const now = new Date();
  const newVer = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
    String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0')
  ].join('-');
  console.log(`  version: ${oldVer || '(none)'} → ${newVer}`);

  // 6. Write content.js (with GENERATED comment at top)
  // The template already starts with the GENERATED comment
  fs.writeFileSync(OUT, output, 'utf8');
  console.log(`  wrote ${path.relative(ROOT, OUT)}`);

  // 7. Bump version in index.html and service-worker.js
  if (oldVer) {
    applyVersionBump(path.join(ROOT, 'index.html'), oldVer, newVer);
    applyVersionBump(path.join(ROOT, 'service-worker.js'), oldVer, newVer);
  } else {
    console.log('  (no old version found — skipping version bump in other files)');
  }
  // Also update SW VERSION constant so the cache name changes and old caches are cleaned up
  const swPath = path.join(ROOT, 'service-worker.js');
  let swSrc = fs.readFileSync(swPath, 'utf8');
  swSrc = swSrc.replace(/const VERSION = '[^']*'/, `const VERSION = 'v-${newVer}'`);
  fs.writeFileSync(swPath, swSrc, 'utf8');
  console.log(`  bumped SW VERSION to v-${newVer}`);

  // 8. Summary
  const totalSections = modules.reduce((n, m) => n + (m.sections ? m.sections.length : 0), 0);
  console.log(`\nDone. ${modules.length} modules, ${totalSections} sections, ${Object.keys(lexique).length} lexique entries.`);
  console.log(`Output: ${OUT}`);
}

main();
