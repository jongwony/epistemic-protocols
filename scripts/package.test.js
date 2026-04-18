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
    assert.equal(views.length, 20);
    for (const view of views) {
      assert.equal(view.skillEntryCount, 1, `${view.plugin}:${view.skill} should have one Skill.md entry`);
      assert.ok(view.transformedSkillMd, `${view.plugin}:${view.skill} should expose transformed Skill.md`);
      assert.ok(view.packagedEntries.includes(`${view.skill}/Skill.md`), `${view.plugin}:${view.skill} should package Skill.md`);
      assert.ok(typeof view.pluginDescription === 'string');
    }
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
  const TARGET_SKILL_MD = path.join(REPO_ROOT, 'hermeneia', 'skills', 'clarify', 'SKILL.md');
  const INJECTION = '\n\nContributor reference: .claude/rules/axioms.md (A1)\n';

  it('fires when a known banned pattern is injected into a Skill.md', () => {
    const backup = fs.readFileSync(TARGET_SKILL_MD, 'utf8');
    try {
      fs.writeFileSync(TARGET_SKILL_MD, backup + INJECTION);

      const result = runArtifactSelfContainmentCheck();

      const hermeneiaFails = result.fail.filter(
        f => f.file && f.file.startsWith('hermeneia:clarify')
      );
      assert.ok(
        hermeneiaFails.length >= 1,
        `expected ≥1 fail for hermeneia:clarify after injecting banned patterns, ` +
        `got ${hermeneiaFails.length}. If 0: detector is silently no-op (liveness failure). ` +
        `Fails: ${JSON.stringify(result.fail)}`
      );

      const hasClaudePath = hermeneiaFails.some(f => /\.claude/.test(f.message));
      assert.ok(hasClaudePath, '.claude/ banned pattern should fire on injected content');

      const hasAxiomsMd = hermeneiaFails.some(f => /axioms?\.md/.test(f.message));
      assert.ok(hasAxiomsMd, 'axioms.md banned pattern should fire on injected content');
    } finally {
      try {
        fs.writeFileSync(TARGET_SKILL_MD, backup);
      } catch (restoreErr) {
        process.stderr.write(
          '\n\n!!! LIVENESS TEST FAILED TO RESTORE hermeneia SKILL.md !!!\n' +
          'Manual recovery required: git checkout hermeneia/skills/clarify/SKILL.md\n' +
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
    { plugin: 'hermeneia', skill: 'clarify', version: '1.17.2', zip: 'clarify.zip', files: 1, bytes: 100 },
    { plugin: 'telos', skill: 'goal', version: '1.8.1', zip: 'goal.zip', files: 1, bytes: 100 },
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
    assert.ok(notes.includes('IntentMisarticulated → ClarifiedIntent'));
    assert.ok(notes.includes('GoalIndeterminate → DefinedEndState'));
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
    assert.ok(notes.includes('| hermeneia | 1.17.2 | clarify.zip |'));
    assert.ok(notes.includes('Bundle: `epistemic-protocols-bundle.zip`'));
  });

  it('follows CANONICAL_PRECEDENCE order in protocols table', () => {
    const notes = generateReleaseNotes(mockResults);
    const hermeneiaPos = notes.indexOf('Hermeneia');
    const telosPos = notes.indexOf('Telos');
    const prothesisPos = notes.indexOf('Prothesis');
    const katalepsisPos = notes.indexOf('Katalepsis');
    assert.ok(hermeneiaPos < telosPos, 'Hermeneia should precede Telos');
    assert.ok(telosPos < prothesisPos, 'Telos should precede Prothesis');
    assert.ok(prothesisPos < katalepsisPos, 'Katalepsis should be last');
  });

  it('includes all 11 protocols in protocols table', () => {
    const notes = generateReleaseNotes(mockResults);
    const protocolNames = [
      'Anamnesis', 'Hermeneia', 'Telos', 'Horismos', 'Aitesis', 'Prothesis',
      'Analogia', 'Syneidesis', 'Prosoche', 'Epharmoge', 'Katalepsis',
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
  it('packages all 20 skills plus bundle in dry-run', () => {
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
    assert.equal(result.results.length, 21);
    assert.deepEqual(
      result.results.map(entry => entry.zip).sort(),
      [
        'attend.zip',
        'bound.zip',
        'catalog.zip',
        'clarify.zip',
        'compose.zip',
        'contextualize.zip',
        'curses.zip',
        'dashboard.zip',
        'epistemic-protocols-bundle.zip',
        'frame.zip',
        'gap.zip',
        'goal.zip',
        'grasp.zip',
        'ground.zip',
        'inquire.zip',
        'introspect.zip',
        'onboard.zip',
        'recollect.zip',
        'report.zip',
        'sophia.zip',
        'write.zip',
      ],
    );
    // Lower-bound invariant: baseline reflects the current plugin set at
    // merge time. Any additive change (new plugin, new reference doc, new
    // agent) only increases this count. A shrink indicates an unintended
    // regression (plugin removed or files accidentally excluded from the
    // packager), which should fail. Baseline reset to 33 after PR #259
    // (reflexion plugin removed + write relocated to epistemic-cooperative)
    // — that shrink was intentional and the guard updated accordingly.
    assert.ok(
      bundle.files >= 33,
      `expected bundle.files >= 33 (regression guard), got ${bundle.files}`
    );
  });
});

// ============================================================
// cross-ref-scan detector liveness (Task #22 → automated)
// ============================================================
//
// This block MUST stay in package.test.js (not a separate file). Node's test
// runner parallelizes across files via child processes but runs top-level
// tests within a single file sequentially. The liveness test mutates
// scripts/package.js via fs.writeFileSync, and the CLI describe above spawns
// a subprocess that reads the same file. Placing the two describes in
// SEPARATE files would cause a cross-file race (confirmed during Stage 2
// development: liveness.test.js + package.test.js run concurrently → CLI
// subprocess sees mutated 20-entry PLUGINS → result.results.length !== 21).
// Keeping both in this single file guarantees sequential execution of
// top-level describes, eliminating the race by construction.
//
// This is the automated form of the Task #22 manual liveness pattern used
// during PR #242 review. It proves the detector is ALIVE — i.e., it
// distinguishes "detector ran and found nothing" (correct, warnings empty)
// from "detector crashed silently" (regression, warnings empty). By
// injecting a known publication gap and asserting the warning fires, the
// test would catch the pre-PR-#242 silent-failure bug class if it ever
// returned. Stage 2 additionally escalates detector-infrastructure failures
// to fail+subCheckFailed in static-checks.js Source 3; this test covers the
// warn-level migration-signal path.
//
// Recovery: if this test is interrupted (Ctrl+C) mid-execution, the working
// tree may contain the injected mutation. Restore via `git checkout
// scripts/package.js`. A test process that completes normally always
// restores the file via the finally block.

describe('cross-ref-scan detector liveness', () => {
  // Regex matches the catalog PLUGINS tuple with tolerance for whitespace,
  // quote-style, and trailing-comma variations. `m` flag lets `^`/`$` match
  // line boundaries; capture group 1 preserves leading indent so the
  // comment-out replacement stays visually aligned with surrounding entries.
  // If package.js switches to double quotes, adds internal spaces, or drops
  // the trailing comma, this match still succeeds — replacing the earlier
  // exact-string match, which was flagged in review for fragility under
  // non-semantic reformatting.
  const LIVENESS_TUPLE_RE =
    /^([ \t]*)(\{\s*dir:\s*['"]epistemic-cooperative['"],\s*skill:\s*['"]catalog['"]\s*\},?)\s*$/m;
  const PACKAGE_JS_PATH = path.join(__dirname, 'package.js');
  const REPO_ROOT = path.join(__dirname, '..');
  const STATIC_CHECKS = path.join(
    REPO_ROOT,
    '.claude',
    'skills',
    'verify',
    'scripts',
    'static-checks.js'
  );

  it('fires publication-gap warning when catalog entry is removed', () => {
    const backup = fs.readFileSync(PACKAGE_JS_PATH, 'utf8');

    // Precondition: ensure we know where to inject the mutation.
    const match = backup.match(LIVENESS_TUPLE_RE);
    assert.ok(
      match,
      'precondition failed: could not find epistemic-cooperative/catalog PLUGINS tuple in scripts/package.js — ' +
      'update LIVENESS_TUPLE_RE in package.test.js to match the current formatting'
    );

    try {
      // Inject: comment out the reflexion entry (preserve leading indent)
      const [fullMatch, indent, tuple] = match;
      const mutated = backup.replace(
        fullMatch,
        `${indent}// ${tuple} // liveness test — injected`
      );
      assert.notEqual(mutated, backup, 'mutation replacement did not change the file content');
      fs.writeFileSync(PACKAGE_JS_PATH, mutated);

      // Run the verifier as a subprocess (child-process isolation from our
      // own require cache). The static-checks.js internally deletes its
      // require cache entry before re-loading package.js, so it sees our
      // mutation.
      //
      // execFileSync throws on non-zero exit, placing stdout in err.stdout.
      // We treat any parseable result as authoritative — even if an
      // unrelated check fails and makes static-checks.js exit 1, we still
      // want to assert against the JSON output. Only truly unparseable
      // output (runtime crash in static-checks.js, empty stdout) fails the
      // liveness test at the execFileSync boundary with a diagnostic error.
      let output;
      try {
        output = execFileSync(
          process.execPath,
          [STATIC_CHECKS, REPO_ROOT],
          { encoding: 'utf8' }
        );
      } catch (execErr) {
        if (execErr && typeof execErr.stdout === 'string' && execErr.stdout.length > 0) {
          output = execErr.stdout;
        } else {
          throw new Error(
            'liveness test: static-checks.js failed without parseable output. ' +
            `exit=${execErr && execErr.status}, ` +
            `stdout=${JSON.stringify(execErr && execErr.stdout)}, ` +
            `stderr=${JSON.stringify(execErr && execErr.stderr)}`
          );
        }
      }
      const result = JSON.parse(output);

      // Expectation: exactly one publication-gap warning for epistemic-cooperative/catalog.
      const gaps = (result.warn || []).filter(
        w =>
          typeof w.message === 'string' &&
          w.message.includes('publication-gap: epistemic-cooperative/catalog')
      );
      assert.equal(
        gaps.length,
        1,
        `expected exactly 1 publication-gap warning for epistemic-cooperative/catalog, got ${gaps.length}. ` +
        'If 0: the detector is silently no-op (regression of PR #242 bug class). ' +
        'If >1: unexpected duplicate detection — investigate cross-ref-scan loop logic.'
      );

      // Narrow to cross-ref-scan only: the liveness test asserts that
      // Source 3's warn-level migration signal (publication-gap) fires
      // WITHOUT escalating to fail. Other checks (notation, gate-type-
      // soundness, spec-vs-impl, etc.) may independently fail for unrelated
      // reasons — those are out of scope for this test and should not
      // break the liveness signal. Filtering to `check === 'cross-ref-scan'`
      // keeps the assertion semantically scoped to what the test is about.
      const crossRefFails = (result.fail || []).filter(
        f => f && f.check === 'cross-ref-scan'
      );
      assert.equal(
        crossRefFails.length,
        0,
        `expected 0 cross-ref-scan fails during liveness test, got ${crossRefFails.length}: ` +
        JSON.stringify(crossRefFails)
      );
    } finally {
      // Always restore, even if assertions above throw. If the restore
      // itself fails (disk full, permission revoked, EIO), emit a LOUD
      // stderr recovery message before re-throwing. Without this, the
      // original assertion error would be clobbered AND the working tree
      // would be left in the mutated 18-entry state — a double loss.
      // CI is safe (ephemeral working tree); this protects local dev runs.
      try {
        fs.writeFileSync(PACKAGE_JS_PATH, backup);
      } catch (restoreErr) {
        process.stderr.write(
          '\n\n!!! LIVENESS TEST FAILED TO RESTORE scripts/package.js !!!\n' +
          'Manual recovery required: git checkout scripts/package.js\n' +
          `Original restore error: ${restoreErr && restoreErr.message}\n\n`
        );
        throw restoreErr;
      }
    }
  });
});
