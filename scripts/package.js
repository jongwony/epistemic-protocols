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
const projectRoot = path.resolve(__dirname, '..');

// ============================================================
// Section 1: Config
// ============================================================

const PLUGINS = [
  { dir: 'prothesis', skill: 'frame' },
  { dir: 'syneidesis', skill: 'gap' },
  { dir: 'hermeneia', skill: 'clarify' },
  { dir: 'katalepsis', skill: 'grasp' },
  { dir: 'telos', skill: 'goal' },
  { dir: 'aitesis', skill: 'inquire' },
  { dir: 'horismos', skill: 'bound' },
  { dir: 'analogia', skill: 'ground' },
  { dir: 'periagoge', skill: 'induce' },
  { dir: 'euporia', skill: 'elicit' },
  { dir: 'prosoche', skill: 'attend' },
  { dir: 'epharmoge', skill: 'contextualize' },
  { dir: 'epistemic-cooperative', skill: 'onboard' },
  { dir: 'epistemic-cooperative', skill: 'catalog' },
  { dir: 'epistemic-cooperative', skill: 'compose' },
  { dir: 'epistemic-cooperative', skill: 'report' },
  { dir: 'epistemic-cooperative', skill: 'dashboard' },
  { dir: 'epistemic-cooperative', skill: 'introspect' },
  { dir: 'epistemic-cooperative', skill: 'sophia' },
  { dir: 'epistemic-cooperative', skill: 'curses' },
  { dir: 'epistemic-cooperative', skill: 'write' },
  { dir: 'epistemic-cooperative', skill: 'comment-review' },
  { dir: 'epistemic-cooperative', skill: 'review-ensemble' },
  { dir: 'epistemic-cooperative', skill: 'goal-research' },
  { dir: 'epistemic-cooperative', skill: 'probe' },
  { dir: 'epistemic-cooperative', skill: 'steer' },
  { dir: 'epistemic-cooperative', skill: 'misuse' },
  { dir: 'epistemic-cooperative', skill: 'crystallize' },
  { dir: 'epistemic-cooperative', skill: 'rehydrate' },
  { dir: 'anamnesis', skill: 'recollect' },
];

// claude.ai description overrides (originals exceed 200 chars)
// Protocol overrides: compact Type-only format for Layer 0 reference
const DESCRIPTION_OVERRIDES = {
  frame: 'Multi-perspective investigation — (FrameworkAbsent, AI, SELECT, Inquiry) → FramedInquiry',
  gap: 'Gap surfacing before decisions — (GapUnnoticed, AI, SURFACE, Decision) → AuditedDecision',
  clarify: 'Clarify intent-expression gaps — (IntentMisarticulated, Hybrid, EXTRACT, Expression) → ClarifiedIntent',
  grasp: 'Comprehension verification after AI work — (ResultUngrasped, User, VERIFY, Result) → VerifiedUnderstanding',
  goal: 'Co-construct goals from vague intent — (GoalIndeterminate, AI, CO-CONSTRUCT, VagueGoal) → DefinedEndState',
  inquire: 'Infer context insufficiency before execution — (ContextInsufficient, AI, INQUIRE, Prospect) → InformedExecution',
  attend: 'Evaluate execution-time risks — (ExecutionBlind, User, EVALUATE, ExecutionContext) → SituatedExecution',
  ground: 'Validate structural mapping between domains — (MappingUncertain, AI, GROUND, Text) → ValidatedMapping',
  induce: 'Crystallize in-process abstraction via dialectical triangulation — (AbstractionInProcess, AI, INDUCE, A) → CrystallizedAbstraction',
  elicit: 'Resolve via Extended-Mind reverse induction — (AbstractAporia, Hybrid, REVERSE-INDUCE-CYCLE, IntentSeed × Substrate) → ResolvedEndpoint',
  bound: 'Epistemic boundary definition — (BoundaryUndefined, AI, DEFINE, TaskScope) → DefinedBoundary',
  contextualize: 'Detect application-context mismatch — (ApplicationDecontextualized, AI, CONTEXTUALIZE, Result) → ContextualizedExecution',
  onboard: 'Quest-based protocol learning — quick recommendation + targeted scenarios for epistemic protocol adoption',
  catalog: 'Instant protocol handbook — browse all protocols, compare by concern, view detailed scenarios',
  compose: 'Protocol composition authoring — build composition SKILL.md from protocol chains',
  write: 'Multi-perspective blog drafting — transforms session insights into publishable content via iterative perspective-based refinement.',
};

