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
  { dir: 'prosoche', skill: 'attend' },
  { dir: 'epharmoge', skill: 'contextualize' },
  { dir: 'epistemic-cooperative', skill: 'onboard' },
];

// claude.ai description overrides (originals exceed 200 chars)
// Protocol overrides: compact Type-only format for Layer 0 reference
const DESCRIPTION_OVERRIDES = {
  frame: 'Multi-perspective investigation — (FrameworkAbsent, AI, SELECT, Inquiry) → FramedInquiry',
  gap: 'Gap surfacing before decisions — (GapUnnoticed, AI, SURFACE, Decision) → AuditedDecision',
  clarify: 'Clarify intent-expression gaps — (IntentMisarticulated, Hybrid, EXTRACT, Expression) → ClarifiedIntent',
  grasp: 'Comprehension verification after AI work — (ResultUngrasped, User, VERIFY, Result) → VerifiedUnderstanding',
  goal: 'Co-construct goals from vague intent — (GoalIndeterminate, AI, CO-CONSTRUCT, VagueGoal) → DefinedEndState',
  inquire: 'Infer context insufficiency before execution — (ContextInsufficient, AI, INQUIRE, ExecutionPlan) → InformedExecution',
  attend: 'Evaluate execution-time risks — (ExecutionBlind, User, EVALUATE, ExecutionContext) → SituatedExecution',
  ground: 'Validate structural mapping between domains — (MappingUncertain, AI, GROUND, AIOutput) → ValidatedMapping',
  bound: 'Epistemic boundary definition — (BoundaryUndefined, AI, DEFINE, TaskScope) → DefinedBoundary',
  contextualize: 'Detect application-context mismatch — (ApplicationDecontextualized, AI, CONTEXTUALIZE, ExecutionResult) → ContextualizedExecution',
  reflexion: 'Extract session insights into persistent memory through guided dialogue. Reconstructs learnings from conversation history.',
};

const EXCLUDE_NAMES = new Set([
  '.DS_Store', '__MACOSX', '.claude-plugin', 'plugin.json',
  'README.md', 'README_ko.md',
]);
const EXCLUDE_EXTS = new Set(['.zip']);
const EXCLUDE_DIRS = new Set(['agents', 'commands']);
const STRIP_FIELDS = new Set(['allowed-tools', 'license', 'compatibility', 'metadata']);

const DESCRIPTION_LIMIT = 200;
const LINE_GUIDELINE = 500;
const DIST_DIR = path.join(projectRoot, 'dist');
const BUNDLE_NAME = 'epistemic-protocols-bundle';

// ============================================================
// Section 2: YAML Frontmatter Parser
// Supports: simple key-value, quoted values, >-/> folded scalar
// Unsupported: lists, nested objects, | literal block, multi-line unquoted values
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

    const m = line.match(/^([a-zA-Z][\w-]*):\s*(.*)/);
    if (!m) continue;

    currentKey = m[1];
    let val = m[2].trim();

    if (val === '>-' || val === '>') {
      inFolded = true;
      currentValue = '';
      continue;
    }

    if ((val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }

    fields.set(currentKey, val);
  }

  if (inFolded && currentKey) fields.set(currentKey, currentValue);

  return { fields, body: lines.slice(endIdx + 1).join('\n') };
}

function serializeFrontmatter(fields) {
  let yaml = '---\n';
  for (const [key, value] of fields) {
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

// ============================================================
// Section 6: Main
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
    const files = collectFiles(skillDir, plugin.skill);
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
  if (!dryRun) {
    const versionLines = buildResults
      .filter(r => r.version)
      .map(r => `| ${r.plugin} | ${r.version} | ${r.zip} |`)
      .join('\n');

    const notes = [
      '| Plugin | Version | Asset |',
      '|--------|---------|-------|',
      versionLines,
      '',
      `Bundle: \`${bundleFile}\``,
    ].join('\n');

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

module.exports = { parseFrontmatter, serializeFrontmatter, transformSkillMd, createZip };
