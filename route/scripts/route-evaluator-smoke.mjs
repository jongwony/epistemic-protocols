#!/usr/bin/env node
/**
 * Does the mapping reach? One context per installed protocol, constructed to
 * show that protocol's deficit, put through the live channel to see whether
 * the protocol's own name comes back.
 *
 * This is a smoke run, and the difference from `route-evaluator-eval.mjs` is
 * what it claims rather than how it is wired:
 *
 *   - The eval asks whether the advisory *helps*. That needs a label saying
 *     what a correct advisory would carry, which is a person's judgement, and
 *     the shipped labels are unadjudicated — so every rate there is withheld.
 *   - This asks only whether each element of the domain lands on its own
 *     element of the codomain. "This context shows deficit X" is true by the
 *     construction of the context, and the `note` on each case states the
 *     construction. No claim is made that X is the *right* routing for it.
 *
 * So a failure here is a wiring failure — a protocol whose declared material
 * does not separate it enough for its own constructed context to reach it, or
 * a channel that did not answer — and not a verdict on the advisory's value.
 *
 * The verdict per case is membership, not set equality: the protocol's name is
 * among the names the advisory would carry. A second name beside it is not a
 * failure of reach; whether it is a failure of anything is the eval's question.
 *
 * The domain is what `deriveProtocols()` returns — installed and enabled, read
 * from disk — compared by identity against the fixtures. A derived protocol
 * with no case, and a case naming no derived protocol, are both reported and
 * both fail the run. Nothing here counts protocols.
 *
 *   node route/scripts/route-evaluator-smoke.mjs            # replay recorded answers
 *   TYPESAFE_API_KEY=… node route/scripts/route-evaluator-smoke.mjs --live
 *
 * A live run reads the key from the variable config/evaluator.json names — the
 * same one that arms the session channel, so running it is the same consent
 * (route/README.md states what this project counts as consent and the two
 * mechanical ways to withhold it). Assigning the variable inline, as above,
 * arms this command and nothing else: a session already running does not see
 * it, and neither does a session started from a shell that never exported it.
 *
 * Zero external dependencies: Node.js standard library only.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { advise, buildCriteria, loadConfig, namesFrom } from "./route-evaluator.mjs";
import { digestTurns, transcriptWorkspace, turnProblems } from "./route-eval-transcript.mjs";
import { deriveProtocols, isMain } from "./route-protocols.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const EVALS = path.join(HERE, "..", "evals");
const CASES = path.join(EVALS, "cases", "smoke.json");
const RECORDED = path.join(EVALS, "smoke-recorded");

/** The case that expects no name: settled ground, and `none` on top. */
const CONTROL = null;

function readCases(file = CASES) {
  try {
    const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readRecorded(id) {
  try {
    return JSON.parse(fs.readFileSync(path.join(RECORDED, `${id}.json`), "utf8"));
  } catch {
    return null;
  }
}

function writeRecorded(id, record) {
  fs.mkdirSync(RECORDED, { recursive: true });
  fs.writeFileSync(path.join(RECORDED, `${id}.json`), JSON.stringify(record, null, 2) + "\n");
}

/**
 * Whether the fixtures and the installed protocols are the same set.
 *
 * Both directions matter and they fail differently: a derived protocol with no
 * case is a hole in the domain the run would otherwise not mention, and a case
 * for a protocol that is not installed is a case whose answer space never
 * carried the name it is waiting for — it would read as a reach failure and be
 * an install state.
 */
function coverage(cases, protocols) {
  const derived = new Set(protocols.map((p) => p.command));
  const covered = new Set(cases.map((c) => c.protocol).filter((p) => p !== CONTROL));
  return {
    uncovered: [...derived].filter((c) => !covered.has(c)).sort(),
    unknown: [...covered].filter((c) => !derived.has(c)).sort(),
  };
}

/** The ranked distribution, so a verdict can be read against what produced it. */
function ranking(probabilities, limit = 4) {
  if (!probabilities || typeof probabilities !== "object") return [];
  return Object.entries(probabilities)
    .filter(([, v]) => Number.isFinite(v))
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, v]) => `${name} ${v.toFixed(2)}`);
}

/**
 * Reach is membership. The control reaches when no name is carried at all —
 * the answer space's own `none` winning is what that looks like from here.
 */
function reached(kase, names) {
  if (kase.protocol === CONTROL) return names.length === 0;
  return names.includes(kase.protocol);
}

