// Tests for the mapping smoke and for the conversation reaching the request.
//
// The assertion that carries the most here is the one on the request body. A
// harness that calls `advise` and gets an answer back is green whether or not
// the conversation was ever offered — the shortfall path returns an answer too.
// So the body is read, and the turns are looked for inside it.
//
// Run with: node --test

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { advise } from "./route-evaluator.mjs";
import { digestText, digestTurns, transcriptLines, transcriptWorkspace, turnProblems } from "./route-eval-transcript.mjs";
import { coverage, failed, readCases, reached, report, run } from "./route-evaluator-smoke.mjs";
import { run as runEval } from "./route-evaluator-eval.mjs";
import { shippedKeyEnv } from "./route-test-env.mjs";

const KEY_ENV = shippedKeyEnv();

const BINDING = {
  endpoint: "https://e.example/v1",
  apiKeyEnv: KEY_ENV,
  model: "m",
  timeoutMs: 10,
  deadlineMs: 20,
  displayCutoff: 0.25,
  maxNames: 3,
  stateTokenBudget: 28000,
};

const PROTOCOLS = [
  { command: "inquire", deficit: "ContextInsufficient", resolution: "InformedExecution", description: "d" },
  { command: "ground", deficit: "MappingUncertain", resolution: "ValidatedMapping", description: "d" },
];

const TURNS = [
  { role: "user", text: "the earliest turn" },
  { role: "assistant", text: "the reply to it" },
];

/** A transport that records what it was handed and answers a fixed distribution. */
function capturing(probabilities) {
  const sent = [];
  return {
    sent,
    ask: (config, key, body) => {
      sent.push(JSON.parse(body));
      return Promise.resolve({ model: "m", answers: { deficit: { probabilities } } });
    },
  };
}

test("a transcript path carries the conversation into the request state", async () => {
  // The whole of item 2: without this the harness sends a one-line prompt and
  // every measurement is of the prompt-only state.
  const workspace = transcriptWorkspace("route-smoke-test-");
  try {
    const file = workspace.write("case", TURNS);
    const { sent, ask } = capturing({ inquire: 0.8, none: 0.1 });
    const result = await advise("the current turn", {
      config: BINDING,
      env: { [KEY_ENV]: "k" },
      protocols: PROTOCOLS,
      transcriptPath: file,
      ask,
    });
    assert.equal(sent.length, 1);
    const state = sent[0].state;
    assert.equal(state.current_prompt, "the current turn");
    assert.ok(Array.isArray(state.conversation), "the request carried no conversation");
    assert.deepEqual(
      state.conversation.map((t) => [t.role, t.text]),
      TURNS.map((t) => [t.role, t.text]),
      "the turns did not arrive in order",
    );
    assert.equal(result.turns, TURNS.length);
  } finally {
    workspace.cleanup();
  }
});

test("passing the turns as an array instead would skip the walk the channel runs", async () => {
  // Stated as a test because the two look interchangeable at the call site and
  // are not: the array is taken as a state already assembled, so nothing
  // derives a budget or strips what the harness wrapped around a turn.
  const { sent, ask } = capturing({ none: 0.9 });
  await advise("p", {
    config: BINDING,
    env: { [KEY_ENV]: "k" },
    protocols: PROTOCOLS,
    conversation: [{ role: "user", text: "<system-reminder>dropped by clean()</system-reminder>kept" }],
    ask,
  });
  assert.match(
    sent[0].state.conversation[0].text,
    /system-reminder/,
    "an array reached the request unwalked, which is what makes it the wrong thing to pass",
  );
});

test("the eval harness sends a fixture's conversation, not the prompt alone", async () => {
  // This is the assertion the harness's own defect was hiding behind. Watching
  // the transcript get written passes whether or not its path is handed on —
  // the file existed and the state still went out with the prompt alone. So
  // what is read here is the request body.
  const { sent, ask } = capturing({ inquire: 0.8, none: 0.1 });
  const out = await runEval({
    live: true,
    cases: [
      { id: "with-turns", outcome: "singleton", prompt: "the current turn", expected: ["inquire"], adjudicated: false, conversation: TURNS },
      { id: "no-turns", outcome: "silence", prompt: "prompt only", expected: [], adjudicated: false },
    ],
    env: { [KEY_ENV]: "k" },
    config: BINDING,
    // Stated rather than read from disk: the domain a worktree derives depends
    // on the worktree's own directory name, and a test that leaves it to disk
    // passes or fails on where it was run from.
    protocols: PROTOCOLS,
    ask,
    writeRecorded: () => {},
    readRecorded: () => null,
  });
  assert.equal(sent.length, 2);
  const withTurns = sent[0].state;
  assert.equal(withTurns.current_prompt, "the current turn");
  assert.ok(Array.isArray(withTurns.conversation), "the fixture's conversation never reached the request");
  assert.deepEqual(
    withTurns.conversation.map((t) => [t.role, t.text]),
    TURNS.map((t) => [t.role, t.text]),
  );
  // A case carrying no turns is still the prompt-only state, and stays it.
  assert.equal(sent[1].state.conversation, undefined);
  assert.equal(out.unadjudicated.results.length, 2);
  assert.equal(out.unadjudicated.results[0].turns, TURNS.length);
  assert.equal(out.unadjudicated.results[1].turns, 0);
});

