---
name: rederive
description: "This skill should be used when choi names a core protocol whose Lean contract is to be re-derived, or invokes /rederive. Runs the per-protocol flow: gather the pre-understanding, derive the protocol's epistemic solution and fuse it with choi's horizon, then read the current contract against it, through sketch, edit, dogfood, merge, the chart close and a retrospective on this skill. Project-local contributor tooling."
allowed-tools: Bash, Read, Grep, Glob, Agent, Skill
---

# Re-derive a protocol contract

One protocol per run. The object is the core protocol itself — its `SKILL.md` on `origin/main`; an open PR whose branch carries the chart id, where one exists, is one more piece of material, never the anchor. Anchor chart: the protocol's own `ROO-*` chart; suite-wide ground: ROO-67.

**What a re-derivation answers to.** The target is the morphism that the `AGENTS.md` Northstar and the premise axiom Context and Utterance as First-Class Ground (`premise/recognition-and-authority.md`) admit, in the form `lean/EpistemicProtocols/Ground.lean` fixes: the fused context — turns bound to who sent them — and the person's utterance are the ground; the structure fixes only what the harness knows; everything else is the model's inference, declared as a documented judgment inside the types. The solution is derived from the gathered pre-understanding and taken at the fusion gate before the current contract is read; the pre-Lean DSL, the current block, any open PR and earlier decides are evidence read against that solution, never the target.

## Steps

1. **Trigger** — choi names the protocol. Resolve its chart; where the protocol's earlier chart is Done, open a new chart linked to it and to ROO-67 (ROO-67 decide 5e64392d). The order across protocols is choi's and session-local; nothing here fixes it.
2. **Gather the pre-understanding** — afresh every run, since what it holds moves between runs:
   - Ground: the Northstar, the premise axiom above, `Ground.lean`, and the protocol's declared deficit and resolution type — its Type line and Definition only, not the formal block; the fusion gate may revise them.
   - Decide coordinates: both charts' decide comments, the protocol chart's Open questions and its related issues; a later decide that supersedes an earlier one says so (ROO-67 decide 78e615b4).
   - Literature: delegate to a subagent — primary sources on the cognitive deficit this protocol takes and the resolution it yields. Every claim carries its verification strength and names the weakest link (`AGENTS.md` §Settled Directions, Academic grounding).
   - Real use: `~/.claude/projects/*/*.jsonl` sessions where choi typed the command (exclude `-private-tmp*`); what the deficit looked like there, and where the run went wrong or right.
3. **Derive the solution** — from the gathered material, not from the current block: deficit → resolution, the coordinates only the person fills, the closure kinds, and the conditions that hold only where a ground carries them — Northstar, premise, literature, choi's utterance, a decide, or observed use; any other morphism step is scaffolding, carried as guidance on a documented judgment (ROO-67 decide 0d3b1e3b). Each part names what grounds it.
   - Independent derivation: `/codex-plus:codex` with an English prompt carrying the locations of the gathered material, the literature findings as a file, and the question this step answers — never this session's solution; it may read beyond the list. Compare the two derivations part by part.
4. **Fusion gate** — present the derived solution beside the ground of each part, where the independent derivation agrees and splits, the real-use reading, the contrary grounds and live alternatives with their consequences, and the limits of what was searched. Branches:
   - choi takes it → write the solution decide on the protocol chart (`/unfold decide`) and go to the reading step;
   - choi corrects or replaces part of it → fuse the utterance and derive again;
   - the correction moves the pre-understanding (a source, a decide, a reading of use) → gather again where it moved, then derive;
   - choi stops → the run ends; what was gathered and derived is recorded on the protocol chart;
   - no utterance → the gate holds; nothing is taken.

   **Re-entry.** A later finding — in the reading, the sketch, the sketch consult, or dogfood — that moves the ground of a taken part returns the run to the earliest step that part depends on and then to this gate, naming the part it moves; parts whose ground did not move stand. A pass that moves no ground re-opens nothing.
5. **Read the current contract against the solution** — in a scratch tree at `origin/main` (`git worktree add --detach <scratch> origin/main`), with the open PR branch merged into it where one exists. Run `node .claude/skills/verify/scripts/lean-contract.js generate . && lake build --wfail` and `node .claude/skills/verify/scripts/static-checks.js .`; record failures, fix nothing; remove any scratch tree.
   - Pre-Lean diff: the block's last DSL version is the parent of the first commit that put a `lean` block in that `SKILL.md` (`git log <ref> --reverse --format=%h -S'```lean' -- <SKILL.md> | head -1`, then `<sha>^`). Walk it clause by clause against the current block, and list every field read with no write or written with no read on either side. For each obligation that is gone, `git log -S'<clause or field>'` and `git blame` find the commit that removed it; a decide or a commit message that states the removal marks it intended, anything else is a regression reported with its locator. Each lost obligation carries a disposition to the sketch gate — held elsewhere in the solution, retired on a named ground, or a challenge to the solution that goes through re-entry.
   - Ablation row: the protocol's row in the ROO-67 document of the second Λ ablation pass (the #961 four: the first pass), its GROUND terms read against decide 78e615b4.
   - Termination graph: every way a run ends, and who closes it (person · AI relay · evidence). An unanswered checkpoint that requires the person's answer holds; nothing auto-selects.
   - Replay the real-use scenario where the current contract bites.
   - Apply the checklist below with `file:line` evidence. The result is a diagnosis: what the current contract carries that the solution does not, and what it lacks. Where it lacks nothing and carries nothing extra, the run goes to the close with that diagnosis recorded on the chart.
