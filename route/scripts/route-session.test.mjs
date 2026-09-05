// Tests for route-session.mjs — the SessionStart injection of the derived
// deficit table, under an opener on thin sources only, with the premise
// index beneath it — and for the derivation in route-protocols.mjs it
// carries.
// Run with: node --test
// Repo precedent: anamnesis/scripts/hypomnesis-write.test.mjs (node:test + node:assert).

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { PREMISE_HEADER, PREMISE_INDEX, PREMISE_INTRO } from "./route-premise.mjs";
import { TABLE_HEADER, deriveProtocols, renderTable } from "./route-protocols.mjs";
import {
  THIN_OPENER,
  TRIMMED_SOURCES,
  buildContext,
  opener,
  render,
} from "./route-session.mjs";

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

// ---------------------------------------------------------------------------
// Opener — conditioned on the documented SessionStart `source`
// ---------------------------------------------------------------------------

test("startup and clear open on thin context", () => {
  assert.equal(opener("startup"), THIN_OPENER);
  assert.equal(opener("clear"), THIN_OPENER);
  assert.match(THIN_OPENER, /^\[route\] Context is thin/);
  assert.match(THIN_OPENER, /sits in the request itself — intent or context only the user can supply/);
  assert.match(THIN_OPENER, /accumulated context cannot yet show/);
});

test("resume and compact carry no opener — the catalog alone", () => {
  // Recall-shaped deficits show in the utterance, so they are the
  // per-prompt directive's kind; only request-held deficits need a
  // session-start nudge, and only where context is thin.
  assert.deepEqual([...TRIMMED_SOURCES].sort(), ["compact", "resume"]);
  assert.equal(opener("resume"), "");
  assert.equal(opener("compact"), "");
});

test("a missing or unknown source reads as thin", () => {
  assert.equal(opener(undefined), THIN_OPENER);
  assert.equal(opener(""), THIN_OPENER);
  assert.equal(opener("something-new"), THIN_OPENER);
});

test("the opener ends in the directive's own action — invoke /route", () => {
  // Two triggers, one router: the match and the relay test live inside
  // /route (Rule #1), so an opener that matched on its own would skip them.
  assert.match(THIN_OPENER, /invoke \/route/);
  assert.doesNotMatch(THIN_OPENER, /match (that|it) against/);
});

test("the opener names no protocol — the condition is stated, /route matches", () => {
  // A protocol named here would be the hand-kept routing table Rule #2
  // refuses. `/route` itself is the one command the opener may carry.
  const commands = THIN_OPENER.match(/\/[a-z-]+/g) ?? [];
  assert.deepEqual(commands.filter((c) => c !== "/route"), []);
  assert.ok(THIN_OPENER.split("\n").length <= 2);
});

test("the table header carries the directive's referent", () => {
  // The per-prompt directive says "a loaded core epistemic protocol"; the
  // header must use the same words so the two injections read as one catalog.
  assert.match(TABLE_HEADER, /^Loaded core epistemic protocols/);
});

test("a row carries both ends of the morphism, and survives a missing resolution", () => {
  assert.equal(
    renderTable([{ command: "x", deficit: "A", resolution: "B" }, { command: "y", deficit: "C", resolution: null }]),
    `${TABLE_HEADER}\n/x A → B\n/y C`,
  );
});

// ---------------------------------------------------------------------------
// Derivation
// ---------------------------------------------------------------------------