test("the eval harness writes the transcript in the shape the walk reads", async () => {
  const seen = [];
  const workspace = transcriptWorkspace("route-eval-test-");
  const { ask } = capturing({ none: 0.9 });
  try {
    await runEval({
      live: true,
      cases: [{ id: "with-turns", outcome: "silence", prompt: "p", expected: [], conversation: TURNS }],
      env: { [KEY_ENV]: "k" },
      config: BINDING,
      protocols: PROTOCOLS,
      ask,
      writeRecorded: () => {},
      readRecorded: () => null,
      makeWorkspace: () => ({
        dir: workspace.dir,
        write: (id, turns) => {
          const file = workspace.write(id, turns);
          seen.push(file);
          return file;
        },
        cleanup: () => {},
      }),
    });
    assert.equal(seen.length, 1);
    const written = fs.readFileSync(seen[0], "utf8").trim().split("\n").map((l) => JSON.parse(l));
    assert.deepEqual(written.map((e) => e.type), ["user", "assistant"]);
  } finally {
    workspace.cleanup();
  }
});

test("the smoke sends a case's conversation too, and reads reach off the answer", async () => {
  const { sent, ask } = capturing({ ground: 0.6, grasp: 0.3, none: 0.1 });
  const out = await run({
    live: true,
    cases: [{ id: "reach-ground", protocol: "ground", conversation: TURNS, prompt: "walk it", note: "n" }],
    env: { [KEY_ENV]: "k" },
    config: BINDING,
    protocols: PROTOCOLS,
    ask,
    writeRecorded: () => {},
    readRecorded: () => null,
  });
  assert.deepEqual(
    sent[0].state.conversation.map((t) => t.text),
    TURNS.map((t) => t.text),
    "the smoke sent the prompt alone",
  );
  assert.equal(out.results.length, 1);
  assert.ok(out.results[0].reached);
  assert.equal(out.results[0].turns, TURNS.length);
  // A protocol the answer space never carried cannot have been reached, and
  // the coverage check is what says so rather than the verdict.
  assert.deepEqual(out.gaps.uncovered, ["inquire"]);
});

test("a recording made before the fixture carried turns is stale, not scored", async () => {
  const kase = { id: "grew", outcome: "silence", prompt: "p", expected: [], conversation: TURNS };
  const out = await runEval({
    cases: [kase],
    readRecorded: () => ({
      id: "grew",
      model: "m",
      probabilities: { none: 0.9 },
      reason: "none",
      criteria: ["none"],
      promptDigest: null,
    }),
  });
  assert.equal(out.stale.length, 1);
  assert.match(out.stale[0].why, /conversation changed/);
  // Absence of the digest is read as "no conversation was offered", which is
  // what was true when a recording without one was made.
  assert.equal(out.unadjudicated.results.length, 0);
});

test("a malformed conversation is reported as a fixture defect, not dropped", async () => {
  const out = await runEval({
    cases: [{ id: "bad", outcome: "silence", prompt: "p", expected: [], conversation: [{ role: "system", text: "x" }] }],
  });
  assert.equal(out.skipped.length, 1);
  assert.match(out.skipped[0].why, /malformed/);
  assert.deepEqual(turnProblems([{ role: "user", text: "" }]), ["turn 0 has no text"]);
  assert.deepEqual(turnProblems(undefined), []);
});

test("the transcript is written in the shape conversationFrom reads", () => {
  const entries = transcriptLines(TURNS).split("\n").map((l) => JSON.parse(l));
  for (const e of entries) {
    assert.ok(e.type === "user" || e.type === "assistant");
    assert.equal(e.isSidechain, false);
    assert.equal(e.message.content[0].type, "text");
  }
});

test("each of the three ways the question can move is caught, not just the conversation", async () => {
  // Checking one of them lets the other two replay silently — a stale answer
  // reported as a current observation.
  const kase = { id: "k", protocol: "inquire", conversation: TURNS, prompt: "the prompt", note: "n" };
  const current = {
    id: "k",
    probabilities: { inquire: 0.9, none: 0.05 },
    criteria: ["inquire", "ground", "none"],
    conversationDigest: digestTurns(TURNS),
    promptDigest: digestText("the prompt"),
  };
  const of = async (record, k = kase) =>
    run({ cases: [k], protocols: PROTOCOLS, config: BINDING, readRecorded: () => record });

  // Nothing moved: the recording is scored.
  assert.equal((await of(current)).results.length, 1);

  // The prompt moved.
  const promptMoved = await of(current, { ...kase, prompt: "a different prompt" });
  assert.match(promptMoved.stale[0]?.why ?? "", /prompt changed/);

  // The conversation moved.
  const turnsMoved = await of(current, { ...kase, conversation: [...TURNS].reverse() });
  assert.match(turnsMoved.stale[0]?.why ?? "", /conversation changed/);

  // A protocol's declared text moved, which moves every case at once.
  const declMoved = await of({ ...current, criteriaDigest: digestText("{\"was\":\"something else\"}") });
  assert.match(declMoved.stale[0]?.why ?? "", /declared text changed/);

  // A recording made before a digest existed reads as the value that was true
  // then, so a fixture that has since grown one is stale rather than regraded.
  const noDigests = await of({ ...current, promptDigest: undefined, conversationDigest: undefined });
  assert.equal(noDigests.stale.length, 1);
});

