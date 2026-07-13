#!/usr/bin/env node
/**
 * Package epistemic protocol skills into ZIP files for distribution
 * Zero external dependencies: Node.js standard library only
 *
 * Usage:
 *   node scripts/package.js            # Build ZIPs to dist/
 *   node scripts/package.js --dry-run  # Simulate build (no file creation)
 *
 * Output: JSON { warnings: [], results: [], dryRun: bool }
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');
const { discoverPlugins, protocolOrder, CANONICAL_CLUSTERS } = require('./load-protocols');
const projectRoot = path.resolve(__dirname, '..');

// ============================================================
// Section 1: Config
// ============================================================

// Single filesystem walk shared across PLUGINS / PROTOCOL_METADATA /
// PROTOCOL_ORDER / buildRuntimeContractView / main(). plugin.json reads are
// memoized inside the helper, so the prior buildRuntimeContractView →
// packagePlugin double-read collapses to one read per plugin.json.
const _records = discoverPlugins({ projectRoot });

const PLUGINS = _records.map(r => ({ dir: r.dir, skill: r.skill }));

// claude.ai description overrides (originals exceed 200 chars)
// Protocol overrides: compact Type-only format for Layer 0 reference
const DESCRIPTION_OVERRIDES = {
  frame: 'Multi-perspective framing — (FrameworkAbsent, AI, DESIGN, Inquiry) → FramedInquiry',
  gap: 'Gap surfacing before decisions — (GapUnnoticed, AI, SURFACE, Decision) → AuditedDecision',
  grasp: 'Intent-scented comprehension verification — (ResultUngrasped, User, VERIFY, Result) → VerifiedUnderstanding',
  inquire: 'Infer context insufficiency before execution — (ContextInsufficient, AI, INQUIRE, Prospect) → InformedExecution',
  attend: 'Compile execution guardrails into verifiable goal conditions — (ExecutionBlind, User, EVALUATE, ExecutionContext) → SituatedExecution',
  ground: 'Validate structural mapping between domains — (MappingUncertain, AI, GROUND, Text) → ValidatedMapping',
  induce: 'Calibrate and crystallize abstraction — (AbstractionInProcess, AI, INDUCE, A) → CrystallizedAbstraction',
  elicit: 'Resolve via Extended-Mind reverse induction — (AbstractAporia, Hybrid, REVERSE-INDUCE-CYCLE, IntentSeed × ExternalizedSubstrate) → ResolvedEndpoint',
  bound: 'Epistemic boundary definition — (BoundaryUndefined, AI, DEFINE, TaskScope) → DefinedBoundary',
  contextualize: 'Detect application-context mismatch — (ApplicationDecontextualized, AI, CONTEXTUALIZE, Result) → ContextualizedExecution',
  distill: 'Distill a session-tethered context into a portable handoff — (ContextTethered, AI, DISTILL, WorkingContext) → PortableHandoff',
  delimit: 'Cut a work horizon into right-sized units — (GranularityUnderdetermined, Hybrid, DELIMIT, ExternalWBS × ExecutionHorizon × ContextLifecycle) → WorkUnitMap',
  conduct: 'Conduct a session\'s epistemic method before object-level work — (MethodUnderdetermined, Hybrid, CONDUCT, WorkProspect × ProtocolGraph) → ConductedMethod',
  ascend: 'Elevate a vague recall to a higher-granularity unit — (RecallGranularityInsufficient, AI, ELEVATE, ScatteredDeposits × DepositGraph) → HigherGranularityUnit',
  preview: 'Divergent-discard instantiation before direction commitment — (DirectionUnrecognizable, Hybrid, PREVIEW, DirectionProspect) → DirectionalContrast',
  onboard: 'Quest-based protocol learning — quick recommendation + targeted scenarios for epistemic protocol adoption',
  catalog: 'Instant protocol handbook — browse all protocols, compare by concern, view detailed scenarios',
  triage: 'Work-unit triage — group GitHub issues, fuse with AGENTS.md northstar, and emit dispatchable initial prompts.',
  dispatch: 'Focused work-unit execution — consume /triage initial prompts, verify premises, fan out PRs, and inscribe rejection traces.',
  'comment-review': "Reviews markdown/HTML artifacts before fixation (publish/commit/merge) via a channel-first browser preview loop.",
  forge: "Reference-grounded prompt-artifact formation — surfaces under-determined contract coordinates from a reference doc and projects a ready-to-use prompt or skill recipe.",
  'lens-review': "Frame-driven multi-perspective PR review — derives fitting lenses per diff, cross-verifies findings, posts one consolidated PR comment.",
  misuse: "Retrospective protocol contract-violation detector — scans past sessions and surfaces violation records for review.",
  'reduced-space-test': "Scoped empirical validation — decomposes a target↔surrogate equivalence claim, bounds a test space, captures evidence, carries the untested complement forward.",
  'review-loop': "Convergence-paced review-resolve loop — verifies findings, auto-applies mechanical fixes, gates judgment fixes, re-reviews to approval.",
  steer: "Project-profile recalibration — audits calibration drift, presents evidence for verdict, writes an updated profile rule and Settled Directions clause.",
};

const EXCLUDE_NAMES = new Set([
  '.DS_Store', '__MACOSX', '.claude-plugin', 'plugin.json',
  'README.md', 'README_ko.md',
]);
const EXCLUDE_EXTS = new Set(['.zip']);
const EXCLUDE_DIRS = new Set(['agents', 'commands', 'evals']);
const STRIP_FIELDS = new Set(['allowed-tools', 'license', 'compatibility', 'metadata']);

// Protocol metadata for release notes (deficit → resolution pairs).
// Derived from per-plugin SKILL.md description Type signature; capitalize(dir)
// for name; `/${skill}` for command. No hand-curated table — drift cannot
// occur because the single filesystem walk above is the only source.
const PROTOCOL_METADATA = Object.fromEntries(
  _records.filter(r => r.isProtocol).map(r => [r.dir, {
    name: r.dir[0].toUpperCase() + r.dir.slice(1),
    command: `/${r.skill}`,
    deficit: r.deficit,
    resolution: r.resolution,
  }])
);

// Display order: Anamnesis (recall, session start) + CANONICAL_PRECEDENCE
// linear extension + Katalepsis (structurally last). protocolOrder() walks
// the same record set and applies the order from load-protocols.js.
const PROTOCOL_ORDER = protocolOrder({ projectRoot });

// Type-signature parse failure surfacing — release notes table builds from
// PROTOCOL_METADATA, so a missing deficit/resolution would silently drop the
// row. Fail-fast at release-notes generation time (not module load) so
// require("./package.js") stays safe for consumers that do not generate notes.
function validateProtocolTables() {
  const incomplete = Object.entries(PROTOCOL_METADATA)
    .filter(([, m]) => !m.deficit || !m.resolution)
    .map(([k]) => k);
  if (incomplete.length) {
    throw new Error(
      `PROTOCOL_METADATA missing deficit/resolution (Type signature parse failed): ${incomplete.join(', ')}`
    );
  }
  const expectedDirs = new Set(_records.filter(r => r.isProtocol).map(r => r.dir));
  const missingFromOrder = [...expectedDirs].filter(d => !PROTOCOL_ORDER.includes(d));
  if (missingFromOrder.length) {
    throw new Error(
      `PROTOCOL_ORDER missing protocols (CANONICAL_PRECEDENCE may need update): ${missingFromOrder.join(', ')}`
    );
  }
}

// Curated first-release highlights (Phase A: no previous tag / empty-changelog fallback).
// Drift-proof: the protocol count derives from PROTOCOL_ORDER and the cluster bullets are
// parsed from CANONICAL_CLUSTERS (the single source also enforced against README by
// static-checks). Per-protocol deficit → resolution lives in the Protocols table below,
// so it is intentionally not duplicated in the cluster bullets here.
const FIRST_RELEASE_PROTOCOL_COUNT = PROTOCOL_ORDER.filter(key => PROTOCOL_METADATA[key]).length;
const FIRST_RELEASE_CLUSTER_BULLETS = CANONICAL_CLUSTERS
  .split(' · ')
  .map(seg => {
    const m = seg.match(/^(.+?) \((.+)\)$/);
    return m ? `- **${m[1]}**: ${m[2]}` : `- ${seg}`;
  })
  .join('\n');
const FIRST_RELEASE_HIGHLIGHTS = `## Highlights

### ${FIRST_RELEASE_PROTOCOL_COUNT} Epistemic Protocols

Structure human-AI interaction quality at every decision point. Each protocol resolves a typed deficit:

${FIRST_RELEASE_CLUSTER_BULLETS}

### Typed Deficit-Resolution System

Every protocol carries a type signature \`(Deficit, Initiator, Action, Target) → Resolution\` that makes the epistemic transition explicit. Protocols compose through session text — each protocol's output becomes natural-language context for subsequent protocols.

### Formal Verification

Static checks validate protocol integrity before every commit (run \`node .claude/skills/verify/scripts/static-checks.js .\` for the current check inventory — covering, among others, json-schema, notation, xref, structure, tool-grounding, version-staleness, graph-integrity, spec-vs-impl, cross-ref-scan, onboard-sync, catalog-sync, gate-type-soundness, and artifact-self-containment).

Protocol dependency graph (\`graph.json\`) enforces precondition DAG, advisory edges, and suppression rules with cycle detection.

### Utility Skills

- \`/catalog\` — instant protocol handbook and reference
- \`/onboard\` — quest-based protocol learning (quick recommendation + targeted scenarios)
- \`/probe\` — deficit recognition fit review (multi-hypothesis surfacing before protocol commitment)
- \`/report\` — Growth Map with epistemic analysis from session patterns
- \`/dashboard\` — full-session coverage analytics`;

const DESCRIPTION_LIMIT = 200;
// LINE_GUIDELINE is informational — emits a packaging warning but does not fail the build.
// 510 absorbs anamnesis Skill.md at 501 lines (after the +1 Euporia distinction row);
// existing 525/581/591 lines in aitesis/prothesis/prosoche were already over the prior 500 baseline.
// Per-protocol grandfathered overage is acknowledged; tightening this guideline requires per-file caps.
const LINE_GUIDELINE = 510;
const DIST_DIR = path.join(projectRoot, 'dist');
const BUNDLE_NAME = 'epistemic-protocols-bundle';
const CODEX_SUBMIT_DIST_DIR = path.join(DIST_DIR, 'codex-submit');
const CODEX_SUBMIT_PLUGINS = Object.freeze([
  { dir: 'aitesis', skill: 'inquire' },
  { dir: 'analogia', skill: 'ground' },
  { dir: 'diairesis', skill: 'delimit' },
  { dir: 'diylisis', skill: 'distill' },
  { dir: 'elenchus', skill: 'sublate' },
  { dir: 'epharmoge', skill: 'contextualize' },
  { dir: 'euporia', skill: 'elicit' },
  { dir: 'horismos', skill: 'bound' },
  { dir: 'hyphegesis', skill: 'conduct' },
  { dir: 'katalepsis', skill: 'grasp' },
  { dir: 'periagoge', skill: 'induce' },
  { dir: 'proplasma', skill: 'preview' },
  { dir: 'prosoche', skill: 'attend' },
  { dir: 'prothesis', skill: 'frame' },
  { dir: 'syneidesis', skill: 'gap' },
]);
const CODEX_SUBMIT_EXCLUDED = new Set(['anamnesis', 'anagoge', 'epistemic-cooperative']);
const CODEX_SUPPORT_DIRS = Object.freeze(['references', 'scripts', 'assets']);
const CODEX_FORBIDDEN_SEGMENTS = new Set(['.claude', '.codex', 'sessions', 'transcripts']);

function compareCodexPaths(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

// ============================================================
// Section 2: YAML Frontmatter Parser
// Supports: simple key-value, quoted values, >-/> folded scalar, block list (- items)
// Unsupported: nested objects, | literal block, multi-line unquoted values, flow-style arrays
// ============================================================

function parseFrontmatter(content) {
  const lines = content.split('\n');
  if (lines[0].trim() !== '---') return { fields: new Map(), body: content };

  let endIdx = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') { endIdx = i; break; }
  }
  if (endIdx === -1) return { fields: new Map(), body: content };

  const fields = new Map();
  let currentKey = null;
  let currentValue = '';
  let inFolded = false;
  let inBlockList = false;
  let blockList = [];

  const unquote = (v) => {
    if ((v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))) {
      return v.slice(1, -1);
    }
    return v;
  };

  for (let i = 1; i < endIdx; i++) {
    const line = lines[i];

    if (inFolded) {
      if (/^\s+/.test(line)) {
        currentValue += (currentValue ? ' ' : '') + line.trim();
        continue;
      }
      fields.set(currentKey, currentValue);
      inFolded = false;
    }

    if (inBlockList) {
      const listMatch = line.match(/^\s+-\s+(.*)$/);
      if (listMatch) {
        blockList.push(unquote(listMatch[1].trim()));
        continue;
      }
      fields.set(currentKey, [...blockList]);
      inBlockList = false;
      blockList = [];
    }

    const m = line.match(/^([a-zA-Z][\w-]*):\s*(.*)/);
    if (!m) continue;

    currentKey = m[1];
    let val = m[2].trim();

    if (val === '>-' || val === '>') {
      inFolded = true;
      currentValue = '';
      continue;
    }

    // Block list: empty key value + next non-blank line begins with indented "- "
    if (val === '') {
      let isBlockList = false;
      for (let j = i + 1; j < endIdx; j++) {
        const peek = lines[j];
        if (peek === '') continue;
        if (/^\s+-\s+/.test(peek)) isBlockList = true;
        break;
      }
      if (isBlockList) {
        inBlockList = true;
        blockList = [];
        continue;
      }
    }

    fields.set(currentKey, unquote(val));
  }

  if (inFolded && currentKey) fields.set(currentKey, currentValue);
  if (inBlockList && currentKey) fields.set(currentKey, [...blockList]);

  return { fields, body: lines.slice(endIdx + 1).join('\n') };
}

function serializeFrontmatter(fields) {
  let yaml = '---\n';
  for (const [key, value] of fields) {
    if (Array.isArray(value)) {
      yaml += `${key}:\n`;
      for (const item of value) {
        // YAML plain scalar safe if not starting with reserved indicators and no embedded newline.
        // `plugin:skill` format is safe (colon not followed by space).
        const needsQuote = /^[-[\]{}&*!|>'"%@`]/.test(item) || item.includes('\n');
        if (needsQuote) {
          yaml += `  - "${item.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"\n`;
        } else {
          yaml += `  - ${item}\n`;
        }
      }
      continue;
    }
    const needsQuote = value.includes(':') || value.includes('#') ||
      value.includes('"') || value.startsWith('{') || value.startsWith('[');
    if (needsQuote) {
      yaml += `${key}: "${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\t/g, '\\t')}"\n`;
    } else {
      yaml += `${key}: ${value}\n`;
    }
  }
  yaml += '---';
  return yaml;
}

// ============================================================
// Section 3: Transformer
// ============================================================

function transformSkillMd(content, skillName) {
  const { fields, body } = parseFrontmatter(content);

  for (const field of STRIP_FIELDS) fields.delete(field);

  const desc = fields.get('description');
  if (desc && desc.length > DESCRIPTION_LIMIT && DESCRIPTION_OVERRIDES[skillName]) {
    fields.set('description', DESCRIPTION_OVERRIDES[skillName]);
  }

  return serializeFrontmatter(fields) + '\n' + body;
}

// ============================================================
// Section 4: ZIP Builder (PKZip format, pure Node.js)
// ============================================================

// CRC-32 via zlib.crc32 (Node 22+)
function crc32(buf) {
  return zlib.crc32(buf) >>> 0;
}

function dosDateTime({ deterministic = false } = {}) {
  if (deterministic) {
    return { time: 0, date: 0x0021 }; // 1980-01-01 00:00:00, the DOS epoch.
  }
  const d = new Date();
  return {
    time: ((d.getHours() & 0x1F) << 11) | ((d.getMinutes() & 0x3F) << 5) | ((d.getSeconds() >> 1) & 0x1F),
    date: (((d.getFullYear() - 1980) & 0x7F) << 9) | (((d.getMonth() + 1) & 0x0F) << 5) | (d.getDate() & 0x1F),
  };
}

function createZip(entries, { deterministic = false } = {}) {
  const { time, date } = dosDateTime({ deterministic });
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBuf = Buffer.from(entry.name, 'utf8');
    const raw = entry.data;
    const deflated = zlib.deflateRawSync(raw);
    const useDeflate = deflated.length < raw.length;
    const fileData = useDeflate ? deflated : raw;
    const method = useDeflate ? 8 : 0;
    const checksum = crc32(raw);

    // Local file header (30 bytes fixed)
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(method, 8);
    local.writeUInt16LE(time, 10);
    local.writeUInt16LE(date, 12);
    local.writeUInt32LE(checksum, 14);
    local.writeUInt32LE(fileData.length, 18);
    local.writeUInt32LE(raw.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28);
    localParts.push(local, nameBuf, fileData);

    // Central directory entry (46 bytes fixed)
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(method, 10);
    central.writeUInt16LE(time, 12);
    central.writeUInt16LE(date, 14);
    central.writeUInt32LE(checksum, 16);
    central.writeUInt32LE(fileData.length, 20);
    central.writeUInt32LE(raw.length, 24);
    central.writeUInt16LE(nameBuf.length, 28);
    central.writeUInt16LE(0, 30);
    central.writeUInt16LE(0, 32);
    central.writeUInt16LE(0, 34);
    central.writeUInt16LE(0, 36);
    central.writeUInt32LE(0, 38);
    central.writeUInt32LE(offset, 42);
    centralParts.push(central, nameBuf);

    offset += 30 + nameBuf.length + fileData.length;
  }

  const centralDirSize = centralParts.reduce((s, b) => s + b.length, 0);

  // End of central directory (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralDirSize, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, ...centralParts, eocd]);
}

// ============================================================
// Section 5: File Collector
// ============================================================

function collectFiles(baseDir, prefix) {
  const files = [];

  function walk(dir, rel) {
    const entries = fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      if (EXCLUDE_NAMES.has(entry.name)) continue;
      if (EXCLUDE_EXTS.has(path.extname(entry.name))) continue;
      if (entry.isSymbolicLink()) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (EXCLUDE_DIRS.has(entry.name)) continue;
        walk(fullPath, rel + entry.name + '/');
      } else {
        const zipName = entry.name === 'SKILL.md' ? 'Skill.md' : entry.name;
        files.push({ sourcePath: fullPath, zipPath: rel + zipName, isSkillMd: entry.name === 'SKILL.md' });
      }
    }
  }

  walk(baseDir, prefix + '/');
  return files;
}

function isForbiddenCodexPath(archivePath) {
  const segments = archivePath.split('/');
  if (segments.some(segment => CODEX_FORBIDDEN_SEGMENTS.has(segment))) return true;

  const basename = segments.at(-1).toLowerCase();
  return basename === '.env' ||
    basename.startsWith('.env.') ||
    basename.endsWith('.pem') ||
    basename.endsWith('.key') ||
    basename === 'id_rsa' ||
    basename === 'id_rsa.pub' ||
    basename.startsWith('credentials.') ||
    basename.startsWith('secrets.') ||
    basename.endsWith('.jsonl');
}

function assertCodexPathAllowed(archivePath) {
  if (isForbiddenCodexPath(archivePath)) {
    throw new Error(`codex-submit forbidden path: ${archivePath}`);
  }
}

function stripReferenceSuffix(target) {
  const suffix = target.search(/[?#]/);
  return suffix === -1 ? target : target.slice(0, suffix);
}

function markdownTarget(rawTarget) {
  const trimmed = rawTarget.trim();
  if (trimmed.startsWith('<')) {
    const closing = trimmed.indexOf('>');
    return closing === -1 ? trimmed : trimmed.slice(1, closing);
  }
  return trimmed.match(/^\S+/)?.[0] || '';
}

function extractArchiveLocalReferences(content, archivePath) {
  const references = [];
  const markdownPattern = /!?\[[^\]]*\]\(([^)]+)\)/g;
  const inlinePathPattern = /`((?:references|scripts|assets|agents)\/[^`\s]+)`/g;
  let match;

  while ((match = markdownPattern.exec(content)) !== null) {
    const target = markdownTarget(match[1]);
    if (!target || /^[A-Za-z][A-Za-z0-9+.-]*:/.test(target) ||
        target.startsWith('//') || target.startsWith('#') || target.startsWith('/')) {
      continue;
    }
    references.push({ kind: 'markdown', target });
  }

  while ((match = inlinePathPattern.exec(content)) !== null) {
    references.push({ kind: 'inline', target: match[1] });
  }

  if (archivePath.endsWith('/agents/openai.yaml')) {
    for (const line of content.split('\n')) {
      const yamlPath = line.match(/(?:^|:\s*|-\s*)(["']?)(\.\/[^"'\s#]+)\1(?:\s|#|$)/)?.[2];
      if (yamlPath) references.push({ kind: 'openai-yaml', target: yamlPath });
    }
  }

  return references;
}

function resolveCodexReference(reference, referringArchivePath, skill) {
  let target = stripReferenceSuffix(reference.target);
  if (!target) return null;

  if (reference.kind === 'openai-yaml') {
    if (target.split('/').includes('..')) {
      throw new Error(`codex-submit openai.yaml traversal is forbidden: ${target}`);
    }
    target = target.slice(2);
    return path.posix.normalize(`${skill}/${target}`);
  }

  return path.posix.normalize(path.posix.join(path.posix.dirname(referringArchivePath), target));
}

function assertCodexReferenceClosure(zipEntries, skill) {
  const packaged = new Set(zipEntries.map(entry => entry.name));
  const skillRoot = `${skill}/`;

  for (const entry of zipEntries) {
    if (!/\.(?:md|ya?ml)$/i.test(entry.name)) continue;
    const content = entry.data.toString('utf8');
    for (const reference of extractArchiveLocalReferences(content, entry.name)) {
      const resolved = resolveCodexReference(reference, entry.name, skill);
      if (!resolved) continue;
      if (!resolved.startsWith(skillRoot)) {
        throw new Error(
          `codex-submit reference escapes skill root: ${entry.name} -> ${reference.target}`
        );
      }
      if (!packaged.has(resolved)) {
        throw new Error(
          `codex-submit unresolved local reference: ${entry.name} -> ${reference.target} (${resolved})`
        );
      }
    }
  }
}

function collectRegularFiles(sourceDir, archiveDir, files) {
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true })
    .sort((a, b) => compareCodexPaths(a.name, b.name));
  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const archivePath = path.posix.join(archiveDir, entry.name);
    assertCodexPathAllowed(archivePath);
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) {
      collectRegularFiles(sourcePath, archivePath, files);
    } else if (entry.isFile()) {
      files.push({ sourcePath, zipPath: archivePath, isSkillMd: false });
    }
  }
}

function directlyReferencedPluginAgents(skillContent) {
  const names = new Set();
  const references = extractArchiveLocalReferences(skillContent, 'skill/SKILL.md');
  for (const reference of references) {
    const target = stripReferenceSuffix(reference.target);
    const match = target.match(/^agents\/([A-Za-z0-9._-]+\.md)$/);
    if (match) names.add(match[1]);
  }
  return [...names].sort(compareCodexPaths);
}

function collectCodexSubmitFiles(plugin, { root = projectRoot } = {}) {
  const pluginDir = path.join(root, plugin.dir);
  const skillDir = path.join(pluginDir, 'skills', plugin.skill);
  const skillSource = path.join(skillDir, 'SKILL.md');

  if (!fs.existsSync(pluginDir)) {
    throw new Error(`codex-submit expected plugin is absent: ${plugin.dir}`);
  }
  if (!fs.existsSync(skillDir) || !fs.statSync(skillDir).isDirectory()) {
    throw new Error(`codex-submit expected skill is absent: ${plugin.dir}/${plugin.skill}`);
  }
  if (!fs.existsSync(skillSource) || !fs.lstatSync(skillSource).isFile()) {
    throw new Error(`codex-submit expected SKILL.md is absent: ${plugin.dir}/${plugin.skill}`);
  }

  const skillContent = fs.readFileSync(skillSource, 'utf8');
  const files = [{
    sourcePath: skillSource,
    zipPath: `${plugin.skill}/SKILL.md`,
    isSkillMd: true,
  }];

  for (const supportDir of CODEX_SUPPORT_DIRS) {
    const sourceDir = path.join(skillDir, supportDir);
    if (!fs.existsSync(sourceDir)) continue;
    if (!fs.lstatSync(sourceDir).isDirectory()) {
      throw new Error(`codex-submit support path is not a directory: ${sourceDir}`);
    }
    collectRegularFiles(sourceDir, `${plugin.skill}/${supportDir}`, files);
  }

  const openaiYaml = path.join(skillDir, 'agents', 'openai.yaml');
  if (fs.existsSync(openaiYaml)) {
    const archivePath = `${plugin.skill}/agents/openai.yaml`;
    assertCodexPathAllowed(archivePath);
    if (!fs.lstatSync(openaiYaml).isFile()) {
      throw new Error(`codex-submit agents/openai.yaml is not a regular file: ${openaiYaml}`);
    }
    files.push({ sourcePath: openaiYaml, zipPath: archivePath, isSkillMd: false });
  }

  for (const agentName of directlyReferencedPluginAgents(skillContent)) {
    const skillAgent = path.join(skillDir, 'agents', agentName);
    if (fs.existsSync(skillAgent)) continue;
    const pluginAgent = path.join(pluginDir, 'agents', agentName);
    if (!fs.existsSync(pluginAgent) || !fs.lstatSync(pluginAgent).isFile()) continue;
    const archivePath = `${plugin.skill}/agents/${agentName}`;
    assertCodexPathAllowed(archivePath);
    files.push({ sourcePath: pluginAgent, zipPath: archivePath, isSkillMd: false });
  }

  return files.sort((a, b) => compareCodexPaths(a.zipPath, b.zipPath));
}

function readCodexManifestVersion(plugin, { root = projectRoot } = {}) {
  const codexManifestPath = path.join(root, plugin.dir, '.codex-plugin', 'plugin.json');
  if (!fs.existsSync(codexManifestPath)) {
    throw new Error(`codex-submit manifest is absent: ${plugin.dir}/.codex-plugin/plugin.json`);
  }
  const codexManifest = JSON.parse(fs.readFileSync(codexManifestPath, 'utf8'));
  if (typeof codexManifest.version !== 'string' || !codexManifest.version) {
    throw new Error(`codex-submit manifest version is absent: ${plugin.dir}/.codex-plugin/plugin.json`);
  }

  const claudeManifestPath = path.join(root, plugin.dir, '.claude-plugin', 'plugin.json');
  if (fs.existsSync(claudeManifestPath)) {
    const claudeManifest = JSON.parse(fs.readFileSync(claudeManifestPath, 'utf8'));
    if (claudeManifest.version !== codexManifest.version) {
      throw new Error(
        `codex-submit manifest version mismatch for ${plugin.dir}: ` +
        `Codex ${codexManifest.version}, Claude ${claudeManifest.version}`
      );
    }
  }
  return codexManifest.version;
}

function assertCodexArtifactContract(zipEntries, plugin) {
  const skillEntries = zipEntries.filter(entry => entry.name.endsWith('/SKILL.md'));
  if (skillEntries.length !== 1 || skillEntries[0].name !== `${plugin.skill}/SKILL.md`) {
    throw new Error(
      `codex-submit ${plugin.dir} must contain exactly one ${plugin.skill}/SKILL.md`
    );
  }
  if (zipEntries.some(entry => entry.name.endsWith('/Skill.md'))) {
    throw new Error(`codex-submit ${plugin.dir} contains forbidden Skill.md casing`);
  }
  assertCodexReferenceClosure(zipEntries, plugin.skill);
}

function buildCodexSubmitArtifact(plugin, { root = projectRoot } = {}) {
  if (CODEX_SUBMIT_EXCLUDED.has(plugin.dir)) {
    throw new Error(`codex-submit excluded plugin selected: ${plugin.dir}`);
  }
  const files = collectCodexSubmitFiles(plugin, { root });
  const version = readCodexManifestVersion(plugin, { root });
  const zipEntries = files.map(file => {
    let data = fs.readFileSync(file.sourcePath);
    if (file.isSkillMd) {
      data = Buffer.from(transformSkillMd(data.toString('utf8'), plugin.skill), 'utf8');
    }
    return { name: file.zipPath, data };
  }).sort((a, b) => compareCodexPaths(a.name, b.name));

  assertCodexArtifactContract(zipEntries, plugin);
  const zipBuffer = createZip(zipEntries, { deterministic: true });
  const filename = `${plugin.skill}.zip`;
  const artifact = {
    plugin: plugin.dir,
    skill: plugin.skill,
    version,
    filename,
    entries: zipEntries.map(entry => entry.name),
    bytes: zipBuffer.length,
    sha256: crypto.createHash('sha256').update(zipBuffer).digest('hex'),
  };
  return { artifact, zipBuffer };
}

function assertArtifactMatchesIndex(artifact, zipBuffer) {
  const digest = crypto.createHash('sha256').update(zipBuffer).digest('hex');
  if (artifact.bytes !== zipBuffer.length || artifact.sha256 !== digest) {
    throw new Error(`codex-submit index/hash disagreement: ${artifact.filename}`);
  }
}

function buildCodexSubmitArtifacts({ root = projectRoot } = {}) {
  if (CODEX_SUBMIT_PLUGINS.length !== 15) {
    throw new Error(`codex-submit selection must contain exactly 15 plugins`);
  }
  const keys = new Set();
  for (const plugin of CODEX_SUBMIT_PLUGINS) {
    const key = `${plugin.dir}/${plugin.skill}`;
    if (keys.has(key)) throw new Error(`codex-submit duplicate selection: ${key}`);
    keys.add(key);
  }
  const builds = CODEX_SUBMIT_PLUGINS.map(plugin => buildCodexSubmitArtifact(plugin, { root }));
  for (const build of builds) assertArtifactMatchesIndex(build.artifact, build.zipBuffer);
  return builds;
}

function runCodexSubmit({ dryRun, root = projectRoot, outputDir = CODEX_SUBMIT_DIST_DIR } = {}) {
  const builds = buildCodexSubmitArtifacts({ root });
  const index = {
    schemaVersion: 1,
    profile: 'codex-submit',
    artifacts: builds.map(build => build.artifact),
  };

  if (!dryRun) {
    fs.rmSync(outputDir, { recursive: true, force: true });
    fs.mkdirSync(outputDir, { recursive: true });
    for (const build of builds) {
      const outputPath = path.join(outputDir, build.artifact.filename);
      fs.writeFileSync(outputPath, build.zipBuffer);
      const written = fs.readFileSync(outputPath);
      assertArtifactMatchesIndex(build.artifact, written);
    }
    fs.writeFileSync(
      path.join(outputDir, 'submission-index.json'),
      `${JSON.stringify(index, null, 2)}\n`,
      'utf8'
    );
  }

  return { warnings: [], results: index.artifacts, dryRun: Boolean(dryRun), profile: 'codex-submit', index };
}

function buildRuntimeContractView(plugin) {
  const skillDir = path.join(projectRoot, plugin.dir, 'skills', plugin.skill);
  // plugin.json read piggybacks on the discoverPlugins() walk that produced
  // PLUGINS. Falls back to direct read for plugins introduced after module
  // load (none in current flow, retained for defensive correctness).
  const record = _records.find(r => r.dir === plugin.dir && r.skill === plugin.skill);
  const pluginJson = record
    ? record.pluginJson
    : JSON.parse(fs.readFileSync(path.join(projectRoot, plugin.dir, '.claude-plugin', 'plugin.json'), 'utf8'));
  const files = collectFiles(skillDir, plugin.skill);
  const packagedEntries = [];
  let transformedSkillMd = null;
  let skillEntryCount = 0;

  for (const file of files) {
    if (file.isSkillMd) {
      const content = fs.readFileSync(file.sourcePath, 'utf8');
      transformedSkillMd = transformSkillMd(content, plugin.skill);
      skillEntryCount++;
    }
    packagedEntries.push(file.zipPath);
  }

  return {
    plugin: plugin.dir,
    skill: plugin.skill,
    pluginDescription: pluginJson.description || '',
    skillEntryCount,
    skillPath: `${plugin.skill}/Skill.md`,
    transformedSkillMd,
    packagedEntries,
  };
}

function buildRuntimeContractViews() {
  return PLUGINS.map(buildRuntimeContractView);
}

// ============================================================
// Section 6: Release Notes Generator
// ============================================================

function generateComputedHighlights(changelog) {
  const TYPE_LABELS = { feat: 'New', fix: 'Fixed', refactor: 'Improved', style: 'Styled' };
  const sections = [];

  // Group commits by type across all scopes
  const byType = {};
  for (const [scope, commits] of Object.entries(changelog.groups)) {
    for (const c of commits) {
      const label = TYPE_LABELS[c.type] || c.type;
      if (!byType[label]) byType[label] = [];
      byType[label].push({ scope, message: c.message });
    }
  }

  for (const label of Object.values(TYPE_LABELS)) {
    if (!byType[label]) continue;
    const bullets = byType[label].map(i => `- **${i.scope}**: ${i.message}`).join('\n');
    sections.push(`### ${label}\n\n${bullets}`);
  }
  // Append any types not in TYPE_LABELS (raw type name as header)
  for (const [label, items] of Object.entries(byType)) {
    if (Object.values(TYPE_LABELS).includes(label)) continue;
    const bullets = items.map(i => `- **${i.scope}**: ${i.message}`).join('\n');
    sections.push(`### ${label}\n\n${bullets}`);
  }

  if (changelog.ungrouped.length > 0) {
    const bullets = changelog.ungrouped
      .filter(c => c.type && c.type !== 'ci' && c.type !== 'test')
      .map(c => `- ${c.message}`)
      .join('\n');
    if (bullets) sections.push(`### Other\n\n${bullets}`);
  }

  return `## Highlights\n\n${sections.join('\n\n')}`;
}

function generateReleaseNotes(buildResults, { tag = null, changelog = null } = {}) {
  // Drift check at the observable-effect site: release notes would silently drop
  // protocols missing from PROTOCOL_METADATA (filtered via generateReleaseNotes's
  // PROTOCOL_ORDER.map → .filter(Boolean) chain), so fail-fast before emitting.
  validateProtocolTables();

  const tagStr = tag ? ` ${tag}` : '';

  // Section 1: Headline
  const headline = `# Epistemic Protocols${tagStr}`;

  // Section 2: Highlights (Phase B computed from changelog, Phase A curated fallback)
  const highlights = (changelog && changelog.groups && Object.keys(changelog.groups).length > 0)
    ? generateComputedHighlights(changelog)
    : FIRST_RELEASE_HIGHLIGHTS;

  // Section 3: Protocols table (deficit → resolution from PROTOCOL_METADATA)
  const protocolRows = PROTOCOL_ORDER
    .filter(key => PROTOCOL_METADATA[key])
    .map(key => {
      const m = PROTOCOL_METADATA[key];
      const ver = buildResults.find(r => r.plugin === key)?.version || '—';
      return `| ${m.name} | \`${m.command}\` | ${m.deficit} → ${m.resolution} | ${ver} |`;
    })
    .join('\n');

  const protocols = [
    '## Protocols',
    '',
    '| Protocol | Command | Deficit → Resolution | Version |',
    '|----------|---------|---------------------|---------|',
    protocolRows,
  ].join('\n');

  // Section 4: Assets table (from buildResults)
  const assetRows = buildResults
    .filter(r => r.version)
    .map(r => `| ${r.plugin} | ${r.version} | ${r.zip} |`)
    .join('\n');

  const bundleZip = buildResults.find(r => r.plugin === 'bundle')?.zip || 'epistemic-protocols-bundle.zip';

  const assets = [
    '## Assets',
    '',
    '| Plugin | Version | Asset |',
    '|--------|---------|-------|',
    assetRows,
    '',
    `Bundle: \`${bundleZip}\``,
  ].join('\n');

  return [headline, '', highlights, '', protocols, '', assets, ''].join('\n');
}

// ============================================================
// Section 7: Main
// ============================================================

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const profileFlag = args.indexOf('--profile');
  const profile = profileFlag === -1 ? null : args[profileFlag + 1];

  if (profileFlag !== -1 && !profile) {
    throw new Error('--profile requires a value');
  }
  if (profile && profile !== 'codex-submit') {
    throw new Error(`unknown packaging profile: ${profile}`);
  }
  if (profile === 'codex-submit') {
    console.log(JSON.stringify(runCodexSubmit({ dryRun }), null, 2));
    return;
  }

  const warnings = [];
  const buildResults = [];
  const bundleEntries = [];

  if (!dryRun) fs.mkdirSync(DIST_DIR, { recursive: true });

  for (const plugin of PLUGINS) {
    const skillDir = path.join(projectRoot, plugin.dir, 'skills', plugin.skill);

    if (!fs.existsSync(skillDir)) {
      warnings.push(`${plugin.dir}: skill directory not found`);
      continue;
    }

    // plugin.json comes from the shared discoverPlugins() walk — same
    // object the buildRuntimeContractView path consumes, so a single
    // process pays one read per plugin.json regardless of which entry
    // points are exercised.
    const record = _records.find(r => r.dir === plugin.dir && r.skill === plugin.skill);
    const pluginJson = record ? record.pluginJson : null;
    if (!pluginJson) {
      warnings.push(`${plugin.dir}: plugin record not found in discoverPlugins()`);
      continue;
    }
    let files;
    try {
      files = collectFiles(skillDir, plugin.skill);
    } catch (e) {
      warnings.push(`${plugin.dir}: collectFiles failed: ${e.message}`);
      continue;
    }
    const zipEntries = [];

    for (const file of files) {
      let data = fs.readFileSync(file.sourcePath);

      if (file.isSkillMd) {
        const content = data.toString('utf8');
        const lineCount = content.split('\n').length - (content.endsWith('\n') ? 1 : 0);

        if (lineCount > LINE_GUIDELINE) {
          warnings.push(`${plugin.dir}: Skill.md is ${lineCount} lines (${lineCount - LINE_GUIDELINE} over ${LINE_GUIDELINE}-line guideline)`);
        }

        const { fields } = parseFrontmatter(content);
        const desc = fields.get('description');
        if (desc && desc.length > DESCRIPTION_LIMIT && !DESCRIPTION_OVERRIDES[plugin.skill]) {
          warnings.push(`${plugin.dir}: description is ${desc.length} chars (over ${DESCRIPTION_LIMIT}-char limit, no override defined)`);
        }

        data = Buffer.from(transformSkillMd(content, plugin.skill), 'utf8');
      }

      zipEntries.push({ name: file.zipPath, data });
    }

    const zipBuffer = createZip(zipEntries);
    const zipFile = `${plugin.skill}.zip`;

    if (!dryRun) fs.writeFileSync(path.join(DIST_DIR, zipFile), zipBuffer);

    buildResults.push({
      plugin: plugin.dir,
      skill: plugin.skill,
      version: pluginJson.version,
      zip: zipFile,
      files: files.length,
      bytes: zipBuffer.length,
    });

    for (const entry of zipEntries) {
      bundleEntries.push({ name: `epistemic-protocols/${entry.name}`, data: entry.data });
    }
  }

  // Bundle ZIP
  const bundleBuffer = createZip(bundleEntries);
  const bundleFile = `${BUNDLE_NAME}.zip`;
  if (!dryRun) fs.writeFileSync(path.join(DIST_DIR, bundleFile), bundleBuffer);

  buildResults.push({
    plugin: 'bundle',
    skill: BUNDLE_NAME,
    zip: bundleFile,
    files: bundleEntries.length,
    bytes: bundleBuffer.length,
  });

  // Release notes (consumed by CI workflow)
  const tag = process.env.TAG_NAME || null;
  let changelog = null;
  try {
    const { execFileSync } = require('child_process');
    const changelogArgs = [path.join(__dirname, 'generate-changelog.js'), ...(tag ? [tag] : [])];
    const output = execFileSync(process.execPath, changelogArgs, {
      encoding: 'utf8',
      cwd: projectRoot,
    });
    changelog = JSON.parse(output);
  } catch (e) {
    // No previous tag or script error — fall back to curated first-release content
    warnings.push(`changelog generation failed, using curated fallback: ${e.message}`);
  }
  const notes = generateReleaseNotes(buildResults, { tag, changelog });
  if (!dryRun) {
    fs.writeFileSync(path.join(DIST_DIR, 'release-notes.md'), notes, 'utf8');
  }

  // Output
  for (const w of warnings) console.error(`WARN: ${w}`);
  console.log(JSON.stringify({ warnings, results: buildResults, dryRun }, null, 2));
}

// Allow importing for tests; skip main() when required as module
if (require.main === module) {
  try {
    main();
  } catch (e) {
    console.error(JSON.stringify({ error: e.message, stack: e.stack }));
    process.exit(2);
  }
}

module.exports = {
  PLUGINS,
  CODEX_SUBMIT_PLUGINS,
  buildRuntimeContractView,
  buildRuntimeContractViews,
  buildCodexSubmitArtifact,
  buildCodexSubmitArtifacts,
  collectFiles,
  collectCodexSubmitFiles,
  extractArchiveLocalReferences,
  isForbiddenCodexPath,
  parseFrontmatter,
  readCodexManifestVersion,
  runCodexSubmit,
  serializeFrontmatter,
  transformSkillMd,
  createZip,
  generateReleaseNotes,
};
