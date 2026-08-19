# Source Adapter Mechanics

How to drive each documented source once it has been designated. Nothing here bears on *which* source to designate — the properties that decision turns on are in the Source Interface table in `SKILL.md`, which is where the designation gate reads them. Load this after Phase 0 has settled the source, and read only the section for the source it settled on.

Every adapter here answers to the contract in `SKILL.md`'s Source Interface: it accepts the design-intent bundle, yields `{ findings[], verdict, exercised, direction? }` — `exercised` from every source that has a channel for it at all, `direction` where the source returns one — and observes the Conveyance boundary — design intent only, never fix-status records, do-not-reflag lists, or verdict-conditioning instructions.

## `code-review` adapter

Call via `Skill("code-review", ...)`, passing the resolved diff pointer (base…head, or the captured working-tree base — **never a raw PR number**, which would re-review the possibly stale remote state) **and the design-intent bundle**.

It runs its own multi-angle finder fan-out and returns a findings JSON array (`{ file, line, summary, failure_scenario }`, ranked most-severe-first) with **no verdict line**. The adapter therefore:

- **Derives the verdict**: `[]` → `approve`, otherwise `needs-attention`.
- **Maps each finding** to `[severity] file:line — description`, assigning severity by assessing that finding's own summary and failure scenario against the mission-anchored severity calibration — the same steer every source receives — and using rank order only for ordering or tie-breaking.
- **Leaves the direction slot empty** rather than filling it. A direction the adapter composed would be the loop's own reading wearing the source's name, and Phase 3 already reads the verified set on the loop's behalf.
- **Never fills the reach slot with an inference** about what the source probably examined. The fixed output shape carries no channel for a reach report, and an inference put there would be indistinguishable from a report.

The adapter does not stamp a round-level "did not say" onto every round either. Both absent slots are standing properties of this source rather than per-round outcomes, so they are declared once at Phase 0 among its coverage trade-offs and surfaced once more at convergence; a per-round stamp would add a trace line that never varies and train the reader to skip past the very slot that has to stay legible for sources which *can* report.

## `codex` adapter

1. **Write the review prompt** to `/tmp/review_loop_codex_${SUFFIX}.txt` (generate `SUFFIX=$(openssl rand -hex 4)`), passing a **pointer** to the diff rather than inlining it, so codex fetches the live diff with its own git. Include a Pointers section:

   ```
   ## Pointers — read the diff yourself with your own tools
   - Diff command: `git diff {base_sha}...{head_sha}`  (PR scope — `{head_sha}` is the PR head, which equals `HEAD` only when the PR branch is checked out; for a working-tree scope use `git diff {captured_base}` — the `HEAD` SHA captured at Phase 0, still equal to `HEAD` until the loop lands commits — then read directly each untracked path carried in Changed files because it is absent from the diff)
   - Changed files: {file_list}
   Run the diff command in this repo and, for working-tree scope, read the identified untracked files directly to see exactly what changed — the diff is not inlined.
   ```

   Also include a **Design-intent** section carrying the design-intent bundle — repo-resident sources as pointers (codex reads these files itself via `--cd`, read-only sandbox), constituted decisions inlined as content — so codex reads the documented intent before judging and does not spend findings refuting intentional, documented choices:

   ```
   ## Design intent — read these before flagging; do not spend findings merely refuting a documented choice the intent already explains
   - Project rules (read in full): {relevant_rule_paths}
   - Project-guide rationale (read in full): {project_guide_paths}  (design-rationale sections of the project guide)
   - Design comments to weight: {design_comment_locations}  (the "why this is intentional" comments adjacent to the changed hunks)
   - Design decisions constituted during this loop: {constituted_decisions}  (each with its constitutive basis; conveyed as design intent, NOT suppression — flag freely if a decision itself causes a defect)
   - Authority order among the surfaces above: {declared_authority_order}  (where the project declares one. When two of them disagree, the higher governs and the lower is what should be corrected — flag the disagreement and say which is which, rather than choosing a side yourself or reading the lower one as the standard)
   A finding whose only objection is that a choice looks wrong, when the documented intent above accounts for it, is intentional design — drop it or note the intent and downgrade rather than flagging high-severity. But intent excuses the design rationale, not a defect the design actually causes: if a documented choice still produces a real bug, regression, or security hole the intent does not prevent, flag it.

   ## Severity anchor (mission-level calibration)
   {mission_anchor_pointer}  (the project's stated-goal section, as resolved at Phase 0)
   Calibrate severity against it: a defect that breaks runtime behavior is high — critical when it additionally corrupts silently, producing wrong results acted on without notice; a defect that misbehaves only in edge conditions is medium; an internal-consistency mismatch with no behavioral consequence is low or suggestion; a wording preference the documented conventions already account for is not a finding. Do not manufacture findings to satisfy thoroughness. Your verdict is your own.
   ```

   Where Phase 0 recorded that the project declares no goal, say so in the prompt rather than omitting the section silently — an absent anchor and an unstated one read alike to the model, and only one of them is true.

   Per the Conveyance boundary, the prompt never contains fix-status claims, do-not-reflag lists, or verdict-conditioning instructions.

   Ask for findings as `[severity] file:line — description` and a closing line `VERDICT: approve | needs-attention`, followed — when that verdict is not approve — by a `DIRECTION:` line naming the one mechanism codex reads behind the findings it just listed, together with the observation that would break that reading. Ask for it in that order, after the findings, so the direction accounts for what was surfaced; state that it never licenses adding, reshaping, or reweighting a finding to fit, and that having no single mechanism to name is an acceptable answer.

   Ask also for an `EXERCISED:` line, on every verdict including approve, reporting which claims it actually reached against the artifact this call and which it did not — naming, for each unreached one, what stopped it. Reaching a claim means arriving at a judgment that claim bears on: driving the artifact under substituted conditions where that is what the claim needs, examining the code that governs it where it is not. Say plainly in the prompt that reporting a claim as unreached costs it nothing and that a guess about what it "effectively" covered is the one answer that does harm here, because the loop reads an unreached claim as unknown and a falsely-claimed one as cleared. A read-only sandbox bounds what a run can touch without fixing what it can reach: a check that resolves its inputs through an interceptable boundary can often be driven over substituted content entirely in-process, and whether a given call finds that route varies between calls made under identical constraints. So the prompt asks what this call did, never what the sandbox permits in principle.

   Name one claim in the prompt so it is asked on every call rather than left to what the run chose to look at: whether each changed file's own contract closes — whether what it declares is carried through it, so that a value declared with no step producing it, a branch taken on a value nothing supplies, or a rule stated in one place and relied on in another that never received it would have been seen. Say plainly that this claim is about the whole of each changed file and not its hunks, because an absence never appears in a diff, and that reporting it unreached is a real answer where reading the whole file was not what this run did.

