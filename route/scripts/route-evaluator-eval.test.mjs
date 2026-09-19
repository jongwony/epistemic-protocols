// Tests for route-evaluator-eval.mjs — the scoring, not the scores.
// Run with: node --test

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { correct, readCases, report, run, scoreOne, stateDigest, tally, transcriptFor } from "./route-evaluator-eval.mjs";
import { advise, conversationFrom } from "./route-evaluator.mjs";
import { envWithoutKeys, shippedKeyEnv } from "./route-test-env.mjs";

const SCRIPT = path.join(path.dirname(fileURLToPath(import.meta.url)), "route-evaluator-eval.mjs");

test("correctness is set equality, not overlap", () => {
  assert.ok(correct(["inquire", "sublate"], ["sublate", "inquire"]));
  assert.ok(correct([], []));
  // A right name beside a wrong one is not a right advisory.
  assert.ok(!correct(["inquire"], ["inquire", "ground"]));
  // An advisory on a case whose answer is silence is the needless-advisory
  // failure, not a near miss.
  assert.ok(!correct([], ["inquire"]));
  assert.ok(!correct(["inquire"], []));
});

test("the baseline arm is the channel off, so silence cases start correct", () => {
  const silence = scoreOne({ expected: [] }, []);
  assert.equal(silence.cell, "right→right");
  const spoiled = scoreOne({ expected: [] }, ["inquire"]);
  assert.equal(spoiled.cell, "right→wrong");
  const repaired = scoreOne({ expected: ["inquire"] }, ["inquire"]);
  assert.equal(repaired.cell, "wrong→right");
  const missed = scoreOne({ expected: ["inquire"] }, ["ground"]);
  assert.equal(missed.cell, "wrong→wrong");
});

test("a correct silence turned into an advisory lands in the spoiled cell", () => {
  // The failure most easily lost in an aggregate, and the one the published
  // analogous result reports alongside its improvement.
  const { overall, baselineCorrect } = tally([
    { cell: "right→wrong", outcome: "silence", baselineRight: true },
    { cell: "right→right", outcome: "silence", baselineRight: true },
    { cell: "wrong→right", outcome: "singleton", baselineRight: false },
  ]);
  assert.equal(overall["right→wrong"], 1);
  assert.equal(baselineCorrect, 2);
});

test("unadjudicated cases are reported but never scored into a rate", async () => {
  const cases = [
    { id: "a", outcome: "silence", prompt: "p", expected: [], adjudicated: false },
    { id: "b", outcome: "singleton", prompt: "p", expected: ["inquire"], adjudicated: true },
  ];
  const out = await run({ live: false, cases });
  // Neither has a recorded answer, so both skip — the point is that the
  // partition exists and the report says so rather than averaging across it.
  assert.equal(out.skipped.length, 2);
  const text = report(out);
  assert.match(text, /adjudicated cases: 0/);
  assert.match(text, /every rate below is withheld/);
  assert.match(text, /no recorded answer; run with --live/);
});

test("the shipped fixtures cover every outcome and ship unadjudicated", () => {
  const cases = readCases();
  assert.ok(cases.length >= 8, `expected a real set, got ${cases.length}`);
  const outcomes = new Set(cases.map((c) => c.outcome));
  for (const o of ["silence", "singleton", "several", "monitor"]) {
    assert.ok(outcomes.has(o), `no fixture for ${o}`);
  }
  // Every case carries the field, and it is a boolean either way. Which
  // value it holds is the adjudicator's to set: evals/README.md tells an
  // independent reviewer to set it true, and a check that refuses that value
  // makes the documented next step fail the suite. What a static check can
  // decide here is that the field exists and is typed — whether the review
  // behind a `true` actually happened is not something this can read.
  for (const c of cases) {
    assert.equal(typeof c.adjudicated, "boolean", `${c.id} has no adjudicated flag`);
    assert.ok(typeof c.note === "string" && c.note.length > 0, `${c.id} has no note`);
    assert.ok(Array.isArray(c.expected), `${c.id} has no expected`);
  }
  // Silence cases must expect no names; they are where a needless advisory
  // shows up as spoiled.
  for (const c of cases.filter((c) => c.outcome === "silence" || c.outcome === "monitor")) {
    assert.deepEqual(c.expected, [], `${c.id} expects names`);
  }
});