async function run({
  live = false,
  cases = readCases(),
  env = process.env,
  // Same distinction the eval harness draws: an omitted binding is read from
  // disk, an explicit null is a caller saying there is none.
  config: configOverride,
  protocols: protocolsOverride,
  readRecorded: readRecordedFn = readRecorded,
  writeRecorded: writeRecordedFn = writeRecorded,
  makeWorkspace = transcriptWorkspace,
  // Injected so a test can read the request this run actually sent. Watching
  // the transcript get written asserts something weaker and misses the failure
  // that matters: a file written and its path not passed on sends the prompt
  // alone.
  ask,
} = {}) {
  const binding = configOverride === undefined ? (live ? loadConfig() : null) : configOverride;
  if (live && !binding) {
    return { error: "live run needs config/evaluator.json to name an https endpoint" };
  }
  if (live && !env[binding.apiKeyEnv]) {
    return { error: `live run needs a key in ${binding.apiKeyEnv}` };
  }
  const protocols = protocolsOverride ?? deriveProtocols();
  if (protocols.length === 0) {
    return { error: "no installed protocols to ask about — the domain is empty" };
  }
  const criteria = buildCriteria(protocols);
  if (!criteria) return { error: "no installed protocols to ask about" };
  const optionNames = Object.keys(criteria);

  const gaps = coverage(cases, protocols);
  const results = [];
  const skipped = [];
  const stale = [];
  const models = new Set();

  const workspace = live ? makeWorkspace() : null;
  try {
    for (const kase of cases) {
      const problems = turnProblems(kase.conversation);
      if (problems.length > 0) {
        skipped.push({ id: kase.id, why: `conversation is malformed (${problems.join("; ")})` });
        continue;
      }
      let record = readRecordedFn(kase.id);
      if (live) {
        const transcriptPath = workspace.write(kase.id, kase.conversation);
        const result = await advise(kase.prompt, { config: binding, env, protocols, transcriptPath, ask });
        // Only an answer is recorded. Any other reason is a shortfall on this
        // side, and writing it over a recording would replace an observation
        // with a non-observation.
        if (result.reason !== "advised" && result.reason !== "none") {
          skipped.push({ id: kase.id, why: `evaluator returned nothing (${result.reason})` });
          continue;
        }
        record = {
          id: kase.id,
          protocol: kase.protocol,
          model: result.model,
          probabilities: result.probabilities,
          reason: result.reason,
          criteria: optionNames.slice().sort(),
          conversationDigest: digestTurns(kase.conversation),
          // The turns the budget actually left, which the fixture cannot state.
          turns: result.turns ?? 0,
          at: new Date().toISOString(),
        };
        writeRecordedFn(kase.id, record);
      }
      if (!record) {
        skipped.push({ id: kase.id, why: "no recorded answer; run with --live" });
        continue;
      }
      if ((record.conversationDigest ?? digestTurns([])) !== digestTurns(kase.conversation)) {
        stale.push({ id: kase.id, why: "the fixture's conversation changed since this answer was recorded" });
        continue;
      }
      if (record.model) models.add(record.model);
      const names = namesFrom({ probabilities: record.probabilities }, binding ?? shippedCutoffs(), record.criteria);
      results.push({
        id: kase.id,
        protocol: kase.protocol,
        names,
        reached: reached(kase, names),
        turns: record.turns ?? 0,
        ranking: ranking(record.probabilities),
      });
    }
  } finally {
    workspace?.cleanup();
  }

  return { results, gaps, skipped, stale, models: [...models] };
}

/** Display settings for a replay, when no binding was passed in. */
function shippedCutoffs() {
  return loadConfig() ?? { displayCutoff: 0.25, maxNames: 3 };
}

function report(out) {
  if (out.error) return `error: ${out.error}`;
  const lines = [];
  const { results, gaps, skipped, stale, models } = out;

  const landed = results.filter((r) => r.reached);
  const missed = results.filter((r) => !r.reached);

  lines.push("mapping smoke — does each deficit reach its own resolution?");
  lines.push("");
  lines.push(`reached: ${landed.length} of ${results.length} cases answered`);
  for (const r of results) {
    const target = r.protocol === CONTROL ? "(settled ground — no name)" : `/${r.protocol}`;
    lines.push(`    ${r.reached ? "reached" : "MISSED "}  ${target.padEnd(24)} got [${r.names.map((n) => `/${n}`).join(", ")}]`);
    lines.push(`             ${r.turns} turns offered · ${r.ranking.join("  ")}`);
  }

  if (gaps.uncovered.length || gaps.unknown.length) {
    lines.push("");
    lines.push("domain and fixtures disagree:");
    for (const c of gaps.uncovered) lines.push(`    /${c} is installed and has no case`);
    for (const c of gaps.unknown) lines.push(`    /${c} has a case and is not installed`);
  }

  if (skipped.length) {
    lines.push("");
    lines.push("skipped — nothing was observed for these:");
    for (const s of skipped) lines.push(`    ${s.id}: ${s.why}`);
  }

  if (stale.length) {
    lines.push("");
    lines.push("stale recordings — the question moved since the answer was recorded:");
    for (const s of stale) lines.push(`    ${s.id}: ${s.why}`);
    lines.push("    re-run with --live to answer the current fixtures.");
  }

  if (missed.length) {
    lines.push("");
    lines.push("A miss is a reach failure, not a verdict on the advisory: the context was");
    lines.push("built to show that deficit, so what it says is that the protocol's own");
    lines.push("declared material did not carry its own case.");
  }

  if (models.length > 1) {
    lines.push("");
    lines.push(`WARNING: answers came from more than one model version (${models.join(", ")}).`);
  } else if (models.length === 1) {
    lines.push("");
    lines.push(`answers from: ${models[0]}`);
  }

  return lines.join("\n");
}

/**
 * A run fails when the domain is not covered, when a case was skipped, or when
 * a case that was answered did not reach. Skips count: a run that observed
 * nothing for a protocol has not shown that protocol's mapping reaching.
 */
function failed(out) {
  if (out.error) return true;
  return (
    out.gaps.uncovered.length > 0 ||
    out.gaps.unknown.length > 0 ||
    out.skipped.length > 0 ||
    out.stale.length > 0 ||
    out.results.some((r) => !r.reached)
  );
}

export { CASES, coverage, failed, readCases, reached, report, run };

if (isMain(import.meta.url)) {
  run({ live: process.argv.includes("--live") })
    .then((out) => {
      process.stdout.write(report(out) + "\n");
      process.exit(failed(out) ? 1 : 0);
    })
    .catch((e) => {
      process.stdout.write(`error: ${e && e.message}\n`);
      process.exit(1);
    });
}
