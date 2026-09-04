// Tests for route-session.mjs — the SessionStart injection of the derived
// deficit table, under an opener on thin sources only — and for the
// derivation in route-protocols.mjs it carries.
// Run with: node --test
// Repo precedent: anamnesis/scripts/hypomnesis-write.test.mjs (node:test + node:assert).

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
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
    env: { ...process.env, CLAUDE_CODE_ENABLE_FUNCTION_HOOKS: "", ...env },
  });
}

// Whether the hook yields to the route-module plugin's hooks module is
// covered in route-yield.test.mjs, against a fixture config directory.

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

  const selfRoot = path.join(cache, spec.self ?? "route", "1.0.0");
  return { root, configDir, pluginRoot: selfRoot, env: { configDir, pluginRoot: selfRoot } };
}

function protocolSkill(name, deficit, extra = "") {
  return [
    "---",
    `name: ${name}`,
    `description: "Does a thing.${extra}"`,
    "---",
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
    { name: "route", skills: [{ dir: "route", body: protocolSkill("route", "DeficitUnrouted") }] },
    { name: "periagoge", skills: [{ dir: "induce", body: protocolSkill("induce", "AbstractionInProcess") }] },
    { name: "horismos", skills: [{ dir: "bound", body: protocolSkill("bound", "BoundaryUndefined") }] },
    { name: "anamnesis", skills: [{ dir: "recollect", body: protocolSkill("recollect", "RecallAmbiguous") }] },
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

// ---------------------------------------------------------------------------
// Derivation
// ---------------------------------------------------------------------------

test("derives one row per installed single-skill protocol, route excluded", () => {
  const fixture = makeFixture(SUITE);
  try {
    const rows = deriveProtocols(fixture.env);
    assert.deepEqual(rows, [
      { command: "recollect", deficit: "RecallAmbiguous" },
      { command: "bound", deficit: "BoundaryUndefined" },
      { command: "induce", deficit: "AbstractionInProcess" },
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
          { dir: "catalog", body: protocolSkill("catalog", "DeficitUnrecognized") },
          { dir: "steer", body: protocolSkill("steer", "CalibrationDriftOpaque") },
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
    assert.doesNotMatch(bodies, /Type:\s*\(/);
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
        skills: [{ dir: "wander", body: protocolSkill("wander", "SomethingElse") }],
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

test("the table stays compressed — command and deficit name only", () => {
  const fixture = makeFixture(SUITE);
  try {
    const context = buildContext("startup", fixture.env);
    assert.ok(context.startsWith(THIN_OPENER));
    assert.match(context, new RegExp(`^${TABLE_HEADER}$`, "m"));
    assert.match(context, /^\/induce AbstractionInProcess$/m);
    // No prose: every table row is exactly "/command Deficit".
    const rows = context.split("\n").slice(THIN_OPENER.split("\n").length + 1);
    assert.equal(rows.length, 3);
    for (const row of rows) assert.match(row, /^\/[a-z-]+ [A-Za-z]+$/);
    assert.doesNotMatch(context, /Does a thing/);
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
    assert.match(out.hookSpecificOutput.additionalContext, /^\/bound BoundaryUndefined$/m);
  } finally {
    cleanup(fixture);
  }
});