const KEY_ENV = shippedKeyEnv();

const BINDING = {
  endpoint: "https://e.example/v1",
  apiKeyEnv: KEY_ENV,
  model: "m",
  timeoutMs: 10,
  deadlineMs: 20,
  displayCutoff: 0.25,
  maxNames: 3,
};

test("a live run without a binding refuses rather than pretending", async () => {
  const out = await run({ live: true, cases: [], env: {}, config: null });
  assert.match(out.error, /config\/evaluator\.json/);
  assert.match(report(out), /^error:/);
});

test("an omitted config resolves the binding from disk; an explicit null does not", async () => {
  // Omitting `config` is the CLI's own call and must read the binding off
  // disk; passing an explicit null is a caller saying there is none. The two
  // have to stay distinguishable, so both sides are asserted here.
  // `cases: []` keeps this off the network — the guards run, the loop does not.
  const omitted = await run({ live: true, cases: [], env: { [KEY_ENV]: "k" } });
  assert.ok(
    !/name an https endpoint/.test(omitted.error ?? ""),
    `omitting config must read the binding off disk, got: ${omitted.error}`,
  );

  const explicit = await run({ live: true, cases: [], env: { [KEY_ENV]: "k" }, config: null });
  assert.match(explicit.error ?? "", /name an https endpoint/);
});

test("the CLI reaches the key guard rather than refusing before it", () => {
  // End to end through the real entry point, on this checkout's binding with
  // no key: the refusal that comes back must be the key guard's, which is only
  // reachable once the binding has resolved. Clearing the credential alone
  // would not establish that nothing is sent — an inherited CLAUDE_PLUGIN_ROOT
  // selects another checkout's binding, whose own variable may be set and would
  // carry the guard past. `envWithoutKeys` fixes both.
  const result = spawnSync(process.execPath, [SCRIPT, "--live"], {
    encoding: "utf8",
    env: envWithoutKeys(),
  });
  assert.match(result.stdout, new RegExp(`live run needs a key in ${KEY_ENV}`));
});

test("a live run without a key refuses rather than recording a non-observation", async () => {
  // Without this check every case returned `no-key`, which is not
  // `no-answer`, so a null distribution was written over the case's
  // recording and scored as silence — a run that observed nothing, reported
  // as a run that observed silence.
  const out = await run({ live: true, cases: [], env: {}, config: BINDING });
  assert.match(out.error ?? "", new RegExp(KEY_ENV));
});

test("a recording whose fixture state has moved is reported, not scored", async () => {
  const kase = { id: "moved", outcome: "silence", prompt: "the new prompt", expected: [] };
  const out = await run({
    cases: [kase],
    readRecorded: () => ({
      id: "moved",
      model: "m",
      probabilities: { none: 0.9 },
      reason: "none",
      criteria: ["none"],
      stateDigest: "0000000000000000",
    }),
  });
  assert.equal(out.adjudicated.results.length + out.unadjudicated.results.length, 0);
  assert.equal(out.stale.length, 1);
  assert.match(report(out), /stale recordings/);
});

test("a conversation that moved moves the question exactly as a changed prompt does", () => {
  const base = { prompt: "p", conversation: [{ role: "user", text: "a" }] };
  assert.notEqual(stateDigest(base), stateDigest({ prompt: "p", conversation: [{ role: "user", text: "b" }] }));
  assert.notEqual(stateDigest(base), stateDigest({ prompt: "p" }));
  assert.equal(stateDigest(base), stateDigest({ prompt: "p", conversation: [{ role: "user", text: "a" }] }));
});