const EXCLUDE_NAMES = new Set([
  '.DS_Store', '__MACOSX', '.claude-plugin', 'plugin.json',
  'README.md', 'README_ko.md',
]);
const EXCLUDE_EXTS = new Set(['.zip']);
const EXCLUDE_DIRS = new Set(['agents', 'commands', 'evals']);
const STRIP_FIELDS = new Set(['allowed-tools', 'license', 'compatibility', 'metadata']);

// Protocol metadata for release notes (deficit → resolution pairs)
// Order mirrors PROTOCOL_ORDER: Anamnesis first (recall, session start), then canonical precedence + Katalepsis last.
const PROTOCOL_METADATA = {
  anamnesis:  { name: 'Anamnesis', command: '/recollect', deficit: 'RecallAmbiguous', resolution: 'RecalledContext' },
  hermeneia:  { name: 'Hermeneia', command: '/clarify', deficit: 'IntentMisarticulated', resolution: 'ClarifiedIntent' },
  telos:      { name: 'Telos', command: '/goal', deficit: 'GoalIndeterminate', resolution: 'DefinedEndState' },
  horismos:   { name: 'Horismos', command: '/bound', deficit: 'BoundaryUndefined', resolution: 'DefinedBoundary' },
  aitesis:    { name: 'Aitesis', command: '/inquire', deficit: 'ContextInsufficient', resolution: 'InformedExecution' },
  prothesis:  { name: 'Prothesis', command: '/frame', deficit: 'FrameworkAbsent', resolution: 'FramedInquiry' },
  analogia:   { name: 'Analogia', command: '/ground', deficit: 'MappingUncertain', resolution: 'ValidatedMapping' },
  periagoge:  { name: 'Periagoge', command: '/induce', deficit: 'AbstractionInProcess', resolution: 'CrystallizedAbstraction' },
  euporia:    { name: 'Euporia', command: '/elicit', deficit: 'AbstractAporia', resolution: 'ResolvedEndpoint' },
  syneidesis: { name: 'Syneidesis', command: '/gap', deficit: 'GapUnnoticed', resolution: 'AuditedDecision' },
  prosoche:   { name: 'Prosoche', command: '/attend', deficit: 'ExecutionBlind', resolution: 'SituatedExecution' },
  epharmoge:  { name: 'Epharmoge', command: '/contextualize', deficit: 'ApplicationDecontextualized', resolution: 'ContextualizedExecution' },
  katalepsis: { name: 'Katalepsis', command: '/grasp', deficit: 'ResultUngrasped', resolution: 'VerifiedUnderstanding' },
};

// Display order: Anamnesis (recall, session start) + CANONICAL_PRECEDENCE + Katalepsis (structurally last)
const PROTOCOL_ORDER = [
  'anamnesis',
  'hermeneia', 'telos', 'horismos', 'aitesis', 'prothesis',
  'analogia', 'periagoge', 'euporia', 'syneidesis', 'prosoche', 'epharmoge', 'katalepsis',
];

// Sync validator: ensures PROTOCOL_ORDER and PROTOCOL_METADATA keys are aligned.
// Called at release-notes generation time (not module load) — drift would cause
// silent table entry drop, so fail-fast where drift has observable effect.
// Load-time validation is intentionally avoided to keep require("./package.js")
// safe for consumers (tests, static-checks) that do not call generateReleaseNotes.
function validateProtocolTables() {
  const orderSet = new Set(PROTOCOL_ORDER);
  const metaSet = new Set(Object.keys(PROTOCOL_METADATA));
  const missingInMeta = PROTOCOL_ORDER.filter(k => !metaSet.has(k));
  const missingInOrder = Object.keys(PROTOCOL_METADATA).filter(k => !orderSet.has(k));
  if (missingInMeta.length || missingInOrder.length) {
    const msg = [
      'PROTOCOL_ORDER/PROTOCOL_METADATA sync error:',
      missingInMeta.length ? `  missing in PROTOCOL_METADATA: ${missingInMeta.join(', ')}` : null,
      missingInOrder.length ? `  missing in PROTOCOL_ORDER: ${missingInOrder.join(', ')}` : null,
    ].filter(Boolean).join('\n');
    throw new Error(msg);
  }
}

