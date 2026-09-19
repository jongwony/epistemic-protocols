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
 * A fixture is a session, not a line. The channel this harness scores sends
 * the accumulated context — the user's turns and the replies to them, newest
 * first under a budget derived from what the question and the prompt leave —
 * so a fixture carrying only a prompt scored a state the channel never sends,
 * and every such run landed on the transcript-shortfall path that leaves the
 * prompt-only state. A case may therefore carry `conversation`, which the
 * harness materializes as a transcript and hands to `advise` as a path, so the
 * walk the channel runs — cleaning, the subagent drop, the per-turn overhead,
 * the derived budget, the newest-first fill — is the walk the fixture is
 * scored through rather than one this file reimplements.
 *
 *   node route/scripts/route-evaluator-eval.mjs           # replay recorded answers
 *   TYPESAFE_API_KEY=… node route/scripts/route-evaluator-eval.mjs --live
 *
 * A live run reads the key from the variable config/evaluator.json names — the
 * same one that arms the session channel, since this project counts holding
 * that key as consent for both.
 *
 * Zero external dependencies: Node.js standard library only.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { advise, buildCriteria, loadConfig, namesFrom } from "./route-evaluator.mjs";
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

/**
 * The state a case asks about: its prompt and the conversation behind it. One
 * digest over both, because a recording answers the whole question it was
 * asked, and a conversation that moved moves the question exactly as a changed
 * prompt does.
 */
function stateDigest(kase) {
  return digest(JSON.stringify({ prompt: kase.prompt ?? "", conversation: kase.conversation ?? [] }));
}

/**
 * The fixture's conversation as a transcript on disk, so `advise` reads it
 * through the same walk the hook does rather than through a shortcut this file
 * would own. Returns "" when the case carries none — the prompt-only state,
 * still reachable, now only where a fixture asks for it.
 */
function transcriptFor(conversation, dir) {
  if (!Array.isArray(conversation) || conversation.length === 0) return "";
  const lines = conversation
    .filter((t) => t && (t.role === "user" || t.role === "assistant") && typeof t.text === "string")
    .map((t) => JSON.stringify({ type: t.role, message: { content: t.text } }));
  if (lines.length === 0) return "";
  const file = path.join(dir, `${crypto.randomUUID()}.jsonl`);
  fs.writeFileSync(file, lines.join("\n") + "\n");
  return file;
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
  readRecorded: readRecordedFn = readRecorded,
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
  const protocols = live ? deriveProtocols() : [];
  const criteria = live ? buildCriteria(protocols) : null;
  if (live && !criteria) return { error: "no installed protocols to ask about" };

  // Fixtures become transcripts for the length of the run and nothing after
  // it, so the directory is made here and removed below whatever happens.
  const scratch = live ? fs.mkdtempSync(path.join(os.tmpdir(), "route-eval-")) : null;
  try {
    for (const kase of cases) {
      let record = readRecordedFn(kase.id);
      if (live) {
        // The path rather than the turns: passing `conversation` straight to
        // `advise` would skip the derived budget and the newest-first fill,
        // which is the part of the channel a fixture run is here to cross.
        const transcriptPath = transcriptFor(kase.conversation, scratch);
        const result = await advise(kase.prompt, { config, env, protocols, transcriptPath });
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
          // the question, and so is the state. Both are hashed rather than
          // copied, since the check is equality and the fixture is the source.
          criteria: Object.keys(criteria).sort(),
          criteriaDigest: digest(JSON.stringify(criteria)),
          stateDigest: stateDigest(kase),
          // How much of the conversation actually reached the request. A case
          // that carries turns and records none did not cross the walk, and
          // without this the report cannot tell that from a case carrying none.
          turns: Number.isInteger(result.turns) ? result.turns : 0,
          at: new Date().toISOString(),
        };
        writeRecorded(kase.id, record);
      }
      if (!record) {
        skipped.push({ id: kase.id, why: "no recorded answer; run with --live" });
        continue;
      }
      if (record.model) models.add(record.model);
      // A recording answers the question it was asked. When the state the
      // fixture describes has since moved, scoring it against the new one
      // grades an old answer on a new task, and nothing in the output would
      // have said so. A recording carrying no state digest at all is that same
      // case rather than an exempt one: it was answered before the
      // conversation was part of the question, so it answers a question this
      // fixture no longer asks.
      if (record.stateDigest !== stateDigest(kase)) {
        stale.push({
          id: kase.id,
          why: record.stateDigest
            ? "the fixture's prompt or conversation changed since this answer was recorded"
            : "recorded before the state carried the conversation",
        });
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
        // What the fixture describes against what the request carried. A gap
        // between them is the shortfall path, and it is reported rather than
        // scored around.
        carried: Array.isArray(kase.conversation) ? kase.conversation.length : 0,
        offered: Number.isInteger(record.turns) ? record.turns : 0,
        ...scoreOne(kase, names),
      };
      (kase.adjudicated === true ? adjudicated : unadjudicated).push(scored);
    }
  } finally {
    if (scratch) fs.rmSync(scratch, { recursive: true, force: true });
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
    lines.push(`             expected [${r.expected.join(", ")}]  got [${r.names.join(", ")}]`);
    lines.push(`             conversation: ${r.carried ?? 0} carried, ${r.offered ?? 0} offered`);
  }

  // The state the run actually sent, called out on its own. A fixture set that
  // describes sessions and a run that sent none of them is the shortfall this
  // harness spent a cycle reporting as a measurement, and the one line that
  // would have shown it is this one.
  const scored = [...adjudicated.results, ...unadjudicated.results];
  const starved = scored.filter((r) => (r.carried ?? 0) > 0 && (r.offered ?? 0) === 0);
  if (starved.length) {
    lines.push("");
    lines.push("prompt-only — these fixtures describe a session and the request carried none of it:");
    for (const r of starved) lines.push(`    ${r.id}`);
    lines.push("    the channel sends the accumulated context; a run scored here scored something else.");
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

export { correct, readCases, report, run, scoreOne, stateDigest, tally, transcriptFor };

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
