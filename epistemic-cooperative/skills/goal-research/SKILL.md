---
name: goal-research
description: Delegate academic-literature research to a background Claude or Codex run using Aitesis and Tavily; check its citations against its Tavily record until the goal holds. User-invoked via /goal-research.
---

# Goal Research

Invoke directly with `/goal-research [runner] <research question>` when the user wants a research question — typically one about the scholarly literature — investigated by a background run that drives Aitesis with Tavily search and extract, and wants the run's citations checked against what its own Tavily calls returned.

**Why this composition**: `/inquire` carries the epistemic contract — its reading of each uncertainty, its record of what collection reached, and what stays open for the person to settle. goal-research refines that contract for academic research in a background run; it adds no second reading beside it. A research run can answer fluently and cite papers it never opened, and nothing in its narrative distinguishes that from a searched answer. So the run's own tool record, never its account of itself, says which Tavily calls succeeded and what they returned; whether a cited source is among them is this session's reading, marked as such.

## Caller Signature

```
/goal-research [runner?] <research question>

runner : claude | codex        (claude when none is designated)
```

Read the runner designation from the request's words as well as its arguments. A leading `claude` or `codex` designates the runner only when it stands as a separate leading argument and what follows reads as the whole question; wording outside the research question designates as well. Where the leading word could instead open the question — `Claude Shannon's 1948 paper…`, `codex CLI sandbox defaults` — ask once which it is. Nothing is removed from inside the question. With no designation, the runner is `claude`.

## Phase 1: Argument Capture

1. If `/goal-research` is invoked with an argument, the research question is that argument after a leading runner designation, read as the Caller Signature says, carried verbatim — nothing is removed from inside it.
2. If invoked without a research question, ask the user once for it, then proceed.

The research question is passed unchanged into the research brief — paraphrasing is prohibited.

## Phase 2: Brief and Launch

**Goal condition**, the one this session judges each pass against in Phase 3:

> Every uncertainty the run's research target turns on is either filled by a citation to a source the run's Tavily calls returned, or returned open with its reach and what would settle it. Among the open items, those that are the person's to settle are marked as theirs.

The run receives this brief as its whole task, with `{inquire}` set to `/inquire` for `claude` and `$inquire` for `codex`, and `{goal condition}` set to the sentence above:

```
Research goal condition: {goal condition}

This session is the research session the goal-research skill has already delegated to — goal-research is already running here, so do not invoke it again in this session.

Research target:
{research_question}

Workflow:
1. Run {inquire} (the Aitesis skill) on the research target, collecting external evidence through Tavily search and Tavily extract. Its reading of each uncertainty, its reach record, and what it leaves open are the report's substance; the lines below refine them for academic research and add no second reading.
2. Open the page of each primary source a filled claim rests on — the paper itself, or its publisher or repository page — with Tavily extract; a search-result snippet alone fills a claim only as "mostly".
3. No person answers in this session. An uncertainty {inquire} reads as the person's to settle — a value, preference, or scope only they hold, or an unknown that is their own — is neither answered nor settled here: it returns open, with its reach and what would settle it. Fill no held value yourself; a candidate you see is shown as the runner's candidate, beside what decides it.
4. Cite each external source by its URL.

Report {inquire}'s whole record as it stands at completion — and again, whole and updated, each time this session is continued — refined as follows:
- An uncertainty filled by an external citation carries its source URL(s) and how far the citation reaches:
  - verified: the claim's primary source — its page opened with Tavily extract in this session — states it; an opened secondary page supports the claim at most as mostly
  - mostly: the source was seen only as a search-result snippet, or its page checked the core claim while surrounding detail is synthesized
