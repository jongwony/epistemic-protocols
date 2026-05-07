#!/usr/bin/env node
/**
 * Filesystem-walk loader for protocol/utility plugin set.
 *
 * Single source of truth = per-protocol SKILL.md (definition + prose) plus
 * per-plugin plugin.json self-description. This module derives all
 * enumeration shapes (PLUGINS, PROTOCOL_METADATA, PROTOCOL_ORDER,
 * PROTOCOL_FILES, etc.) from the filesystem so consumers (package.js,
 * static-checks.js, agent-symlinks sync) never carry a hand-curated list.
 *
 * Active set = filesystem plugin dirs minus those whose plugin.json carries
 * "deprecated": true. Deprecation lives in per-plugin self-description per
 * Plugin Encapsulation; no hardcoded allowlist here.
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_PROJECT_ROOT = path.resolve(__dirname, '..');

// Linear extension of the precedence partial order, validated against
// graph.json by checkPrecedenceLinearExtension. Hand-curated because
// multiple valid linear extensions exist; this is the project's canonical
// presentation order. Excludes Anamnesis (display first) and Katalepsis
// (structurally last).
const CANONICAL_PRECEDENCE = [
  'Horismos', 'Aitesis', 'Prothesis',
  'Analogia', 'Periagoge', 'Euporia',
  'Syneidesis', 'Prosoche', 'Epharmoge',
];

// Per-call memoization cache. discoverPlugins() instantiates a fresh cache
// so callers within a single process pay one read per plugin.json regardless
// of how many derivation views they request.
function makeJsonReader() {
  const cache = new Map();
  return function readJsonMemoized(absPath) {
    if (cache.has(absPath)) return cache.get(absPath);
    const content = JSON.parse(fs.readFileSync(absPath, 'utf8'));
    cache.set(absPath, content);
    return content;
  };
}

// Minimal frontmatter parser — name + description only. Full parse lives in
// scripts/package.js parseFrontmatter (handles folded scalars, quoting). This
// loader only needs the Type signature embedded in description, which is a
// single-line scalar across all current SKILL.md files.
//
// Returns null sentinel on read failure (permission error, EMFILE, EIO).
// discoverPlugins skips null records and emits a stderr diagnostic so the
// silent-skip class flagged in PR #351 review (C2) cannot recur.
function parseSkillFrontmatter(skillMdPath) {
  let content;
  try {
    content = fs.readFileSync(skillMdPath, 'utf8');
  } catch (e) {
    process.stderr.write(
      `[load-protocols] WARN: cannot read SKILL.md ${skillMdPath}: ${e.message}\n`
    );
    return null;
  }
  if (!content.startsWith('---\n')) return { name: null, description: null, content };
  const end = content.indexOf('\n---', 4);
  if (end === -1) return { name: null, description: null, content };
  const block = content.slice(4, end);
  const fields = {};
  for (const line of block.split('\n')) {
    const m = line.match(/^([a-z_-]+):\s*(.*)$/);
    if (!m) continue;
    let [, key, value] = m;
    value = value.trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    fields[key] = value;
  }
  return { name: fields.name || null, description: fields.description || null, content };
}

// Parse Type: (Deficit, ...) → Resolution from description, or fall back to
// body prose. Pattern is the SKILL.md-level canonical for the morphism's
// type signature — present in every protocol's SKILL.md (sometimes in
// description, sometimes in the body's first paragraph).
function extractTypeSignature(skillMd) {
  const re = /Type:\s*[`"]?\(([A-Z][A-Za-z]+)\s*,[^)]*\)\s*→\s*([A-Z][A-Za-z]+)/;
  const fromDescription = skillMd.description && skillMd.description.match(re);
  if (fromDescription) return { deficit: fromDescription[1], resolution: fromDescription[2] };
  const fromBody = skillMd.content.match(re);
  if (fromBody) return { deficit: fromBody[1], resolution: fromBody[2] };
  return { deficit: null, resolution: null };
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Walk plugin directories and return enriched plugin records.
 *
 * @param {object} [options]
 * @param {string} [options.projectRoot] - defaults to repo root
 * @param {boolean} [options.includeDeprecated=false] - include deprecated plugins
 * @returns {Array<{
 *   dir: string,
 *   skill: string,
 *   pluginJson: object,
 *   pluginJsonPath: string,
 *   skillMdPath: string,
 *   skillName: string,
 *   skillDescription: string,
 *   deficit: string|null,
 *   resolution: string|null,
 *   isProtocol: boolean,
 *   isUtility: boolean,
 *   deprecated: boolean
 * }>}
 */