// Curated first-release highlights (Phase A: no previous tag exists)
const FIRST_RELEASE_HIGHLIGHTS = `## Highlights

### 12 Epistemic Protocols

Structure human-AI interaction quality at every decision point. Each protocol resolves a typed deficit:

- **Planning**: \`/clarify\` (intent gaps), \`/goal\` (vague goals), \`/inquire\` (context insufficiency)
- **Analysis**: \`/frame\` (absent frameworks), \`/ground\` (unmapped abstractions)
- **Decision**: \`/gap\` (unnoticed gaps before action)
- **Execution**: \`/attend\` (execution-time risk evaluation)
- **Verification**: \`/contextualize\` (post-execution context mismatch)
- **Cross-cutting**: \`/bound\` (epistemic boundaries), \`/recollect\` (vague recall recognition), \`/grasp\` (comprehension verification)

### Typed Deficit-Resolution System

Every protocol carries a type signature \`(Deficit, Initiator, Action, Target) → Resolution\` that makes the epistemic transition explicit. Protocols compose through session text — each protocol's output becomes natural-language context for subsequent protocols.

### Formal Verification

16 static checks validate protocol integrity before every commit:
json-schema, notation, directive-verb, xref, structure, tool-grounding, version-staleness, graph-integrity, spec-vs-impl, cross-ref-scan, onboard-sync, precedence-linear-extension, partition-invariant, catalog-sync, gate-type-soundness, artifact-self-containment.

Protocol dependency graph (\`graph.json\`) enforces precondition DAG, advisory edges, and suppression rules with cycle detection.

### Utility Skills

- \`/catalog\` — instant protocol handbook and reference
- \`/onboard\` — quest-based protocol learning (quick recommendation + targeted scenarios)
- \`/probe\` — deficit recognition fit review (multi-hypothesis surfacing before protocol commitment)
- \`/report\` — Growth Map with epistemic analysis from session patterns
- \`/dashboard\` — full-session coverage analytics
- \`/reflect\` — cross-session insight extraction into persistent memory
- \`/write\` — multi-perspective blog drafting from session insights`;

const DESCRIPTION_LIMIT = 200;
// 510 absorbs anamnesis Skill.md at 501 lines (after the +1 Euporia distinction row);
// existing 525/581/591 lines in aitesis/prothesis/prosoche were already over the prior 500 baseline.
const LINE_GUIDELINE = 510;
const DIST_DIR = path.join(projectRoot, 'dist');
const BUNDLE_NAME = 'epistemic-protocols-bundle';

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

function dosDateTime() {
  const d = new Date();
  return {
    time: ((d.getHours() & 0x1F) << 11) | ((d.getMinutes() & 0x3F) << 5) | ((d.getSeconds() >> 1) & 0x1F),
    date: (((d.getFullYear() - 1980) & 0x7F) << 9) | (((d.getMonth() + 1) & 0x0F) << 5) | (d.getDate() & 0x1F),
  };
}

function createZip(entries) {
  const { time, date } = dosDateTime();
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

function buildRuntimeContractView(plugin) {
  const skillDir = path.join(projectRoot, plugin.dir, 'skills', plugin.skill);
  const pluginJsonPath = path.join(projectRoot, plugin.dir, '.claude-plugin', 'plugin.json');
  const pluginJson = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));
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

  const warnings = [];
  const buildResults = [];
  const bundleEntries = [];

  if (!dryRun) fs.mkdirSync(DIST_DIR, { recursive: true });

  for (const plugin of PLUGINS) {
    const skillDir = path.join(projectRoot, plugin.dir, 'skills', plugin.skill);
    const pluginJsonPath = path.join(projectRoot, plugin.dir, '.claude-plugin', 'plugin.json');

    if (!fs.existsSync(skillDir)) {
      warnings.push(`${plugin.dir}: skill directory not found`);
      continue;
    }

    let pluginJson;
    try {
      pluginJson = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));
    } catch (e) {
      warnings.push(`${plugin.dir}: failed to read plugin.json: ${e.message}`);
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
  buildRuntimeContractView,
  buildRuntimeContractViews,
  collectFiles,
  parseFrontmatter,
  serializeFrontmatter,
  transformSkillMd,
  createZip,
  generateReleaseNotes,
};
