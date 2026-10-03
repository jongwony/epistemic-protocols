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
const os = require('node:os');
const path = require('node:path');
const zlib = require('zlib');
const { CANONICAL_PRECEDENCE, CANONICAL_PROTOCOL_SET } = require('./load-protocols');
// Full protocol registry, derived — display-first Anamnesis + canonical precedence chain +
// structurally-last Katalepsis (same construction as load-protocols protocolOrder()).
const ALL_PROTOCOLS = ['Anamnesis', ...CANONICAL_PRECEDENCE, 'Katalepsis'];
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
  DESCRIPTION_LIMIT,
  DESCRIPTION_OVERRIDES,
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
const { runLanguagePurityCheck } = require('../.claude/skills/verify/scripts/language-purity');
const { discoverPlugins } = require('./load-protocols');

function writeFixtureFile(root, relativePath, content = 'fixture\n') {
  const target = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

// The pre-commit hook runs this suite with GIT_DIR, GIT_INDEX_FILE and the rest
// of git's environment exported. Inherited by a subprocess, those override cwd
// and silently redirect a fixture's git calls at the real repository — where
// `git init` rewrites the shared config rather than building a fixture. Strip
// the whole namespace so a temp-dir fixture is determined by its cwd alone.
function envWithoutGitVars() {
  const env = { ...process.env };
  for (const key of Object.keys(env)) {
    if (key.startsWith('GIT_')) delete env[key];
  }
  return env;
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
    const content = '---\nname: review-loop\nskills:\n  - aitesis:inquire\n  - epharmoge:contextualize\n---\nBody';
    const { fields } = parseFrontmatter(content);
    assert.deepEqual(fields.get('skills'), ['aitesis:inquire', 'epharmoge:contextualize']);
    assert.equal(fields.get('name'), 'review-loop');
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
    const content = '---\nname: rt\nskills:\n  - aitesis:inquire\n  - elenchus:sublate\n---\nBody';
    const { fields, body } = parseFrontmatter(content);
    const rebuilt = serializeFrontmatter(fields) + '\n' + body;
    const reparsed = parseFrontmatter(rebuilt);
    assert.deepEqual(reparsed.fields.get('skills'), ['aitesis:inquire', 'elenchus:sublate']);
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
    // Installs its own fixture entry rather than naming a live skill: the table is
    // empty whenever every source description fits the limit, and this test is about
    // the override path, not about which skills happen to need one.
    const longDesc = 'A'.repeat(201);
    DESCRIPTION_OVERRIDES['__fixture-skill'] = 'Short override';
    try {
      const content = `---\nname: __fixture-skill\ndescription: ${longDesc}\n---\nBody`;
      const result = transformSkillMd(content, '__fixture-skill');
      const { fields } = parseFrontmatter(result);
      assert.equal(fields.get('description'), 'Short override');
    } finally {
      delete DESCRIPTION_OVERRIDES['__fixture-skill'];
    }
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
    assert.equal(views.length, PLUGINS.length);
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

  // This block previously REQUIRED `--config mcp_servers.tavily.tool_timeout_sec=3600`.
  // That override cannot work: a dotted override under `mcp_servers` replaces the
  // server's whole table instead of merging, dropping the transport field, and codex
  // then refuses to load config at all ("invalid transport"). Reproduced on
  // codex-cli 0.149.0 for every server and every key, including keys the config file
  // already sets. The assertions below pin the repair so the line cannot come back.

  it('carries no dotted mcp_servers config override, which would break codex config load', () => {
    const skill = fs.readFileSync(skillPath, 'utf8');
    // Scope to the launch command itself. The prose deliberately SHOWS the broken form
    // while telling you not to use it, so a whole-file match would flag the warning that
    // exists to prevent the thing being warned about.
    const launchBlocks = (skill.match(/```bash\n([\s\S]*?)```/g) ?? []).filter((b) =>
      b.includes('codex exec'),
    );
    assert.ok(launchBlocks.length > 0, 'the codex exec launch command must be present');
    for (const block of launchBlocks) {
      assert.ok(
        !/--config\s+mcp_servers\./.test(block),
        'a dotted --config mcp_servers.<name>.<key>= override makes codex exit 1 at config load',
      );
    }
    assert.match(
      skill,
      /invalid transport/i,
      'the skill must say why the override is absent, or a future author re-adds it',
    );
  });

  it('documents the Codex session envelope', () => {
    const skill = fs.readFileSync(skillPath, 'utf8');
    const bashMs = Number(skill.match(/Bash\(run_in_background: true, timeout: (\d+)\)/)?.[1]);
    assert.ok(Number.isFinite(bashMs), 'Bash session timeout must be documented');
  });

  it('filters non-JSON stdout lines before jq, and never claims the events file is pure JSONL', () => {
    const skill = fs.readFileSync(skillPath, 'utf8');
    // codex prints plain notice lines to stdout alongside the JSONL; `jq -rs` aborts on
    // the first one and returns empty, which the skill reads as "codex failed before
    // answering" — turning a successful run into a reported crash.
    const jqLines = skill.match(/^.*jq -rs.*$/gm) ?? [];
    assert.ok(jqLines.length > 0, 'the extraction command must be present');
    for (const line of jqLines) {
      assert.ok(
        /grep '\^\{'/.test(line) || /grep '\^\{'/.test(skill.slice(0, skill.indexOf(line))),
        `jq must be fed only JSON lines: ${line.trim()}`,
      );
    }
    assert.ok(
      !/events file is pure JSONL/i.test(skill),
      'stdout is not pure JSONL — the skill must not assert that it is',
    );
  });

  it('requires a zero-search check before any result is presented as research', () => {
    const skill = fs.readFileSync(skillPath, 'utf8');
    // A codex run can complete and answer fluently from recalled knowledge when the
    // MCP is unavailable; nothing in the narrative distinguishes that from a searched
    // answer, so the count is the only signal.
    // Only a completed, error-free Tavily call counts: a call that started and failed
    // retrieved nothing. The executable fixtures below exercise the count itself.
    assert.match(skill, /\.item\.status=="completed" and \.item\.error==null/, 'the count must keep only completed, error-free calls');
    assert.match(skill, /test\("tavily"; "i"\)/, 'the count must keep only Tavily calls');
    assert.match(
      skill,
      /no successful Tavily call/i,
      'Phase 3 must say what to do when the count is zero',
    );
    // The check reads only the Tavily route, so a zero count says nothing came through
    // that route — not that every claim was recalled, since a page fetched another way is
    // outside the record.
    assert.match(skill, /nothing in the trace was retrieved through the designated route/i);
    assert.ok(!/recalled-from-training/i.test(skill), 'a zero count does not establish that claims were recalled');
    // The marking is a statement in the Source Check covering the trace, never an edit of
    // the trace, which is forwarded verbatim.
    assert.ok(!/mark every claim in it/i.test(skill), 'the zero-call branch must not rewrite the trace');
    assert.match(skill, /statement covering the whole trace below it/i);
  });

  it('designates the runner from the request, claude when none is designated', () => {
    const skill = fs.readFileSync(skillPath, 'utf8');
    assert.match(skill, /runner\s*:\s*claude \| codex/, 'the caller signature must name both runners');
    assert.match(skill, /claude when none is designated/i, 'the default runner must be stated');
    assert.match(skill, /request's words as well as its arguments/i, 'designations are read from words, not only arguments');
    // The research question is carried verbatim, so a designation is never cut out of it,
    // and a leading word that could open the question is asked about, not guessed.
    assert.match(skill, /only when it stands as a separate leading argument and what follows reads as the whole question/i);
    assert.match(skill, /could instead open the question[^\n]*Claude Shannon[^\n]*ask once/i, 'ambiguous leading words are asked about');
    assert.match(skill, /Nothing is removed from inside the question/i);
    const phase1 = skill.slice(skill.indexOf('## Phase 1'), skill.indexOf('## Phase 2'));
    assert.match(phase1, /read as the Caller Signature says/, 'Phase 1 defers to the one designation rule');
    // Separate command calls share no shell state, and the claude runner's precondition is
    // checked before launch.
    assert.match(skill, /substitute the generated value literally for `\$\{SUFFIX\}` in every later block/);
    assert.match(skill, /Before launch, confirm that Tavily search and Tavily extract are available to the subagent/);
    assert.match(skill, /### Runner: claude/, 'the claude route must be specified');
    assert.match(skill, /### Runner: codex/, 'the codex route must be specified');
  });

  // The report form lives in the brief both runners receive. Asserting inside that block
  // keeps a copy elsewhere in the prose from satisfying the test while the runner never
  // sees it.
  const readBrief = () => {
    const skill = fs.readFileSync(skillPath, 'utf8');
    // Line-anchored fences: an unanchored match can start at a closing fence and pair it
    // with the next block's opening one.
    const brief = [...skill.matchAll(/^```[^\n]*\n([\s\S]*?)^```/gm)].map((m) => m[1]).find((b) => b.includes('Research target:'));
    assert.ok(brief, 'the research brief must be present');
    return brief;
  };

  it('refines /inquire\'s reading for research instead of running a second one', () => {
    const brief = readBrief();
    // /inquire carries the contract: its reading of each uncertainty, its reach record, and
    // what stays open. The strength scale subdivides "filled by an external citation"; it is
    // not a parallel scale, so a detail from recall is the runner's own inference and open.
    assert.match(brief, /add no second reading/i, 'the brief must state the refinement relation');
    for (const label of ['verified', 'mostly']) {
      assert.match(brief, new RegExp(`- ${label}:`), `the brief must define the ${label} strength`);
    }
    assert.match(brief, /filled by an external citation/i, 'verified and mostly subdivide a citation-filled uncertainty');
    assert.match(brief, /snippet/i, 'a search-result snippet must cap a claim below verified');
    assert.match(brief, /not a citation[\s\S]*reconstructed, as your own inference[\s\S]*open/i,
      'a detail from recall is the runner\'s own inference and leaves its item open');
    assert.match(brief, /weakest link/i, 'the weakest link must be named');
    assert.match(brief, /absence or novelty claim[\s\S]*reach record/i,
      'absence claims are scoped by /inquire\'s own reach record, not a second one');
    assert.match(brief, /replication status[\s\S]*retraction/i, 'empirical effects carry replication and retraction status');
    assert.match(brief, /design warning, not a quantitative law/i);
  });

  it('returns what only the person can settle as open, and presents it to the user as theirs', () => {
    const brief = readBrief();
    // A background run has no person. Without this the runner fills a held value itself and
    // the report presents the runner's choice as settled.
    assert.match(brief, /No person answers in this session/i);
    assert.match(brief, /neither answered nor settled here/i, 'the person\'s items return open');
    assert.match(brief, /Fill no held value yourself/i);
    const skill = fs.readFileSync(skillPath, 'utf8');
    const phase4 = skill.slice(skill.indexOf('## Phase 4'), skill.indexOf('## Rules'));
    assert.match(phase4, /--- Yours to Settle ---/, 'the output must carry the user\'s items in their own block');
    // The check result comes first, so a zero-call or unreadable statement is read before
    // anything that rests on the trace.
    const order = ['--- Source Check ---', '--- Yours to Settle ---', '--- Trace ---'].map((h) => phase4.indexOf(h));
    assert.ok(order.every((i, k) => i > 0 && (k === 0 || i > order[k - 1])), 'Source Check, then Yours to Settle, then Trace');
    assert.match(phase4, /Present the check results first/);
    assert.match(phase4, /the report cites no URL; no claim carries a checkable citation/);
    assert.match(phase4, /successful Tavily calls returned a response this check cannot read; URLs they returned cannot be confirmed/);
    assert.match(phase4, /neither the runner nor the main session answers or settles them/i);
  });

  it('states that an unreadable tool record leaves the source check unrun, not passed', () => {
    const skill = fs.readFileSync(skillPath, 'utf8');
    // A subagent's own account of what it opened is part of the report under check. If
    // the skill let that account stand in for the record, a fabricated citation would be
    // presented as checked.
    assert.match(skill, /no readable record exists, the checks[^\n]*have not run/i, 'Phase 3 must say the checks did not run');
    assert.match(skill, /does not substitute for the record/i);
    assert.match(skill, /not run: the runner's tool record is not readable/i, 'the output must carry the unrun state');
  });

  const hasJq = (() => {
    try {
      execFileSync('jq', ['--version'], { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  })();

  // Bash blocks of a surface, fence lines anchored (indented blocks included).
  const bashBlocks = (doc) => [...doc.matchAll(/^[ \t]*```bash\n([\s\S]*?)^[ \t]*```/gm)].map((m) => m[1]);
  const pick = (doc, ...marks) => {
    const block = bashBlocks(doc).find((b) => marks.every((m) => b.includes(m)));
    assert.ok(block, `a bash block containing ${marks.join(' + ')} must be present`);
    return block;
  };
  const tmpFile = (kind, suffix, ext) => `/tmp/goal_research_${kind}_${suffix}.${ext}`;
  const parseChecks = (out) => {
    const count = Number(out.match(/^successful Tavily calls: (\d+)$/m)?.[1]);
    const unreadable = Number(out.match(/with a response this check cannot read: (\d+)$/m)?.[1]);
    const cited = Number(out.match(/^cited URLs: (\d+)$/m)?.[1]);
    const [, after] = out.split('--- cited, not opened in this run ---');
    const [notOpened, extracted] = (after ?? '').split('--- extracted ---');
    const urlsOf = (t) => (t ?? '').split('\n').map((l) => l.trim()).filter((l) => /^https?:/.test(l));
    // Order is the shell's collation; the sets are what the checks assert.
    return { count, unreadable, cited, notOpened: urlsOf(notOpened).sort(), extracted: urlsOf(extracted).sort() };
  };

  // Runs the SKILL's own codex blocks — narrative extraction, record reduction, checks,
  // cleanup — over a codex event stream, so the test exercises the text a runner follows.
  const runCodexChecks = (events) => {
    const skill = fs.readFileSync(skillPath, 'utf8');
    const script = [
      pick(skill, 'goal_research_report_', 'agent_message'),
      pick(skill, 'goal_research_calls_', 'mcp_tool_call'),
      pick(skill, 'comm -23'),
      pick(skill, 'rm -f'),
    ].join('\n');
    const suffix = crypto.randomBytes(4).toString('hex');
    const kinds = [['events', 'jsonl'], ['json', 'jsonl'], ['report', 'txt'], ['calls', 'jsonl']];
    fs.writeFileSync(tmpFile('events', suffix, 'jsonl'),
      events.map((e) => (typeof e === 'string' ? e : JSON.stringify(e))).join('\n') + '\n');
    try {
      const out = execFileSync('bash', ['-c', script], { env: { ...process.env, SUFFIX: suffix }, encoding: 'utf8' });
      for (const [kind, ext] of kinds) {
        assert.ok(!fs.existsSync(tmpFile(kind, suffix, ext)), `cleanup must remove the ${kind} file`);
      }
      return parseChecks(out);
    } finally {
      for (const [kind, ext] of kinds) fs.rmSync(tmpFile(kind, suffix, ext), { force: true });
    }
  };

  // Event shapes as codex-cli 0.160.0 emits them for Tavily MCP calls: the Tavily response
  // arrives as structured_content and/or as JSON text inside content[].text.
  const asText = (obj) => ({ content: [{ type: 'text', text: JSON.stringify(obj) }] });
  const asStructured = (obj) => ({ content: [{ type: 'text', text: 'formatted, not JSON' }], structured_content: obj });
  const tavily = (id, tool, args, result, extra = {}) => ({
    type: 'item.completed',
    item: { id, type: 'mcp_tool_call', server: 'tavily', tool, arguments: args, result, error: null, status: 'completed', ...extra },
  });
  const message = (id, text) => ({ type: 'item.completed', item: { id, type: 'agent_message', text } });

  it('counts a URL as opened only when a successful Tavily result returned it', { skip: !hasJq && 'jq not installed' }, () => {
    const paper = 'https://aclanthology.org/2024.tacl-1.9';
    const events = [
      'Codex autostart is disabled.',
      { type: 'thread.started', thread_id: 't' },
      // (a) a query naming a fabricated URL that returns nothing
      tavily('item_1', 'tavily_search', { query: 'see https://fabricated.example/paper' },
        asText({ query: 'see https://fabricated.example/paper', results: [] })),
      tavily('item_2', 'tavily_search', { query: 'lost in the middle' },
        asStructured({ results: [{ url: paper, content: 'snippet' }, { url: 'https://example.org/snippet-only?a=1&b=2', content: 'snippet' }] })),
      // (b) an extract whose outer call succeeded but whose URL failed
      tavily('item_3', 'tavily_extract', { urls: [paper, 'https://failed.example/x'] },
        asText({ results: [{ url: paper, raw_content: 'page linking https://linked.example/inside' }],
          failed_results: [{ url: 'https://failed.example/x', error: 'Failed to retrieve content' }] })),
      // (c) an extract call that failed outright
      { type: 'item.started', item: { id: 'item_4', type: 'mcp_tool_call', server: 'tavily', tool: 'tavily_extract',
        arguments: { urls: ['https://failedcall.example/y'] }, result: null, error: null, status: 'in_progress' } },
      { type: 'item.completed', item: { id: 'item_4', type: 'mcp_tool_call', server: 'tavily', tool: 'tavily_extract',
        arguments: { urls: ['https://failedcall.example/y'] }, result: null, error: { message: 'timeout' }, status: 'failed' } },
      // a page fetched outside the Tavily route
      { type: 'item.completed', item: { id: 'item_5', type: 'command_execution', command: 'curl https://curl.example/z',
        aggregated_output: 'https://curl.example/z', exit_code: 0, status: 'completed' } },
      message('item_6', 'progress https://example.org/early-draft'),
      message('item_7', [
        `Claim A ([paper](${paper}/#abstract)), verified.`,
        `Again _HTTPS://ACLANTHOLOGY.ORG/2024.tacl-1.9_ and '${paper}'.`,
        // cited only in upper case, with no lower-case twin anywhere in the report
        'Claim H: HTTPS://UPPER.EXAMPLE/Only',
        'Claim B: https://example.org/snippet-only?a=1&b=2.',
        'Claim C: https://fabricated.example/paper',
        'Claim D, verified: https://failed.example/x',
        'Claim E: https://failedcall.example/y',
        'Claim F: https://linked.example/inside',
        'Claim G: https://curl.example/z',
      ].join('\n')),
    ];
    const r = runCodexChecks(events);
    assert.equal(r.count, 3, 'three Tavily calls completed without error; the failed extract does not count');
    assert.equal(r.unreadable, 0);
    assert.deepEqual(r.notOpened, [
      'https://curl.example/z',
      'https://fabricated.example/paper',
      'https://failed.example/x',
      'https://failedcall.example/y',
      'https://linked.example/inside',
      'https://upper.example/Only',
    ], 'arguments, failed_results, failed calls, page-internal links and non-Tavily fetches are not evidence; '
      + 'case, fragment, trailing slash and punctuation do not cause a miss');
    assert.deepEqual(r.extracted, [paper], 'only an extract result entry counts as extracted, never failed_results');
  });

  it('takes the zero-call path when the only Tavily call started and failed', { skip: !hasJq && 'jq not installed' }, () => {
    const r = runCodexChecks([
      { type: 'item.started', item: { id: 'item_1', type: 'mcp_tool_call', server: 'tavily', tool: 'tavily_search',
        arguments: { query: 'q' }, result: null, error: null, status: 'in_progress' } },
      { type: 'item.completed', item: { id: 'item_1', type: 'mcp_tool_call', server: 'tavily', tool: 'tavily_search',
        arguments: { query: 'q' }, result: null, error: { message: 'unauthorized' }, status: 'failed' } },
      // a successful call to some other MCP server is not a Tavily call
      { type: 'item.completed', item: { id: 'item_2', type: 'mcp_tool_call', server: 'github', tool: 'search_code',
        arguments: {}, result: asText({ results: [{ url: 'https://github.com/x' }] }), error: null, status: 'completed' } },
      message('item_3', 'From memory: https://example.org/recalled'),
    ]);
    assert.equal(r.count, 0, 'zero successful Tavily calls');
    assert.deepEqual(r.notOpened, ['https://example.org/recalled']);
  });

  it('reduces a Claude Code subagent transcript to the same calls under the same predicate', { skip: !hasJq && 'jq not installed' }, () => {
    const REPO_ROOT = path.join(__dirname, '..');
    const refPath = path.join(REPO_ROOT, 'epistemic-cooperative', 'skills', 'goal-research', 'references', 'host-claude-code.md');
    const skill = fs.readFileSync(skillPath, 'utf8');
    assert.ok(skill.includes('(references/host-claude-code.md)'), 'the claude branch must point at the host reference');
    const ref = fs.readFileSync(refPath, 'utf8');
    const paper = 'https://aclanthology.org/2024.tacl-1.9';
    const use = (id, name, input) => ({ type: 'assistant', message: { content: [{ type: 'tool_use', id, name, input }] } });
    const result = (id, obj, isError = null) => ({ type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: id,
      is_error: isError, content: typeof obj === 'string' ? obj : [{ type: 'text', text: JSON.stringify(obj) }] }] } });
    const transcript = [
      use('t1', 'mcp__tavily__tavily_search', { query: 'https://fabricated.example/paper' }),
      result('t1', { results: [] }),
      use('t2', 'mcp__tavily__tavily_search', { query: 'lost in the middle' }),
      result('t2', { results: [{ url: 'https://example.org/snippet-only' }] }),
      use('t3', 'mcp__tavily__tavily_extract', { urls: [paper, 'https://failed.example/x'] }),
      result('t3', { results: [{ url: paper, raw_content: 'page' }], failed_results: [{ url: 'https://failed.example/x', error: 'e' }] }),
      use('t4', 'mcp__tavily__tavily_extract', { urls: ['https://failedcall.example/y'] }),
      result('t4', 'Error: request failed', true),
      use('t5', 'mcp__tavily__tavily_extract', { urls: ['https://nevercompleted.example/w'] }),
      use('t6', 'WebFetch', { url: 'https://webfetch.example/v' }),
      result('t6', 'https://webfetch.example/v'),
    ];
    const suffix = crypto.randomBytes(4).toString('hex');
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'goal-research-claude-'));
    const files = [tmpFile('calls', suffix, 'jsonl'), tmpFile('report', suffix, 'txt')];
    try {
      const T = path.join(dir, 'agent-x.jsonl');
      fs.writeFileSync(T, transcript.map((e) => JSON.stringify(e)).join('\n') + '\n');
      fs.writeFileSync(tmpFile('report', suffix, 'txt'), [
        `Claim A: ${paper}`, 'Claim B: https://example.org/snippet-only', 'Claim C: https://fabricated.example/paper',
        'Claim D: https://failed.example/x', 'Claim E: https://failedcall.example/y',
        'Claim F: https://nevercompleted.example/w', 'Claim G: https://webfetch.example/v',
      ].join('\n'));
      const script = [pick(ref, 'tool_use', 'goal_research_calls_'), pick(skill, 'comm -23')].join('\n');
      const out = execFileSync('bash', ['-c', script], { env: { ...process.env, SUFFIX: suffix, T }, encoding: 'utf8' });
      const r = parseChecks(out);
      assert.equal(r.count, 3);
      assert.deepEqual(r.notOpened, [
        'https://fabricated.example/paper',
        'https://failed.example/x',
        'https://failedcall.example/y',
        'https://nevercompleted.example/w',
        'https://webfetch.example/v',
      ]);
      assert.deepEqual(r.extracted, [paper]);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
      for (const f of files) fs.rmSync(f, { force: true });
    }
  });

  // The official Tavily MCP server prints its response as formatted text, one `URL: ` line
  // per result; a remote server can return JSON instead. Both forms reach both reducers.
  const officialText = [
    'Request ID: r1',
    'Detailed Results:',
    '',
    'Title: Paper',
    'ID: s1',
    'URL: https://text.example/paper',
    'Content: snippet naming https://content.example/in-snippet',
    'Raw Content: body line',
    'URL: https://inner.example/x',
    'more body',
    '',
    'Images:',
    '',
    '[1] URL: https://img.example/1.png',
  ].join('\n');
  const officialExtract = ['Detailed Results:', '', 'Title: Paper', 'URL: https://text.example/paper', 'Raw Content: page'].join('\n');
  const unreadableText = 'Something went sideways but the call succeeded; it mentions https://odd.example/u';
  const textReport = [
    'A: https://text.example/paper',
    'B: https://content.example/in-snippet',
    'C: https://inner.example/x',
    'D: https://img.example/1.png',
    'E: https://odd.example/u',
  ].join('\n');
  const assertTextFormat = (r) => {
    assert.equal(r.count, 3);
    assert.equal(r.unreadable, 1, 'a successful call whose response is neither JSON nor result lines is counted, not passed over');
    assert.deepEqual(r.notOpened, [
      'https://content.example/in-snippet',
      'https://img.example/1.png',
      'https://odd.example/u',
    ], 'only `URL: ` result lines are sources — not snippet text, image lines, or an unreadable response');
    // The documented limit: a page-body line beginning `URL: ` reads as a result line.
    assert.ok(!r.notOpened.includes('https://inner.example/x'));
    assert.deepEqual(r.extracted, ['https://text.example/paper']);
  };

  it('reads source records from the Tavily MCP server\'s formatted text (codex)', { skip: !hasJq && 'jq not installed' }, () => {
    const text = (t) => ({ content: [{ type: 'text', text: t }] });
    assertTextFormat(runCodexChecks([
      tavily('item_1', 'tavily_search', { query: 'q' }, text(officialText)),
      tavily('item_2', 'tavily_extract', { urls: ['https://text.example/paper'] }, text(officialExtract)),
      tavily('item_3', 'tavily_search', { query: 'q2' }, text(unreadableText)),
      message('item_4', textReport),
    ]));
  });

  it('reads source records from the Tavily MCP server\'s formatted text (Claude Code)', { skip: !hasJq && 'jq not installed' }, () => {
    const REPO_ROOT = path.join(__dirname, '..');
    const ref = fs.readFileSync(path.join(REPO_ROOT, 'epistemic-cooperative', 'skills', 'goal-research', 'references', 'host-claude-code.md'), 'utf8');
    const skill = fs.readFileSync(skillPath, 'utf8');
    const use = (id, name) => ({ type: 'assistant', message: { content: [{ type: 'tool_use', id, name, input: {} }] } });
    const res = (id, t) => ({ type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: id, is_error: false,
      content: [{ type: 'text', text: t }] }] } });
    const transcript = [
      use('t1', 'mcp__tavily__tavily_search'), res('t1', officialText),
      use('t2', 'mcp__tavily__tavily_extract'), res('t2', officialExtract),
      use('t3', 'mcp__tavily__tavily_search'), res('t3', unreadableText),
    ];
    const suffix = crypto.randomBytes(4).toString('hex');
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'goal-research-claude-text-'));
    const files = [tmpFile('calls', suffix, 'jsonl'), tmpFile('report', suffix, 'txt')];
    try {
      const T = path.join(dir, 'agent-x.jsonl');
      fs.writeFileSync(T, transcript.map((e) => JSON.stringify(e)).join('\n') + '\n');
      fs.writeFileSync(tmpFile('report', suffix, 'txt'), textReport);
      const script = [pick(ref, 'tool_use', 'goal_research_calls_'), pick(skill, 'comm -23')].join('\n');
      assertTextFormat(parseChecks(execFileSync('bash', ['-c', script], { env: { ...process.env, SUFFIX: suffix, T }, encoding: 'utf8' })));
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
      for (const f of files) fs.rmSync(f, { force: true });
    }
  });

  it('reads every URL by one predicate: URI characters, balanced parentheses, prose punctuation off', { skip: !hasJq && 'jq not installed' }, () => {
    const r = runCodexChecks([
      tavily('item_1', 'tavily_search', { query: 'q' }, asText({ results: [
        { url: 'https://x.org/paper(A)' },
        { url: 'https://en.wikipedia.org/wiki/Foo_(album)' },
        { url: 'https://x.org/a' },
        { url: 'https://arxiv.org/abs/2307.03172' },
      ] })),
      message('item_2', [
        'HTTPS://FABRICATED.EXAMPLE/paper',
        'See https://x.org/paper(B).',
        'Wiki: https://en.wikipedia.org/wiki/Foo_(album)',
        'Link [t](https://x.org/a) and a cell |https://x.org/a| here',
        // a Korean particle running straight on from the URL, escaped to keep this file ASCII
        'https://arxiv.org/abs/2307.03172\uC5D0 \uB530\uB974\uBA74',
        '[https://x.org/a](https://x.org/a)',
        '(see https://x.org/a), **https://x.org/a**',
      ].join('\n')),
    ]);
    assert.equal(r.cited, 5, "distinct normalized URLs");
    assert.deepEqual(r.notOpened, ['https://fabricated.example/paper', 'https://x.org/paper(B)'],
      'an upper-case scheme is still a URL; a different parenthesized path is a different URL; '
      + 'balanced parentheses, markdown, table pipes and a Korean particle cause no false flag');
  });

  it('says the report cites no URL rather than passing clean', { skip: !hasJq && 'jq not installed' }, () => {
    const r = runCodexChecks([
      tavily('item_1', 'tavily_search', { query: 'q' }, asText({ results: [{ url: 'https://x.org/a' }] })),
      message('item_2', 'An answer that cites nothing.'),
    ]);
    assert.equal(r.count, 1);
    assert.equal(r.cited, 0);
    assert.deepEqual(r.notOpened, []);
  });
});

