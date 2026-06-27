# Diylisis F5 Residual — Re-scope against HEAD (issue #524)

> Design re-scope for issue #524. The issue was filed against diylisis **0.3.0**
> (runtime 0.2.4) and proposed three fixes. diylisis is now at **0.4.13**. This doc
> verifies each proposed fix against the current spec and re-scopes the issue to the
> one genuinely-open residual.

## Premise check: two of the three fixes already landed

#524 named one observed convergence carrying two session-tethered defects, and traced
them to three spec gaps with three proposed fixes. Verified against
`diylisis/skills/distill/SKILL.md` @ 0.4.13:

| #524 fix | Status at HEAD | Evidence |
|---|---|---|
| **fix#1** — force fresh-subagent in F5 (close the self-simulation disjunction) | **LANDED** | F5 is now platform-laddered: `F5Realization ∈ {refuter-subagent, generic-subagent, lint-fallback}` (L98); the lint branch is "last resort … only where no subagent surface exists" and "loses fresh-context isolation … verdict must name the fallback it ran under" (L325, Rule 9). Author self-simulation excluded throughout. Merged via #527/#528 (`cead11c`, `6d0b52f`, `974a858`). |
| **fix#2** — `StableRef` durability predicate | **LANDED** | `StableRef = { kind, locator, lifetime: "durable" \| "volatile" }` (L63); `durable(locator)` defined (L64) with the exact `/tmp`, `/var/folders`, `$TMPDIR`, OS-cache root list; `StablePointer requires StableRef.lifetime = durable` (L74); Rule 21 "Durable grounding"; UX Safeguard "Durable grounding" (L377). Commit `2257b2e` ("F2 StableRef durability predicate로 휘발성 locator 차단"). |
| **fix#3** — emit-prose deixis re-scan + disposition-consistency | **PARTIAL** | See decomposition below. |

So the brief's framing ("design the residual fix#2 and fix#3") is **partly
superseded by HEAD**: fix#2 is fully implemented. Defect 1 from the field case
(four `/tmp` ROUTE refs) would now fail F2's `durable(locator)` and be repaired
(inline / relocate) before disposition. This re-scope replaces the stale fix#2 design
ask with a verification: **fix#2 is closed; confirm and move on.**

## fix#3 decomposed — what's covered, what's residual

#524's fix#3 bundled two distinct defenses. They have different statuses at HEAD.

### fix#3(a) — emit-prose undefined token ("D1–D5"): now covered by hardened F5

The field defect was an emit-prose token (`"리뷰 피드백(D1–D5) … 완료"`) where "D1–D5"
is session-local discussion numbering with no substitution-table entry. #524 itself
noted that **fix#1 and fix#3(a) compose**: a fresh subagent given *only the emit text*
structurally cannot resolve "D1–D5", so hardened F5 alone catches it.

fix#1 is now landed, and F5's inputs are explicitly *"the candidate handoff text
(inline) … reference resolvability is judged against the allowed sources and
verification commands the document grants"* (L325) — the refuter sees only the emit,
not the author session. Its fixed category checklist includes *"coined names without
in-document definition, session identifiers, deictic anchors, unresolvable
references"* — "D1–D5" lands squarely in that sweep. **So defect 2a is now caught by
F5 in its primary (subagent) realization.**

