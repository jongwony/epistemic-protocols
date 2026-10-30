// Tests for route-session.mjs — the SessionStart injection of the routing
// frame and the derived table, with the premise index as a second part, on
// every source alike — and for the derivation in route-protocols.mjs it carries.
// Run with: node --test
// Repo precedent: anamnesis/scripts/hypomnesis-write.test.mjs (node:test + node:assert).

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { PREMISE_HEADER, PREMISE_INDEX } from "./route-premise.mjs";
import { FRAME_HEADER, FRAME_JUDGMENTS, TABLE_HEADER, deriveProtocols, flatten, readFrame, renderRouting, renderTable, selectProtocol } from "./route-protocols.mjs";
import { PARTS, buildContext, render } from "./route-session.mjs";

const SCRIPT = path.join(path.dirname(fileURLToPath(import.meta.url)), "route-session.mjs");

function runHook(input, env = {}) {
  return spawnSync(process.execPath, [SCRIPT], {
    input,
    encoding: "utf8",
    env: { ...process.env, ...env },
  });
}

// ---------------------------------------------------------------------------
// Fixture tree: a marketplace of plugins laid out the way installed_plugins
// records them, so derivation is exercised without touching the real install.
// ---------------------------------------------------------------------------

function makeFixture(spec = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "route-fixture-"));
  const configDir = path.join(root, "config");
  const cache = path.join(root, "cache", "mp");
  fs.mkdirSync(path.join(configDir, "plugins"), { recursive: true });

  const plugins = {};
  const enabledPlugins = {};
  for (const p of spec.plugins ?? []) {
    const at = path.join(cache, p.name, p.version ?? "1.0.0");
    for (const skill of p.skills ?? []) {
      const dir = path.join(at, "skills", skill.dir);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, "SKILL.md"), skill.body);
    }
    if ((p.skills ?? []).length === 0) fs.mkdirSync(at, { recursive: true });
    plugins[`${p.name}@${p.marketplace ?? "mp"}`] = [
      { scope: "user", installPath: at, version: p.version ?? "1.0.0" },
    ];
    enabledPlugins[`${p.name}@${p.marketplace ?? "mp"}`] = p.enabled !== false;
  }

  fs.writeFileSync(
    path.join(configDir, "plugins", "installed_plugins.json"),
    JSON.stringify({ version: 2, plugins }),
  );
  fs.writeFileSync(
    path.join(configDir, "settings.json"),
    JSON.stringify({ enabledPlugins }),
  );

  // The premise layer, where the fixture asks for it: premise/ under the
  // marketplace checkout the host records, apart from the cache entries.
  const checkout = path.join(root, "checkout");
  if (spec.premise) {
    fs.mkdirSync(path.join(checkout, "premise"), { recursive: true });
    fs.writeFileSync(path.join(checkout, "premise", PREMISE_INDEX[0].file), "# doc\n");
    fs.writeFileSync(
      path.join(configDir, "plugins", "known_marketplaces.json"),
      JSON.stringify({ mp: { source: { source: "git" }, installLocation: checkout } }),
    );
  }

  const selfRoot = path.join(cache, spec.self ?? "route", "1.0.0");
  return { root, configDir, checkout, pluginRoot: selfRoot, env: { configDir, pluginRoot: selfRoot } };
}


function protocolSkill(name, deficit, resolution, extra = "") {
  return [
    "---",
    `name: ${name}`,
    `description: "Does a thing.${extra}"`,
    "---",
    "",
    ...(resolution ? [`Type: (${deficit}, AI, DO, Thing) → ${resolution}`] : []),
    "",
    "```",
    "── MORPHISM ──",
    "A",
    "  → step(x)",
    `deficit:  ${deficit}              -- activation precondition`,
    "```",
    "",
  ].join("\n");
}

const SUITE = {
  self: "route",
  plugins: [
    { name: "route", skills: [{ dir: "route", body: protocolSkill("route", "DeficitUnrouted", "ProtocolInvocation") }] },
    { name: "periagoge", skills: [{ dir: "induce", body: protocolSkill("induce", "AbstractionInProcess", "CrystallizedAbstraction") }] },
    { name: "horismos", skills: [{ dir: "bound", body: protocolSkill("bound", "BoundaryUndefined", "DefinedBoundary") }] },
    { name: "anamnesis", skills: [{ dir: "recollect", body: protocolSkill("recollect", "RecallAmbiguous", "RecalledContext") }] },
  ],
};

