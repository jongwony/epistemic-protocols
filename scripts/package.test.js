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
  const skillDir = path.join(REPO_ROOT, 'epistemic-cooperative', 'skills', 'goal-research');
  const skillPath = path.join(skillDir, 'SKILL.md');
  const refPath = (name) => path.join(skillDir, 'references', name);

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

  // Structural checks only: what each piece of prose means goes to review, not to a
  // phrase match. These hold the pieces a mechanical predicate can decide.

  it('keeps host tool bindings in the host references, with the codex envelope bound on Claude Code', () => {
    const skill = fs.readFileSync(skillPath, 'utf8');
    assert.ok(!/Bash\(run_in_background/.test(skill), 'a host tool binding stays out of the host-neutral body');
    const ref = fs.readFileSync(refPath('host-claude-code.md'), 'utf8');
    const bashMs = Number(ref.match(/Bash\(run_in_background: true, timeout: (\d+)\)/)?.[1]);
    assert.equal(bashMs, 75 * 60 * 1000);
  });

  it('opens the brief every runner receives with its labelled goal condition and carries the research-target slot', () => {
    const skill = fs.readFileSync(skillPath, 'utf8');
    // Line-anchored fences: an unanchored match can start at a closing fence and pair it
    // with the next block's opening one.
    const brief = [...skill.matchAll(/^```[^\n]*\n([\s\S]*?)^```/gm)].map((m) => m[1]).find((b) => b.includes('Research target:'));
    assert.ok(brief, 'the research brief must be present');
    assert.ok(brief.startsWith('Research goal condition: {goal condition}\n'), 'the brief states the goal condition under a label no goal command reads');
    assert.ok(!brief.includes('/goal'), 'the goal command is sent apart from the brief');
    assert.ok(brief.includes('{research_question}'), 'the research question is slotted in verbatim');
    assert.ok(brief.includes('{inquire}'), 'the runner-specific /inquire invocation is slotted');
  });

  it('presents the source check, then the items to settle, then the trace', () => {
    const skill = fs.readFileSync(skillPath, 'utf8');
    const phase4 = skill.slice(skill.indexOf('## Phase 4'), skill.indexOf('## Rules'));
    const order = ['--- Source Check ---', '--- Yours to Settle ---', '--- Trace ---'].map((h) => phase4.indexOf(h));
    assert.ok(order.every((i, k) => i > 0 && (k === 0 || i > order[k - 1])), 'Source Check, then Yours to Settle, then Trace');
  });

  it('links each host reference from the body and packages it', () => {
    const skill = fs.readFileSync(skillPath, 'utf8');
    const view = buildRuntimeContractViews().find((v) => v.skill === 'goal-research');
    assert.ok(view, 'goal-research must have a runtime contract view');
    for (const name of ['host-claude-code.md', 'host-codex.md']) {
      assert.ok(skill.includes(`(references/${name})`), `SKILL.md links ${name}`);
      assert.ok(view.packagedEntries.includes(`goal-research/references/${name}`), `${name} is packaged`);
    }
  });

  // ---- mechanical behaviour: the blocks run as written, on fixtures ----

  const hasJq = (() => {
    try {
      execFileSync('jq', ['--version'], { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  })();
  const needsJq = { skip: !hasJq && 'jq not installed' };

  // Bash blocks of a surface, fence lines anchored (indented blocks included).
  const bashBlocks = (doc) => [...doc.matchAll(/^[ \t]*```bash\n([\s\S]*?)^[ \t]*```/gm)].map((m) => m[1]);
  const pick = (doc, ...marks) => {
    const block = bashBlocks(doc).find((b) => marks.every((m) => b.includes(m)));
    assert.ok(block, `a bash block containing ${marks.join(' + ')} must be present`);
    return block;
  };
  const skillText = () => fs.readFileSync(skillPath, 'utf8');
  const refText = (name) => fs.readFileSync(refPath(name), 'utf8');
  const lines = (t) => (t ?? '').split('\n').filter((l) => l.length > 0);
  const toJsonl = (events) => events.map((e) => (typeof e === 'string' ? e : JSON.stringify(e))).join('\n') + '\n';

  // One run directory per test; `files` maps names under it to contents. Each step is
  // { pass, blocks } run in its own shell, as separate command calls are.
  const runSteps = (files, steps, collect = []) => {
    const suffix = crypto.randomBytes(4).toString('hex');
    const D = `/tmp/goal_research_${suffix}`;
    fs.mkdirSync(D, { recursive: true });
    try {
      for (const [name, content] of Object.entries(files)) fs.writeFileSync(path.join(D, name), content);
      // A step may add to the environment (a stand-in CLI on PATH) and run from a directory.
      const outs = steps.map(({ pass = 0, blocks, env = {}, cwd }) =>
        execFileSync('bash', ['-c', blocks.join('\n')], {
          env: { ...process.env, SUFFIX: suffix, PASS: String(pass), ...env, PATH: env.PATH ? `${env.PATH}:${process.env.PATH}` : process.env.PATH },
          cwd, encoding: 'utf8' }));
      const collected = Object.fromEntries(collect.map((n) => [n, fs.existsSync(path.join(D, n)) ? fs.readFileSync(path.join(D, n), 'utf8') : null]));
      // The latest pass's own report, and the trace assembled from every pass.
      const passReports = fs.readdirSync(D).map((f) => f.match(/^p(\d+)\.report\.txt$/)).filter(Boolean)
        .map((m) => [Number(m[1]), fs.readFileSync(path.join(D, m[0]), 'utf8')]).sort((x, y) => x[0] - y[0]);
      const report = passReports.length ? passReports[passReports.length - 1][1] : null;
      const trace = fs.existsSync(path.join(D, 'trace.txt')) ? fs.readFileSync(path.join(D, 'trace.txt'), 'utf8') : null;
      return { outs, out: outs.join(''), report, trace, collected };
    } finally {
      fs.rmSync(D, { recursive: true, force: true });
    }
  };
  const parseList = (out) => {
    const count = out.match(/^successful Tavily calls: (\d+)$/m)?.[1];
    const unreadable = out.match(/^not mechanically readable: (\d+)$/m)?.[1];
    const [, after] = out.split('--- returned ---');
    const [returned, extracted] = (after ?? '').split('--- extracted ---');
    return {
      failed: /^reduction failed: the checks have not run$/m.test(out),
      count: count === undefined ? undefined : Number(count),
      unreadable: unreadable === undefined ? undefined : Number(unreadable),
      unreadableIds: [...out.matchAll(/^ {2}call (\S+) \(/gm)].map((m) => m[1]).sort(),
      returned: lines(returned).sort(),
      extracted: lines(extracted).sort(),
    };
  };

  const codexOutcome = () => pick(skillText(), 'turn.completed', 'report.txt');
  const passRecord = () => pick(skillText(), 'p*.json.jsonl', 'record.status');
  const codexReducer = () => pick(skillText(), 'mcp_tool_call', 'calls.jsonl');
  const claudeReducer = () => pick(skillText(), 'tool_use', 'calls.jsonl');
  const listing = () => pick(skillText(), 'not mechanically readable');
  const assemble = () => pick(skillText(), 'trace.txt');
  const tavilyLib = () => pick(skillText(), 'def tavily_result');

  // Codex event shapes as codex-cli 0.160.0 emits them for Tavily MCP calls.
  const json = (obj) => ({ content: [{ type: 'text', text: JSON.stringify(obj) }] });
  const structured = (obj) => ({ content: [{ type: 'text', text: 'formatted, not JSON' }], structured_content: obj });
  const text = (t) => ({ content: [{ type: 'text', text: t }] });
  const call = (id, tool, result, extra = {}) => ({
    type: 'item.completed',
    item: { id, type: 'mcp_tool_call', server: 'tavily', tool, arguments: { query: 'see https://from-args.example/q' }, result, error: null, status: 'completed', ...extra },
  });
  const message = (id, t) => ({ type: 'item.completed', item: { id, type: 'agent_message', text: t } });
  const done = { type: 'turn.completed', usage: {} };
  const officialText = ['Request ID: r1', 'Detailed Results:', '', 'Title: T', 'URL: https://text.example/p', 'Content: c'].join('\n');

  // A run of one or more per-pass event files: each pass's outcome block in order, then
  // trace assembly, record, reduction and listing over the whole run. Shared by the codex
  // runner and `claude -p`, which differ only in their outcome block and reducer.
  const runPasses = (passes, outcome, reducer) => {
    const files = {};
    passes.forEach(({ events, status = 0 }, k) => {
      files[`p${k}.events.jsonl`] = toJsonl(events);
      files[`p${k}.status`] = `${status}\n`;
    });
    const steps = passes.map((_, k) => ({ pass: k, blocks: [outcome] }));
    steps.push({ blocks: [assemble(), passRecord(), tavilyLib(), reducer, listing()] });
    const r = runSteps(files, steps);
    return { ...parseList(r.outs[r.outs.length - 1]), passes: r.outs.slice(0, -1).map((o) => o.trim()), report: r.report, trace: r.trace };
  };
  const runCodex = (passes) => runPasses(passes, codexOutcome(), codexReducer());

  it('codex: counts only completed, error-free calls named exactly as Tavily search or extract', needsJq, () => {
    const r = runCodex([{ events: [
      'Codex autostart is disabled.',
      call('c1', 'tavily_search', json({ results: [{ url: 'https://a.example/1' }] })),
      call('c2', 'tavily-extract', json({ results: [{ url: 'https://a.example/1' }], failed_results: [{ url: 'https://failed.example/x', error: 'e' }] })),
      call('c3', 'tavily_research', json({ results: [{ url: 'https://research.example/r' }] })),
      call('c4', 'tavily_crawl', json({ results: [{ url: 'https://crawl.example/c' }] })),
      call('c5', 'tavily_map', json({ results: [{ url: 'https://map.example/m' }] })),
      { type: 'item.started', item: { id: 'c6', type: 'mcp_tool_call', server: 'tavily', tool: 'tavily_extract', result: null, error: null, status: 'in_progress' } },
      call('c6', 'tavily_extract', null, { error: { message: 'timeout' }, status: 'failed' }),
      call('c7', 'search_code', json({ results: [{ url: 'https://github.example/g' }] }), { server: 'github' }),
      message('m1', 'progress'),
      message('m2', 'final report'),
      done,
    ] }]);
    assert.deepEqual(r.passes, ['pass 0: returned']);
    assert.equal(r.count, 2, 'research, crawl, map, a failed call and another server\'s search are not counted');
    assert.equal(r.unreadable, 0);
    assert.deepEqual(r.returned, ['https://a.example/1'], 'arguments and failed_results are never read');
    assert.deepEqual(r.extracted, ['https://a.example/1']);
    assert.equal(r.report.trim(), 'final report', 'the report is the pass\'s last agent_message');
  });

  it('codex: lists JSON result URLs verbatim and fails closed on anything else', needsJq, () => {
    const verbatim = ['HTTPS://Upper.Example/Path', 'https://x.org/paper(A)', 'https://ko.example/\uB17C\uBB38/\uC81C1\uC7A5'];
    const r = runCodex([{ events: [
      call('c1', 'tavily_search', structured({ results: verbatim.map((url) => ({ url })) })),
      call('c2', 'tavily_search', text(officialText)),
      call('c3', 'tavily_extract', json({ error: 'Unauthorized: missing or invalid API key' })),
      call('c4', 'tavily_search', text('{"results": [{"url": "https://cut.example/')),
      message('m1', 'report'),
      done,
    ] }]);
    assert.equal(r.count, 4);
    assert.equal(r.unreadable, 3, 'formatted text, a JSON error body, and truncated JSON are not mechanically readable');
    assert.deepEqual(r.unreadableIds, ['0:c2', '0:c3', '0:c4'], 'a codex call is named by its pass and item id');
    assert.deepEqual(r.returned, [...verbatim].sort(), 'no normalization: case, parentheses and non-ASCII paths kept as returned');
    assert.deepEqual(r.extracted, []);
  });

  it('codex: a started-then-failed call alone gives the zero-call count', needsJq, () => {
    const r = runCodex([{ events: [
      { type: 'item.started', item: { id: 'c1', type: 'mcp_tool_call', server: 'tavily', tool: 'tavily_search', result: null, error: null, status: 'in_progress' } },
      call('c1', 'tavily_search', null, { error: { message: 'unauthorized' }, status: 'failed' }),
      message('m1', 'From memory.'),
      done,
    ] }]);
    assert.equal(r.count, 0);
    assert.equal(r.failed, false);
    assert.deepEqual(r.returned, []);
  });

  it('codex: a continuation pass is read with the launch for the record, and its own report for the outcome', needsJq, () => {
    const r = runCodex([
      { events: [{ type: 'thread.started', thread_id: 't1' }, call('c1', 'tavily_search', json({ results: [{ url: 'https://first.example/1' }] })), message('m1', 'first report'), done] },
      { events: [{ type: 'thread.started', thread_id: 't1' }, call('c2', 'tavily_extract', json({ results: [{ url: 'https://second.example/2' }] })), message('m2', 'second report'), done] },
    ]);
    assert.deepEqual(r.passes, ['pass 0: returned', 'pass 1: returned']);
    assert.equal(r.count, 2);
    assert.deepEqual(r.returned, ['https://first.example/1', 'https://second.example/2']);
    assert.deepEqual(r.extracted, ['https://second.example/2']);
    assert.equal(r.report.trim(), 'second report');
  });

  it('the trace keeps every returned pass\'s report in order; a later restatement never replaces the full report', needsJq, () => {
    const full = 'Full report: claim A (https://a.example/1), open item B with its reach.';
    const condensed = 'Goal acknowledged. The condition holds for the report I already returned.';
    const r = runCodex([
      { events: [call('c1', 'tavily_search', json({ results: [{ url: 'https://a.example/1' }] })), message('m1', full), done] },
      { events: [message('m2', condensed), done] },
    ]);
    assert.deepEqual(r.passes, ['pass 0: returned', 'pass 1: returned']);
    assert.equal(r.trace, `## Pass 0\n\n${full}\n\n## Pass 1\n\n${condensed}\n\n`);
  });

  it('codex (a): a continuation that ends in turn.failed or a nonzero exit fails, never reusing the earlier report', needsJq, () => {
    const launch = { events: [call('c1', 'tavily_search', json({ results: [{ url: 'https://first.example/1' }] })), message('m1', 'first report'), done] };
    const turnFailed = runCodex([launch, { events: [message('m2', 'partial'), { type: 'turn.failed', error: { message: 'stream disconnected' } }] }]);
    assert.deepEqual(turnFailed.passes, ['pass 0: returned', 'pass 1: failed']);
    assert.equal(turnFailed.report, '', 'the earlier pass\'s report is not taken as the new one');
    assert.equal(turnFailed.trace, '## Pass 0\n\nfirst report\n\n', 'the trace carries only the passes that returned');
    const nonzero = runCodex([launch, { events: [message('m2', 'looks fine'), done], status: 1 }]);
    assert.deepEqual(nonzero.passes, ['pass 0: returned', 'pass 1: failed']);
    assert.equal(nonzero.report, '');
    const noEvents = runCodex([launch, { events: ['Error loading config.toml: invalid transport'], status: 1 }]);
    assert.deepEqual(noEvents.passes, ['pass 0: returned', 'pass 1: failed']);
  });

  it('(d): a reduction that cannot read its record says so, and reports no count', needsJq, () => {
    // record missing (no pass files), and a truncated last line
    const missing = runSteps({}, [{ blocks: [passRecord(), tavilyLib(), codexReducer(), listing()] }]);
    const m = parseList(missing.out);
    assert.ok(m.failed, 'a missing record is a failed reduction');
    assert.equal(m.count, undefined, 'no count is printed');
    const truncated = runSteps({
      'p0.json.jsonl': toJsonl([call('c1', 'tavily_search', json({ results: [{ url: 'https://a.example/1' }] }))]) + '{"type":"item.completed","item":{"id":"c2"',
    }, [{ blocks: [passRecord(), tavilyLib(), codexReducer(), listing()] }]);
    const t = parseList(truncated.out);
    assert.ok(t.failed, 'a line that does not parse fails the reduction');
    assert.equal(t.count, undefined);
    const claudeTruncated = runSteps({
      'record.jsonl': '{"type":"assistant","message":{"content":[]}}\n{"type":"user","mess',
      'record.status': '0\n',
    }, [{ blocks: [tavilyLib(), claudeReducer(), listing()] }]);
    assert.ok(parseList(claudeTruncated.out).failed);
    const recordFailed = runSteps({ 'record.jsonl': '', 'record.status': '1\n' }, [{ blocks: [tavilyLib(), claudeReducer(), listing()] }]);
    assert.ok(parseList(recordFailed.out).failed, 'a record that failed to write is never reduced to zero calls');
  });

  // Claude message record: one reduction for the Claude Code subagent transcript and for
  // `claude -p` stream-json; each host reference writes record.jsonl from its own input.
  const use = (id, name) => ({ type: 'assistant', message: { id: `msg_${id}`, content: [{ type: 'tool_use', id, name, input: {} }] } });
  const res = (id, content, isError = null) => ({ type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: id, is_error: isError, content }] } });
  const textItems = (t) => [{ type: 'text', text: t }];
  const prompt = (t) => ({ type: 'user', message: { content: t } });
  const say = (id, t) => ({ type: 'assistant', message: { id, content: [{ type: 'text', text: t }] } });
  const claudeCalls = [
    use('t1', 'mcp__tavily__tavily_search'), res('t1', textItems(JSON.stringify({ results: [{ url: 'https://a.example/1' }] }))),
    use('t2', 'mcp__plugin_x_tavily__tavily-extract'), res('t2', JSON.stringify({ results: [{ url: 'https://a.example/1' }], failed_results: [{ url: 'https://failed.example/x', error: 'e' }] })),
    use('t3', 'mcp__tavily__tavily_research'), res('t3', textItems(JSON.stringify({ results: [{ url: 'https://research.example/r' }] }))),
    use('t4', 'mcp__tavily__tavily_search'), res('t4', 'Error: request failed', true),
    use('t5', 'mcp__tavily__tavily_extract'),
    use('t6', 'mcp__tavily__tavily_search'), res('t6', textItems(officialText)),
    use('t7', 'mcp__tavily__tavily_search'), res('t7', textItems('[Output truncated: tool result saved to /tmp/x.txt]')),
    use('t8', 'WebFetch'), res('t8', 'https://webfetch.example/v'),
  ];

  // Claude Code: the reference writes record.jsonl from the run's transcripts for the tool
  // record; the pass outcome is the host's delivered result and status, never the transcript.
  const runClaudeCode = (transcripts, { status = 0, delivered = 'report' } = {}) => {
    const ref = refText('host-claude-code.md');
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'goal-research-cc-'));
    try {
      const paths = transcripts.map((entries, k) => {
        const p = path.join(dir, `agent-${k}.jsonl`);
        fs.writeFileSync(p, toJsonl(entries));
        return p;
      });
      // The record block runs as written: it reads the paths listed in transcripts.txt.
      const build = pick(ref, 'record.status', 'transcripts.txt');
      const r = runSteps({
        'p0.status': `${status}\n`, 'p0.report.txt': delivered,
        'transcripts.txt': [...paths, paths[0]].join('\n') + '\n',
      }, [
        { blocks: [build, 'cat "/tmp/goal_research_${SUFFIX}/record.status"'] },
        { blocks: [pick(ref, 'pass ${PASS}: returned')] },
        { blocks: [tavilyLib(), claudeReducer(), listing()] },
      ]);
      return { ...parseList(r.outs[2]), recordStatus: r.outs[0].trim(), pass: r.outs[1].trim(), report: r.report };
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  };

  it('Claude Code: the tool record is every transcript of the run; the pass report is the host\'s delivered result', needsJq, () => {
    const r = runClaudeCode([
      [prompt('brief'), say('msg_0', 'early'), ...claudeCalls.slice(0, 6), say('msg_f0', 'first report')],
      [prompt('continue'), ...claudeCalls.slice(6)],
    ], { delivered: 'the delivered report' });
    assert.equal(r.pass, 'pass 0: returned');
    assert.equal(r.report, 'the delivered report', 'the report is what the host delivered, unchanged');
    assert.equal(r.count, 4, 'research, an errored call, a call with no result and WebFetch are not counted');
    assert.equal(r.unreadable, 2, 'formatted text and a truncated stub are not mechanically readable');
    assert.deepEqual(r.unreadableIds, ['t6', 't7']);
    assert.deepEqual(r.returned, ['https://a.example/1']);
    assert.deepEqual(r.extracted, ['https://a.example/1']);
  });

  const runClaudeP = (passes) => runPasses(passes, pick(refText('host-codex.md'), '"result"', 'report.txt'), claudeReducer());

  it('Codex host: the shared reduction reads every claude -p pass, and each pass\'s terminal result is its report', needsJq, () => {
    const r = runClaudeP([
      { events: [{ type: 'system', subtype: 'init', tools: ['mcp__tavily__tavily_search', 'Skill'] }, ...claudeCalls,
        { type: 'result', subtype: 'success', is_error: false, result: 'first result' }] },
      { events: [use('t9', 'mcp__tavily__tavily_search'), res('t9', textItems(JSON.stringify({ results: [{ url: 'https://later.example/9' }] }))),
        { type: 'result', subtype: 'success', is_error: false, result: 'resumed result' }] },
    ]);
    assert.deepEqual(r.passes, ['pass 0: returned', 'pass 1: returned']);
    assert.equal(r.report.trim(), 'resumed result');
    assert.equal(r.count, 5, 'the resumed pass\'s call is read with the launch');
    assert.equal(r.unreadable, 2);
    assert.deepEqual(r.returned, ['https://a.example/1', 'https://later.example/9']);
  });

  it('Codex host (b): a resumed pass whose terminal result is an error fails, not the earlier success', needsJq, () => {
    const first = { events: [...claudeCalls, { type: 'result', subtype: 'success', is_error: false, result: 'first result' }] };
    const errored = runClaudeP([first, { events: [{ type: 'result', subtype: 'error_max_turns', is_error: true, result: '' }] }]);
    assert.deepEqual(errored.passes, ['pass 0: returned', 'pass 1: failed']);
    assert.equal(errored.report, '');
    const nonzero = runClaudeP([first, { events: [{ type: 'result', subtype: 'success', is_error: false, result: 'x' }], status: 1 }]);
    assert.deepEqual(nonzero.passes, ['pass 0: returned', 'pass 1: failed']);
    const noTerminal = runClaudeP([first, { events: [say('m', 'partial')] }]);
    assert.deepEqual(noTerminal.passes, ['pass 0: returned', 'pass 1: failed']);
  });

  it('Codex host: the goal turn reports whether /goal engaged from its own events', needsJq, () => {
    const check = pick(refText('host-codex.md'), 'active_goal');
    const engaged = runSteps({ 'p1.events.jsonl': toJsonl([{ type: 'active_goal', value: { condition: 'c' } }, { type: 'active_goal', value: null }]) }, [{ blocks: [check] }]);
    assert.equal(engaged.out.trim(), 'goal engaged', 'a goal set and later met still engaged');
    const refused = runSteps({ 'p1.events.jsonl': toJsonl([{ type: 'active_goal', value: null }, { type: 'result', subtype: 'success', is_error: false, result: 'Goals are unavailable here.' }]) }, [{ blocks: [check] }]);
    assert.equal(refused.out.trim(), 'goal not engaged');
  });

  // A stand-in CLI on PATH echoes its arguments, working directory and stdin, so a pass
  // block's routing is what is observed.
  const standIn = (name) => {
    const bin = fs.mkdtempSync(path.join(os.tmpdir(), 'goal-research-bin-'));
    fs.writeFileSync(path.join(bin, name), '#!/bin/sh\necho "ARGS $*"\necho "CWD $(pwd)"\ncat\n', { mode: 0o755 });
    return bin;
  };
  const passFiles = { 'brief.txt': 'Research goal condition: the condition\nResearch target:\nq\n', 'goal.txt': '/goal the condition\n', 'continue.txt': 'gaps\n' };
  const runPassBlock = (block, cli, cwds) => {
    const bin = standIn(cli);
    try {
      const r = runSteps(passFiles, cwds.map((cwd, k) => ({ pass: k, blocks: [block], env: { PATH: bin }, cwd })),
        cwds.map((_, k) => `p${k}.events.jsonl`));
      return cwds.map((_, k) => r.collected[`p${k}.events.jsonl`]);
    } finally {
      fs.rmSync(bin, { recursive: true, force: true });
    }
  };

  it('Codex host: the brief starts the session, the /goal turn follows it alone, then continuations', () => {
    const seen = runPassBlock(pick(refText('host-codex.md'), 'claude -p', 'SESSION'), 'claude', [os.tmpdir(), os.tmpdir(), os.tmpdir()]);
    assert.match(seen[0], /^ARGS -p --session-id /, 'pass 0 starts the session');
    assert.match(seen[0], /Research target:/, 'pass 0 sends the brief');
    assert.match(seen[1], /^ARGS -p --resume /, 'the goal turn resumes the same session');
    assert.match(seen[1], /\n\/goal \S/, 'pass 1 sends /goal');
    assert.ok(!seen[1].includes('Research target:'), 'the goal turn carries the condition alone');
    assert.match(seen[2], /^ARGS -p --resume /);
    assert.match(seen[2], /\ngaps\n/, 'later passes send the continuation');
  });

  // ---- round 5: positive success evidence on every route, and the loop's first pass ----

  it('Claude Code: a pass returns on the host\'s completed status and a non-empty delivered result', needsJq, () => {
    const transcript = [[prompt('brief'), say('msg_f', 'text in the transcript')]];
    assert.equal(runClaudeCode(transcript).pass, 'pass 0: returned');
    assert.equal(runClaudeCode(transcript, { status: 1 }).pass, 'pass 0: failed', 'a host failure fails the pass');
    assert.equal(runClaudeCode(transcript, { delivered: '  \n' }).pass, 'pass 0: failed', 'an empty delivered result is no report');
  });

  it('Claude Code: a run that ends by handing its report back is returned, and its tool record reduces', needsJq, () => {
    // An Auto-mode subagent ends with a terminal tool_use carrying the report; the host
    // delivers that message, and the transcript is read only for the Tavily calls.
    const handback = { type: 'assistant', message: { id: 'msg_h', content: [{ type: 'tool_use', id: 'h1', name: 'SubagentHandback', input: { message: 'full report' } }] } };
    const r = runClaudeCode([[prompt('brief'),
      use('t1', 'mcp__tavily__tavily_search'), res('t1', textItems(JSON.stringify({ results: [{ url: 'https://a.example/1' }] }))),
      handback]], { delivered: 'full report' });
    assert.equal(r.pass, 'pass 0: returned');
    assert.equal(r.report, 'full report');
    assert.equal(r.count, 1);
    assert.deepEqual(r.returned, ['https://a.example/1']);
  });

  it('codex and claude -p: an empty final report is a failed pass', needsJq, () => {
    const codexEmpty = runCodex([{ events: [call('c1', 'tavily_search', json({ results: [] })), message('m1', ''), done] }]);
    assert.deepEqual(codexEmpty.passes, ['pass 0: failed']);
    const claudeEmpty = runClaudeP([{ events: [{ type: 'result', subtype: 'success', is_error: false, result: '' }] }]);
    assert.deepEqual(claudeEmpty.passes, ['pass 0: failed']);
    const blank = runClaudeP([{ events: [{ type: 'result', subtype: 'success', is_error: false, result: '  \n' }] }]);
    assert.deepEqual(blank.passes, ['pass 0: failed'], 'whitespace is not a report');
  });

  it('both reductions keep each call once, however often the record repeats it', needsJq, () => {
    const once = call('c1', 'tavily_search', json({ results: [{ url: 'https://a.example/1' }] }));
    const codex = runCodex([{ events: [once, once, message('m1', 'report'), done] }]);
    assert.equal(codex.count, 1);
    const repeated = [use('t1', 'mcp__tavily__tavily_search'), res('t1', textItems(JSON.stringify({ results: [{ url: 'https://a.example/1' }] })))];
    const cc = runClaudeCode([[prompt('brief'), ...repeated], [...repeated, prompt('continue'), say('msg_f', 'report')]]);
    assert.equal(cc.count, 1, 'a call carried in two transcripts counts once');
  });

  it('trace assembly ends with status 0 when the last pass failed', needsJq, () => {
    const r = runSteps({ 'p0.report.txt': 'full report\n', 'p1.report.txt': '' }, [{ blocks: [assemble()] }]);
    assert.equal(r.trace, '## Pass 0\n\nfull report\n\n');
  });

  it('the first evaluated pass continues on any gap, whichever pass number the route starts at', () => {
    const decide = pick(skillText(), 'gaps.txt');
    const run = (counts) => {
      const steps = counts.map(([pass, n]) => ({ pass, blocks: [decide.replace('{gap count}', String(n))] }));
      return runSteps({}, steps).outs.map((o) => o.trim());
    };
    assert.deepEqual(run([[0, 3]]), ['continue'], 'codex and Claude Code evaluate from pass 0');
    assert.deepEqual(run([[1, 3]]), ['continue'], 'claude -p evaluates from pass 1, the goal turn');
    assert.deepEqual(run([[1, 3], [2, 2], [3, 2]]), ['continue', 'continue', 'stop: gaps did not shrink']);
    assert.deepEqual(run([[0, 2], [1, 0]]), ['continue', 'stop: goal met']);
    assert.deepEqual(run([[0, 0]]), ['stop: goal met']);
  });

  it('every resumed pass runs from the working directory pass 0 recorded (claude -p and codex)', () => {
    const here = fs.mkdtempSync(path.join(os.tmpdir(), 'goal-research-cwd0-'));
    const elsewhere = fs.mkdtempSync(path.join(os.tmpdir(), 'goal-research-cwd1-'));
    try {
      const real = fs.realpathSync(here);
      for (const [block, cli] of [
        [pick(refText('host-codex.md'), 'claude -p', 'SESSION'), 'claude'],
        [pick(skillText(), 'codex exec --json', 'codex exec resume'), 'codex'],
      ]) {
        const seen = runPassBlock(block, cli, [here, elsewhere, elsewhere]);
        for (const k of [0, 1, 2]) {
          assert.match(seen[k], new RegExp(`\nCWD ${real.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\n`), `${cli} pass ${k} runs from pass 0's directory`);
        }
      }
    } finally {
      for (const d of [here, elsewhere]) fs.rmSync(d, { recursive: true, force: true });
    }
  });

  // ---- round 6: call identity, orphan results, MCP error flags, record binding, codex goal turn ----

  it('codex: item ids restart in every pass, so a call is identified by its pass and item id', needsJq, () => {
    const r = runCodex([
      { events: [call('item_1', 'tavily_search', json({ results: [{ url: 'https://first.example/1' }] })), message('item_2', 'full report'), done] },
      { events: [call('item_1', 'tavily_extract', json({ results: [{ url: 'https://second.example/2' }] })), message('item_2', 'goal turn'), done] },
    ]);
    assert.equal(r.count, 2, 'the same item id in two passes is two calls');
    assert.deepEqual(r.extracted, ['https://second.example/2'], 'the later pass\'s extract is listed');
  });

  it('Claude record: a tool_result with no matching tool_use is skipped, not a reduction failure', needsJq, () => {
    const r = runClaudeCode([[prompt('brief'),
      res('orphan', textItems(JSON.stringify({ results: [{ url: 'https://orphan.example/o' }] }))),
      use('t1', 'mcp__tavily__tavily_search'), res('t1', textItems(JSON.stringify({ results: [{ url: 'https://a.example/1' }] }))),
      say('msg_f', 'report')]]);
    assert.equal(r.failed, false, 'the reduction succeeds');
    assert.equal(r.count, 1);
    assert.deepEqual(r.returned, ['https://a.example/1']);
  });

  it('a Tavily call whose MCP result is flagged as an error is not a successful call', needsJq, () => {
    // codex 0.160.0 maps an MCP result with isError to status "failed", keeping the result.
    const codex = runCodex([{ events: [
      call('c1', 'tavily_search', json({ results: [{ url: 'https://flagged.example/f' }] }), { status: 'failed' }),
      message('m1', 'report'), done] }]);
    assert.equal(codex.count, 0);
    const cc = runClaudeCode([[prompt('brief'),
      use('t1', 'mcp__tavily__tavily_search'), res('t1', textItems(JSON.stringify({ results: [{ url: 'https://flagged.example/f' }] })), true),
      say('msg_f', 'report')]]);
    assert.equal(cc.count, 0);
  });

  it('Claude Code: the record block runs as written on the common single transcript', needsJq, () => {
    const r = runClaudeCode([[prompt('brief'), say('msg_f', 'report')]]);
    assert.equal(r.recordStatus, '0');
    assert.equal(r.pass, 'pass 0: returned');
  });

  it('codex: the brief launches the session, the /goal turn follows it alone by resume, then continuations', () => {
    const seen = runPassBlock(pick(skillText(), 'codex exec --json', 'codex exec resume'), 'codex', [os.tmpdir(), os.tmpdir(), os.tmpdir()]);
    assert.match(seen[0], /^ARGS exec --json /, 'pass 0 launches');
    assert.match(seen[0], /Research target:/);
    assert.ok(!seen[0].includes('/goal'), 'the brief carries no /goal');
    assert.match(seen[1], /^ARGS exec resume /, 'the goal turn resumes the same session');
    assert.match(seen[1], /\n\/goal \S/);
    assert.ok(!seen[1].includes('Research target:'), 'the goal turn carries the condition alone');
    assert.match(seen[2], /^ARGS exec resume /);
    assert.match(seen[2], /\ngaps\n/);
  });

  // ---- round 7: the current report, and one gap line per pass ----

  it('the gaps are read on the current report this session marks, not on the trace or the latest pass', needsJq, () => {
    const mark = pick(skillText(), 'current.txt');
    const r = runSteps({ 'p0.report.txt': 'full report\n', 'p1.report.txt': 'Goal acknowledged.\n' },
      [{ blocks: [mark.replace('{pass of the current report}', '0')] }]);
    assert.equal(r.out, 'full report\n', 'a pass that only refers back leaves pass 0\'s report current');
  });

  it('gaps.txt keeps one line per pass and rejects a count that is not a non-negative integer', () => {
    const decide = pick(skillText(), 'gaps.txt');
    const run = (counts) => runSteps({}, counts.map(([pass, n]) => ({ pass, blocks: [decide.replace('{gap count}', String(n))] })), ['gaps.txt']);
    const again = run([[0, 3], [0, 3]]);
    assert.deepEqual(again.outs.map((o) => o.trim()), ['continue', 'continue'], 'recording pass 0 again replaces its line');
    assert.equal(again.collected['gaps.txt'], '0 3\n');
    const bad = run([[0, 'three']]);
    assert.equal(bad.outs[0].trim(), 'step failed: the gap count is not a non-negative integer');
    assert.equal(bad.collected['gaps.txt'], null, 'nothing is recorded');
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
