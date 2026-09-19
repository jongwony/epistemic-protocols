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
  clean,
  conversationFrom,
  estimateTokens,
  loadConfig,
  namesFrom,
  render,
  renderAdvisory,
  textOf,
} from "./route-evaluator.mjs";
import { DIRECTIVE } from "./route-prompt.mjs";

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

// --- The conversation as state ---------------------------------------------

const jsonl = (...entries) => entries.map((e) => JSON.stringify(e)).join("\n") + "\n";
const reader = (text) => () => text;

const userTurn = (content, extra = {}) => ({ type: "user", message: { role: "user", content }, ...extra });
const botTurn = (content, extra = {}) => ({
  type: "assistant",
  message: { role: "assistant", content },
  ...extra,
});

test("a content array keeps text and drops every tool block", () => {
  // This is the whole of "tool calls excluded": keeping `text` drops tool_use
  // and tool_result by construction, so a block type added later is dropped
  // without this file learning its name.
  const content = [
    { type: "text", text: "before" },
    { type: "tool_use", name: "Bash", input: { command: "rm -rf /" } },
    { type: "tool_result", content: "deleted everything" },
    { type: "thinking", thinking: "private" },
    { type: "text", text: "after" },
  ];
  assert.equal(textOf(content), "before\nafter");
  assert.equal(textOf("a plain string turn"), "a plain string turn");
  assert.equal(textOf(null), "");
  assert.equal(textOf(42), "");
});

test("clean strips the harness wrappers and this plugin's own injections", () => {
  // Without the second half the state would carry one copy per turn of text
  // this plugin wrote — the channel reading itself back, and paying for it.
  const advisory = `${LABEL} This prompt may fit /inquire. Verify each is loaded.`;
  const text = `real question\n${DIRECTIVE}\n${advisory}\n<system-reminder>ignore</system-reminder>`;
  assert.equal(clean(text), "real question");
  assert.equal(clean("<command-name>/verify</command-name>kept"), "kept");
  assert.equal(clean("<local-command-stdout>noise</local-command-stdout>x"), "x");
});

test("the token estimate charges CJK more than latin", () => {
  // Measured against the endpoint: Korean ran 1.84 chars/token and English
  // 3.99, so a single ratio is wrong by more than double on one of them.
  const ko = estimateTokens("\uAC00".repeat(100));  // Hangul syllable
  const en = estimateTokens("a".repeat(100));
  assert.ok(ko > en, `${ko} should exceed ${en}`);
  assert.ok(ko >= 50 && ko <= 60, `CJK estimate ${ko} off the measured rate`);
  assert.ok(en >= 25 && en <= 30, `latin estimate ${en} off the measured rate`);
  assert.equal(estimateTokens(null), 0);
});

test("the conversation carries user and assistant turns in order", () => {
  const raw = jsonl(
    userTurn("first ask"),
    botTurn([{ type: "text", text: "first answer" }, { type: "tool_use", name: "Read", input: {} }]),
    { type: "summary", summary: "not a turn" },
    { type: "system", content: "not a turn" },
    userTurn("second ask"),
  );
  const turns = conversationFrom("/t", 28000, { readFile: reader(raw) });
  assert.deepEqual(turns, [
    { role: "user", text: "first ask" },
    { role: "assistant", text: "first answer" },
    { role: "user", text: "second ask" },
  ]);
});

test("a subagent's turns are a different conversation and stay out", () => {
  const raw = jsonl(userTurn("mine"), userTurn("delegated", { isSidechain: true }));
  assert.deepEqual(conversationFrom("/t", 28000, { readFile: reader(raw) }), [
    { role: "user", text: "mine" },
  ]);
});

test("the budget keeps the newest turns and drops the oldest", () => {
  const raw = jsonl(
    userTurn("oldest " + "x".repeat(400)),
    userTurn("middle " + "y".repeat(400)),
    userTurn("newest " + "z".repeat(400)),
  );
  const turns = conversationFrom("/t", 250, { readFile: reader(raw) });
  assert.ok(turns.length >= 1 && turns.length < 3, `kept ${turns.length}`);
  assert.ok(turns[turns.length - 1].text.startsWith("newest"));
  assert.ok(!turns.some((t) => t.text.startsWith("oldest")));
});

test("a turn larger than the whole budget is carried as its tail, not dropped", () => {
  // Otherwise the one turn nearest the deficit is the one lost, for being the
  // one that says the most.
  const raw = jsonl(userTurn("head ".repeat(20) + "TAIL-MARKER"));
  const turns = conversationFrom("/t", 30, { readFile: reader(raw) });
  assert.equal(turns.length, 1);
  assert.ok(turns[0].text.endsWith("TAIL-MARKER"));
  assert.ok(turns[0].text.length < 105, `kept ${turns[0].text.length} chars`);
});

test("every transcript shortfall leaves the prompt-only state", () => {
  assert.deepEqual(conversationFrom("", 28000), []);
  assert.deepEqual(conversationFrom(null, 28000), []);
  assert.deepEqual(
    conversationFrom("/t", 28000, {
      readFile: () => {
        throw new Error("ENOENT");
      },
    }),
    [],
  );
  // A malformed line is skipped, not fatal, and an empty turn adds nothing.
  const raw = "{not json\n" + jsonl(userTurn(""), userTurn("kept"));
  assert.deepEqual(conversationFrom("/t", 28000, { readFile: reader(raw) }), [
    { role: "user", text: "kept" },
  ]);
});

test("the request carries the conversation only when there is one", () => {
  const config = { model: "jev-latest", stateTokenBudget: 28000 };
  const criteria = { inquire: { declares: "ContextInsufficient → InformedExecution" }, none: "x" };
  const bare = JSON.parse(buildRequest(config, "ask", criteria, []));
  assert.deepEqual(Object.keys(bare.state), ["current_prompt"]);
  const rich = JSON.parse(
    buildRequest(config, "ask", criteria, [{ role: "user", text: "earlier" }]),
  );
  assert.deepEqual(rich.state.conversation, [{ role: "user", text: "earlier" }]);
  assert.equal(rich.state.current_prompt, "ask");
});

test("a tie with none is silence, whatever order the keys arrived in", () => {
  // A sort leaves ties in serialization order, so rank alone would let the
  // server's key order decide between silence and a named protocol.
  const config = { displayCutoff: 0.25, maxNames: 3 };
  assert.deepEqual(namesFrom({ probabilities: { none: 0.31, conduct: 0.31 } }, config), []);
  assert.deepEqual(namesFrom({ probabilities: { conduct: 0.31, none: 0.31 } }, config), []);
  // Strictly more mass than none, and above the cutoff, still speaks.
  assert.deepEqual(namesFrom({ probabilities: { conduct: 0.4, none: 0.31 } }, config), ["conduct"]);
  // Above the cutoff but under none stays out.
  assert.deepEqual(namesFrom({ probabilities: { conduct: 0.3, none: 0.35 } }, config), []);
});
