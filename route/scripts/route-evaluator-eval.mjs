#!/usr/bin/env node
/**
 * Score the advisory channel against adjudicated fixtures.
 *
 * This prepares a comparison. It does not adjudicate one: every case's
 * `expected` label is a person's judgement of what a correct advisory would
 * carry, and the labels shipped with this harness were written by the same
 * hand that wrote the harness. `evals/README.md` says what that is worth.
 * Until a case is marked `adjudicated`, its result is reported apart and
 * left out of every rate, because a rate over labels nobody checked is a
 * number with a confidence interval nobody can state.
 *
 * Scoring is paired — the same case with the advisory and without — into
 * four cells, and the spoiled cell is reported on its own:
 *
 *   baseline right → assisted right    right→right
 *   baseline right → assisted wrong    right→wrong   SPOILED
 *   baseline wrong → assisted right    wrong→right   repaired
 *   baseline wrong → assisted wrong    wrong→wrong
 *
 * Netting these together is what hides the second row. The published result
 * for the analogous design reports both a large fall in wrong selections and
 * decisions spoiled that the unaided agent had got right; an aggregate shows
 * only the first. A correct baseline silence that becomes a needless
 * advisory is a spoiled case and the most likely one in the set.
 *
 * The baseline arm is the channel disabled: no advisory, every case scored
 * as silence. That is the honest counterfactual for *this* change, since
 * turning the channel off is what the repository ships. It is not a model of
 * how well an agent routes unaided — this harness measures the advisory's
 * contribution to the line, not the reader's behaviour after reading it.
 * Measuring that needs paired agent turns, which this does not do.
 *
 *   node route/scripts/route-evaluator-eval.mjs           # replay recorded answers
 *   TYPESAFE_API_KEY=… node route/scripts/route-evaluator-eval.mjs --live
 *
 * A live run reads the key from the variable config/evaluator.json names — the
 * same one that arms the session channel, since this project counts holding
 * that key as consent for both.
 *
 * A case's `conversation` is written to a transcript and offered by path, so
 * the shipped walk — budget derived under the endpoint ceiling, newest-first
 * fill, harness wrappers stripped — is what assembles the state. Passing the
 * turns straight to `advise` would skip every one of those, and a run that
 * skipped them would be scoring a state the session channel never sends.
 *
 * Zero external dependencies: Node.js standard library only.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { advise, buildCriteria, loadConfig, namesFrom } from "./route-evaluator.mjs";
import { digestTurns, transcriptWorkspace, turnProblems } from "./route-eval-transcript.mjs";
import { deriveProtocols, isMain } from "./route-protocols.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const EVALS = path.join(HERE, "..", "evals");
const CASES = path.join(EVALS, "cases", "cases.json");
const RECORDED = path.join(EVALS, "recorded");
const OUTCOMES = ["silence", "singleton", "several", "monitor"];

/** Short content hash — equality of the question, not its contents. */
function digest(text) {
  return crypto.createHash("sha256").update(text).digest("hex").slice(0, 16);
}

