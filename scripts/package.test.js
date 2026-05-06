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
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('zlib');
const {
  buildRuntimeContractViews,
  parseFrontmatter,
  serializeFrontmatter,
  transformSkillMd,
  createZip,
  generateReleaseNotes
} = require('./package');
const { runArtifactSelfContainmentCheck } = require('../.claude/skills/verify/scripts/artifact-self-containment');

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
    assert.equal(views.length, 28);
    for (const view of views) {
      assert.equal(view.skillEntryCount, 1, `${view.plugin}:${view.skill} should have one Skill.md entry`);
      assert.ok(view.transformedSkillMd, `${view.plugin}:${view.skill} should expose transformed Skill.md`);
      assert.ok(view.packagedEntries.includes(`${view.skill}/Skill.md`), `${view.plugin}:${view.skill} should package Skill.md`);
      assert.ok(typeof view.pluginDescription === 'string');
    }

    // HFT format spec must be packaged in BOTH crystallize and rehydrate so
    // each skill is self-contained when installed standalone (rehydrate.zip
    // without crystallize.zip must still resolve references/hft-format.md).
    // Regression guard: if `collectFiles` ever drops the `references/`
    // directory or the duplication is removed, this assertion fires.
    const crystallizeView = views.find(v => v.skill === 'crystallize');
    assert.ok(crystallizeView, 'crystallize runtime view should exist');
    assert.ok(
      crystallizeView.packagedEntries.includes('crystallize/references/hft-format.md'),
      'crystallize should package references/hft-format.md',
    );
    const rehydrateView = views.find(v => v.skill === 'rehydrate');
    assert.ok(rehydrateView, 'rehydrate runtime view should exist');
    assert.ok(
      rehydrateView.packagedEntries.includes('rehydrate/references/hft-format.md'),
      'rehydrate should package references/hft-format.md (duplicated for standalone-installable self-containment)',
    );
  });

  it('artifact self-containment passes with no runtime boundary leaks', () => {
    const result = runArtifactSelfContainmentCheck();
    assert.deepEqual(result.fail, []);
  });
});

// ============================================================
// artifact-self-containment detector liveness
// ============================================================

describe('artifact-self-containment detector liveness', () => {
  const REPO_ROOT = path.join(__dirname, '..');
  const TARGET_SKILL_MD = path.join(REPO_ROOT, 'aitesis', 'skills', 'inquire', 'SKILL.md');
  const INJECTION = '\n\nContributor reference: .claude/rules/axioms.md (A1)\n';

  it('fires when a known banned pattern is injected into a Skill.md', () => {
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
// generateReleaseNotes
// ============================================================

describe('generateReleaseNotes', () => {
  const mockResults = [
    { plugin: 'aitesis', skill: 'inquire', version: '1.17.2', zip: 'inquire.zip', files: 1, bytes: 100 },
    { plugin: 'horismos', skill: 'bound', version: '1.8.1', zip: 'bound.zip', files: 1, bytes: 100 },
    { plugin: 'prothesis', skill: 'frame', version: '5.8.1', zip: 'frame.zip', files: 1, bytes: 100 },
    { plugin: 'bundle', skill: 'epistemic-protocols-bundle', zip: 'epistemic-protocols-bundle.zip', files: 19, bytes: 5000 },
  ];

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

  it('includes all 11 protocols in protocols table', () => {
    const notes = generateReleaseNotes(mockResults);
    const protocolNames = [
      'Anamnesis', 'Horismos', 'Aitesis', 'Prothesis',
      'Analogia', 'Periagoge', 'Euporia', 'Syneidesis', 'Prosoche', 'Epharmoge', 'Katalepsis',
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
    assert.ok(!notes.includes('### 11 Epistemic Protocols'));
  });

  it('falls back to curated highlights when changelog groups empty', () => {
    const changelog = { groups: {}, ungrouped: [] };
    const notes = generateReleaseNotes(mockResults, { changelog });
    assert.ok(notes.includes('### 11 Epistemic Protocols'));
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
  it('packages all 27 skills plus bundle in dry-run', () => {
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
    assert.equal(result.results.length, 29);
    assert.deepEqual(
      result.results.map(entry => entry.zip).sort(),
      [
        'attend.zip',
        'bound.zip',
        'catalog.zip',
        'comment-review.zip',
        'compose.zip',
        'contextualize.zip',
        'crystallize.zip',
        'curses.zip',
        'dashboard.zip',
        'elicit.zip',
        'epistemic-protocols-bundle.zip',
        'frame.zip',
        'gap.zip',
        'goal-research.zip',
        'grasp.zip',
        'ground.zip',
        'induce.zip',
        'inquire.zip',
        'introspect.zip',
        'misuse.zip',
        'onboard.zip',
        'probe.zip',
        'recollect.zip',
        'rehydrate.zip',
        'report.zip',
        'review-ensemble.zip',
        'sophia.zip',
        'steer.zip',
        'write.zip',
      ].sort(),
    );
    // Lower-bound invariant: baseline reflects the current plugin set at
    // merge time. Any additive change (new plugin, new reference doc, new
    // agent) only increases this count. A shrink indicates an unintended
    // regression (plugin removed or files accidentally excluded from the
    // packager), which should fail. Baseline reset to 33 after PR #259
    // (reflexion plugin removed + write relocated to epistemic-cooperative)
    // — that shrink was intentional and the guard updated accordingly.
    assert.ok(
      bundle.files >= 34,
      `expected bundle.files >= 34 (regression guard), got ${bundle.files}`
    );
  });
});

