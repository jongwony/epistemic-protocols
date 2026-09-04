// Tests for route-prompt.mjs — the UserPromptSubmit routing directive and
// the derived deficit table it screens against.
// Run with: node --test
// Repo precedent: anamnesis/scripts/hypomnesis-write.test.mjs (node:test + node:assert).

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  DIRECTIVE,
  TABLE_HEADER,
  buildContext,
  deriveProtocols,
  parsePayload,
  render,
} from "./route-prompt.mjs";

const SCRIPT = path.join(path.dirname(fileURLToPath(import.meta.url)), "route-prompt.mjs");

function runHook(input) {
  return spawnSync(process.execPath, [SCRIPT], { input, encoding: "utf8" });
}

// ---------------------------------------------------------------------------
// Fixture tree: a marketplace of plugins laid out the way installed_plugins
// records them, so derivation is exercised without touching the real install.
// ---------------------------------------------------------------------------

function skillFile(body) {
  return body;
}

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
      fs.writeFileSync(path.join(dir, "SKILL.md"), skillFile(skill.body));
    }
    if ((p.skills ?? []).length === 0) fs.mkdirSync(at, { recursive: true });
    plugins[`${p.name}@${p.marketplace ?? "mp"}`] = [
      { scope: "user", installPath: at, version: p.version ?? "1.0.0" },
    ];
    if (p.enabled !== false) enabledPlugins[`${p.name}@${p.marketplace ?? "mp"}`] = true;
    if (p.enabled === false) enabledPlugins[`${p.name}@${p.marketplace ?? "mp"}`] = false;
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
// Directive
// ---------------------------------------------------------------------------

test("directive carries the firing conditions and stays short", () => {
  // (a) the screen names the deficit, which the injected table makes
  //     evaluable at prompt time
  assert.match(DIRECTIVE, /accumulated context shows an interaction deficit/);
  assert.match(DIRECTIVE, /loaded core epistemic protocol resolves, invoke \/route/);
  // (b) active-protocol exclusion, with "active" defined in place: invoked
  //     and not yet converged/deactivated — leftover skill prose is not active
  assert.match(DIRECTIVE, /Skip while an epistemic protocol is active: invoked this session and not yet converged or deactivated/);
  assert.match(DIRECTIVE, /converged protocol's prose still in context does not make it active/);
  // (c) silence otherwise
  assert.match(DIRECTIVE, /Otherwise stay silent/);
  assert.ok(DIRECTIVE.split("\n").length <= 4);
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

test("missing settings or install record yields no table, never an error", () => {
  const fixture = makeFixture(SUITE);
  try {
    fs.rmSync(path.join(fixture.configDir, "settings.json"));
    assert.deepEqual(deriveProtocols(fixture.env), []);
    assert.equal(buildContext(fixture.env), DIRECTIVE);
  } finally {
    cleanup(fixture);
  }
});

test("malformed settings yields no table, never an error", () => {
  const fixture = makeFixture(SUITE);
  try {
    fs.writeFileSync(path.join(fixture.configDir, "settings.json"), "{ not json");
    assert.deepEqual(deriveProtocols(fixture.env), []);
    assert.equal(buildContext(fixture.env), DIRECTIVE);
  } finally {
    cleanup(fixture);
  }
});

test("an unrecognized plugin layout yields no table", () => {
  const fixture = makeFixture(SUITE);
  try {
    const stray = { configDir: fixture.configDir, pluginRoot: path.join(fixture.root, "nowhere") };
    assert.deepEqual(deriveProtocols(stray), []);
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
    const context = buildContext(fixture.env);
    assert.ok(context.startsWith(DIRECTIVE));
    assert.match(context, new RegExp(`^${TABLE_HEADER}$`, "m"));
    assert.match(context, /^\/induce AbstractionInProcess$/m);
    // No prose: every table row is exactly "/command Deficit".
    const rows = context.split("\n").slice(DIRECTIVE.split("\n").length + 1);
    for (const row of rows) assert.match(row, /^\/[a-z-]+ [A-Za-z]+$/);
    assert.doesNotMatch(context, /Does a thing/);
  } finally {
    cleanup(fixture);
  }
});

test("no derived protocol means the directive goes out alone", () => {
  const fixture = makeFixture({ self: "route", plugins: [] });
  try {
    assert.equal(buildContext(fixture.env), DIRECTIVE);
  } finally {
    cleanup(fixture);
  }
});

// ---------------------------------------------------------------------------
// Wire format
// ---------------------------------------------------------------------------

test("parsePayload tolerates empty and malformed stdin", () => {
  assert.deepEqual(parsePayload(""), {});
  assert.deepEqual(parsePayload("not json"), {});
  assert.deepEqual(parsePayload(undefined), {});
  assert.deepEqual(parsePayload("[1,2]"), [1, 2]);
});

test("render carries directive and table as UserPromptSubmit additionalContext", () => {
  const fixture = makeFixture(SUITE);
  try {
    const out = JSON.parse(render(JSON.stringify({
      hook_event_name: "UserPromptSubmit",
      prompt: "hello",
    }), fixture.env));
    assert.equal(out.hookSpecificOutput.hookEventName, "UserPromptSubmit");
    assert.equal(out.hookSpecificOutput.additionalContext, buildContext(fixture.env));
    assert.equal(out.suppressOutput, true);
  } finally {
    cleanup(fixture);
  }
});

test("render on empty stdin still yields the directive", () => {
  const out = JSON.parse(render(""));
  assert.equal(out.hookSpecificOutput.hookEventName, "UserPromptSubmit");
  assert.ok(out.hookSpecificOutput.additionalContext.includes("/route"));
});

test("hook process exits 0 with the directive on empty stdin", () => {
  const result = runHook("");
  assert.equal(result.status, 0);
  const out = JSON.parse(result.stdout);
  assert.ok(out.hookSpecificOutput.additionalContext.includes("/route"));
});

test("hook process exits 0 with the directive on a valid payload", () => {
  const result = runHook(JSON.stringify({
    session_id: "s",
    transcript_path: "/tmp/t.jsonl",
    hook_event_name: "UserPromptSubmit",
    prompt: "what next?",
  }));
  assert.equal(result.status, 0);
  const out = JSON.parse(result.stdout);
  assert.equal(out.hookSpecificOutput.hookEventName, "UserPromptSubmit");
  assert.ok(out.hookSpecificOutput.additionalContext.includes("/route"));
});
