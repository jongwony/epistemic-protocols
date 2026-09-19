// Tests for route-evaluator-eval.mjs — the scoring, not the scores.
// Run with: node --test

import { test } from "node:test";
import assert from "node:assert/strict";
import { correct, readCases, report, run, scoreOne, tally } from "./route-evaluator-eval.mjs";

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

test("a live run without a binding refuses rather than pretending", async () => {
  const out = await run({ live: true, cases: [] });
  assert.match(out.error, /config\/evaluator\.json enabled/);
  assert.match(report(out), /^error:/);
});

test("a live run without a key refuses rather than recording a non-observation", async () => {
  // The refusal message always claimed a key was required; only the config
  // was checked. Without one every case returned `no-key`, which is not
  // `no-answer`, so a null distribution was written over the case's
  // recording and scored as silence — a run that observed nothing, reported
  // as a run that observed silence.
  const config = {
    endpoint: "https://e.example/v1",
    apiKeyEnv: "ROUTE_TEST_ABSENT_KEY",
    model: "m",
    timeoutMs: 10,
    deadlineMs: 20,
    displayCutoff: 0.25,
    maxNames: 3,
  };
  const out = await run({ live: true, cases: [], env: {}, config });
  assert.match(out.error ?? "", /ROUTE_TEST_ABSENT_KEY/);
});

test("a recording whose fixture prompt has moved is reported, not scored", async () => {
  const kase = { id: "moved", outcome: "silence", prompt: "the new prompt", expected: [] };
  const out = await run({
    cases: [kase],
    readRecorded: () => ({
      id: "moved",
      model: "m",
      probabilities: { none: 0.9 },
      reason: "none",
      criteria: ["none"],
      promptDigest: "0000000000000000",
    }),
  });
  assert.equal(out.adjudicated.results.length + out.unadjudicated.results.length, 0);
  assert.equal(out.stale.length, 1);
  assert.match(report(out), /stale recordings/);
});