// ============================================================
// codex stdout extraction contract (review-loop)
// ============================================================

// codex prints plain notice lines to stdout alongside its `--json` event stream —
// `Codex autostart is disabled.` survives `2>/dev/null` on codex-cli 0.149.0 — so
// stdout is NOT pure JSONL. `jq -rs` aborts on the first such line with
// `parse error: Invalid numeric literal`, exits 5, and prints nothing. The surface
// below reads an empty extraction as "the call produced no verdict", so without the
// filter a SUCCESSFUL run is reported as a failure. The file also asserted the events
// file was pure JSONL, which is the claim that made the missing filter look
// deliberate. goal-research/SKILL.md carries the same repair, pinned by the block
// above; these assertions hold it here.

describe('codex stdout extraction contract', () => {
  const REPO_ROOT = path.join(__dirname, '..');
  const surfaces = [
    [
      'review-loop codex source adapter',
      path.join(
        REPO_ROOT,
        'epistemic-cooperative',
        'skills',
        'review-loop',
        'references',
        'source-adapter-codex.md',
      ),
    ],
  ];

  for (const [label, docPath] of surfaces) {
    it(`${label}: feeds jq only the JSON lines`, () => {
      const doc = fs.readFileSync(docPath, 'utf8');
      // Scope to the fenced command blocks. The prose deliberately NAMES `jq -rs` while
      // explaining why the filter is there, so a whole-file line match would flag the
      // warning that exists to keep the filter in place.
      const jqBlocks = (doc.match(/```bash\n([\s\S]*?)```/g) ?? []).filter((b) =>
        b.includes('jq -rs'),
      );
      assert.ok(jqBlocks.length > 0, 'the extraction command must be present');
      for (const block of jqBlocks) {
        assert.ok(
          /grep '\^\{'/.test(block),
          `jq must be fed only JSON lines, or one plain notice line empties the extraction:\n${block}`,
        );
      }
    });

    it(`${label}: states that stdout is not pure JSONL, and never claims it is`, () => {
      const doc = fs.readFileSync(docPath, 'utf8');
      const mentions = [...doc.matchAll(/pure JSONL/g)];
      assert.ok(
        mentions.length > 0,
        'the correction must stay on the surface — deleting it lets the claim back in unnoticed',
      );
      for (const m of mentions) {
        const preceding = doc.slice(Math.max(0, m.index - 60), m.index);
        assert.ok(
          /\bnot\b/.test(preceding),
          `every mention of pure JSONL must be a denial, not an assertion: ...${preceding.trim()} ${m[0]}`,
        );
      }
    });

    it(`${label}: records why the filter is there`, () => {
      const doc = fs.readFileSync(docPath, 'utf8');
      // Without its reason recorded beside it, a future author reads `grep '^{'` as
      // defensive noise on a stream and drops it, restoring the defect silently.
      assert.match(doc, /load-bearing/i, 'the filter must carry its reason');
    });
  }
});