2. **Launch it in the background.** `--color never` + splitting the streams (stdout to the events file, `2>` to a separate warn file) keeps the events file pure JSONL — the codex banner and any stderr warnings ride their own warn file. `--cd {repo_root}` points codex's own git/Read at the repo so it re-derives the diff against the orchestrator-supplied base and head SHAs; `--sandbox read-only` is kept because `git diff` is a local read needing no network. Select `{effort}` per run by this review's reasoning demand — scale it to the diff's size and complexity — floored at `high` (never below): a notably small, mechanical diff runs at `high`, a substantive or wide diff at `xhigh`, and the most demanding reviews may escalate to `max` (the top of this model's ladder — it consumes usage limits faster, so reserve it for genuinely heavy diffs). If codex's git cannot resolve those SHAs the extraction comes back empty — the step-3 empty-extraction guard surfaces it.

   ```bash
   codex exec --ephemeral --json --color never --skip-git-repo-check --cd "{repo_root}" \
     -m gpt-5.6-sol {effort_flag} --sandbox read-only \
     < /tmp/review_loop_codex_${SUFFIX}.txt \
     > /tmp/review_loop_codex_events_${SUFFIX}.jsonl \
     2>/tmp/review_loop_codex_warn_${SUFFIX}.txt &
   ```

   `{effort_flag}` is `--config model_reasoning_effort="{effort}"`. Report that setting back to the loop, which records it on the round trace as observed provenance under the contract in `SKILL.md`'s Convergence section.

   Whether a call that stops answering is cut off, and by what, is not this adapter's to decide — `SKILL.md`'s Source Interface states where that goes.

3. **Collect on the completion notification** — do not poll or sleep. The events file is pure JSONL; extract the **final** codex `agent_message` narrative verbatim with the line below — high-reasoning codex streams progress messages first, so the line takes the last `agent_message` — then **forward it verbatim to the loop — do NOT regex-parse it into findings/verdict**: the consuming agent (an LLM) reads the `[severity] file:line — description` findings, the `EXERCISED:` line, and the closing `VERDICT:` line directly from the narrative. **An empty extraction means the call produced no verdict** — the loop reads that round per Rule 13. An extraction-pipeline error (e.g. `jq` missing) is an extraction failure, not a source failure — fall back to reading the raw events file directly rather than reporting the source as failed.

   ```bash
   jq -rs '[.[] | select(.type=="item.completed" and .item.type=="agent_message") | .item.text] | last // empty' /tmp/review_loop_codex_events_${SUFFIX}.jsonl
   ```

   Some codex warnings ride the **stderr banner**, not `agent_message` — the launch sent stderr to its own warn file. **Read that file whole, on every outcome including a clean one, and never through a keyword filter.** A filter admits only what someone thought to enumerate, and what it drops it drops silently: no match reads exactly like no problem, so a run that stated its own reason for stalling gets reported as showing no sign of error — the filter's omission and a genuinely quiet run are indistinguishable downstream. The file holds a banner and whatever the run wrote to stderr, so reading it outright costs little and forfeits nothing a filter would have saved. Surface its contents alongside the findings; when it is empty, say that it was empty rather than leaving the check unmentioned, so a reader can tell the stream was inspected.

   ```bash
   tail -c 4000 /tmp/review_loop_codex_warn_${SUFFIX}.txt
   ```

4. **Clean up all three temp files each round** (`rm -f /tmp/review_loop_codex_${SUFFIX}.txt /tmp/review_loop_codex_events_${SUFFIX}.jsonl /tmp/review_loop_codex_warn_${SUFFIX}.txt`) to prevent `/tmp` accumulation across rounds.
