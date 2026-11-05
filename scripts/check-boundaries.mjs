#!/usr/bin/env node
/**
 * check-boundaries: zero-dependency import-boundary checker for vertical slices.
 *
 * Usage: node scripts/check-boundaries.mjs <src-dir>
 * Exit code 0 = OK, 1 = violations found, 2 = usage error.
 *
 * Expected layout (see doc/conventions.md):
 *   <src>/modules/<module>/domain/**
 *   <src>/modules/<module>/repository/**
 *   <src>/modules/<module>/app-cases/<app-case>/**
 *   <src>/modules/<module>/index.ts        (public API of the module)
 *   <src>/shared/**                        (cross-cutting, framework-agnostic helpers)
 *   <src>/main/**                          (composition root: wiring, adapters, server)
 *
 * Rules:
 *   R1 slice-isolation   An app case never imports another app case.
 *   R2 domain-purity     domain/ imports only its own domain/ and shared/.
 *   R3 module-api        Code outside a module imports it only through modules/<m>/index.ts.
 *   R4 shared-is-leaf    shared/ never imports modules/ or main/.
 *   R5 no-root-import    Nothing in modules/ imports main/ (the composition root).
 *
 * Copy this file into your own project; it has no dependencies.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.mts', '.cts', '.js', '.jsx', '.mjs', '.cjs']);
const IMPORT_PATTERN =
  /(?:import|export)\s+(?:type\s+)?(?:[\w*{}\s,$]+?\s+from\s+)?['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)|require\(\s*['"]([^'"]+)['"]\s*\)/g;

function listSourceFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry.startsWith('.')) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) files.push(...listSourceFiles(full));
    else if (SOURCE_EXTENSIONS.has(extname(entry))) files.push(full);
  }
  return files;
}

/** Strip comments so commented-out imports are ignored. */
function stripComments(code) {
  return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
}

export function extractSpecifiers(code) {
  const specifiers = [];
  for (const match of stripComments(code).matchAll(IMPORT_PATTERN)) {
    specifiers.push(match[1] ?? match[2] ?? match[3]);
  }
  return specifiers;
}

/** Describe where a file lives in the architecture. `relPath` is relative to src, using "/". */
export function locate(relPath) {
  const parts = relPath.split('/');
  if (parts[0] === 'shared') return { area: 'shared' };
  if (parts[0] === 'main') return { area: 'main' };
  if (parts[0] === 'modules' && parts.length >= 3) {
    const module = parts[1];
    const layer = parts[2];
    if (parts.length === 3) {
      return { area: 'module', module, layer: 'public-api', isIndex: /^index\.[cm]?[jt]sx?$/.test(layer) };
    }
    if (layer === 'app-cases') return { area: 'module', module, layer, appCase: parts[3] };
    return { area: 'module', module, layer };
  }
  return { area: 'other' };
}

/** Returns a list of [rule, message] pairs for an import from `from` to `to`. */
export function checkImport(from, to) {
  const violations = [];

  // R1 slice-isolation
  if (
    from.layer === 'app-cases' &&
    to.layer === 'app-cases' &&
    (from.module !== to.module || from.appCase !== to.appCase)
  ) {
    violations.push([
      'slice-isolation',
      `app case "${from.module}/${from.appCase}" must not import app case "${to.module}/${to.appCase}". ` +
        'Move shared logic to domain/ or inject it as a dependency.',
    ]);
  }

  // R2 domain-purity
  if (from.layer === 'domain') {
    const allowed =
      to.area === 'shared' || (to.area === 'module' && to.module === from.module && to.layer === 'domain');
    if (!allowed) {
      violations.push(['domain-purity', `domain of "${from.module}" may only import its own domain/ and shared/.`]);
    }
  }

  // R3 module-api
  if (to.area === 'module' && from.module !== to.module && !to.isIndex) {
    violations.push(['module-api', `import module "${to.module}" through modules/${to.module}/index.ts, not its internals.`]);
  }

  // R4 shared-is-leaf
  if (from.area === 'shared' && (to.area === 'module' || to.area === 'main')) {
    violations.push(['shared-is-leaf', 'shared/ must not depend on modules/ or main/.']);
  }

  // R5 no-root-import
  if (from.area === 'module' && to.area === 'main') {
    violations.push(['no-root-import', 'modules must not import the composition root (main/).']);
  }

  return violations;
}

export function checkBoundaries(srcDir) {
  const root = resolve(srcDir);
  const toRel = (absolute) => relative(root, absolute).split(sep).join('/');
  const violations = [];

  for (const file of listSourceFiles(root)) {
    const fromRel = toRel(file);
    const from = locate(fromRel);
    for (const specifier of extractSpecifiers(readFileSync(file, 'utf8'))) {
      if (!specifier.startsWith('.')) continue; // packages and node: builtins are out of scope
      const targetRel = toRel(resolve(dirname(file), specifier));
      if (targetRel.startsWith('..')) continue; // outside src
      for (const [rule, message] of checkImport(from, locate(targetRel))) {
        violations.push({ file: fromRel, specifier, rule, message });
      }
    }
  }
  return violations;
}

const isCli = process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const srcDir = process.argv[2];
  if (!srcDir) {
    console.error('Usage: node scripts/check-boundaries.mjs <src-dir>');
    process.exit(2);
  }
  const violations = checkBoundaries(srcDir);
  if (violations.length === 0) {
    console.log(`check-boundaries: OK (${srcDir})`);
  } else {
    for (const v of violations) console.error(`✖ [${v.rule}] ${v.file} -> '${v.specifier}'\n  ${v.message}`);
    console.error(`\ncheck-boundaries: ${violations.length} violation(s). See doc/conventions.md.`);
    process.exit(1);
  }
}