test("a recording made before the state carried the conversation is stale, not exempt", async () => {
  // The hole this closes: the old check skipped a recording with no digest,
  // so every answer recorded against a prompt alone would have been scored
  // against a fixture that now describes a session.
  const kase = { id: "old", outcome: "silence", prompt: "p", conversation: [{ role: "user", text: "a" }], expected: [] };
  const out = await run({
    cases: [kase],
    readRecorded: () => ({ id: "old", model: "m", probabilities: { none: 0.9 }, reason: "none", criteria: ["none"] }),
  });
  assert.equal(out.stale.length, 1);
  assert.match(out.stale[0].why, /before the state carried the conversation/);
});

test("a fixture's conversation becomes a transcript the shipped walk can read", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "route-eval-test-"));
  try {
    const file = transcriptFor(
      [{ role: "user", text: "the earliest" }, { role: "assistant", text: "a reply" }, { role: "nope", text: "dropped" }],
      dir,
    );
    // Read back through the channel's own walk rather than by parsing here:
    // what matters is that `conversationFrom` accepts what this writes.
    const walked = conversationFrom(file, 10_000);
    assert.deepEqual(walked.map((t) => t.role), ["user", "assistant"]);
    assert.equal(walked[0].text, "the earliest");
    // A case carrying nothing stays on the prompt-only state, on purpose.
    assert.equal(transcriptFor([], dir), "");
    assert.equal(transcriptFor(undefined, dir), "");
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("the fixture set describes sessions rather than lines", () => {
  // The defect this whole file was scoring around: the channel sends the
  // accumulated context, so a set whose cases are all one-liners measures a
  // state the channel never sends. Which cases carry turns is the fixture
  // author's call; that some do is what keeps the walk on the scored path.
  const cases = readCases();
  const withConversation = cases.filter((c) => Array.isArray(c.conversation) && c.conversation.length > 0);
  assert.ok(withConversation.length > 0, "no fixture carries a conversation");
  for (const c of withConversation) {
    for (const turn of c.conversation) {
      assert.ok(turn.role === "user" || turn.role === "assistant", `${c.id} carries a ${turn.role} turn`);
      assert.ok(typeof turn.text === "string" && turn.text.length > 0, `${c.id} carries an empty turn`);
    }
  }
  // A gate can only hold over something already said, so these two are the
  // cases a prompt-only fixture could not state at all.
  for (const c of cases.filter((c) => c.outcome === "monitor")) {
    assert.ok(
      Array.isArray(c.conversation) && c.conversation.length > 0,
      `${c.id} is a gate case with nothing behind it`,
    );
  }
});


test("a fixture's conversation reaches the request body through advise", async () => {
  // The claim the whole change rests on, asserted where it can fail: the
  // harness's own composition — write the case's turns, hand advise the path —
  // must put those turns in `state.conversation`. Before this, the call passed
  // neither, so every recorded answer was an answer about a prompt alone.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "route-eval-test-"));
  try {
    const kase = readCases().find((c) => Array.isArray(c.conversation) && c.conversation.length > 0);
    assert.ok(kase, "no fixture carries a conversation");
    const file = transcriptFor(kase.conversation, dir);
    let sent = null;
    const result = await advise(kase.prompt, {
      config: { ...BINDING, stateTokenBudget: 28000 },
      env: { [KEY_ENV]: "k" },
      protocols: [{ command: "inquire", deficit: "ContextInsufficient", resolution: "InformedExecution" }],
      transcriptPath: file,
      ask: (_config, _key, body) => {
        sent = JSON.parse(body);
        return Promise.resolve({ model: "m", answers: { deficit: { probabilities: { inquire: 0.9, none: 0.1 } } } });
      },
    });
    assert.equal(sent.state.current_prompt, kase.prompt);
    assert.equal(sent.state.conversation.length, kase.conversation.length);
    assert.deepEqual(sent.state.conversation.map((t) => t.text), kase.conversation.map((t) => t.text));
    assert.equal(result.turns, kase.conversation.length);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
