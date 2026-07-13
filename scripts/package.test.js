#!/usr/bin/env node
/**
 * Unit tests for scripts/package.js core functions
 * Uses Node.js built-in test runner (node:test + node:assert)
 *
 * Run: node --test scripts/package.test.js
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('zlib');
const {
  PLUGINS,
  CODEX_SUBMIT_PLUGINS,
  buildSkillArtifact,
  buildCodexSubmitArtifact,
  buildCodexSubmitArtifacts,
  buildRuntimeContractViews,
  collectCodexSubmitFiles,
  collectReleaseFiles,
  isForbiddenCodexPath,
  parseFrontmatter,
  readCodexManifestVersion,
  runRelease,
  runCodexSubmit,
  serializeFrontmatter,
  transformSkillMd,
  createZip,
  generateReleaseNotes
} = require('./package');
const { runArtifactSelfContainmentCheck } = require('../.claude/skills/verify/scripts/artifact-self-containment');
const { discoverPlugins } = require('./load-protocols');

function writeFixtureFile(root, relativePath, content = 'fixture\n') {
  const target = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function makeCodexFixture() {
  const root = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'codex-submit-fixture-'));
  const plugin = { dir: 'fixture-plugin', skill: 'fixture' };
  writeFixtureFile(root, 'fixture-plugin/.codex-plugin/plugin.json', JSON.stringify({
    name: 'fixture-plugin',
    version: '1.2.3',
  }));
  writeFixtureFile(root, 'fixture-plugin/.claude-plugin/plugin.json', JSON.stringify({
    name: 'fixture-plugin',
    version: '1.2.3',
  }));
  writeFixtureFile(root, 'fixture-plugin/skills/fixture/SKILL.md', [
    '---',
    'name: fixture',
    'description: Fixture skill',
    '---',
    '[local](references/local.md?view=1#section)',
    '[external](https://example.com/reference)',
    '`references/inline.md`',
    '`agents/refuter.md`',
    '',
  ].join('\n'));
  writeFixtureFile(root, 'fixture-plugin/skills/fixture/references/local.md');
  writeFixtureFile(root, 'fixture-plugin/skills/fixture/references/inline.md');
  writeFixtureFile(root, 'fixture-plugin/skills/fixture/scripts/unreferenced.sh', '#!/bin/sh\n');
  writeFixtureFile(root, 'fixture-plugin/skills/fixture/assets/icon.svg', '<svg/>\n');
  writeFixtureFile(root, 'fixture-plugin/skills/fixture/agents/openai.yaml', [
    'interface:',
    '  icon_small: "./assets/icon.svg"',
    '',
  ].join('\n'));
  writeFixtureFile(
    root,
    'fixture-plugin/agents/refuter.md',
    '[fixture reference](../references/local.md)\n'
  );
  writeFixtureFile(root, 'fixture-plugin/agents/unrelated.md');
  return { root, plugin };
}

function snapshotTree(root) {
  if (!fs.existsSync(root)) return null;
  const snapshot = [];
  function walk(current, relative) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name))) {
      const nextRelative = path.posix.join(relative, entry.name);
      const target = path.join(current, entry.name);
      if (entry.isDirectory()) walk(target, nextRelative);
      else if (entry.isFile()) snapshot.push([nextRelative, fs.readFileSync(target).toString('base64')]);
    }
  }
  walk(root, '');
  return snapshot;
}

// ============================================================
// parseFrontmatter
// ============================================================

describe('parseFrontmatter', () => {
  it('parses simple key-value pairs', () => {
    const content = '---\nname: gap\ndescription: test\n---\nBody text';
    const { fields, body } = parseFrontmatter(content);
    assert.equal(fields.get('name'), 'gap');
    assert.equal(fields.get('description'), 'test');
    assert.equal(body, 'Body text');
  });

  it('parses quoted values (double quotes)', () => {
    const content = '---\ndescription: "value with: colon"\n---\n';
    const { fields } = parseFrontmatter(content);
    assert.equal(fields.get('description'), 'value with: colon');
  });

  it('parses quoted values (single quotes)', () => {
    const content = "---\ndescription: 'value with: colon'\n---\n";
    const { fields } = parseFrontmatter(content);
    assert.equal(fields.get('description'), 'value with: colon');
  });

  it('parses folded scalar (>-)', () => {
    const content = '---\ndescription: >-\n  first line\n  second line\n---\nBody';
    const { fields, body } = parseFrontmatter(content);
    assert.equal(fields.get('description'), 'first line second line');
    assert.equal(body, 'Body');
  });

  it('parses folded scalar (>)', () => {
    const content = '---\ndescription: >\n  folded\n  text\n---\n';
    const { fields } = parseFrontmatter(content);
    assert.equal(fields.get('description'), 'folded text');
  });

  it('handles folded scalar followed by another field', () => {
    const content = '---\ndescription: >-\n  long text\n  continued\nname: test\n---\n';
    const { fields } = parseFrontmatter(content);
    assert.equal(fields.get('description'), 'long text continued');
    assert.equal(fields.get('name'), 'test');
  });

  it('returns original content when no frontmatter', () => {
    const content = 'No frontmatter here';
    const { fields, body } = parseFrontmatter(content);
    assert.equal(fields.size, 0);
    assert.equal(body, content);
  });

  it('returns original content when unterminated frontmatter', () => {
    const content = '---\nname: test\nNo closing delimiter';
    const { fields, body } = parseFrontmatter(content);
    assert.equal(fields.size, 0);
    assert.equal(body, content);
  });

  it('handles folded scalar at end of frontmatter', () => {
    const content = '---\ndescription: >-\n  last field\n---\n';
    const { fields } = parseFrontmatter(content);
    assert.equal(fields.get('description'), 'last field');
  });

  it('parses block list (composition skill skills: field)', () => {
    const content = '---\nname: comment-review\nskills:\n  - aitesis:inquire\n  - syneidesis:gap\n  - epharmoge:contextualize\n---\nBody';
    const { fields } = parseFrontmatter(content);
    assert.deepEqual(fields.get('skills'), ['aitesis:inquire', 'syneidesis:gap', 'epharmoge:contextualize']);
    assert.equal(fields.get('name'), 'comment-review');
  });

  it('parses block list followed by another field', () => {
    const content = '---\nskills:\n  - a\n  - b\ntrailing: value\n---\n';
    const { fields } = parseFrontmatter(content);
    assert.deepEqual(fields.get('skills'), ['a', 'b']);
    assert.equal(fields.get('trailing'), 'value');
  });

  it('parses block list at end of frontmatter', () => {
    const content = '---\nname: bar\nskills:\n  - one\n  - two\n---\n';
    const { fields } = parseFrontmatter(content);
    assert.deepEqual(fields.get('skills'), ['one', 'two']);
  });

  it('preserves block list through parse → serialize round-trip', () => {
    const content = '---\nname: rt\nskills:\n  - aitesis:inquire\n  - syneidesis:gap\n---\nBody';
    const { fields, body } = parseFrontmatter(content);
    const rebuilt = serializeFrontmatter(fields) + '\n' + body;
    const reparsed = parseFrontmatter(rebuilt);
    assert.deepEqual(reparsed.fields.get('skills'), ['aitesis:inquire', 'syneidesis:gap']);
    assert.equal(reparsed.fields.get('name'), 'rt');
  });
});

// ============================================================
// serializeFrontmatter
// ============================================================

describe('serializeFrontmatter', () => {
  it('serializes simple values', () => {
    const fields = new Map([['name', 'gap'], ['version', '1.0']]);
    const result = serializeFrontmatter(fields);
    assert.equal(result, '---\nname: gap\nversion: 1.0\n---');
  });

  it('quotes values containing colons', () => {
    const fields = new Map([['description', 'value: with colon']]);
    const result = serializeFrontmatter(fields);
    assert.match(result, /description: "value: with colon"/);
  });

  it('quotes values containing hash', () => {
    const fields = new Map([['note', 'has # hash']]);
    const result = serializeFrontmatter(fields);
    assert.match(result, /note: "has # hash"/);
  });

  it('escapes double quotes in values', () => {
    const fields = new Map([['text', 'say "hello"']]);
    const result = serializeFrontmatter(fields);
    assert.match(result, /text: "say \\"hello\\""/);
  });

  it('quotes values starting with { or [', () => {
    const fields = new Map([['data', '{key: val}']]);
    const result = serializeFrontmatter(fields);
    assert.match(result, /data: "{key: val}"/);
  });

  it('serializes array values as block list', () => {
    const fields = new Map([['name', 'x'], ['skills', ['plugin:a', 'plugin:b']]]);
    const result = serializeFrontmatter(fields);
    assert.equal(result, '---\nname: x\nskills:\n  - plugin:a\n  - plugin:b\n---');
  });
});

// ============================================================
// transformSkillMd
// ============================================================

describe('transformSkillMd', () => {
  it('strips disallowed fields', () => {
    const content = '---\nname: gap\nallowed-tools: Read\nlicense: MIT\ncompatibility: v2\nmetadata: extra\n---\nBody';
    const result = transformSkillMd(content, 'gap');
    assert.ok(!result.includes('allowed-tools'));
    assert.ok(!result.includes('license'));
    assert.ok(!result.includes('compatibility'));
    assert.ok(!result.includes('metadata'));
    assert.ok(result.includes('name: gap'));
    assert.ok(result.includes('Body'));
  });

  it('overrides long descriptions when override exists', () => {
    const longDesc = 'A'.repeat(201);
    const content = `---\nname: frame\ndescription: ${longDesc}\n---\nBody`;
    const result = transformSkillMd(content, 'frame');
    const { fields } = parseFrontmatter(result);
    assert.ok(fields.get('description').length <= 200);
  });

  it('preserves long descriptions when no override defined', () => {
    const longDesc = 'A'.repeat(201);
    const content = `---\nname: custom\ndescription: ${longDesc}\n---\nBody`;
    const result = transformSkillMd(content, 'custom');
    const { fields } = parseFrontmatter(result);
    assert.equal(fields.get('description'), longDesc);
  });

  it('preserves short descriptions unchanged', () => {
    const content = '---\nname: gap\ndescription: Short description\n---\nBody';
    const result = transformSkillMd(content, 'gap');
    const { fields } = parseFrontmatter(result);
    assert.equal(fields.get('description'), 'Short description');
  });
});

// ============================================================
// runtime contract view / artifact self-containment
// ============================================================

describe('runtime contract view', () => {
  it('builds a packaged runtime view for every skill', () => {
    const views = buildRuntimeContractViews();
    assert.equal(views.length, 39);
    for (const view of views) {
      assert.equal(view.skillEntryCount, 1, `${view.plugin}:${view.skill} should have one SKILL.md entry`);
      assert.ok(view.transformedSkillMd, `${view.plugin}:${view.skill} should expose transformed SKILL.md`);
      assert.ok(view.packagedEntries.includes(`${view.skill}/SKILL.md`), `${view.plugin}:${view.skill} should package SKILL.md`);
      assert.ok(typeof view.pluginDescription === 'string');
    }
  });

  it('artifact self-containment passes with no runtime boundary leaks', () => {
    const result = runArtifactSelfContainmentCheck();
    assert.deepEqual(result.fail, []);
  });
});

// ============================================================
// goal-research runtime contract
// ============================================================

describe('goal-research runtime contract', () => {
  const REPO_ROOT = path.join(__dirname, '..');
  const skillPath = path.join(REPO_ROOT, 'epistemic-cooperative', 'skills', 'goal-research', 'SKILL.md');

  it('extends Tavily MCP tool-call timeout separately from the Codex session timeout', () => {
    const skill = fs.readFileSync(skillPath, 'utf8');
    const bashMs = Number(skill.match(/Bash\(run_in_background: true, timeout: (\d+)\)/)?.[1]);
    const mcpSec = Number(skill.match(/--config mcp_servers\.tavily\.tool_timeout_sec=(\d+)/)?.[1]);
    assert.ok(Number.isFinite(bashMs), 'Bash session timeout must be documented');
    assert.ok(Number.isFinite(mcpSec), 'Tavily MCP per-call timeout must be configured');
    assert.ok(bashMs > mcpSec * 1000, 'Bash envelope must exceed MCP per-call budget');
    assert.equal(mcpSec, 3600);
    assert.match(skill, /per-call MCP\s+timeout/i);
    assert.match(skill, /tavily_research/);
  });
});

// ============================================================
// artifact-self-containment detector liveness
// ============================================================

describe('artifact-self-containment detector liveness', () => {
  const REPO_ROOT = path.join(__dirname, '..');
  const TARGET_SKILL_MD = path.join(REPO_ROOT, 'aitesis', 'skills', 'inquire', 'SKILL.md');
  const INJECTION = '\n\nContributor reference: .claude/rules/axioms.md (A1)\n';

  it('fires when a known banned pattern is injected into a SKILL.md', () => {
    const backup = fs.readFileSync(TARGET_SKILL_MD, 'utf8');
    try {
      fs.writeFileSync(TARGET_SKILL_MD, backup + INJECTION);

      const result = runArtifactSelfContainmentCheck();

      const aitesisFails = result.fail.filter(
        f => f.file && f.file.startsWith('aitesis:inquire')
      );
      assert.ok(
        aitesisFails.length >= 1,
        `expected ≥1 fail for aitesis:inquire after injecting banned patterns, ` +
        `got ${aitesisFails.length}. If 0: detector is silently no-op (liveness failure). ` +
        `Fails: ${JSON.stringify(result.fail)}`
      );

      const hasClaudePath = aitesisFails.some(f => /\.claude/.test(f.message));
      assert.ok(hasClaudePath, '.claude/ banned pattern should fire on injected content');

      const hasAxiomsMd = aitesisFails.some(f => /axioms?\.md/.test(f.message));
      assert.ok(hasAxiomsMd, 'axioms.md banned pattern should fire on injected content');
    } finally {
      try {
        fs.writeFileSync(TARGET_SKILL_MD, backup);
      } catch (restoreErr) {
        process.stderr.write(
          '\n\n!!! LIVENESS TEST FAILED TO RESTORE aitesis SKILL.md !!!\n' +
          'Manual recovery required: git checkout aitesis/skills/inquire/SKILL.md\n' +
          `Original restore error: ${restoreErr && restoreErr.message}\n\n`
        );
        throw restoreErr;
      }
    }
  });
});

// ============================================================
// enforcement-check detector liveness (checks 25/26/27)
// ============================================================
// static-checks.js is a run-to-completion script (no module exports), so
// these liveness tests execute it as a subprocess and parse its JSON
// output. Non-zero exit is expected here: each test deliberately breaks a
// live file to prove the detector fires, then restores it. Only the target
// check's fail entries are asserted — other checks reacting to the
// temporary mutation are irrelevant to liveness.
// IMPORTANT: these tests mutate live files. Never run this test file
// concurrently with a static protocol verification run (see CLAUDE.md
// Verification note); run them sequentially.

function runStaticChecksSubprocess() {
  const REPO_ROOT = path.join(__dirname, '..');
  const scriptPath = path.join(
    REPO_ROOT, '.claude', 'skills', 'verify', 'scripts', 'static-checks.js'
  );
  try {
    const stdout = execFileSync(process.execPath, [scriptPath, REPO_ROOT], {
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
    });
    return JSON.parse(stdout);
  } catch (err) {
    // Exit code 1 means checks ran and some failed — the expected liveness
    // path; stdout still carries the full JSON results. Anything else
    // (crash, unparseable output) propagates as a loud test failure.
    if (err.stdout) {
      try {
        return JSON.parse(err.stdout);
      } catch {
        throw err;
      }
    }
    throw err;
  }
}

describe('enforcement-check detector liveness', () => {
  const REPO_ROOT = path.join(__dirname, '..');
  const CORE_SKILL_MD = path.join(REPO_ROOT, 'aitesis', 'skills', 'inquire', 'SKILL.md');
  const INK_STYLE_MD = path.join(
    REPO_ROOT, 'epistemic-cooperative', 'styles', 'epistemic-ink.md'
  );

  function restoreOrDie(filePath, backup, label) {
    try {
      fs.writeFileSync(filePath, backup);
    } catch (restoreErr) {
      process.stderr.write(
        `\n\n!!! LIVENESS TEST FAILED TO RESTORE ${label} !!!\n` +
        `Manual recovery required: git checkout ${path.relative(REPO_ROOT, filePath)}\n` +
        `Original restore error: ${restoreErr && restoreErr.message}\n\n`
      );
      throw restoreErr;
    }
  }

  it('formal-blocks-rule fires when the rule label is mangled in a core SKILL.md', () => {
    const LABEL = '**Formal blocks are runtime-normative**';
    const backup = fs.readFileSync(CORE_SKILL_MD, 'utf8');
    assert.ok(backup.includes(LABEL), 'precondition: rule label present in pristine file');
    try {
      fs.writeFileSync(
        CORE_SKILL_MD,
        backup.replace(LABEL, '**Formal blocks are runtime-MANGLED**')
      );

      const result = runStaticChecksSubprocess();
      const fails = result.fail.filter(
        f => f.check === 'formal-blocks-rule' && /aitesis/.test(f.file)
      );
      assert.ok(
        fails.length >= 1,
        `expected ≥1 formal-blocks-rule fail for aitesis after mangling the rule label, ` +
        `got ${fails.length}. If 0: detector is silently no-op (liveness failure). ` +
        `Fails: ${JSON.stringify(result.fail)}`
      );
    } finally {
      restoreOrDie(CORE_SKILL_MD, backup, 'aitesis SKILL.md');
    }
  });

  it('gate-integrity-rule fires when the mutation-taxonomy kernel is mangled in its entry', () => {
    // The Gate integrity Rules entry states the kernel with a capital T
    // ("Type-preserving materialization"); the earlier prose occurrence is
    // lowercase, so this exact-case replace targets the entry body only.
    const ENTRY_KERNEL = 'Type-preserving materialization';
    const backup = fs.readFileSync(CORE_SKILL_MD, 'utf8');
    assert.ok(backup.includes(ENTRY_KERNEL), 'precondition: entry kernel present in pristine file');
    try {
      fs.writeFileSync(
        CORE_SKILL_MD,
        backup.replace(ENTRY_KERNEL, 'Type-MANGLED materialization')
      );

      const result = runStaticChecksSubprocess();
      const fails = result.fail.filter(
        f => f.check === 'gate-integrity-rule' && /aitesis/.test(f.file)
      );
      assert.ok(
        fails.length >= 1,
        `expected ≥1 gate-integrity-rule fail for aitesis after mangling the kernel phrase, ` +
        `got ${fails.length}. If 0: detector is silently no-op (liveness failure). ` +
        `Fails: ${JSON.stringify(result.fail)}`
      );
    } finally {
      restoreOrDie(CORE_SKILL_MD, backup, 'aitesis SKILL.md');
    }
  });

  it('gate-firing-anchor fires when a kernel phrase is deleted from the Ink element', () => {
    const KERNEL = 'an uncited skip is not a relay but a silent gate omission';
    const backup = fs.readFileSync(INK_STYLE_MD, 'utf8');
    assert.ok(backup.includes(KERNEL), 'precondition: kernel phrase present in pristine file');
    try {
      fs.writeFileSync(INK_STYLE_MD, backup.replace(KERNEL, ''));

      const result = runStaticChecksSubprocess();
      const fails = result.fail.filter(f => f.check === 'gate-firing-anchor');
      assert.ok(
        fails.length >= 1,
        `expected ≥1 gate-firing-anchor fail after deleting a kernel phrase, ` +
        `got ${fails.length}. If 0: detector is silently no-op (liveness failure). ` +
        `Fails: ${JSON.stringify(result.fail)}`
      );
      const namesDeletedKernel = fails.some(f => f.message && f.message.includes(KERNEL));
      assert.ok(namesDeletedKernel, 'fail message should name the deleted kernel phrase');
    } finally {
      restoreOrDie(INK_STYLE_MD, backup, 'epistemic-ink.md');
    }
  });
});

// ============================================================
// createZip
// ============================================================

describe('createZip', () => {
  it('creates valid ZIP with local file header signature', () => {
    const entries = [{ name: 'test.txt', data: Buffer.from('hello') }];
    const zip = createZip(entries);
    // PK\x03\x04 local file header
    assert.equal(zip.readUInt32LE(0), 0x04034b50);
  });

  it('creates ZIP with correct end-of-central-directory signature', () => {
    const entries = [{ name: 'test.txt', data: Buffer.from('hello') }];
    const zip = createZip(entries);
    // Find EOCD signature (last 22+ bytes)
    const eocdOffset = zip.length - 22;
    assert.equal(zip.readUInt32LE(eocdOffset), 0x06054b50);
  });

  it('records correct entry count in EOCD', () => {
    const entries = [
      { name: 'a.txt', data: Buffer.from('aaa') },
      { name: 'b.txt', data: Buffer.from('bbb') },
      { name: 'c.txt', data: Buffer.from('ccc') },
    ];
    const zip = createZip(entries);
    const eocdOffset = zip.length - 22;
    assert.equal(zip.readUInt16LE(eocdOffset + 8), 3);  // total entries (disk)
    assert.equal(zip.readUInt16LE(eocdOffset + 10), 3); // total entries
  });

  it('uses STORE (method 0) when deflate is not smaller', () => {
    // Very short data — deflate adds overhead
    const entries = [{ name: 'tiny.txt', data: Buffer.from('hi') }];
    const zip = createZip(entries);
    const method = zip.readUInt16LE(8); // compression method in local header
    assert.equal(method, 0, 'Expected STORE for tiny data');
  });

  it('uses DEFLATE (method 8) when beneficial', () => {
    // Repetitive data compresses well
    const entries = [{ name: 'big.txt', data: Buffer.from('x'.repeat(1000)) }];
    const zip = createZip(entries);
    const method = zip.readUInt16LE(8);
    assert.equal(method, 8, 'Expected DEFLATE for compressible data');
  });

  it('stores correct CRC-32', () => {
    const data = Buffer.from('test data for crc');
    const entries = [{ name: 'crc.txt', data }];
    const zip = createZip(entries);
    const expectedCrc = zlib.crc32(data) >>> 0;
    const storedCrc = zip.readUInt32LE(14); // CRC-32 in local header
    assert.equal(storedCrc, expectedCrc);
  });

  it('handles multiple entries with correct central directory', () => {
    const entries = [
      { name: 'dir/a.md', data: Buffer.from('# Title A') },
      { name: 'dir/b.md', data: Buffer.from('# Title B') },
    ];
    const zip = createZip(entries);
    // Find central directory signature (0x02014b50) after local entries
    let found = 0;
    for (let i = 0; i < zip.length - 4; i++) {
      if (zip.readUInt32LE(i) === 0x02014b50) found++;
    }
    assert.equal(found, 2, 'Expected 2 central directory entries');
  });

  it('roundtrips: deflated data decompresses to original', () => {
    const original = Buffer.from('repetitive '.repeat(100));
    const entries = [{ name: 'round.txt', data: original }];
    const zip = createZip(entries);

    const method = zip.readUInt16LE(8);
    const compressedSize = zip.readUInt32LE(18);
    const nameLen = zip.readUInt16LE(26);
    const dataOffset = 30 + nameLen;
    const compressed = zip.subarray(dataOffset, dataOffset + compressedSize);

    let recovered;
    if (method === 8) {
      recovered = zlib.inflateRawSync(compressed);
    } else {
      recovered = compressed;
    }
    assert.deepEqual(recovered, original);
  });
});

// ============================================================
// codex-submit artifact profile
// ============================================================

describe('codex-submit artifact profile', () => {
  it('packages support closure, openai.yaml, and only directly referenced plugin agents', () => {
    const { root, plugin } = makeCodexFixture();
    try {
      const first = buildCodexSubmitArtifact(plugin, { root });
      const second = buildCodexSubmitArtifact(plugin, { root });
      assert.deepEqual(first.artifact.entries, [
        'fixture/SKILL.md',
        'fixture/agents/openai.yaml',
        'fixture/agents/refuter.md',
        'fixture/assets/icon.svg',
        'fixture/references/inline.md',
        'fixture/references/local.md',
        'fixture/scripts/unreferenced.sh',
      ]);
      assert.ok(!first.artifact.entries.includes('fixture/agents/unrelated.md'));
      assert.equal(first.artifact.version, '1.2.3');
      assert.equal(first.artifact.entries.filter(name => name.endsWith('/SKILL.md')).length, 1);
      assert.ok(!first.artifact.entries.some(name => name.endsWith('/Skill.md')));
      assert.deepEqual(first.zipBuffer, second.zipBuffer);
      assert.deepEqual(first.artifact, second.artifact);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  it('fails closed on every forbidden filename and path-segment class', () => {
    const forbidden = [
      'references/.env',
      'references/.env.local',
      'scripts/server.pem',
      'scripts/private.key',
      'assets/id_rsa',
      'assets/id_rsa.pub',
      'references/credentials.json',
      'references/secrets.yaml',
      'references/events.jsonl',
      'references/.claude/state.md',
      'references/.codex/state.md',
      'references/sessions/state.md',
      'references/transcripts/state.md',
    ];
    for (const relativePath of forbidden) {
      const { root, plugin } = makeCodexFixture();
      try {
        writeFixtureFile(root, `fixture-plugin/skills/fixture/${relativePath}`);
        assert.equal(isForbiddenCodexPath(`fixture/${relativePath}`), true, relativePath);
        assert.throws(
          () => collectCodexSubmitFiles(plugin, { root }),
          /artifact forbidden path/,
          relativePath
        );
      } finally {
        fs.rmSync(root, { recursive: true, force: true });
      }
    }
    assert.equal(isForbiddenCodexPath('fixture/references/public.md'), false);
  });

  it('rejects missing and escaping archive-local references', () => {
    for (const reference of ['[missing](references/missing.md)', '[escape](../../outside.md)']) {
      const { root, plugin } = makeCodexFixture();
      try {
        const skillPath = path.join(root, 'fixture-plugin', 'skills', 'fixture', 'SKILL.md');
        fs.appendFileSync(skillPath, `${reference}\n`);
        assert.throws(
          () => buildCodexSubmitArtifact(plugin, { root }),
          /unresolved local reference|reference escapes skill root/
        );
      } finally {
        fs.rmSync(root, { recursive: true, force: true });
      }
    }
  });

  it('treats inline-code and openai.yaml asset paths as closure obligations', () => {
    const missingTargets = [
      'fixture-plugin/skills/fixture/references/inline.md',
      'fixture-plugin/skills/fixture/assets/icon.svg',
    ];
    for (const missingTarget of missingTargets) {
      const { root, plugin } = makeCodexFixture();
      try {
        fs.rmSync(path.join(root, missingTarget));
        assert.throws(
          () => buildCodexSubmitArtifact(plugin, { root }),
          /unresolved local reference/,
          missingTarget
        );
      } finally {
        fs.rmSync(root, { recursive: true, force: true });
      }
    }
  });

  it('rejects parent traversal in agents/openai.yaml paths', () => {
    const { root, plugin } = makeCodexFixture();
    try {
      writeFixtureFile(
        root,
        'fixture-plugin/skills/fixture/agents/openai.yaml',
        'interface:\n  icon_small: "./assets/../icon.svg"\n'
      );
      assert.throws(
        () => buildCodexSubmitArtifact(plugin, { root }),
        /openai\.yaml traversal is forbidden/
      );
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  it('uses the Codex manifest version and rejects Claude manifest drift', () => {
    const { root, plugin } = makeCodexFixture();
    try {
      assert.equal(readCodexManifestVersion(plugin, { root }), '1.2.3');
      writeFixtureFile(root, 'fixture-plugin/.claude-plugin/plugin.json', JSON.stringify({
        name: 'fixture-plugin',
        version: '9.9.9',
      }));
      assert.throws(
        () => readCodexManifestVersion(plugin, { root }),
        /manifest version mismatch/
      );
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  it('fails when an expected selected plugin is absent', () => {
    const root = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'codex-submit-empty-'));
    try {
      assert.throws(
        () => buildCodexSubmitArtifacts({ root }),
        /expected plugin is absent: aitesis/
      );
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  it('rejects an excluded plugin even when it exists in the repository', () => {
    assert.throws(
      () => buildCodexSubmitArtifact({ dir: 'anamnesis', skill: 'recollect' }),
      /excluded plugin selected: anamnesis/
    );
  });

  it('dry-run reports exactly the public-core set without mutating profile output', () => {
    const profileDir = path.join(__dirname, '..', 'dist', 'codex-submit');
    const before = snapshotTree(profileDir);
    const script = path.join(__dirname, 'package.js');
    const first = JSON.parse(execFileSync(
      process.execPath,
      [script, '--profile', 'codex-submit', '--dry-run'],
      { encoding: 'utf8' }
    ));
    const second = JSON.parse(execFileSync(
      process.execPath,
      [script, '--profile', 'codex-submit', '--dry-run'],
      { encoding: 'utf8' }
    ));

    assert.equal(first.profile, 'codex-submit');
    assert.equal(first.dryRun, true);
    assert.equal(first.results.length, 15);
    assert.deepEqual(first.index, second.index);
    assert.deepEqual(
      first.results.map(({ plugin, skill }) => ({ dir: plugin, skill })),
      CODEX_SUBMIT_PLUGINS
    );
    assert.ok(!first.results.some(result =>
      ['anamnesis', 'anagoge', 'epistemic-cooperative', 'bundle'].includes(result.plugin)
    ));
    assert.ok(!first.results.some(result => /bundle|release-notes/.test(result.filename)));
    for (const artifact of first.results) {
      assert.deepEqual(artifact.entries, [...artifact.entries].sort());
      assert.equal(artifact.entries.filter(name => name.endsWith('/SKILL.md')).length, 1);
      assert.ok(!artifact.entries.some(name => name.endsWith('/Skill.md')));
    }
    assert.ok(
      first.results.find(result => result.plugin === 'diylisis').entries
        .includes('distill/agents/zero-memory-refuter.md')
    );
    assert.ok(
      first.results.find(result => result.plugin === 'prothesis').entries
        .includes('frame/references/conceptual-foundations.md')
    );
    assert.deepEqual(snapshotTree(profileDir), before);
  });

  it('clean rebuilds reproduce index data and remove stale profile artifacts', () => {
    const root = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'codex-submit-build-'));
    const outputDir = path.join(root, 'output');
    try {
      const first = runCodexSubmit({ dryRun: false, outputDir });
      const firstSnapshot = snapshotTree(outputDir);
      writeFixtureFile(outputDir, 'stale.zip', 'stale');
      const second = runCodexSubmit({ dryRun: false, outputDir });
      const secondSnapshot = snapshotTree(outputDir);

      assert.deepEqual(second.index, first.index);
      assert.deepEqual(secondSnapshot, firstSnapshot);
      assert.ok(!fs.existsSync(path.join(outputDir, 'stale.zip')));
      assert.equal(second.index.artifacts.length, 15);
      for (const artifact of second.index.artifacts) {
        const zip = fs.readFileSync(path.join(outputDir, artifact.filename));
        assert.equal(zip.length, artifact.bytes);
        assert.equal(
          crypto.createHash('sha256').update(zip).digest('hex'),
          artifact.sha256
        );
      }
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});

// ============================================================
// unified release artifact contract
// ============================================================

describe('unified release artifact contract', () => {
  it('produces byte-identical release and submission ZIPs for the fifteen public-core skills', () => {
    for (const plugin of CODEX_SUBMIT_PLUGINS) {
      const release = buildSkillArtifact(plugin, { profile: 'release' });
      const submission = buildCodexSubmitArtifact(plugin);
      assert.deepEqual(release.zipBuffer, submission.zipBuffer, `${plugin.dir}/${plugin.skill}`);
      assert.deepEqual(release.artifact, submission.artifact, `${plugin.dir}/${plugin.skill}`);
    }
  });

  it('retains utility sidecars and directly referenced agents in the release superset', () => {
    const entriesFor = (dir, skill) => collectReleaseFiles({ dir, skill }).map(file => file.zipPath);
    assert.ok(entriesFor('epistemic-cooperative', 'catalog').includes('catalog/routing-map.md'));
    assert.ok(entriesFor('epistemic-cooperative', 'comment-review')
      .includes('comment-review/templates/preview.html'));
    assert.ok(entriesFor('epistemic-cooperative', 'forge')
      .includes('forge/adapters/codex-goals.md'));
    assert.ok(entriesFor('diylisis', 'distill')
      .includes('distill/agents/zero-memory-refuter.md'));
    assert.ok(entriesFor('epistemic-cooperative', 'curses')
      .includes('curses/agents/dimension-profiler.md'));
    assert.ok(!entriesFor('epistemic-cooperative', 'comment-review')
      .includes('comment-review/evals/evals.json'));
  });

  it('rebuilds every release ZIP and bundle deterministically with canonical SKILL.md casing', () => {
    const root = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'release-build-'));
    const outputDir = path.join(root, 'output');
    try {
      const first = runRelease({ dryRun: false, outputDir });
      const firstSnapshot = snapshotTree(outputDir);
      const second = runRelease({ dryRun: false, outputDir });
      const secondSnapshot = snapshotTree(outputDir);

      assert.deepEqual(second, first);
      assert.deepEqual(secondSnapshot, firstSnapshot);
      assert.equal(second.results.length, 40);
      assert.equal(PLUGINS.length, 39);
      for (const plugin of PLUGINS) {
        const build = buildSkillArtifact(plugin, { profile: 'release' });
        assert.equal(
          build.artifact.entries.filter(name => name.endsWith('/SKILL.md')).length,
          1,
          `${plugin.dir}/${plugin.skill}`
        );
        assert.ok(
          !build.artifact.entries.some(name => name.endsWith('/Skill.md')),
          `${plugin.dir}/${plugin.skill}`
        );
        const written = fs.readFileSync(path.join(outputDir, build.artifact.filename));
        assert.equal(written.length, build.artifact.bytes);
        assert.equal(
          crypto.createHash('sha256').update(written).digest('hex'),
          build.artifact.sha256
        );
      }
      const bundle = second.results.find(result => result.plugin === 'bundle');
      const bundleBytes = fs.readFileSync(path.join(outputDir, bundle.zip));
      assert.equal(bundleBytes.length, bundle.bytes);
      assert.equal(
        crypto.createHash('sha256').update(bundleBytes).digest('hex'),
        bundle.sha256
      );
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});

// ============================================================
// generateReleaseNotes
// ============================================================

describe('generateReleaseNotes', () => {
  const mockResults = [
    { plugin: 'aitesis', skill: 'inquire', version: '1.17.2', zip: 'inquire.zip', files: 1, bytes: 100 },
    { plugin: 'horismos', skill: 'bound', version: '1.8.1', zip: 'bound.zip', files: 1, bytes: 100 },
    { plugin: 'prothesis', skill: 'frame', version: '5.8.1', zip: 'frame.zip', files: 1, bytes: 100 },
    { plugin: 'bundle', skill: 'epistemic-protocols-bundle', zip: 'epistemic-protocols-bundle.zip', files: 19, bytes: 5000 },
  ];

  // Derived from the same canonical source package.js uses, so the curated-fallback
  // count assertions below validate dynamic rendering instead of re-hardcoding a number.
  const EXPECTED_PROTOCOL_COUNT = discoverPlugins({ projectRoot: path.join(__dirname, '..') })
    .filter(r => r.isProtocol).length;

  it('generates 4-section structure', () => {
    const notes = generateReleaseNotes(mockResults);
    assert.ok(notes.includes('# Epistemic Protocols'));
    assert.ok(notes.includes('## Highlights'));
    assert.ok(notes.includes('## Protocols'));
    assert.ok(notes.includes('## Assets'));
  });

  it('includes tag in headline when provided', () => {
    const notes = generateReleaseNotes(mockResults, { tag: 'v2026.03.15' });
    assert.ok(notes.includes('# Epistemic Protocols v2026.03.15'));
  });

  it('omits tag from headline when not provided', () => {
    const notes = generateReleaseNotes(mockResults);
    assert.ok(notes.startsWith('# Epistemic Protocols\n'));
    assert.ok(!notes.includes('null'));
    assert.ok(!notes.includes('undefined'));
  });

  it('includes deficit → resolution pairs in protocols table', () => {
    const notes = generateReleaseNotes(mockResults);
    assert.ok(notes.includes('ContextInsufficient → InformedExecution'));
    assert.ok(notes.includes('BoundaryUndefined → DefinedBoundary'));
    assert.ok(notes.includes('FrameworkAbsent → FramedInquiry'));
  });

  it('shows versions from buildResults in protocols table', () => {
    const notes = generateReleaseNotes(mockResults);
    assert.ok(notes.includes('| 1.17.2 |'));
    assert.ok(notes.includes('| 5.8.1 |'));
  });

  it('shows dash for protocols not in buildResults', () => {
    const notes = generateReleaseNotes(mockResults);
    // syneidesis is not in mockResults, should show —
    assert.ok(notes.includes('| — |'));
  });

  it('includes asset table from buildResults', () => {
    const notes = generateReleaseNotes(mockResults);
    assert.ok(notes.includes('| aitesis | 1.17.2 | inquire.zip |'));
    assert.ok(notes.includes('Bundle: `epistemic-protocols-bundle.zip`'));
  });

  it('follows CANONICAL_PRECEDENCE order in protocols table', () => {
    const notes = generateReleaseNotes(mockResults);
    const horismosPos = notes.indexOf('Horismos');
    const aitesisPos = notes.indexOf('Aitesis');
    const prothesisPos = notes.indexOf('Prothesis');
    const katalepsisPos = notes.indexOf('Katalepsis');
    assert.ok(horismosPos < aitesisPos, 'Horismos should precede Aitesis');
    assert.ok(aitesisPos < prothesisPos, 'Aitesis should precede Prothesis');
    assert.ok(prothesisPos < katalepsisPos, 'Katalepsis should be last');
  });

  it('includes all 17 protocols in protocols table', () => {
    const notes = generateReleaseNotes(mockResults);
    const protocolNames = [
      'Anamnesis', 'Anagoge', 'Horismos', 'Aitesis', 'Prothesis', 'Hyphegesis',
      'Analogia', 'Periagoge', 'Euporia', 'Proplasma', 'Syneidesis', 'Prosoche', 'Epharmoge', 'Elenchus', 'Diylisis', 'Diairesis', 'Katalepsis',
    ];
    for (const name of protocolNames) {
      assert.ok(notes.includes(name), `Expected ${name} in protocols table`);
    }
  });

  it('uses computed highlights when changelog provided', () => {
    const changelog = {
      groups: {
        prothesis: [{ hash: 'abc1234', type: 'feat', message: 'Two-mode redesign' }],
        syneidesis: [{ hash: 'def5678', type: 'fix', message: 'Phase 2 routing fix' }],
      },
      ungrouped: [],
    };
    const notes = generateReleaseNotes(mockResults, { changelog });
    assert.ok(notes.includes('### New'));
    assert.ok(notes.includes('### Fixed'));
    assert.ok(notes.includes('**prothesis**: Two-mode redesign'));
    assert.ok(!notes.includes(`### ${EXPECTED_PROTOCOL_COUNT} Epistemic Protocols`));
  });

  it('falls back to curated highlights when changelog groups empty', () => {
    const changelog = { groups: {}, ungrouped: [] };
    const notes = generateReleaseNotes(mockResults, { changelog });
    assert.ok(notes.includes(`### ${EXPECTED_PROTOCOL_COUNT} Epistemic Protocols`));
  });
});

// ============================================================
// generate-changelog.js CLI
// ============================================================

describe('generate-changelog.js CLI', () => {
  it('outputs valid JSON with empty groups when no tags exist', () => {
    const output = execFileSync(process.execPath, [path.join(__dirname, 'generate-changelog.js')], {
      encoding: 'utf8',
      cwd: path.join(__dirname, '..'),
    });
    const result = JSON.parse(output);
    assert.ok(result.range);
    assert.ok('groups' in result);
    assert.ok('ungrouped' in result);
  });
});

// ============================================================
// package.js CLI
// ============================================================

describe('package.js CLI', () => {
  it('packages all 39 skills plus bundle in dry-run', () => {
    const output = execFileSync(process.execPath, [path.join(__dirname, 'package.js'), '--dry-run'], {
      encoding: 'utf8',
    });
    const result = JSON.parse(output);
    const bundle = result.results.find(entry => entry.plugin === 'bundle');

    // Regression guard: packaging must not emit plugin-malformation or missing-SKILL
    // warnings for anamnesis (distinct from non-blocking style warnings like line
    // guidelines). A silent skip of anamnesis would drop results.length without
    // surfacing the cause — this filter catches that specific failure mode.
    const anamnesisWarnings = result.warnings.filter(w => /anamnesis|recollect/.test(w));
    assert.deepEqual(anamnesisWarnings, [], 'no anamnesis/recollect packaging warnings');
    assert.equal(result.results.length, 40);
    assert.deepEqual(
      result.results.map(entry => entry.zip).sort(),
      [
        'ascend.zip',
        'attend.zip',
        'bound.zip',
        'catalog.zip',
        'comment-review.zip',
        'conduct.zip',
        'contextualize.zip',
        'curses.zip',
        'dashboard.zip',
        'delimit.zip',
        'dispatch.zip',
        'distill.zip',
        'elicit.zip',
        'epistemic-protocols-bundle.zip',
        'forge.zip',
        'frame.zip',
        'gap.zip',
        'goal-research.zip',
        'grasp.zip',
        'ground.zip',
        'image-companion.zip',
        'induce.zip',
        'inquire.zip',
        'introspect.zip',
        'lens-review.zip',
        'misuse.zip',
        'onboard.zip',
        'preview.zip',
        'probe.zip',
        'realign.zip',
        'recollect.zip',
        'reduced-space-test.zip',
        'report.zip',
        'review-loop.zip',
        'sophia.zip',
        'steer.zip',
        'sublate.zip',
        'triage.zip',
        'white-bear.zip',
        'zero-shot.zip',
      ].sort(),
    );
    // Lower-bound invariant: baseline reflects the current plugin set at
    // merge time. Any additive change (new plugin, new reference doc, new
    // agent) only increases this count. A shrink indicates an unintended
    // regression (plugin removed or files accidentally excluded from the
    // packager), which should fail.
    assert.ok(
      bundle.files >= 30,
      `expected bundle.files >= 30 (regression guard), got ${bundle.files}`
    );
  });
});

// ============================================================
// load-protocols Type signature regression guard
// ============================================================

describe('load-protocols Type signature extraction', () => {
  // Regression guard for PR #351 review T2: every active protocol's SKILL.md
  // description (or body fallback) must yield non-null deficit + resolution.
  // A future SKILL.md edit that breaks the Type signature pattern would
  // silently drop the protocol from release notes and CANONICAL_PROTOCOLS.
  // This test fails fast at that boundary.
  it('every active protocol yields non-null deficit and resolution', () => {
    const records = discoverPlugins({ projectRoot: path.resolve(__dirname, '..') });
    const protocols = records.filter(r => r.isProtocol);
    assert.ok(
      protocols.length >= 11,
      `expected >= 11 active protocols, got ${protocols.length} (graph.json may have failed to parse)`
    );
    for (const r of protocols) {
      assert.ok(r.deficit, `${r.dir}: deficit is null — SKILL.md Type signature parse failed`);
      assert.ok(r.resolution, `${r.dir}: resolution is null — SKILL.md Type signature parse failed`);
    }
  });
});

// ============================================================
// agent routing map (generate-routing-map + session-context)
// ============================================================

describe('agent routing map', () => {
  const REPO_ROOT = path.resolve(__dirname, '..');
  const {
    generateRoutingMap,
    buildRoutingEntries,
    checkRoutingMap,
  } = require('./generate-routing-map');
  const SESSION_CONTEXT = path.join(
    REPO_ROOT, 'epistemic-cooperative', 'skills', 'catalog', 'scripts', 'session-context.js'
  );

  it('parses all 17 protocols, each with a when: trigger and deficit → resolution spine', () => {
    const entries = buildRoutingEntries({ projectRoot: REPO_ROOT });
    assert.equal(entries.length, 17, `expected 17 routing entries, got ${entries.length}`);
    for (const e of entries) {
      assert.ok(e.trigger && e.trigger.length > 0, `${e.cmd}: missing when: trigger`);
      assert.ok(e.deficit, `${e.cmd}: missing deficit spine`);
      assert.ok(e.resolution, `${e.cmd}: missing resolution spine`);
      assert.ok(e.cluster, `${e.cmd}: missing cluster`);
    }
    // Bidirectional drift guard: the routing-entry command set must equal the
    // discovered-protocol command set exactly — not just cover it (guard (a):
    // no protocol silently dropped) but also not exceed it (guard (b): no
    // stale catalog row surviving a protocol removal/rename).
    const covered = new Set(entries.map(e => e.cmd));
    const protocols = discoverPlugins({ projectRoot: REPO_ROOT }).filter(r => r.isProtocol);
    const discovered = new Set(protocols.map(r => `/${r.skill}`));
    for (const r of protocols) {
      assert.ok(covered.has(`/${r.skill}`), `protocol /${r.skill} missing from routing map`);
    }
    for (const cmd of covered) {
      assert.ok(discovered.has(cmd), `routing map entry ${cmd} has no matching discovered protocol (stale catalog row)`);
    }
  });

  it('produces deterministic output with the routing directive and every entry rendered', () => {
    const a = generateRoutingMap({ projectRoot: REPO_ROOT });
    const b = generateRoutingMap({ projectRoot: REPO_ROOT });
    assert.equal(a, b, 'routing map generation must be deterministic');
    assert.match(a, /Route from the deficit, not the summary\./);
    assert.equal((a.match(/^\*\*`\//gm) || []).length, 17, 'all 17 entries rendered');
    assert.equal((a.match(/^\s+when:/gm) || []).length, 17, 'every entry has a when: line');
  });

  it('committed routing-map.md is in sync with its canonical sources', () => {
    const { inSync, reason } = checkRoutingMap({ projectRoot: REPO_ROOT });
    assert.ok(inSync, `routing-map.md stale: ${reason} — run node scripts/generate-routing-map.js`);
  });

  it('session-context.js emits valid SessionStart JSON with non-empty additionalContext', () => {
    const out = execFileSync(process.execPath, [SESSION_CONTEXT], { encoding: 'utf8' });
    const parsed = JSON.parse(out);
    assert.equal(parsed.hookSpecificOutput.hookEventName, 'SessionStart');
    const ctx = parsed.hookSpecificOutput.additionalContext;
    assert.ok(typeof ctx === 'string' && ctx.length > 0, 'additionalContext must be a non-empty string');
    assert.match(ctx, /Route from the deficit, not the summary\./);
    assert.equal((ctx.match(/\*\*`\//g) || []).length, 17, 'full map injects all 17 entries');
  });

  it('session-context.js --only filters to the requested commands (preamble kept)', () => {
    const out = execFileSync(process.execPath, [SESSION_CONTEXT, '--only=/grasp,/gap'], { encoding: 'utf8' });
    const ctx = JSON.parse(out).hookSpecificOutput.additionalContext;
    assert.match(ctx, /Route from the deficit, not the summary\./);
    assert.equal((ctx.match(/\*\*`\//g) || []).length, 2, 'only the two requested commands');
    assert.ok(ctx.includes('**`/grasp`**'));
    assert.ok(ctx.includes('**`/gap`**'));
    assert.ok(!ctx.includes('**`/inquire`**'));
  });
});