function readCases(file = CASES) {
  try {
    const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function recordedFile(id) {
  return path.join(RECORDED, `${id}.json`);
}

function readRecorded(id) {
  try {
    return JSON.parse(fs.readFileSync(recordedFile(id), "utf8"));
  } catch {
    return null;
  }
}

function writeRecorded(id, record) {
  fs.mkdirSync(RECORDED, { recursive: true });
  fs.writeFileSync(recordedFile(id), JSON.stringify(record, null, 2) + "\n");
}

/**
 * Right when the names the advisory would carry are exactly the ones the
 * adjudicator said it should. Set equality, not overlap: a correct name
 * beside a wrong one is not a correct advisory, and an extra name on a case
 * whose answer is silence is the needless-advisory failure.
 */
function correct(expected, actual) {
  const a = [...new Set(expected)].sort();
  const b = [...new Set(actual)].sort();
  return a.length === b.length && a.every((x, i) => x === b[i]);
}

function emptyCells() {
  return { "right→right": 0, "right→wrong": 0, "wrong→right": 0, "wrong→wrong": 0 };
}

function scoreOne(kase, names) {
  // Baseline is the channel off: the line is never emitted, so the baseline
  // advisory is empty and is right exactly on the cases whose answer is
  // silence.
  const baselineRight = correct(kase.expected ?? [], []);
  const assistedRight = correct(kase.expected ?? [], names);
  const cell = `${baselineRight ? "right" : "wrong"}→${assistedRight ? "right" : "wrong"}`;
  return { cell, baselineRight, assistedRight, names };
}

function tally(results) {
  const overall = emptyCells();
  const byOutcome = Object.fromEntries(OUTCOMES.map((o) => [o, emptyCells()]));
  let baselineCorrect = 0;
  for (const r of results) {
    overall[r.cell] += 1;
    if (byOutcome[r.outcome]) byOutcome[r.outcome][r.cell] += 1;
    if (r.baselineRight) baselineCorrect += 1;
  }
  return { overall, byOutcome, baselineCorrect };
}

async function run({
  live = false,
  cases = readCases(),
  env = process.env,
  // Injected so the guards below can be exercised without a binding on disk
  // and without touching evals/recorded/. No default: an omitted `config` has
  // to arrive as `undefined` for the check below to tell it apart from an
  // explicit null, and a default here would make every caller look explicit.
  config: configOverride,
  // Injected so a test states its own domain. Read from disk, the domain
  // depends on where this checkout sits: `deriveProtocols` identifies the
  // marketplace by the installed path and falls back to the name of the
  // directory above, which in a worktree is the worktree's name. A test
  // leaving it to disk passes or fails on that rather than on what it asserts.
  protocols: protocolsOverride,
  readRecorded: readRecordedFn = readRecorded,
  // Injected so a test exercising a live run does not write into the
  // directory a real run's observations live in.
  writeRecorded: writeRecordedFn = writeRecorded,
  makeWorkspace = transcriptWorkspace,
  // Injected so a test can read the request this run actually sent. Watching
  // the transcript get written is not the same assertion and does not catch
  // the failure this harness had: the file was written and the path was not
  // passed on, so the state went out carrying the prompt alone.
  ask,
} = {}) {
  const adjudicated = [];
  const unadjudicated = [];
  const skipped = [];
  const stale = [];
  const models = new Set();
  const cutoffsUsed = new Set();

  // An explicit null is a caller saying there is no binding on disk, which
  // `??` would read as no override and send back to disk.
  const binding = configOverride === undefined ? (live ? loadConfig() : null) : configOverride;
  if (live && !binding) {
    return { error: "live run needs config/evaluator.json to name an https endpoint" };
  }
  const config = binding;
  // Without this check every case returns `no-key`, which is not `no-answer`
  // and so was written over the case's recording as a null distribution and
  // scored as silence — a run that observed nothing, reported as a run that
  // observed silence.
  if (live && !env[config.apiKeyEnv]) {
    return { error: `live run needs a key in ${config.apiKeyEnv}` };
  }
  const protocols = protocolsOverride ?? (live ? deriveProtocols() : []);
  const criteria = live ? buildCriteria(protocols) : null;
  if (live && !criteria) return { error: "no installed protocols to ask about" };

  // Only a live run offers anything, so only a live run needs transcripts on
  // disk; a replay reads what was recorded and sends nothing.
  const workspace = live ? makeWorkspace() : null;
  try {
  for (const kase of cases) {
    // A malformed conversation is a fixture defect, reported rather than
    // dropped: a turn that vanishes quietly leaves the run reporting on a
    // state it never offered.
    const problems = turnProblems(kase.conversation);
    if (problems.length > 0) {
      skipped.push({ id: kase.id, why: `conversation is malformed (${problems.join("; ")})` });
      continue;
    }
    let record = readRecordedFn(kase.id);
    if (live) {
      // Offered by path rather than as an array. `advise` takes an array as a
      // state already assembled and walks nothing; the path is what sends the
      // request through budget derivation, the endpoint ceiling and the
      // newest-first fill — the assembly the session channel runs.
      const transcriptPath = workspace.write(kase.id, kase.conversation);
      const result = await advise(kase.prompt, { config, env, protocols, transcriptPath, ask });
      // Only an answer is recorded. Every other reason is a shortfall on our
      // side, and writing it over an existing recording destroys an
      // observation to put a non-observation in its place.
      if (result.reason !== "advised" && result.reason !== "none") {
        skipped.push({ id: kase.id, why: `evaluator returned nothing (${result.reason})` });
        continue;
      }
      record = {
        id: kase.id,
        model: result.model,
        probabilities: result.probabilities,
        reason: result.reason,
        // What it was asked, so a replay can tell whether the question moved.
        // Names alone do not: a protocol's declared description is part of
        // the question, and so is the prompt. Both are hashed rather than
        // copied, since the check is equality and the fixture is the source.
        criteria: Object.keys(criteria).sort(),
        criteriaDigest: digest(JSON.stringify(criteria)),
        promptDigest: digest(kase.prompt ?? ""),
        // The conversation is part of what was asked, so a recording that
        // outlives a change to it is as stale as one whose prompt moved.
        conversationDigest: digestTurns(kase.conversation),
        // How many turns survived the budget — a number the fixture cannot
        // state, since it depends on the ceiling and on what every installed
        // protocol's options cost.
        turns: result.turns ?? 0,
        at: new Date().toISOString(),
      };
      writeRecordedFn(kase.id, record);
    }
    if (!record) {
      skipped.push({ id: kase.id, why: "no recorded answer; run with --live" });
      continue;
    }
    if (record.model) models.add(record.model);
    // A recording answers the question it was asked. When the fixture's
    // prompt has since changed, scoring it against the new one grades an old
    // answer on a new task, and nothing in the output would have said so.
    if (record.promptDigest && record.promptDigest !== digest(kase.prompt ?? "")) {
      stale.push({ id: kase.id, why: "the fixture's prompt changed since this answer was recorded" });
      continue;
    }
    // A recording made before the fixture carried a conversation answered a
    // narrower question and has no digest to say so. Its absence is read as
    // "no conversation was offered", which is what was true when it was made,
    // so adding one to the fixture makes it stale.
    const recordedTurns = record.conversationDigest ?? digestTurns([]);
    if (recordedTurns !== digestTurns(kase.conversation)) {
      stale.push({ id: kase.id, why: "the fixture's conversation changed since this answer was recorded" });
      continue;
    }
    const cutoffs = config ?? loadConfigOrDefaults();
    cutoffsUsed.add(`displayCutoff=${cutoffs.displayCutoff} maxNames=${cutoffs.maxNames}`);
    // Replay applies the *current* display settings, so the same recorded
    // answer yields different names when they move. Carry them into the
    // report rather than leaving the reader to assume they held.
    const names = namesFrom({ probabilities: record.probabilities }, cutoffs, record.criteria);
    const scored = {
      id: kase.id,
      outcome: kase.outcome,
      expected: kase.expected ?? [],
      turns: record.turns ?? 0,
      ...scoreOne(kase, names),
    };
    (kase.adjudicated === true ? adjudicated : unadjudicated).push(scored);
  }
  } finally {
    workspace?.cleanup();
  }

  return {
    adjudicated: { results: adjudicated, ...tally(adjudicated) },
    unadjudicated: { results: unadjudicated, ...tally(unadjudicated) },
    skipped,
    stale,
    models: [...models],
    cutoffs: [...cutoffsUsed],
  };
}

/** Cutoffs for replay when the channel is off — the shipped defaults. */
function loadConfigOrDefaults() {
  return loadConfig() ?? { displayCutoff: 0.25, maxNames: 3 };
}

function formatCells(cells, baselineCorrect) {
  const spoiled = cells["right→wrong"];
  const share = baselineCorrect > 0 ? ` (${((spoiled / baselineCorrect) * 100).toFixed(1)}% of baseline-correct)` : "";
  return [
    `    right→right ${cells["right→right"]}   wrong→right ${cells["wrong→right"]} (repaired)`,
    `    wrong→wrong ${cells["wrong→wrong"]}   right→wrong ${spoiled} (SPOILED)${share}`,
  ].join("\n");
}

function report(out) {
  if (out.error) return `error: ${out.error}`;
  const lines = [];
  const { adjudicated, unadjudicated, skipped, models } = out;

  lines.push(`adjudicated cases: ${adjudicated.results.length}`);
  if (adjudicated.results.length === 0) {
    lines.push("    none — every rate below is withheld. Adjudicate the labels in");
    lines.push("    route/evals/cases/cases.json and set \"adjudicated\": true on each.");
  } else {
    lines.push(formatCells(adjudicated.overall, adjudicated.baselineCorrect));
    for (const outcome of OUTCOMES) {
      const cells = adjudicated.byOutcome[outcome];
      const n = Object.values(cells).reduce((a, b) => a + b, 0);
      if (n === 0) continue;
      lines.push(`  ${outcome} (${n})`);
      lines.push(formatCells(cells, cells["right→right"] + cells["right→wrong"]));
    }
  }

  lines.push("");
  lines.push(`unadjudicated cases: ${unadjudicated.results.length} — reported, not scored into any rate`);
  for (const r of unadjudicated.results) {
    lines.push(`    ${r.cell === "right→wrong" ? "SPOILED" : r.cell.padEnd(7)}  ${r.outcome.padEnd(9)} ${r.id}`);
    lines.push(`             expected [${r.expected.join(", ")}]  got [${r.names.join(", ")}]  ${r.turns ?? 0} turns offered`);
  }

  if (skipped.length) {
    lines.push("");
    lines.push("skipped:");
    for (const s of skipped) lines.push(`    ${s.id}: ${s.why}`);
  }

  if (out.stale && out.stale.length) {
    lines.push("");
    lines.push("stale recordings — the question moved since the answer was recorded:");
    for (const s of out.stale) lines.push(`    ${s.id}: ${s.why}`);
    lines.push("    re-run with --live to answer the current fixtures.");
  }

  // The names scored are a function of the display settings as well as the
  // recorded answer, so the settings are part of what the run reports.
  if (out.cutoffs && out.cutoffs.length) {
    lines.push("");
    lines.push(`scored under: ${out.cutoffs.join(" | ")}`);
  }

  if (models.length > 1) {
    lines.push("");
    lines.push(`WARNING: answers came from more than one model version (${models.join(", ")}).`);
    lines.push("Cases graded under one version and replayed under another measure two things.");
  } else if (models.length === 1) {
    lines.push("");
    lines.push(`answers from: ${models[0]}`);
  }

  return lines.join("\n");
}

export { correct, readCases, report, run, scoreOne, tally };

if (isMain(import.meta.url)) {
  run({ live: process.argv.includes("--live") })
    .then((out) => {
      process.stdout.write(report(out) + "\n");
      process.exit(out.error ? 1 : 0);
    })
    .catch((e) => {
      process.stdout.write(`error: ${e && e.message}\n`);
      process.exit(1);
    });
}