function discoverPlugins(options = {}) {
  const projectRoot = options.projectRoot || DEFAULT_PROJECT_ROOT;
  const includeDeprecated = !!options.includeDeprecated;
  const readJson = makeJsonReader();

  // Active protocol set = graph.json nodes (canonical for inter-morphism
  // relations). Utility plugins are those with plugin.json but absent from
  // graph.json nodes. This boundary is graph-derived, not hardcoded.
  //
  // Parse failures are surfaced loudly. The prior silent catch relied on
  // the graph-integrity static check, but that runs only inside
  // static-checks.js — package.js dry-run and direct loader calls would
  // collapse every plugin to utility under a malformed graph.json without
  // any diagnostic (PR #351 review C1).
  let protocolNodeSet = new Set();
  const graphPath = path.join(projectRoot, '.claude', 'skills', 'verify', 'graph.json');
  if (fs.existsSync(graphPath)) {
    try {
      const graph = readJson(graphPath);
      if (Array.isArray(graph.nodes)) protocolNodeSet = new Set(graph.nodes);
    } catch (e) {
      process.stderr.write(
        `[load-protocols] WARN: cannot parse graph.json (${e.message}); ` +
        `every plugin will classify as utility — release/packaging may misbehave\n`
      );
    }
  }

  const records = [];
  const dirEntries = fs.readdirSync(projectRoot, { withFileTypes: true });

  for (const dirEntry of dirEntries) {
    if (!dirEntry.isDirectory() || dirEntry.name.startsWith('.')) continue;

    const pluginDir = dirEntry.name;
    const pluginJsonPath = path.join(projectRoot, pluginDir, '.claude-plugin', 'plugin.json');
    if (!fs.existsSync(pluginJsonPath)) continue;

    let pluginJson;
    try {
      pluginJson = readJson(pluginJsonPath);
    } catch (e) {
      // Surface plugin.json parse errors loudly. Prior silent skip relied
      // on the json-schema static check, but that runs only inside
      // static-checks.js — direct loader callers (package.js, scripts)
      // would see the plugin disappear with no diagnostic (PR #351
      // review H3).
      process.stderr.write(
        `[load-protocols] WARN: cannot parse ${pluginJsonPath}: ${e.message}; plugin skipped\n`
      );
      continue;
    }

    const deprecated = pluginJson.deprecated === true;
    if (deprecated && !includeDeprecated) continue;

    const skillsDir = path.join(projectRoot, pluginDir, 'skills');
    if (!fs.existsSync(skillsDir)) continue;

    const skillDirs = fs.readdirSync(skillsDir, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .map(e => e.name);

    for (const skillName of skillDirs) {
      const skillMdPath = path.join(skillsDir, skillName, 'SKILL.md');
      if (!fs.existsSync(skillMdPath)) continue;

      const skillMd = parseSkillFrontmatter(skillMdPath);
      if (skillMd === null) continue; // parse failure already reported on stderr
      const { deficit, resolution } = extractTypeSignature(skillMd);

      records.push({
        dir: pluginDir,
        skill: skillName,
        pluginJson,
        pluginJsonPath,
        skillMdPath,
        skillName: skillMd.name,
        skillDescription: skillMd.description,
        deficit,
        resolution,
        isProtocol: protocolNodeSet.has(pluginDir),
        isUtility: !protocolNodeSet.has(pluginDir),
        deprecated,
      });
    }
  }

  return records;
}

// Convenience derivations consumers commonly need. Each is a pure projection
// over discoverPlugins() — recompute is cheap (per-call memoization keeps
// reads at one per plugin.json).

function pluginsTuples(options) {
  return discoverPlugins(options).map(p => ({ dir: p.dir, skill: p.skill }));
}

function protocolMetadata(options) {
  const records = discoverPlugins(options).filter(p => p.isProtocol);
  const out = {};
  for (const r of records) {
    out[r.dir] = {
      name: capitalize(r.dir),
      command: `/${r.skill}`,
      deficit: r.deficit,
      resolution: r.resolution,
    };
  }
  return out;
}

// Display order = Anamnesis (recall, session start) + canonical-precedence
// linear extension + Katalepsis (structurally last).
function protocolOrder(options) {
  const order = ['anamnesis', ...CANONICAL_PRECEDENCE.map(s => s.toLowerCase()), 'katalepsis'];
  const protocolDirs = new Set(discoverPlugins(options).filter(p => p.isProtocol).map(p => p.dir));
  return order.filter(d => protocolDirs.has(d));
}

function protocolFiles(options) {
  return discoverPlugins(options).filter(p => p.isProtocol).map(p =>
    path.relative(options?.projectRoot || DEFAULT_PROJECT_ROOT, p.skillMdPath)
  );
}

function sourcePluginDirs(options) {
  const records = discoverPlugins(options);
  return [...new Set(records.map(r => r.dir))];
}

module.exports = {
  CANONICAL_PRECEDENCE,
  discoverPlugins,
  pluginsTuples,
  protocolMetadata,
  protocolOrder,
  protocolFiles,
  sourcePluginDirs,
  parseSkillFrontmatter,
  extractTypeSignature,
};

// CLI mode: shell scripts consume the active plugin/skill set via line-
// delimited stdout. JSON-strict deprecated handling lives in this loader
// (not in shell grep), so shell consumers inherit the same equality
// semantics the JS code uses (PR #351 review M2).
if (require.main === module) {
  const arg = process.argv[2];
  switch (arg) {
    case '--list-plugin-dirs': {
      const dirs = sourcePluginDirs();
      process.stdout.write(dirs.join('\n') + '\n');
      break;
    }
    case '--list-skill-tuples': {
      const tuples = pluginsTuples().map(p => `${p.dir}/${p.skill}`);
      process.stdout.write(tuples.join('\n') + '\n');
      break;
    }
    default:
      process.stderr.write(
        'usage: load-protocols.js [--list-plugin-dirs|--list-skill-tuples]\n'
      );
      process.exit(1);
  }
}