function cleanup(fixture) {
  fs.rmSync(fixture.root, { recursive: true, force: true });
}

test("the table header names what its rows are", () => {
  assert.match(TABLE_HEADER, /^Loaded core epistemic protocols/);
});

test("a row carries both ends of the morphism and the declared description, and survives either missing", () => {
  assert.equal(
    renderTable([
      { command: "x", deficit: "A", resolution: "B", description: "Does x: then y." },
      { command: "y", deficit: "C", resolution: null, description: "Does y." },
      { command: "z", deficit: "D", resolution: "E", description: null },
    ]),
    `${TABLE_HEADER}\n/x A → B — Does x: then y.\n/y C — Does y.\n/z D → E`,
  );
});

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const ROUTE_SKILL = path.join(REPO, "route", "skills", "route", "SKILL.md");

function repoProtocols() {
  return fs.readdirSync(REPO, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== "route")
    .map((e) => selectProtocol(path.join(REPO, e.name)))
    .filter(Boolean);
}

test("the repo's own routing part — frame and table — fits one injection", () => {
  // The host caps each additionalContext string at 10,000 characters; the
  // routing part goes out as its own SessionStart entry, so it alone must fit.
  const protocols = repoProtocols();
  assert.ok(protocols.length > 0);
  assert.ok(protocols.every((p) => p.description), "every core protocol declares a description");
  const frame = readFrame(path.join(REPO, "route"));
  assert.ok(frame, "the frame reads from route's own SKILL.md");
  const routing = renderRouting(protocols, frame);
  assert.ok(routing.length <= 10000, `the routing part is ${routing.length} characters`);
});

test("the frame carries the contract's judgments and Rules as written", () => {
  // Propagation: every judgment the frame carries is the doc comment above
  // that axiom in the SKILL.md, and its rules are the Rules section, so the
  // contract stays their only home.
  const source = fs.readFileSync(ROUTE_SKILL, "utf8");
  const frame = readFrame(path.join(REPO, "route"));
  assert.deepEqual(frame.judgments.map(([name]) => name), [...FRAME_JUDGMENTS]);
  for (const [name, doc] of frame.judgments) {
    const at = source.indexOf(`\naxiom ${name} `);
    assert.ok(at > 0, `axiom ${name} is declared`);
    const span = source.slice(source.lastIndexOf("/--", at) + 3, source.lastIndexOf("-/", at));
    assert.equal(doc, flatten(span), `${name} is carried as its source span`);
  }
  assert.equal(frame.rules, source.slice(source.indexOf("## Rules\n") + "## Rules\n".length).trim());
  const routing = renderRouting(repoProtocols(), frame);
  assert.ok(routing.startsWith(FRAME_HEADER));
  for (const [, doc] of frame.judgments) assert.ok(routing.includes(doc));
  assert.ok(routing.includes(frame.rules));
  assert.ok(routing.indexOf(frame.rules) < routing.indexOf(TABLE_HEADER), "the table follows the frame");
  // Where a row is missing, the frame itself says where a description is read from,
  // and who reads a delegated agent's report.
  assert.ok(routing.includes("from where the protocol states it"));
  assert.ok(routing.includes("the agent that receives its report"));
});

test("frame and table each go out without the other", () => {
  const rows = [{ command: "x", deficit: "A", resolution: "B", description: "Does x." }];
  // A frame that cannot be read leaves the table alone.
  assert.equal(renderRouting(rows, null), renderTable(rows));
  assert.equal(readFrame("/nonexistent"), null);
  // A host whose install record yields no table still gets the frame.
  const frame = { judgments: [["FitSupported", "judged."]], rules: "1. rule" };
  assert.equal(renderRouting([], frame), `${FRAME_HEADER}\nJudgments:\n- \`FitSupported\` — judged.\nRules:\n1. rule`);
  assert.equal(renderRouting([], null), "");
});

// ---------------------------------------------------------------------------
// Derivation
// ---------------------------------------------------------------------------