test("a digest distinguishes a changed conversation from an absent one", () => {
  assert.notEqual(digestTurns(TURNS), digestTurns([]));
  assert.equal(digestTurns(undefined), digestTurns([]));
  assert.notEqual(digestTurns(TURNS), digestTurns([...TURNS].reverse()));
});

test("reach is membership, and the control reaches by carrying no name", () => {
  assert.ok(reached({ protocol: "ground" }, ["ground"]));
  // A second name beside the right one is not a reach failure — whether it is
  // a failure of anything is the eval's question, not this one's.
  assert.ok(reached({ protocol: "ground" }, ["ground", "grasp"]));
  assert.ok(!reached({ protocol: "ground" }, ["grasp"]));
  assert.ok(!reached({ protocol: "ground" }, []));
  assert.ok(reached({ protocol: null }, []));
  assert.ok(!reached({ protocol: null }, ["inquire"]));
});

test("coverage names both directions of a domain mismatch", () => {
  const gaps = coverage(
    [{ protocol: "inquire" }, { protocol: "sketch" }, { protocol: null }],
    [{ command: "inquire" }, { command: "ground" }],
  );
  assert.deepEqual(gaps.uncovered, ["ground"]);
  assert.deepEqual(gaps.unknown, ["sketch"]);
});

test("a run that observed nothing does not pass", () => {
  // A skip is not a reach. The run is green only when every case in the domain
  // was answered and landed.
  const clean = { results: [{ reached: true }], gaps: { uncovered: [], unknown: [] }, skipped: [], stale: [] };
  assert.equal(failed(clean), false);
  assert.equal(failed({ ...clean, skipped: [{ id: "x", why: "y" }] }), true);
  assert.equal(failed({ ...clean, stale: [{ id: "x", why: "y" }] }), true);
  assert.equal(failed({ ...clean, gaps: { uncovered: ["ground"], unknown: [] } }), true);
  assert.equal(failed({ ...clean, results: [{ reached: false }] }), true);
  assert.equal(failed({ error: "no binding" }), true);
});

test("a live smoke without a key refuses rather than recording a non-observation", async () => {
  const out = await run({ live: true, cases: [], env: {}, config: BINDING, protocols: PROTOCOLS });
  assert.match(out.error ?? "", new RegExp(KEY_ENV));
  assert.match(report(out), /^error:/);
});

test("an empty domain refuses rather than reporting a vacuous pass", async () => {
  // The domain is read from disk, so a checkout whose plugin root does not
  // resolve to the installed marketplace derives nothing. Reporting zero of
  // zero reached would read as a clean run.
  const out = await run({ live: false, cases: readCases(), protocols: [] });
  assert.match(out.error ?? "", /domain is empty/);
});

test("the shipped smoke fixtures state their construction and name one target each", () => {
  const cases = readCases();
  assert.ok(cases.length > 1, `expected a real set, got ${cases.length}`);
  const ids = new Set();
  let controls = 0;
  for (const c of cases) {
    assert.ok(typeof c.id === "string" && c.id, "a case has no id");
    assert.ok(!ids.has(c.id), `${c.id} appears twice`);
    ids.add(c.id);
    // The note is what carries the claim the smoke actually makes — that the
    // context was built to show this deficit. Without it the case asserts a
    // routing judgement it is not entitled to.
    assert.ok(typeof c.note === "string" && c.note.length > 0, `${c.id} has no note`);
    assert.ok(typeof c.prompt === "string" && c.prompt.trim(), `${c.id} has no prompt`);
    assert.deepEqual(turnProblems(c.conversation), [], `${c.id} has a malformed conversation`);
    assert.ok(Array.isArray(c.conversation) && c.conversation.length > 0, `${c.id} carries no conversation`);
    assert.ok(c.protocol === null || (typeof c.protocol === "string" && c.protocol), `${c.id} names no target`);
    if (c.protocol === null) controls += 1;
  }
  assert.equal(controls, 1, "the set needs exactly one settled-ground control");
});

test("the workspace cleans up after itself", () => {
  const workspace = transcriptWorkspace("route-smoke-cleanup-");
  const file = workspace.write("x", TURNS);
  assert.ok(fs.existsSync(file));
  // A case with no turns is offered no path, so nothing is written for it.
  assert.equal(workspace.write("empty", []), "");
  workspace.cleanup();
  assert.equal(fs.existsSync(workspace.dir), false);
  assert.ok(workspace.dir.startsWith(fs.realpathSync(os.tmpdir())) || workspace.dir.includes(path.sep));
});