- A detail from recall (a volume, issue, page range, date, or number that no source in this session gave) is not a citation. Mark it reconstructed, as your own inference, and leave its item open, needing a spot-check.
- The weakest link: the claim or detail the conclusions lean on that stands weakest, named explicitly.
- An absence or novelty claim ("no study has…", "untested", "novel", "first to…") reaches only as far as {inquire}'s reach record for it; carry that record beside the claim.
- For each empirical effect cited: its replication status and any retraction, where checkable in this session, otherwise "not checked". An effect that failed replication is reported as a design warning, not a quantitative law.
- Open: every item still open — the person's to settle, reconstructed, or short of ground — each with its reach, the person's marked as theirs.
```

Before launching a run or reading its output, read [Error patterns](references/error-patterns.md): failures already seen when driving a run, each with its symptom and fix.

Run the brief in the background, in its own context rather than as a fork of this conversation: a Claude run by default — a Claude subagent where the host offers one, else the `claude` CLI — or a `codex exec` session when codex is designated. Where the runner has a goal command, the first continuation is the goal turn, sent once: `/goal {goal condition}` alone, with what remains named in the next message (Phase 3) — a goal command reads everything after `/goal` as its objective, within a length limit the brief can exceed. Every continuation goes to the same session. A runner that cannot be launched is reported with what is missing, and the skill stops there.

## Phase 3: Reading and Continuation

After each pass — the launch, the goal turn, each continuation — has ended:

1. **The pass.** Read what the runner delivered: its exit or completion status and its final report. The pass **failed** where the status is not a success, its last turn ended in an error, or it was aborted. A report is **whole** where it restates the research report as a whole; the **current report** is the latest whole one. A pass whose report is not whole — a goal turn's acknowledgement — leaves the current report as it was. What Phase 4 shows of a report is shown verbatim — nothing rewrites it.
2. **The record.** Read the run's own tool record — its transcript or event stream. A **successful Tavily call** completed without an error flag and is Tavily's search or extract tool on whatever server provides it: its name, or its last `__` segment, is exactly `tavily_search`, `tavily-search`, `tavily_extract`, or `tavily-extract`; research, crawl, and map calls and every other tool are not counted. A structured response — JSON carrying a `results` array — lists what the call returned: each entry's `url`, verbatim; what a call asked for is never read. Any other response — formatted text, as some Tavily servers return — is read by this session itself in step 3. A page the run fetched another way — a built-in web search, a shell `curl` — is outside this record.
3. **The reading.** Read the current report against the URLs the record returned and extracted, and against each call's response that is not structured — a source found there counts as returned or extracted by this session's reading: each citation is **returned by this run**, **extracted by this run**, or **not found in this run's Tavily record**, and a `verified` label on a source this run did not extract is said so. Matching a citation to the record is this session's reading: variants of one source — a DOI link and the publisher page, http and https, a trailing slash — are the same source; another version of a paper is another source, unless the record shows the claim's text in the version the run extracted. Note what the report's form misses: a claim with no citation, an absence or novelty claim with no reach record, an empirical effect with no replication or retraction status, a recalled detail not marked reconstructed. Every judgment here is this session's reading, marked as such.
4. **Continue or stop.** The **gaps** are the citations not found, the `verified` labels on sources not extracted, the uncertainties neither filled by a citation nor returned open with their reach, and what the report's form misses (step 3); an item that is the person's to settle is never a gap. A **failure** is shown only by positive evidence: a failed pass, one whose record is truncated or malformed included; no successful Tavily call in the run; or Tavily shown unavailable to the run (the error patterns say what shows it). The goal is met when the latest pass delivered a whole report with no gaps and no failure stands — a failure stands until a later pass recovers it; a pass that returns only part of the report leaves the goal unmet. Otherwise continue the same run while it is moving toward the goal condition — this session's judgment. Every continuation but the goal turn names everything still missing: failures first, a reply that was not whole among them — ask for the whole report — then the current gaps. A problem already named once that is still there after the next pass is not named again: stop, and report it with what remains. Only the goal turn's acknowledgement is exempt, since it answers no named problem. A **harness failure** — the launch cannot start, or the run's record cannot be reached — is reported directly, with its cause. What remains returns open to the user.

A continuation goes to the same run, not a new one, with this message:

```
The goal condition is not met yet. Continue toward it in this same session, then return the whole report again, updated.
What to address:
- {each failure and gap, one line each}
```

A failure is named plainly with what to do — "no Tavily call succeeded — use Tavily search and extract for the sources", "your last turn ended in an error — continue and return your whole report". Naming each problem once bounds the repeats; whether the run is still moving toward the goal is this session's judgment, and a pass that only trades one gap for another is not moving — stop, and report what remains.

When the loop has ended and the result is presented, remove what this skill wrote; a session a CLI keeps in its own store is the user's to remove.

## Phase 4: Output

Present the source check first, then the items the run returned as the user's to settle, then the trace:

```
## Goal Research Result

Target: {research_question}
Runner: {what ran — a Claude subagent, the `claude` CLI, or codex}
Passes: {passes} — stopped: {goal met | a named problem persisted | not moving | harness failure: {cause}}

--- Source Check ---
{which pass's report is current; then any failure, raw — "no successful Tavily call: nothing in the report was retrieved through the designated route; its claims stand as the runner's own, open, unchecked", a failed pass, a harness failure;
 otherwise the record: {calls} successful Tavily calls, {unstructured} with responses that are not structured;
 then, as this session's reading: each citation not found in this run's Tavily record, each `verified` label on a source this run did not extract, what the report form is missing, and the gaps that remain}

--- Yours to Settle ---
{each item the run returned as the user's, with what it needs; or "none returned"}

--- Trace ---
{the current report in full, headed "Pass k"; every pass after it verbatim, a failed pass with its raw error; from passes before it, each reply that was not whole, verbatim, and each failed pass with its raw error; whole reports the current one superseded, listed by pass number only}
```

The items to settle are lifted from the trace and presented to the user as theirs; neither the runner nor this session answers or settles them, and work that rests on one waits for the user's words.

## Rules

- The research question is embedded verbatim — no paraphrasing before passing it to the runner.
- The runner is the designated one, `claude` when none is designated; the research runs in the background, so the main session is free until each pass ends.
- A run is not required to succeed in one pass; a failure is not masked, does not start a new run, and does not fall back to the other runner.
- The record is read for what is unambiguous there; citations are checked against it by this session, each judgment marked as its reading; the report itself is forwarded unedited.
- The skill is a delegation channel only — interpretation, follow-up questions, and downstream protocol routing belong to the main session after the trace returns.
