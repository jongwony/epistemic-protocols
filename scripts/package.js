#!/usr/bin/env node
/**
 * Package epistemic protocol skills into ZIP files for distribution
 * Zero external dependencies: Node.js standard library only
 *
 * Usage:
 *   node scripts/package.js                    # Build ZIPs to dist/
 *   node scripts/package.js --release v1.0.0   # Build + create GitHub Release draft
 *   node scripts/package.js --dry-run          # Simulate build (no file creation)
 *
 * Output: JSON { warnings: [], results: [], dryRun: bool }
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { execSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');

// ============================================================
// Section 1: Config
// ============================================================

const PLUGINS = [
  { dir: 'prothesis', skill: 'mission' },
  { dir: 'syneidesis', skill: 'gap' },
  { dir: 'hermeneia', skill: 'clarify' },
  { dir: 'katalepsis', skill: 'grasp' },
  { dir: 'telos', skill: 'goal' },
  { dir: 'aitesis', skill: 'inquire' },
  { dir: 'epitrope', skill: 'calibrate' },
  { dir: 'reflexion', skill: 'reflexion' },
  { dir: 'write', skill: 'write' },
];

// claude.ai description overrides (originals exceed 200 chars)
const DESCRIPTION_OVERRIDES = {
  mission: 'Assemble a team to analyze from multiple perspectives when the right framework is absent. Produces a framed inquiry from selected viewpoints.',
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
      yaml += `${key}: "${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"\n`;
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

// CRC-32: prefer zlib.crc32 (Node >=22.2), fallback to lookup table
const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  CRC_TABLE[i] = c;
}

function crc32(buf) {
  if (typeof zlib.crc32 === 'function') return zlib.crc32(buf) >>> 0;
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
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
    local.writeUInt16LE(0, 6);
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
    central.writeUInt16LE(0, 8);
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
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (EXCLUDE_NAMES.has(entry.name)) continue;
      if (EXCLUDE_EXTS.has(path.extname(entry.name))) continue;
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
  const releaseIdx = args.indexOf('--release');
  const releaseTag = releaseIdx !== -1 ? args[releaseIdx + 1] : null;

  if (releaseIdx !== -1 && !releaseTag) {
    console.error('ERROR: --release requires a tag (e.g., --release v1.0.0)');
    process.exit(1);
  }

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

    const pluginJson = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));
    const files = collectFiles(skillDir, plugin.skill);
    const zipEntries = [];

    for (const file of files) {
      let data = fs.readFileSync(file.sourcePath);

      if (file.isSkillMd) {
        const content = data.toString('utf8');
        const lineCount = content.split('\n').length;

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

  // Output
  for (const w of warnings) console.error(`WARN: ${w}`);
  console.log(JSON.stringify({ warnings, results: buildResults, dryRun }, null, 2));

  // GitHub Release (draft)
  if (releaseTag && !dryRun) {
    const versionLines = buildResults
      .filter(r => r.version)
      .map(r => `| ${r.plugin} | ${r.version} | ${r.zip} |`)
      .join('\n');

    const notes = [
      `## Epistemic Protocols ${releaseTag}`,
      '',
      '| Plugin | Version | Asset |',
      '|--------|---------|-------|',
      versionLines,
      '',
      `Bundle: \`${bundleFile}\``,
    ].join('\n');

    const notesFile = path.join(DIST_DIR, '.release-notes.md');
    fs.writeFileSync(notesFile, notes, 'utf8');

    const zipPaths = buildResults.map(r => `"${path.join(DIST_DIR, r.zip)}"`).join(' ');

    try {
      execSync(
        `gh release create "${releaseTag}" --draft --title "Epistemic Protocols ${releaseTag}" --notes-file "${notesFile}" ${zipPaths}`,
        { cwd: projectRoot, stdio: 'inherit' }
      );
    } catch (e) {
      console.error(`ERROR: gh release create failed: ${e.message}`);
      process.exit(1);
    } finally {
      try { fs.unlinkSync(notesFile); } catch { /* cleanup */ }
    }
  }
}

try {
  main();
} catch (e) {
  console.error(JSON.stringify({ error: e.message, stack: e.stack }));
  process.exit(2);
}
