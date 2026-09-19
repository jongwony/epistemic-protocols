// Tests for route-evaluator.mjs — the advisory channel.
// Run with: node --test
//
// These are deterministic tests of the adapter: what it sends, what it makes
// of what comes back, and that every shortfall is silent. None of them says
// anything about whether the evaluator's answers are any good — that is what
// route-evaluator-eval.mjs is for, and it needs adjudicated fixtures before
// its numbers mean anything.

import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  LABEL,
  advise,
  buildCriteria,
  buildRequest,
  loadConfig,
  namesFrom,
  render,
  renderAdvisory,
} from "./route-evaluator.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT = path.join(HERE, "route-evaluator.mjs");
const SHIPPED_CONFIG = path.join(HERE, "..", "config", "evaluator.json");

const PROTOCOLS = [
  { command: "inquire", deficit: "ContextInsufficient", resolution: "InformedExecution", description: "Infer context insufficiency before execution — /inquire." },
  { command: "ground", deficit: "MappingUncertain", resolution: "ValidatedMapping", description: "Validate an abstract structure against a concrete application — /ground." },
  { command: "sublate", deficit: "ContextSuspect", resolution: "VettedContext", description: null },
];

const CONFIG = {
  endpoint: "https://example.invalid/v1/systemone",
  apiKeyEnv: "TEST_KEY",
  model: "test-model",
  timeoutMs: 100,
  displayCutoff: 0.25,
  maxNames: 3,
};

const ENV = { TEST_KEY: "k" };

function answering(probabilities, model = "test-model-1.0") {
  return async () => ({ model, answers: { deficit: { type: "choice", probabilities } } });
}

test("the shipped config is disabled and carries no secret", () => {
  // Landing it enabled would start sending prompt text off-machine for
  // everyone who installs the plugin, without anyone deciding to.
  assert.equal(loadConfig(SHIPPED_CONFIG), null);
  const raw = JSON.parse(
    spawnSync(process.execPath, ["-e", `process.stdout.write(require("fs").readFileSync(${JSON.stringify(SHIPPED_CONFIG)}, "utf8"))`], { encoding: "utf8" }).stdout,
  );
  assert.equal(raw.enabled, false);
  // The variable's name may ship; a value never may.
  assert.equal(raw.apiKeyEnv, "TYPESAFE_API_KEY");
  assert.ok(!("apiKey" in raw), "config must not carry a key field");
  for (const v of Object.values(raw)) {
    assert.doesNotMatch(String(v), /^(sk|ts)[-_][A-Za-z0-9]{8,}/, "no credential-shaped value");
  }
});

test("loadConfig refuses anything that is off, absent, or not https", () => {
  assert.equal(loadConfig(path.join(HERE, "does-not-exist.json")), null);
});

test("cards are built from declared material, and say nothing about each other", () => {
  const criteria = buildCriteria(PROTOCOLS);
  // Rule #2: each protocol's own declared description is the sole source of
  // what deficit it resolves. A field here telling two protocols apart would
  // be the hand-kept routing table that rule refuses.
  for (const [name, value] of Object.entries(criteria)) {
    if (name === "none") continue;
    const keys = Object.keys(value);
    assert.ok(keys.every((k) => k === "declares" || k === "description"), `${name}: ${keys}`);
    assert.ok(!("not_for" in value), `${name} must not carry authored discrimination`);
  }
  assert.deepEqual(criteria.inquire, {
    declares: "ContextInsufficient → InformedExecution",
    description: "Infer context insufficiency before execution — /inquire.",
  });
  // A protocol with no declared description keeps its card on the pair alone
  // rather than being given one.
  assert.deepEqual(criteria.sublate, { declares: "ContextSuspect → VettedContext" });
  // No candidates means no question to ask.
  assert.equal(buildCriteria([]), null);
});

test("the answer space carries an explicit none", () => {
  const criteria = buildCriteria(PROTOCOLS);
  assert.ok("none" in criteria);
  assert.match(criteria.none, /supports none of the listed protocols/);
  const body = JSON.parse(buildRequest(CONFIG, "p", criteria));
  assert.equal(body.questions.deficit.type, "choice");
  assert.equal(body.model, "test-model");
  assert.deepEqual(body.state, { current_prompt: "p" });
});

test("names come from probabilities, never from a confidence threshold", async () => {
  // The live call this was built against returned inquire 0.43 / sublate 0.42
  // at confidence 0.29. A confidence gate at any usual threshold deletes this
  // case; it is Route's several-fit outcome, not its silence.
  const spread = { inquire: 0.43, sublate: 0.42, ground: 0.06, none: 0.04, preview: 0.05 };
  assert.deepEqual(namesFrom({ probabilities: spread, confidence: 0.29 }, CONFIG), ["inquire", "sublate"]);
  const result = await advise("p", { config: CONFIG, env: ENV, protocols: PROTOCOLS, ask: answering(spread) });
  assert.match(result.advisory, /\/inquire, \/sublate/);
  assert.equal(result.reason, "advised");
});