test("derives one row per installed single-skill protocol, route excluded", () => {
  const fixture = makeFixture(SUITE);
  try {
    const rows = deriveProtocols(fixture.env);
    // The declared description rides along on each row.
    assert.deepEqual(rows, [
      { command: "recollect", deficit: "RecallAmbiguous", resolution: "RecalledContext", description: "Does a thing." },
      { command: "bound", deficit: "BoundaryUndefined", resolution: "DefinedBoundary", description: "Does a thing." },
      { command: "induce", deficit: "AbstractionInProcess", resolution: "CrystallizedAbstraction", description: "Does a thing." },
    ]);
    // Route never routes to itself.
    assert.ok(!rows.some((r) => r.command === "route"));
  } finally {
    cleanup(fixture);
  }
});

test("a multi-skill plugin is a utility bundle, not a core protocol", () => {
  const fixture = makeFixture({
    ...SUITE,
    plugins: [
      ...SUITE.plugins,
      {
        name: "cooperative",
        skills: [
          { dir: "catalog", body: protocolSkill("catalog", "DeficitUnrecognized", "X") },
          { dir: "steer", body: protocolSkill("steer", "CalibrationDriftOpaque", "Y") },
        ],
      },
    ],
  });
  try {
    const rows = deriveProtocols(fixture.env);
    assert.ok(!rows.some((r) => r.command === "catalog"));
    assert.ok(!rows.some((r) => r.command === "steer"));
    assert.equal(rows.length, 3);
  } finally {
    cleanup(fixture);
  }
});

test("a skill without a deficit line is left out rather than guessed at", () => {
  const fixture = makeFixture({
    ...SUITE,
    plugins: [
      ...SUITE.plugins,
      {
        name: "helper",
        skills: [{
          dir: "help",
          body: "---\nname: help\ndescription: \"No morphism block.\"\n---\n\n# Helper\n",
        }],
      },
    ],
  });
  try {
    const rows = deriveProtocols(fixture.env);
    assert.ok(!rows.some((r) => r.command === "help"));
    assert.equal(rows.length, 3);
  } finally {
    cleanup(fixture);
  }
});

test("selection keys on the deficit line, not the frontmatter Type clause", () => {
  // anamnesis:recollect carries no `Type: (...)` clause in its description
  // while its siblings do. Keying on that clause drops it silently; the
  // MORPHISM deficit line covers every protocol in the suite.
  const fixture = makeFixture(SUITE);
  try {
    const rows = deriveProtocols(fixture.env);
    const recollect = rows.find((r) => r.command === "recollect");
    assert.ok(recollect, "a protocol without a Type clause must still be derived");
    assert.equal(recollect.deficit, "RecallAmbiguous");
    const bodies = SUITE.plugins.map((p) => p.skills[0].body).join("");
    assert.ok(bodies.includes("Type: ("), "the fixture carries Type clauses only in the body");
  } finally {
    cleanup(fixture);
  }
});

test("a disabled plugin does not appear", () => {
  const fixture = makeFixture({
    ...SUITE,
    plugins: SUITE.plugins.map((p) => (p.name === "horismos" ? { ...p, enabled: false } : p)),
  });
  try {
    const rows = deriveProtocols(fixture.env);
    assert.ok(!rows.some((r) => r.command === "bound"));
    assert.equal(rows.length, 2);
  } finally {
    cleanup(fixture);
  }
});

test("a plugin from another marketplace does not appear", () => {
  const fixture = makeFixture({
    ...SUITE,
    plugins: [
      ...SUITE.plugins,
      {
        name: "stranger",
        marketplace: "other",
        skills: [{ dir: "wander", body: protocolSkill("wander", "SomethingElse", "Z") }],
      },
    ],
  });
  try {
    const rows = deriveProtocols(fixture.env);
    assert.ok(!rows.some((r) => r.command === "wander"));
    assert.equal(rows.length, 3);
  } finally {
    cleanup(fixture);
  }
});

// ---------------------------------------------------------------------------
// Fail open
// ---------------------------------------------------------------------------

test("missing settings or install record yields empty context, never an error", () => {
  const fixture = makeFixture(SUITE);
  try {
    fs.rmSync(path.join(fixture.configDir, "settings.json"));
    assert.deepEqual(deriveProtocols(fixture.env), []);
    assert.equal(buildContext(fixture.env), "");
  } finally {
    cleanup(fixture);
  }
});