Residual sliver: in the *lint-fallback* realization only (no subagent surface), F5
runs in the author session and loses fresh-context isolation — the author silently
shares what "D1–D5" means, so the emit-prose token could still slip. An explicit
emit-text re-scan leg (fix#3a) would harden the fallback tier specifically. This is a
**low-value, narrow** hardening: it only matters on platforms with no subagent
spawn at all, and the spec already marks that tier as weakened-by-design.

### fix#3(b) — disposition-consistency drift: the genuinely-open residual

The second half of the field defect is **factual drift**: the emit prose claimed
review item D2 was "반영" (reflected) when D2 was actually **DROP**'d at the Gate
(user handles it directly). This is not an unresolvable token — it is an emit-prose
**claim about a Gate disposition that contradicts `Λ.history`**.

No current gate catches it:

- **F5 refuter** sees only the emit text and the contract; it has no access to
  `Λ.history`, so it cannot know D2 was DROP'd. If the claim uses only resolvable
  tokens ("all review feedback reflected"), the refuter passes it.
- **F6 leak lint** (`leaked_drops`, L107) catches a DROP'd item's *discriminating
  content* surviving into the emit. A *meta-claim about disposition* ("D2 was
  reflected") need not carry D2's discriminating content — it asserts a false status,
  not leaks D2's substance. `leaked_drops` does not fire.
- **F6 `unclean_deltas`** governs re-distillation CorrectionDelta hygiene, unrelated.

So a prose sentence asserting that a DROP'd / Defer'd item was done passes every gate.
This is a real, narrow, spec-level hole: **emit-prose claims about per-item Gate
dispositions are never cross-checked against `Λ.history`.**

## Design of the residual fix (fix#3b — disposition-consistency check)

Add a sixth measure leg to F6 that is the *disposition dual* of the leak lint. Where
`leaked_drops` checks "did DROP'd *content* leak into the emit?", this checks "does
the emit *assert a disposition* that contradicts the item's actual `Λ.history`
disposition?"

- **Domain**: the same `emit_candidate(Λ)` channels F6 already lints (contract ∪
  prose ∪ task_state ∪ residual_ledger ∪ emitted_deltas).
- **Detection** (heuristic, prose-operational — no NLP claim): for each item with a
  terminal non-KEEP disposition in `Λ.history` (DROP, Defer-released), if the emit
  asserts a completion/reflection/inclusion claim *about that item* (by its
  discriminating tokens or by an enumerating claim that ranges over it), the claim is
  a **disposition-drift** defect.
- **Measure leg**: `|disposition_drift|` added to `measure(Λ)` (L110), weakly
  decreasing like the other legs, blocking the fixed point until zero.
- **Repair**: rewrite the offending emit claim to match `Λ.history` — either drop the
  claim or restate it to the item's actual disposition. Like the leak repair, nothing
  re-enters the residual ledger (the disposition was already user-decided at the
  Gate); the defect is the emit *misreporting* it, and the fix is correcting the
  emit.

This stays inside F6's existing monotone-measure machinery (no new phase, no new
gate, no Constitution interaction — it's a deterministic emit-hygiene check, A2
Extension / relay), so it composes with the existing leak lint without disturbing
convergence semantics. It is the natural completion of the F5↔F6 duality the spec
already states: F5 catches *missing* content, leak-lint catches *leaked* DROP content,
disposition-drift catches *misreported* dispositions.

## Recommendation (per sub-fix)

1. **fix#1, fix#2 — CLOSE.** Both fully landed at 0.4.13. The field-case defect 1
   (volatile `/tmp` refs) is now structurally repaired by `durable(locator)`; the
   emit-prose token (defect 2a) is caught by hardened F5 in its primary realization.
   Recommend updating #524 to mark these resolved with the commit citations above.
2. **fix#3(a) emit-text re-scan — DECLINE as a standalone leg (re-scope to a note).**
   It is redundant with hardened F5 except in the no-subagent lint-fallback tier,
   which the spec already marks weakened-by-design. Adding a permanent F6 leg to
   harden a tier that exists only where no better realization is possible is low
   payoff. Record it as a known-limitation note on the lint tier instead.
3. **fix#3(b) disposition-consistency — ADOPT (the genuine residual).** This is the
   one defect with no current gate. It is small, deterministic (relay/Extension), and
   completes the stated F5↔F6 duality. Recommend implementing the `|disposition_drift|`
   measure leg above.

**Open fork for the human:** the only live decision is fix#3(b)'s *scope*:

- **(i) Minimal** — `|disposition_drift|` over **DROP**'d items only (the field
  case). Smallest diff; catches the observed defect.
- **(ii) Full** — extend to **Defer-released** items too (Defer = released-not-retained
  per the Λ invariant), since a Defer'd item asserted as done is the same class of
  drift. Marginally larger; closes the symmetric hole.

Recommended: **(ii) Full** — Defer-released items share DROP's "released from emit"
semantics, so excluding them would leave a sibling hole open; the extra cost is one
predicate in the detection domain. But this is a genuine value call (minimal-diff vs
symmetric-completeness) for the maintainer.

## Spec-edit sketch (fix#3b, scope (ii))

In `diylisis/skills/distill/SKILL.md`:

- **TYPES / F6 measure** (near L107–110): add
  `disposition_drift(Λ) = { claim ∈ emit_candidate(Λ) : claim asserts completion/inclusion of item d ∧ Λ.history(d) ∈ {DROP, Defer-released} }`
  and extend `measure(Λ) = |unresolved_anchors| + |unmet_stop| + |schema_gaps| +
  |unsurfaced_residual| + |leaked_drops| + |unclean_deltas| + |disposition_drift|`.
- **F6 prose** (L352): add the disposition-drift leg alongside the leak lint, with the
  "rewrite the claim to match `Λ.history`; nothing re-enters the residual ledger"
  repair.
- **Rules**: add a short Rule (sibling to Rule 18 "Emit-time leak lint") —
  *"Disposition-consistency: an emit claim that a DROP'd or Defer-released item was
  done/reflected/included contradicts `Λ.history` and blocks the fixed point; repair
  by correcting the emit."*
- **UX Safeguards**: one row mirroring "Emit-time leak lint".
- Patch version bump in `diylisis/.claude-plugin/plugin.json`; run
  `node .claude/skills/verify/scripts/static-checks.js .` (FAIL 0) and the diylisis
  tests. Semantic-closure sweep: the new measure leg needs its type, guard, state
  update, termination path (drives `measure → 0`), and the F5↔F6 duality prose
  aligned — per the project's terminal-condition sweep requirement.
