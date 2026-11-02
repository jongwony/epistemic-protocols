/**
 * The report over a run's cell results.
 *
 * One row per case × arm × length, each a count of verdicts — never a rate
 * summed across cases and never a difference netted between arms, because a
 * gain on one case and a loss on another cancel in a net and the loss is what
 * a reader needs to see. The control case (`control-reading-relay`) is
 * reported in its own table, apart from the cases it guards, since netting a
 * spoiled case against a rescued one hides the spoil.
 *
 * The verdict that counts is the person's where one is recorded and the
 * judge's otherwise; a judge verdict nobody has adjudicated is marked as such,
 * and every disagreement between the two is listed. Reads before the action
 * are reported as observations beside the counts, not as part of them.
 *
 * Zero external dependencies: Node.js standard library only.
 */

import { finalVerdict } from "./judge.mjs";

const CONTROL = new Set(["control-reading-relay"]);

/** Tallies per case × arm × length, in the order the results first name them. */
function tally(results) {
  const rows = new Map();
  for (const r of results) {
    const key = `${r.case}\u0000${r.arm}\u0000${r.length}`;
    if (!rows.has(key)) {
      rows.set(key, { case: r.case, arm: r.arm, length: r.length, n: 0, pass: 0, fail: 0, unclear: 0, pending: 0, judgeOnly: 0, noAction: 0, failed: 0, premiseReadFirst: 0 });
    }
    const row = rows.get(key);
    row.n++;
    if (r.launchFailed) { row.failed++; continue; }
    if (r.action?.kind === "none") row.noAction++;
    if ((r.observations ?? []).some((o) => o.premise)) row.premiseReadFirst++;
    const { verdict, by } = finalVerdict(r);
    if (!verdict) row.pending++;
    else {
      row[verdict]++;
      if (by === "judge") row.judgeOnly++;
    }
  }
  return [...rows.values()];
}

/** Results where the judge and the person both gave a verdict and they differ. */
function disagreements(results) {
  return results.filter((r) => r.judge?.verdict && r.human?.verdict && r.judge.verdict !== r.human.verdict)
    .map((r) => ({ cell: r.cell, judge: r.judge.verdict, human: r.human.verdict, judgeReason: r.judge.reason ?? "", humanReason: r.human.reason ?? "" }));
}

function table(rows) {
  const head = "| case | arm | length | n | pass | fail | unclear | pending | judge-only | no action | launch failed | read premise first |";
  const sep = "|---|---|---|---|---|---|---|---|---|---|---|---|";
  return [head, sep, ...rows.map((r) => `| ${r.case} | ${r.arm} | ${r.length} | ${r.n} | ${r.pass} | ${r.fail} | ${r.unclear} | ${r.pending} | ${r.judgeOnly} | ${r.noAction} | ${r.failed} | ${r.premiseReadFirst} |`)].join("\n");
}

/** The report as Markdown text. */
function renderReport({ manifest, results }) {
  const rows = tally(results);
  const graded = rows.filter((r) => !CONTROL.has(r.case));
  const control = rows.filter((r) => CONTROL.has(r.case));
  const dis = disagreements(results);
  const lines = [
    `# Premise application run ${manifest?.runId ?? ""}`.trim(),
    "",
    `Model: ${manifest?.model ?? "?"} · CLI: ${manifest?.cliVersion ?? "?"} · commit: ${manifest?.commit ?? "?"} · route: ${manifest?.routeVersion ?? "?"} · max turns: ${manifest?.maxTurns ?? "?"} · long prefix: ~${manifest?.longTokens ?? "?"} tokens · spent: $${(manifest?.spentUsd ?? 0).toFixed(4)}`,
    "",
    "Counts per cell; nothing is summed across cases or netted between arms. `judge-only` counts verdicts no person has adjudicated. `read premise first` counts cells that opened a premise document before acting — an observation, not part of the verdict. The case labels ship unadjudicated.",
    "",
    "## Cases",
    "",
    graded.length ? table(graded) : "(no results)",
    "",
    "## Control, counted apart",
    "",
    control.length ? table(control) : "(not run)",
    "",
    "## Judge and person disagree",
    "",
    dis.length ? dis.map((d) => `- ${d.cell}: judge ${d.judge}, person ${d.human} — ${d.humanReason}`).join("\n") : "(none recorded)",
  ];
  if (manifest?.hostFacts?.length) lines.push("", "## Host facts", "", ...manifest.hostFacts.map((f) => `- ${f}`));
  return lines.join("\n") + "\n";
}

export { CONTROL, disagreements, renderReport, tally };