test("malformed settings yields empty context, never an error", () => {
  const fixture = makeFixture(SUITE);
  try {
    fs.writeFileSync(path.join(fixture.configDir, "settings.json"), "{ not json");
    assert.deepEqual(deriveProtocols(fixture.env), []);
    assert.equal(buildContext(fixture.env), "");
  } finally {
    cleanup(fixture);
  }
});

test("an unrecognized plugin layout yields no table", () => {
  const fixture = makeFixture(SUITE);
  try {
    const stray = { configDir: fixture.configDir, pluginRoot: path.join(fixture.root, "nowhere") };
    assert.deepEqual(deriveProtocols(stray), []);
    assert.equal(renderTable(deriveProtocols(stray)), "");
  } finally {
    cleanup(fixture);
  }
});

test("no derived protocol and no index means nothing goes out", () => {
  const fixture = makeFixture({ self: "route", plugins: [] });
  try {
    assert.equal(buildContext(fixture.env), "");
  } finally {
    cleanup(fixture);
  }
});

// ---------------------------------------------------------------------------
// Emitted context
// ---------------------------------------------------------------------------

test("each table row is one line: command, deficit → resolution, then the declared description whole", () => {
  const fixture = makeFixture(SUITE);
  try {
    const context = buildContext(fixture.env);
    assert.ok(context.startsWith(TABLE_HEADER));
    assert.match(context, /^\/induce AbstractionInProcess → CrystallizedAbstraction — Does a thing\.$/m);
    const rows = context.split("\n").slice(1);
    assert.equal(rows.length, 3);
    for (const row of rows) assert.match(row, /^\/[a-z-]+ [A-Za-z]+ → [A-Za-z]+ — Does a thing\.$/);
  } finally {
    cleanup(fixture);
  }
});

test("each part goes out alone: the routing part without the index, the index without it", () => {
  const fixture = makeFixture({ ...SUITE, premise: true });
  try {
    const table = buildContext(fixture.env, "routing");
    const premise = buildContext(fixture.env, "premise");
    assert.ok(table.startsWith(TABLE_HEADER));
    assert.doesNotMatch(table, new RegExp(PREMISE_HEADER));
    assert.ok(premise.startsWith(PREMISE_HEADER));
    assert.doesNotMatch(premise, new RegExp(TABLE_HEADER));
    // With no part named, both go out joined, table first.
    assert.equal(buildContext(fixture.env), `${table}\n${premise}`);
  } finally {
    cleanup(fixture);
  }
});

test("hooks.json registers each part as its own SessionStart entry", () => {
  // Separate entries give each part its own size cap, and one part's
  // failure cannot suppress the other.
  const hooks = JSON.parse(fs.readFileSync(path.join(path.dirname(SCRIPT), "..", "hooks", "hooks.json"), "utf8"));
  const commands = hooks.hooks.SessionStart.map((entry) => {
    assert.equal(entry.hooks.length, 1);
    return entry.hooks[0].command;
  });
  assert.deepEqual(
    commands,
    PARTS.map((part) => `node "\${CLAUDE_PLUGIN_ROOT}/scripts/route-session.mjs" ${part}`),
  );
});

test("the premise index follows the table on every source, its paths absolute", () => {
  const fixture = makeFixture({ ...SUITE, premise: true });
  try {
    const expected = [
      PREMISE_HEADER,
      `\`${path.join(fixture.checkout, "premise", PREMISE_INDEX[0].file)}\` — Moments: ${PREMISE_INDEX[0].moments}`,
    ].join("\n");
    const context = buildContext(fixture.env);
    assert.ok(context.startsWith(TABLE_HEADER), "the injection begins at the table");
    assert.ok(context.endsWith(`\n${expected}`), "the index closes the injection");
    // The table sits before the index, unchanged by it.
    assert.equal(context.indexOf(TABLE_HEADER) < context.indexOf(PREMISE_HEADER), true);
  } finally {
    cleanup(fixture);
  }
});