// ============================================================
// artifact-self-containment detector liveness
// ============================================================

describe('artifact-self-containment detector liveness', () => {
  const REPO_ROOT = path.join(__dirname, '..');
  const TARGET_SKILL_MD = path.join(REPO_ROOT, 'aitesis', 'skills', 'inquire', 'SKILL.md');
  // The axiom identifier sits inside a fence on purpose: formal blocks are fenced yet
  // runtime-normative, so stripping them would hide the leak the last assertion checks.
  const INJECTION = '\n\nContributor reference: .claude/rules/axioms.md\n\n```\n-- relay basis per A1\n```\n';

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

      const hasAxiomId = aitesisFails.some(f => /axiom identifier/.test(f.message));
      assert.ok(hasAxiomId, 'axiom-identifier pattern should fire inside a fenced formal block');
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

describe('language-purity worktree prune', () => {
  // path -> still warned? Rejects a missing prune, a bare-name prune, and a
  // prune without the path-segment boundary; a dead detector fails all three.
  const CASES = {
    '.claude/worktrees/wt/x.md': false,
    'foo/worktrees/y.md': true,
    '.claude/worktrees-copy/w.md': true,
  };

  it('prunes .claude/worktrees/ by path, not by bare directory name', () => {
    const root = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'lp-prune-'));
    try {
      // Hangul by charCode so this file stays self-pure under the check it exercises.
      for (const rel of Object.keys(CASES)) writeFixtureFile(root, rel, String.fromCharCode(0xAC00));
      const warned = runLanguagePurityCheck({ projectRoot: root }).warn.map(w => w.file);
      for (const [rel, expected] of Object.entries(CASES)) {
        assert.equal(warned.includes(rel), expected, `${rel}: warned should be ${expected}. Got ${JSON.stringify(warned)}`);
      }
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});

// ============================================================
// enforcement-check detector liveness (checks 25/26/27/28)
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

function runStaticChecksSubprocess(projectRoot) {
  const REPO_ROOT = path.join(__dirname, '..');
  // Defaults to this repo; a caller may pass a throwaway fixture root instead.
  const targetRoot = projectRoot || REPO_ROOT;
  const scriptPath = path.join(
    REPO_ROOT, '.claude', 'skills', 'verify', 'scripts', 'static-checks.js'
  );
  try {
    const stdout = execFileSync(process.execPath, [scriptPath, targetRoot], {
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
      // static-checks.js shells out to git itself, so it needs the same
      // scrubbing: an inherited GIT_DIR would aim it at the real repository
      // no matter which root it was handed. A fixture root has no
      // origin/<base>, so a CI run's GITHUB_BASE_REF is withheld from it.
      env: projectRoot ? { ...envWithoutGitVars(), GITHUB_BASE_REF: '' } : envWithoutGitVars(),
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

// ============================================================
// version-staleness conflict guard (worktree git-dir resolution)
// ============================================================
// Unlike the liveness tests above, this builds a throwaway repository under
// the OS temp dir and mutates nothing live, so it carries no sequencing
// constraint. Both checkout shapes are asserted because they differ exactly
// where this guard once broke: `.git` is a directory in a primary checkout
// but a gitdir: pointer file in a worktree, and the conflict heads live in
// the per-worktree git dir rather than the shared one.

function gitFixture(cwd, args, { allowFailure = false } = {}) {
  try {
    return execFileSync('git', args, {
      cwd, encoding: 'utf8', stdio: 'pipe', env: envWithoutGitVars(),
    });
  } catch (err) {
    if (allowFailure) return err.stdout || '';
    throw err;
  }
}

// Builds: a primary checkout on `trunk`, two divergent branches editing the
// same line, and a worktree on one of them. Returns both checkout roots.
function makeConflictFixture() {
  const root = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'staleness-guard-'));
  const primary = path.join(root, 'primary');
  fs.mkdirSync(primary, { recursive: true });
  gitFixture(primary, ['init', '-q', '-b', 'trunk', '.']);
  gitFixture(primary, ['config', 'user.email', 'fixture@example.invalid']);
  gitFixture(primary, ['config', 'user.name', 'fixture']);
  writeFixtureFile(primary, '.claude-plugin/plugin.json', '{\n  "name": "fixture",\n  "version": "1.0.0"\n}\n');
  writeFixtureFile(primary, 'skills/x/SKILL.md', 'base\n');
  gitFixture(primary, ['add', '-A']);
  gitFixture(primary, ['commit', '-qm', 'base']);
  for (const [branch, body] of [['sideA', 'from A\n'], ['sideB', 'from B\n']]) {
    gitFixture(primary, ['checkout', '-q', 'trunk']);
    gitFixture(primary, ['checkout', '-q', '-b', branch]);
    writeFixtureFile(primary, 'skills/x/SKILL.md', body);
    gitFixture(primary, ['commit', '-qam', branch]);
  }
  gitFixture(primary, ['checkout', '-q', 'sideA']);
  const worktree = path.join(root, 'wt');
  gitFixture(primary, ['worktree', 'add', '-q', worktree, 'sideB']);
  // Assert the isolation rather than trusting it: an inherited GIT_* variable
  // would aim these calls at the real repository regardless of cwd, which is
  // how a fixture can rewrite the shared config instead of building its own.
  const realRoot = fs.realpathSync(root);
  for (const checkout of [primary, worktree]) {
    const resolved = gitFixture(checkout, ['rev-parse', '--absolute-git-dir']).trim();
    assert.ok(
      resolved.startsWith(realRoot),
      `fixture escaped its temp root: rev-parse in ${checkout} resolved to ${resolved}`
    );
  }
  return { root, primary, worktree };
}

function stalenessMessages(results) {
  return [...results.pass, ...results.warn, ...results.fail]
    .filter(r => r.check === 'version-staleness')
    .map(r => r.message);
}

const SKIPPED_ON_CONFLICT = /MERGE_HEAD detected/;

describe('version-staleness conflict guard', () => {
  it('trips in a worktree, where .git is a pointer file', () => {
    const { root, worktree } = makeConflictFixture();
    try {
      // Sanity-check the premise: a worktree really does carry a `.git` file,
      // so a `<root>/.git/MERGE_HEAD` path could never have existed here.
      assert.ok(
        fs.statSync(path.join(worktree, '.git')).isFile(),
        'fixture premise broken: worktree .git should be a file'
      );
      gitFixture(worktree, ['merge', 'sideA'], { allowFailure: true });
      const messages = stalenessMessages(runStaticChecksSubprocess(worktree));
      assert.ok(
        messages.some(m => SKIPPED_ON_CONFLICT.test(m)),
        `guard did not trip in worktree. version-staleness said: ${JSON.stringify(messages)}`
      );
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  it('trips in a primary checkout, where .git is a directory', () => {
    const { root, primary } = makeConflictFixture();
    try {
      gitFixture(primary, ['checkout', '-q', 'sideA']);
      gitFixture(primary, ['merge', 'sideB'], { allowFailure: true });
      const messages = stalenessMessages(runStaticChecksSubprocess(primary));
      assert.ok(
        messages.some(m => SKIPPED_ON_CONFLICT.test(m)),
        `guard did not trip in primary checkout. version-staleness said: ${JSON.stringify(messages)}`
      );
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  it('stays out of the way when there is no conflict', () => {
    const { root, worktree } = makeConflictFixture();
    try {
      // An ordinary uncommitted edit — the staleness check should evaluate it
      // rather than skip, or the fix would have disabled the check outright.
      writeFixtureFile(worktree, 'skills/x/SKILL.md', 'edited, uncommitted\n');
      const messages = stalenessMessages(runStaticChecksSubprocess(worktree));
      assert.ok(
        !messages.some(m => SKIPPED_ON_CONFLICT.test(m)),
        `guard tripped without a conflict. version-staleness said: ${JSON.stringify(messages)}`
      );
      assert.ok(
        messages.some(m => /no version bump/.test(m)),
        `staleness check did not evaluate the edit. version-staleness said: ${JSON.stringify(messages)}`
      );
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
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
    assert.equal(first.results.length, CODEX_SUBMIT_PLUGINS.length);
    assert.deepEqual(first.index, second.index);
    assert.deepEqual(
      first.results.map(({ plugin, skill }) => ({ dir: plugin, skill })),
      CODEX_SUBMIT_PLUGINS
    );
    assert.ok(!first.results.some(result =>
      ['anamnesis', 'epistemic-cooperative', 'bundle'].includes(result.plugin)
    ));
    assert.ok(!first.results.some(result => /bundle|release-notes/.test(result.filename)));
    for (const artifact of first.results) {
      assert.deepEqual(artifact.entries, [...artifact.entries].sort());
      assert.equal(artifact.entries.filter(name => name.endsWith('/SKILL.md')).length, 1);
      assert.ok(!artifact.entries.some(name => name.endsWith('/Skill.md')));
    }
    assert.ok(
      first.results.find(result => result.plugin === 'analogia').entries
        .includes('ground/references/best-practices.md')
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
      assert.equal(second.index.artifacts.length, CODEX_SUBMIT_PLUGINS.length);
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
  it('produces byte-identical release and submission ZIPs for the public-core skills', () => {
    for (const plugin of CODEX_SUBMIT_PLUGINS) {
      const release = buildSkillArtifact(plugin, { profile: 'release' });
      const submission = buildCodexSubmitArtifact(plugin);
      assert.deepEqual(release.zipBuffer, submission.zipBuffer, `${plugin.dir}/${plugin.skill}`);
      assert.deepEqual(release.artifact, submission.artifact, `${plugin.dir}/${plugin.skill}`);
    }
  });

  it('rejects a SKILL.md references/ pointer left dangling by removing a skill\'s only reference file', () => {
    const plugin = { dir: 'elenchus', skill: 'sublate' };
    const relativeReference = 'skills/sublate/references/round-composition.md';
    const sourceReferences = fs.readdirSync(
      path.join(__dirname, '..', plugin.dir, 'skills', plugin.skill, 'references')
    );
    assert.deepEqual(sourceReferences, ['round-composition.md'], 'fixture premise: the only reference file');
    const root = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'release-dangling-reference-'));
    try {
      fs.cpSync(path.join(__dirname, '..', plugin.dir), path.join(root, plugin.dir), { recursive: true });
      for (const profile of ['release', 'codex-submit']) {
        assert.doesNotThrow(() => buildSkillArtifact(plugin, { root, profile }), `intact copy, ${profile}`);
      }
      fs.rmSync(path.join(root, plugin.dir, relativeReference));
      for (const profile of ['release', 'codex-submit']) {
        assert.throws(
          () => buildSkillArtifact(plugin, { root, profile }),
          /unresolved local reference: sublate\/SKILL\.md -> references\/round-composition\.md/,
          profile
        );
      }
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  it('retains utility sidecars in the release superset', () => {
    const entriesFor = (dir, skill) => collectReleaseFiles({ dir, skill }).map(file => file.zipPath);
    assert.ok(entriesFor('epistemic-cooperative', 'review-loop')
      .includes('review-loop/references/pr-scope.md'));
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
      assert.equal(second.results.length, PLUGINS.length + 1); // every skill plus the bundle
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
    { plugin: 'analogia', skill: 'ground', version: '5.8.1', zip: 'ground.zip', files: 1, bytes: 100 },
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
    assert.ok(notes.includes('ContextInsufficient → SufficientContext'));
    assert.ok(notes.includes('BoundaryUndefined → DefinedBoundary'));
    assert.ok(notes.includes('MappingUncertain → MappingAssessment'));
  });

  it('shows versions from buildResults in protocols table', () => {
    const notes = generateReleaseNotes(mockResults);
    assert.ok(notes.includes('| 1.17.2 |'));
    assert.ok(notes.includes('| 5.8.1 |'));
  });

  it('shows dash for protocols not in buildResults', () => {
    const notes = generateReleaseNotes(mockResults);
    // elenchus is not in mockResults, should show —
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
    const analogiaPos = notes.indexOf('Analogia');
    const katalepsisPos = notes.indexOf('Katalepsis');
    assert.ok(horismosPos < aitesisPos, 'Horismos should precede Aitesis');
    assert.ok(aitesisPos < analogiaPos, 'Aitesis should precede Analogia');
    assert.ok(analogiaPos < katalepsisPos, 'Katalepsis should be last');
  });

  it('includes all core protocols in protocols table', () => {
    const notes = generateReleaseNotes(mockResults);
    for (const name of ALL_PROTOCOLS) {
      assert.ok(notes.includes(name), `Expected ${name} in protocols table`);
    }
  });

  it('uses computed highlights when changelog provided', () => {
    const changelog = {
      groups: {
        analogia: [{ hash: 'abc1234', type: 'feat', message: 'Two-mode redesign' }],
        elenchus: [{ hash: 'def5678', type: 'fix', message: 'Phase 2 routing fix' }],
      },
      ungrouped: [],
    };
    const notes = generateReleaseNotes(mockResults, { changelog });
    assert.ok(notes.includes('### New'));
    assert.ok(notes.includes('### Fixed'));
    assert.ok(notes.includes('**analogia**: Two-mode redesign'));
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
  it('packages every skill plus bundle in dry-run', () => {
    const output = execFileSync(process.execPath, [path.join(__dirname, 'package.js'), '--dry-run'], {
      encoding: 'utf8',
    });
    const result = JSON.parse(output);
    const bundle = result.results.find(entry => entry.plugin === 'bundle');

    // Regression guard: packaging must not emit plugin-malformation or missing-SKILL
    // warnings for anamnesis (distinct from non-blocking style warnings like line
    // guidelines). A silent skip of anamnesis would drop results.length without
    // surfacing the cause — this filter catches that specific failure mode.
    const anamnesisWarnings = result.warnings.filter(w => /anamnesis|recollect/.test(w) && !/-line guideline\)$/.test(w));
    assert.deepEqual(anamnesisWarnings, [], 'no anamnesis/recollect packaging warnings');
    assert.equal(result.results.length, PLUGINS.length + 1); // every skill plus the bundle
    assert.deepEqual(
      result.results.map(entry => entry.zip).sort(),
      [
        'apportion.zip',
        'bound.zip',
        'conduct.zip',
        'contextualize.zip',
        'elicit.zip',
        'epistemic-protocols-bundle.zip',
        'gate-check.zip',
        'goal-research.zip',
        'grasp.zip',
        'ground.zip',
        'ideate.zip',
        'induce.zip',
        'inquire.zip',
        'onboard.zip',
        'preview.zip',
        'probe.zip',
        'realign.zip',
        'recollect.zip',
        'reduced-space-test.zip',
        'review-loop.zip',
        'route.zip',
        'sketch.zip',
        'sublate.zip',
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
    assert.deepEqual(
      protocols.map(r => r.dir).sort(),
      ALL_PROTOCOLS.map(p => p.toLowerCase()).sort(),
      'active protocol set diverges from the canonical registry (CANONICAL_PROTOCOL_SET vs filesystem plugin dirs)'
    );
    for (const r of protocols) {
      assert.ok(r.deficit, `${r.dir}: deficit is null — SKILL.md Type signature parse failed`);
      assert.ok(r.resolution, `${r.dir}: resolution is null — SKILL.md Type signature parse failed`);
    }
  });
});

// ============================================================
// plugin directory registration (non-circular inventory guard)
// ============================================================

describe('plugin directory registration', () => {
  // The comparison above filters by isProtocol, and isProtocol is defined as
  // membership in CANONICAL_PROTOCOL_SET — so a protocol directory the set has
  // not been told about never enters that comparison, and it passes. It catches
  // the removal direction (a registered name whose directory is gone) and is
  // blind to the addition direction. This guard reads the filesystem inventory
  // instead of the registry, so neither direction can hide behind the filter.
  const KNOWN_UTILITY_DIRS = ['epistemic-cooperative', 'route'];

  it('every plugin directory on disk is registered as a protocol or a utility', () => {
    const dirs = [...new Set(
      discoverPlugins({ projectRoot: path.resolve(__dirname, '..') }).map(r => r.dir)
    )].sort();
    assert.deepEqual(
      dirs,
      [...CANONICAL_PROTOCOL_SET, ...KNOWN_UTILITY_DIRS].sort(),
      'plugin directory inventory diverges from its declared registration. ' +
      'Register a new protocol in CANONICAL_PROTOCOL_SET (scripts/load-protocols.js), ' +
      'or declare a new utility plugin in KNOWN_UTILITY_DIRS here. ' +
      'Note: the packaged-zip list in this file fails on a new directory too, and ' +
      'adding the zip name there silences that assertion while leaving the directory ' +
      'unregistered — register it here first.'
    );
  });
});

// ============================================================
// default installer skip list
// ============================================================

describe('default installer skip list', () => {
  // scripts/install.sh derives its plugin list from the marketplace manifest;
  // SKIP_PLUGINS is the one hand-maintained exclusion. A name left there after
  // its plugin leaves the manifest would keep asserting an exclusion of nothing,
  // so this guard re-runs the claim: every skipped name is a manifest plugin.
  const installSh = fs.readFileSync(path.resolve(__dirname, 'install.sh'), 'utf8');
  const manifest = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '..', '.claude-plugin', 'marketplace.json'), 'utf8')
  );

  it('every name in SKIP_PLUGINS is a plugin present in the marketplace manifest', () => {
    const match = installSh.match(/^SKIP_PLUGINS="([^"]*)"$/m);
    assert.ok(match, 'scripts/install.sh must declare SKIP_PLUGINS="..." on its own line');
    const skipped = match[1].split(/\s+/).filter(Boolean);
    const manifestNames = new Set(manifest.plugins.map(p => p.name));
    for (const name of skipped) {
      assert.ok(
        manifestNames.has(name),
        `SKIP_PLUGINS names "${name}", which is not a plugin in .claude-plugin/marketplace.json — ` +
        'remove the stale exclusion or restore the plugin'
      );
    }
  });
});

// ============================================================

describe('packaged discovery metadata', () => {
  it('keeps every packaged description within the discovery limit', () => {
    // The override path used to bypass the length warning entirely: the check fired
    // only when NO override existed, so an over-limit override shipped silently.
    // This asserts the thing that is actually statically decidable — the description a
    // runtime reader receives, after transformation, and its length.
    const offenders = [];
    for (const plugin of PLUGINS) {
      const skillPath = path.join(__dirname, '..', plugin.dir, 'skills', plugin.skill, 'SKILL.md');
      if (!fs.existsSync(skillPath)) continue;
      const transformed = transformSkillMd(fs.readFileSync(skillPath, 'utf8'), plugin.skill);
      const { fields } = parseFrontmatter(transformed);
      const desc = fields.get('description') || '';
      if (desc.length > DESCRIPTION_LIMIT) {
        offenders.push(`${plugin.dir}/${plugin.skill}: ${desc.length} chars`);
      }
    }
    assert.deepEqual(offenders, [], `over ${DESCRIPTION_LIMIT}-char discovery limit: ${offenders.join('; ')}`);
  });
});

it('ships an executable standalone capture-outcome reader with recollect', () => {
  const { zipEntries } = buildSkillArtifact({ dir: 'anamnesis', skill: 'recollect' });
  const reader = zipEntries.find((entry) => entry.name === 'recollect/scripts/hypomnesis-outcome.mjs');
  assert.ok(reader, 'the runtime reference requires the reader in the release artifact');
  const root = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'recollect-reader-package-'));
  try {
    const filename = path.join(root, 'hypomnesis-outcome.mjs');
    for (const entry of zipEntries.filter((entry) => entry.name.startsWith('recollect/scripts/'))) {
      fs.writeFileSync(path.join(root, path.basename(entry.name)), entry.data);
    }
    const result = JSON.parse(execFileSync(process.execPath, [filename, root, 'legacy-session'], { encoding: 'utf8' }));
    assert.equal(result.record_state, 'unknown');
    assert.deepEqual(result.artifacts, []);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
