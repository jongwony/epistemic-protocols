// Tests for route-smoke.mjs — that the checks can fail, not that they pass.
// A check which cannot report a broken arrow is not a check, and a smoke whose
// every assertion holds vacuously is the failure it exists to catch.
// Run with: node --test

import { test } from "node:test";
import assert from "node:assert/strict";
import { againstCanonical, domainFrom, probe, probeConversation, report, run, wiring } from "./route-smoke.mjs";

const BINDING = {
  endpoint: "https://e.example/v1",
  apiKeyEnv: "TYPESAFE_API_KEY",
  model: "m",
  timeoutMs: 10,
  deadlineMs: 20,
  displayCutoff: 0.25,
  maxNames: 3,
  stateTokenBudget: 28000,
};

const DOMAIN = [
  { command: "inquire", plugin: "aitesis", deficit: "ContextInsufficient", resolution: "InformedExecution", description: "d1" },
  { command: "ground", plugin: "analogia", deficit: "MappingUncertain", resolution: "ValidatedMapping", description: "d2" },
];

function checkFor(checks, name) {
  const found = checks.find((c) => c.check === name);
  assert.ok(found, `no check named ${name}; got ${checks.map((c) => c.check).join(" | ")}`);
  return found;
}

test("an empty domain is a broken arrow, not a clean run", () => {
  const checks = wiring([], BINDING);
  assert.equal(checks.length, 1);
  assert.equal(checks[0].ok, false);
});

test("a protocol with no declared resolution is reported, not passed over", () => {
  const checks = wiring([...DOMAIN, { command: "orphan", plugin: "x", deficit: "SomeDeficit", resolution: null }], BINDING);
  const declared = checkFor(checks, "every deficit names its resolution");
  assert.equal(declared.ok, false);
  assert.match(declared.detail, /orphan/);
});

test("the domain is checked against the registry by identity, not by size", () => {
  // Same size, wrong members: a count passes this and the check does not.
  const swapped = [
    { command: "inquire", plugin: "not-a-registered-plugin", deficit: "D", resolution: "R" },
  ];
  const verdict = againstCanonical(swapped);
  if (verdict === null) return; // not a checkout — the claim is left unmade
  assert.ok(verdict.absent.length > 0, "a missing registered protocol must be reported");
  assert.deepEqual(verdict.extra, ["not-a-registered-plugin"]);
});

test("this checkout's domain is the canonical protocol set", () => {
  const verdict = againstCanonical(domainFrom());
  if (verdict === null) return;
  assert.deepEqual(verdict.absent, [], "a registered protocol the discovery predicate missed");
  assert.deepEqual(verdict.extra, [], "a discovered plugin the registry does not carry");
});

test("the probe puts the deficit in the conversation and never in the prompt", () => {
  // The whole point of the probe: a prompt-only channel cannot pass it, which
  // is what makes a reach evidence that the accumulated context was sent.
  const [turn] = probeConversation(DOMAIN[0]);
  assert.equal(turn.role, "user");
  assert.match(turn.text, /ContextInsufficient → InformedExecution/);
});

test("a probe reaches only when the answer carries that protocol's own name", async () => {
  const answers = {
    inquire: { advisory: "[x] This prompt may fit /inquire.", reason: "advised", turns: 1, model: "m" },
    ground: { advisory: "[x] This prompt may fit /inquire.", reason: "advised", turns: 1, model: "m" },
  };
  let sentTranscript = 0;
  const results = await probe(DOMAIN, {
    config: BINDING,
    env: {},
    adviseFn: async (prompt, options) => {
      // The hook is called with a path, so the derived budget and the walk are
      // crossed. A turn list here would step around both.
      if (typeof options.transcriptPath === "string" && options.transcriptPath) sentTranscript += 1;
      return answers[options.protocols.find((p) => options.transcriptPath.includes(p.command))?.command] ?? {};
    },
  });
  assert.equal(sentTranscript, DOMAIN.length);
  assert.equal(results.find((r) => r.command === "inquire").reached, true);
  // ground's own name did not come back, so its deficit did not reach its
  // resolution — a neighbour's name is not a reach.
  assert.equal(results.find((r) => r.command === "ground").reached, false);
});

test("a live run without a key refuses rather than reporting an unrun arm as silence", async () => {
  const out = await run({ live: true, env: {}, domain: DOMAIN, config: BINDING });
  assert.match(out.liveError, /TYPESAFE_API_KEY/);
  assert.equal(out.live, null);
  assert.match(report(out), /live arm: not run/);
});

test("a run with no binding on disk reports the wiring as broken rather than passing", async () => {
  const out = await run({ live: false, domain: DOMAIN, config: null });
  assert.ok(out.wiring.some((c) => !c.ok));
});

test("the report says when the host offers no protocols at all", async () => {
  const out = await run({ live: false, domain: DOMAIN, config: BINDING });
  const text = report(out);
  // Silent-by-design is the hazard: a host whose layout the derivation cannot
  // read yields an empty table and an empty answer space and says nothing.
  assert.match(text, out.installed.length === 0 ? /installed set on this host: empty/ : /installed set on this host: /);
});