test("derives one row per installed single-skill protocol, route excluded", () => {
  const fixture = makeFixture(SUITE);
  try {
    const rows = deriveProtocols(fixture.env);
    assert.deepEqual(rows, [
      { command: "recollect", deficit: "RecallAmbiguous", resolution: "RecalledContext" },
      { command: "bound", deficit: "BoundaryUndefined", resolution: "DefinedBoundary" },
      { command: "induce", deficit: "AbstractionInProcess", resolution: "CrystallizedAbstraction" },
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

test("missing settings or install record yields the opener alone, never an error", () => {
  const fixture = makeFixture(SUITE);
  try {
    fs.rmSync(path.join(fixture.configDir, "settings.json"));
    assert.deepEqual(deriveProtocols(fixture.env), []);
    assert.equal(buildContext("startup", fixture.env), THIN_OPENER);
  } finally {
    cleanup(fixture);
  }
});

test("malformed settings yields the opener alone on a thin source, nothing on a trimmed one", () => {
  const fixture = makeFixture(SUITE);
  try {
    fs.writeFileSync(path.join(fixture.configDir, "settings.json"), "{ not json");
    assert.deepEqual(deriveProtocols(fixture.env), []);
    assert.equal(buildContext("clear", fixture.env), THIN_OPENER);
    assert.equal(buildContext("compact", fixture.env), "");
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

test("no derived protocol means the opener goes out alone, or nothing at all", () => {
  const fixture = makeFixture({ self: "route", plugins: [] });
  try {
    assert.equal(buildContext("startup", fixture.env), THIN_OPENER);
    assert.equal(buildContext("resume", fixture.env), "");
  } finally {
    cleanup(fixture);
  }
});

// ---------------------------------------------------------------------------
// Emitted context
// ---------------------------------------------------------------------------

test("the table stays compressed — command, deficit and resolution names only", () => {
  const fixture = makeFixture(SUITE);
  try {
    const context = buildContext("startup", fixture.env);
    assert.ok(context.startsWith(THIN_OPENER));
    assert.match(context, new RegExp(`^${TABLE_HEADER}$`, "m"));
    assert.match(context, /^\/induce AbstractionInProcess → CrystallizedAbstraction$/m);
    // No prose: every table row is exactly "/command Deficit → Resolution".
    const rows = context.split("\n").slice(THIN_OPENER.split("\n").length + 1);
    assert.equal(rows.length, 3);
    for (const row of rows) assert.match(row, /^\/[a-z-]+ [A-Za-z]+ → [A-Za-z]+$/);
    assert.doesNotMatch(context, /Does a thing/);
  } finally {
    cleanup(fixture);
  }
});

test("the premise index follows the table on every source, its paths absolute", () => {
  const fixture = makeFixture({ ...SUITE, premise: true });
  try {
    const expected = [
      PREMISE_HEADER,
      PREMISE_INTRO,
      `Read \`${path.join(fixture.checkout, "premise", PREMISE_INDEX[0].file)}\` ${PREMISE_INDEX[0].when}`,
    ].join("\n");
    const startup = buildContext("startup", fixture.env);
    assert.ok(startup.startsWith(THIN_OPENER));
    assert.match(startup, new RegExp(`^${TABLE_HEADER}$`, "m"));
    assert.ok(startup.endsWith(`\n${expected}`), "the index closes the injection");
    // The table sits between opener and index, unchanged by the index.
    assert.equal(startup.indexOf(TABLE_HEADER) < startup.indexOf(PREMISE_HEADER), true);
    for (const source of ["resume", "compact"]) {
      const trimmed = buildContext(source, fixture.env);
      assert.ok(trimmed.startsWith(TABLE_HEADER), `${source} begins at the table`);
      assert.ok(trimmed.endsWith(`\n${expected}`), `${source} carries the index`);
    }
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
    const context = buildContext("compact", fixture.env);
    assert.ok(context.startsWith(PREMISE_HEADER));
    assert.doesNotMatch(context, new RegExp(TABLE_HEADER));
  } finally {
    cleanup(fixture);
  }
});

test("resume and compact carry the same table with no opener line", () => {
  const fixture = makeFixture(SUITE);
  try {
    const startup = buildContext("startup", fixture.env);
    const table = startup.slice(THIN_OPENER.length + 1);
    for (const source of ["resume", "compact"]) {
      const trimmed = buildContext(source, fixture.env);
      assert.ok(trimmed.startsWith(TABLE_HEADER), `${source} must begin at the header`);
      assert.doesNotMatch(trimmed, /^\[route\]/m);
      assert.equal(trimmed, table);
      assert.equal(trimmed.split("\n").length, 1 + 3);
    }
  } finally {
    cleanup(fixture);
  }
});

// ---------------------------------------------------------------------------
// Wire format
// ---------------------------------------------------------------------------

test("render carries opener and table as SessionStart additionalContext", () => {
  const fixture = makeFixture(SUITE);
  try {
    const out = JSON.parse(render(JSON.stringify({
      hook_event_name: "SessionStart",
      source: "resume",
      session_id: "s",
    }), fixture.env));
    assert.equal(out.hookSpecificOutput.hookEventName, "SessionStart");
    assert.equal(out.hookSpecificOutput.additionalContext, buildContext("resume", fixture.env));
    assert.equal(out.suppressOutput, true);
  } finally {
    cleanup(fixture);
  }
});

test("render on empty or malformed stdin reads as startup", () => {
  for (const raw of ["", "not json", "[1,2]"]) {
    const out = JSON.parse(render(raw, { configDir: "/nonexistent", pluginRoot: "/nonexistent" }));
    assert.equal(out.hookSpecificOutput.hookEventName, "SessionStart");
    assert.equal(out.hookSpecificOutput.additionalContext, THIN_OPENER);
  }
});

test("hook process exits 0 on empty stdin", () => {
  const result = runHook("", { CLAUDE_CONFIG_DIR: "/nonexistent" });
  assert.equal(result.status, 0);
  const out = JSON.parse(result.stdout);
  assert.equal(out.hookSpecificOutput.hookEventName, "SessionStart");
  assert.ok(out.hookSpecificOutput.additionalContext.startsWith("[route]"));
});

test("hook process exits 0 with empty context on a trimmed source with nothing to derive", () => {
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
    assert.match(out.hookSpecificOutput.additionalContext, /^\/bound BoundaryUndefined → DefinedBoundary$/m);
  } finally {
    cleanup(fixture);
  }
});