6. **Sketch** — before/after flow, a table of what changes, what stays, and the scenario replayed on the new shape. Present the lost obligations with their dispositions and the choices whose cost the reader bears as a gate. A sketch choice the gathered literature does not reach sends one targeted search back to the gathering step, fed into the gate, never as a verdict.
7. **Sketch consult** — `/codex-plus:codex` with an English prompt carrying the sketch's material and question, conclusions withheld; compare with this session's reading and report agreements and splits.
8. **Decides** — one per settled point: protocol-local → the protocol chart; suite-wide → ROO-67; a principle that holds beyond this repository → a proposal on the premise chart (ROO-77), never a `premise/` edit in this PR. Each via `/unfold decide`.
9. **Edit in a fork** — a fork in a worktree, given the decide ids as its spec, on the open PR's branch rebased onto `origin/main`, or on a new branch from `origin/main` carrying the protocol chart id:
   - commit A, where the contract is not yet in this shape: GROUND copied from `lean/EpistemicProtocols/Ground.lean`, model judgments as documented `axiom`, a `Nonempty` instance per axiom type and each guarantee stated and proved together in `lean/EpistemicProtocols/<Namespace>/Theorems.lean`;
   - commit B: the re-derivation;
   - plugin version: one minor step over main's (ROO-67 decide db1de854);
   - verify: `lean-contract.js check` (generate, `lake build --wfail`, `lake lint`) and `lake test`, static checks, the `AGENTS.md` §Development test bundle, and `static-checks.test.mjs` in its own `node --test` run;
   - one codex review round; PR body carries the record and `Part of ROO-67`; no merge.
   Check the fork's report against the branch and CI before relaying it.
10. **Dogfood** — run the new `SKILL.md` by hand in this session on a live target. Each mismatch → a gate → choi's answer → a decide → a fork fix → re-judge. Close the run with the intents taken, quoting choi's words. This dogfood is the run's runtime evidence.
11. **Merge and close** — merge only on choi's instruction. The close runs whatever status the chart shows: `/unfold close` on the protocol chart — structure delta, closing note with commit and PR locators, follow-ups with one pointer back.
12. **Skill retrospective** — after the close, read this run for where the flow sent it around and where choi brought something in at a gate. Present each candidate with its ground (a source, a decide, the premise, or this run's trace), the surface it reads as belonging to — this skill, the protocol chart, ROO-67, or a premise proposal on ROO-77 — and what it would make unnecessary here. Branches:
    - choi takes a candidate → it lands where choi placed it; a change to this skill is its own commit under ROO-67;
    - choi corrects or re-places one → fuse and present again;
    - no utterance → nothing changes.

## Checklist (reading step)

- **Translation or re-derivation** — does a stage machine (projected gate or phase state) return inside the fused context; do rule chains that guarded a changing Λ survive (premise "Cases in Place of a Judgment")?
- **Λ ablation** — each state field: a projection of the fused context → deleted; the occupant of an open coordinate → a `Coord` with citation, admits and supports; harness state (interrupt, steering, persistence) → a named delegation point, not a type; none of these → removed.
- **Gate earns its place** — a judgment gate stands where its answer is irreversible or is the held judgment the closure needs; a reversible step the person can interrupt through the harness takes no added gate. Reversibility grants no relay.
- **Relay reach** — the AI fills a judgment coordinate only where reachable evidence settles it or a grant covers it; discretion is not relay; a delegated fill is recorded as the AI's.
- **Origin and standing** — is an AI-proposed value the person takes recorded as adopted, with who proposed it kept apart (`Proposer` × `Standing`)?
- **Adoption condition** — is adoption read as "taken with the deciding evidence and the AI's contrary grounds in view" (`Covered`), not as "re-show when a value changes" rules?
- **Place of observation** — is evidence adoption needs observed before the presentation, not after closure?
- **Person's value after an upstream edit** — is its reach read from the person's words on the fused context as it now stands, with no fixed read-once layer, and not by key equality?
- **Closure kinds** — are withdrawal and a person-named route result constructors, kept apart from the AI's relay?
- **Next move** — is a hand-off set only by a chain the person declared, an adopted routing policy, or an explicit grant, with document edges and AI tags presented as proposals?
- **After closure** — is the AI's contrary ground shown before the gate and attached to the closure record when the person closes over it; is re-raising bound to new evidence, and owed before a dependent irreversible step; is "accepted, evidentially disputed" representable; does the AI never rewrite or veto the closed value?
- **No premature typing** — does the sketch close a model judgment (item identity, per-item kind, turn form) into a type? Keep it a `supports` judgment until dogfood observes that judgment failing.
- **Presentation** — for a protocol that revises a map or plan: the current sheet plus a change ledger; a picture only where paths diverge; each re-drafted line marked necessary consequence or proposal.
- **One slot, two meanings** — does any field carry two orthogonal meanings at once?