test("the premise index goes out even where no protocol resolved", () => {
  // The two companions fail independently: an install record that yields no
  // protocol does not cost the index, and a missing index does not cost the
  // table.
  const fixture = makeFixture({ self: "route", plugins: [], premise: true });
  try {
    fs.writeFileSync(
      path.join(fixture.configDir, "plugins", "installed_plugins.json"),
      JSON.stringify({ version: 2, plugins: { "route@mp": [{ scope: "user", installPath: fixture.pluginRoot }] } }),
    );
    const context = buildContext(fixture.env);
    assert.ok(context.startsWith(PREMISE_HEADER));
    assert.doesNotMatch(context, new RegExp(TABLE_HEADER));
  } finally {
    cleanup(fixture);
  }
});

test("without a readable frame the injection is the table and index only", () => {
  // The fixture plugin root carries no skills/route/SKILL.md, so no frame is
  // read and nothing tells the reader to invoke /route.
  const fixture = makeFixture(SUITE);
  try {
    const context = buildContext(fixture.env);
    assert.ok(context.startsWith(TABLE_HEADER), "must begin at the header");
    assert.doesNotMatch(context, /^\[route\]/m);
    assert.doesNotMatch(context, /invoke \/route/);
    assert.equal(context.split("\n").length, 1 + 3);
  } finally {
    cleanup(fixture);
  }
});

// ---------------------------------------------------------------------------
// Wire format
// ---------------------------------------------------------------------------

test("render carries the table as SessionStart additionalContext on every source", () => {
  const fixture = makeFixture(SUITE);
  try {
    const out = JSON.parse(render(JSON.stringify({
      hook_event_name: "SessionStart",
      source: "resume",
      session_id: "s",
    }), fixture.env));
    assert.equal(out.hookSpecificOutput.hookEventName, "SessionStart");
    assert.equal(out.hookSpecificOutput.additionalContext, buildContext(fixture.env));
    assert.equal(out.suppressOutput, true);
  } finally {
    cleanup(fixture);
  }
});

test("render on empty or malformed stdin still answers, with nothing to derive", () => {
  for (const raw of ["", "not json", "[1,2]"]) {
    const out = JSON.parse(render(raw, { configDir: "/nonexistent", pluginRoot: "/nonexistent" }));
    assert.equal(out.hookSpecificOutput.hookEventName, "SessionStart");
    assert.equal(out.hookSpecificOutput.additionalContext, "");
  }
});

test("hook process exits 0 on empty stdin", () => {
  const result = runHook("", { CLAUDE_CONFIG_DIR: "/nonexistent" });
  assert.equal(result.status, 0);
  const out = JSON.parse(result.stdout);
  assert.equal(out.hookSpecificOutput.hookEventName, "SessionStart");
  assert.equal(typeof out.hookSpecificOutput.additionalContext, "string");
});

test("hook process exits 0 with empty context when nothing can be derived", () => {
  const result = runHook(JSON.stringify({ hook_event_name: "SessionStart", source: "compact" }), {
    CLAUDE_CONFIG_DIR: "/nonexistent",
    CLAUDE_PLUGIN_ROOT: "/nonexistent",
  });
  assert.equal(result.status, 0);
  const out = JSON.parse(result.stdout);
  assert.equal(out.hookSpecificOutput.hookEventName, "SessionStart");
  assert.equal(out.hookSpecificOutput.additionalContext, "");
});

test("hook process exits 0 and derives from the fixture through the environment", () => {
  const fixture = makeFixture(SUITE);
  try {
    const result = runHook(JSON.stringify({
      hook_event_name: "SessionStart",
      source: "compact",
      session_id: "s",
      transcript_path: "/tmp/t.jsonl",
    }), { CLAUDE_CONFIG_DIR: fixture.configDir, CLAUDE_PLUGIN_ROOT: fixture.pluginRoot });
    assert.equal(result.status, 0);
    const out = JSON.parse(result.stdout);
    assert.ok(out.hookSpecificOutput.additionalContext.startsWith(TABLE_HEADER));
    assert.doesNotMatch(out.hookSpecificOutput.additionalContext, /^\[route\]/m);
    assert.match(out.hookSpecificOutput.additionalContext, /^\/bound BoundaryUndefined → DefinedBoundary — Does a thing\.$/m);
  } finally {
    cleanup(fixture);
  }
});
