---
name: rederive
description: "This skill should be used when choi names the next protocol whose Lean contract PR is to be reviewed and re-derived on the fused context, or invokes /rederive. Runs the per-protocol flow from reading the translated PR against main to the merge and the chart close. Project-local contributor tooling."
allowed-tools: Bash, Read, Grep, Glob, Agent, Skill
---

# Re-derive a protocol contract

One protocol per run. Anchor chart: the protocol's own `ROO-*` chart; suite-wide ground: ROO-67. Read both charts' decide comments before step 1 — they carry the settled shape this flow applies.

## Steps

1. **Trigger** — choi names the protocol. Resolve its open Lean PR (`gh pr list --state open`) and chart (branch name carries the id). The order across protocols is choi's and session-local; nothing here fixes it.
2. **Read against main** — build a scratch tree: `git worktree add --detach <scratch> origin/main`, merge the PR branch into it. Run `node .claude/skills/verify/scripts/lean-contract.js generate . && lake build --wfail` and `node .claude/skills/verify/scripts/static-checks.js .`; record failures, fix nothing. Remove the scratch tree.
   - Termination graph: every way a run ends, and who closes it (person · AI relay · evidence).
   - One real-use scenario: `~/.claude/projects/*/*.jsonl` sessions where choi typed the command (exclude `-private-tmp*`); replay where the contract bites.
   - Apply the checklist below with `file:line` evidence.
3. **Diagnosis → direction** — state translation or re-derivation with its ground, then stop: the direction is choi's. On the answer, write the direction decide on the protocol chart (`/unfold decide`; draft, choi culls, then write).
4. **Sketch** — before/after flow, a table of what changes, what stays, and the scenario replayed on the new shape. Present choices whose cost the reader bears as a gate; relay choices analysis settles, citing the decide that settles them.
5. **Literature grounding** — delegate to a subagent: primary sources bearing on the sketch's open choices (e.g. presentation load, anchoring on AI drafts). Every claim carries its verification strength and names the weakest link (`AGENTS.md` §Settled Directions, Academic grounding). Feed findings into the gate, never as a verdict.
6. **Independent consult** — `/codex-plus:codex` with an English prompt carrying the material and the question, conclusions withheld; compare with this session's reading and report agreements and splits.
7. **Decides** — one per settled point: protocol-local → the protocol chart; suite-wide → ROO-67. Each via `/unfold decide`.
8. **Edit in a fork** — a fork in a worktree on the PR branch, given the decide ids as its spec:
   - rebase onto `origin/main`;
   - commit A: GROUND copied from `lean/EpistemicProtocols/Ground.lean`, model judgments as documented `axiom`, a `Nonempty` instance per axiom type in `lean/EpistemicProtocols/<Namespace>/Proofs.lean`;
   - commit B: the re-derivation;
   - plugin version: one minor step over main's (ROO-67 decide db1de854);
   - verify: `lean-contract.js generate` + `lake build --wfail`, static checks, the `AGENTS.md` §Development test bundle, and `static-checks.test.mjs` in its own `node --test` run;
   - one codex review round; PR body carries the record and `Part of ROO-67`; no merge.
   Check the fork's report against the branch and CI before relaying it.
9. **Dogfood** — run the new `SKILL.md` by hand in this session on a live target. Each mismatch → a gate → choi's answer → a decide → a fork fix → re-judge. Close the run with the intents taken, quoting choi's words.
10. **Merge and close** — merge only on choi's instruction. Then `/unfold close` on the protocol chart: structure delta, closing note with commit and PR locators, follow-ups with one pointer back.

## Checklist (step 2)

- **Translation or re-derivation** — does a stage machine (projected gate or phase state) return inside the fused context; do rule chains that guarded a changing Λ survive (premise "Cases in Place of a Judgment")?
- **Origin and standing** — is an AI-proposed value the person takes recorded as adopted, with who proposed it kept apart (`Proposer` × `Standing`)?
- **Adoption condition** — is adoption read as "taken with the deciding evidence and the AI's contrary grounds in view" (`Covered`), not as "re-show when a value changes" rules?
- **Place of observation** — is evidence adoption needs observed before the presentation, not after closure?
- **Person's value after an upstream edit** — is its reach read from the person's words on the fused context as it now stands, with no fixed read-once layer (ROO-67 decide 8b9cf1c3), and not by key equality?
- **Closure kinds** — are withdrawal and a person-named route result constructors, kept apart from the AI's relay?
- **Presentation** — for a protocol that revises a map or plan: the current sheet plus a change ledger; a picture only where paths diverge; each re-drafted line marked necessary consequence or proposal.
- **One slot, two meanings** — does any field carry two orthogonal meanings at once?