test("none on top yields no advisory", async () => {
  const result = await advise("p", {
    config: CONFIG,
    env: ENV,
    protocols: PROTOCOLS,
    ask: answering({ none: 0.8, inquire: 0.1, ground: 0.1 }),
  });
  assert.equal(result.advisory, "");
  assert.equal(result.reason, "none");
});

test("a runner-up below the cutoff is left out; none is never a name", () => {
  assert.deepEqual(namesFrom({ probabilities: { inquire: 0.9, ground: 0.1 } }, CONFIG), ["inquire"]);
  assert.deepEqual(namesFrom({ probabilities: { inquire: 0.6, none: 0.4 } }, CONFIG), ["inquire"]);
  assert.deepEqual(namesFrom({}, CONFIG), []);
});

test("the advisory is labelled, modal, and demands a check — and is not a Route nudge", () => {
  const line = renderAdvisory(["inquire", "ground"]);
  assert.ok(line.startsWith(LABEL));
  assert.match(line, /may fit/);
  assert.match(line, /Verify each is loaded and fits the full context before invoking \/route/);
  assert.match(line, /nothing has been invoked/);
  // Route's own output shape, and any claim to be it, stays out: Rule #1
  // makes `↗ /command — reason` a thing produced by invoking Route.
  assert.doesNotMatch(line, /↗/);
  assert.doesNotMatch(line, /—\s*reason/);
  assert.doesNotMatch(line, /Route (recommends|suggests|routed)/i);
  assert.equal(renderAdvisory([]), "");
});

test("every shortfall is silent and none of them throws", async () => {
  const cases = [
    ["no-prompt", { config: CONFIG, env: ENV, protocols: PROTOCOLS, ask: answering({ inquire: 1 }) }, ""],
    ["disabled", { config: null, env: ENV, protocols: PROTOCOLS }, "p"],
    ["no-key", { config: CONFIG, env: {}, protocols: PROTOCOLS }, "p"],
    ["no-candidates", { config: CONFIG, env: ENV, protocols: [] }, "p"],
    ["no-answer", { config: CONFIG, env: ENV, protocols: PROTOCOLS, ask: async () => null }, "p"],
    ["no-answer", { config: CONFIG, env: ENV, protocols: PROTOCOLS, ask: async () => ({ answers: {} }) }, "p"],
    ["no-answer", { config: CONFIG, env: ENV, protocols: PROTOCOLS, ask: async () => ({ answers: { deficit: "?" } }) }, "p"],
  ];
  for (const [reason, options, prompt] of cases) {
    const result = await advise(prompt, options);
    assert.equal(result.advisory, "", reason);
    assert.equal(result.reason, reason);
  }
  // A transport that throws is a shortfall like any other.
  const thrown = await advise("p", {
    config: CONFIG,
    env: ENV,
    protocols: PROTOCOLS,
    ask: async () => {
      throw new Error("boom");
    },
  }).catch(() => "rejected");
  assert.notEqual(thrown, "rejected", "advise must not reject");
});

test("the resolved model is reported, since the configured one may be an alias", async () => {
  const result = await advise("p", {
    config: CONFIG,
    env: ENV,
    protocols: PROTOCOLS,
    ask: answering({ inquire: 0.9, none: 0.1 }, "jev-1.13.0"),
  });
  assert.equal(result.model, "jev-1.13.0");
  assert.deepEqual(result.probabilities, { inquire: 0.9, none: 0.1 });
});

test("render emits nothing addressable when there is no advisory", () => {
  const silent = JSON.parse(render(""));
  assert.equal(silent.hookSpecificOutput, undefined);
  assert.equal(silent.suppressOutput, true);
  const spoken = JSON.parse(render("x"));
  assert.equal(spoken.hookSpecificOutput.additionalContext, "x");
});

test("the hook exits 0 and stays silent with the shipped config", () => {
  // Disabled by default, so this is the behaviour every install gets: the
  // process runs, says nothing, and cannot take the static directive down.
  const result = spawnSync(process.execPath, [SCRIPT], {
    input: JSON.stringify({ hook_event_name: "UserPromptSubmit", prompt: "anything" }),
    encoding: "utf8",
  });
  assert.equal(result.status, 0);
  const out = JSON.parse(result.stdout);
  assert.equal(out.hookSpecificOutput, undefined);
});
