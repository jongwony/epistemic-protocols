# Periagoge `/induce` — 4-Lens Expert Review (Layer 3 then-record)

- **Artifact**: `periagoge/skills/induce/SKILL.md` @ `bb42d63a`
- **Question (user, verbatim)**: 타입 이론과 카테고리 이론의 전문가 관점에서 리뷰를 한번 해주시면 좋겠습니다.
- **Method**: four lenses run as isolated subagents with **no shared pre-briefing**, each reading the artifact itself; then two rounds of dialectic in which each lens's self-declared Horizon Limits were used as the attack surface by the others.
- **Ledger read before dispatch**: `325ea647`, `382d3408`, `bb42d63a`.

Layer 3 per `design/README.md` — 설계 결정의 **근거**와 **폐기된 대안**의 기록, 런타임 비참조.
Placement note: `CLAUDE.md` §Design Placement routes evidence reviews to a deliberation
surface (issue/PR body) and bars `docs/`. This file exists because the producing session was
not durable. When this reaches a PR, the PR body is the proper home and this file should be
reconsidered rather than kept by default.

---

## 0. Why isolation, and what it bought

Each lens was given the artifact path, its own lens question, a fixed 4-part directive
(Epistemic Contribution / Framework Analysis / Horizon Limits / Assessment), and the same
supporting-context reading list. It was **not** given the other lenses' findings, the ledger
rationale, or the known-open questions. Agreement produced inside one context is not
convergence; agreement produced across four is evidence.

The residual contamination vector, stated plainly: **all four received the same reading list**
(`type-category-convention.md`, `protocol-repair.md`, `structural-specs.md`, `CLAUDE.md`,
three `premise/` files). Those documents do not contain any of the findings, but they do
supply shared judgment criteria. The four *methods* were independent — signature purity,
arrow composability, reachability enumeration, causal ablation — and that is what the
convergence rests on.

---

## 1. The three items the ledger's single "open question" actually contains

This is the review's central result and it answers the question the ledger recorded as
deliberately open.

`325ea647` reported one judgment-needed item: *"MORPHISM의 propose(candidate, grounding,
calibration)과 TYPES의 Propose = (Ii, E, K, ctx) -> (P, G)가 propose의 인자 수에 대해 서로
다른 말을 한다."* All four lenses, independently, landed on material inside that heading —
and the debate established it is **three separable items with different resolution kinds**.

### (i) The arity disagreement — a well-formedness defect, closed by reading the file

`MORPHISM:28` `propose(candidate, grounding, calibration)` vs `TYPES:70`
`Propose = (Iᵢ, E, K, ctx) → (P, G)`.

LENS 2 established which side is malformed: `candidate` is `P` and `grounding` is `G` — the
two things `Propose` **produces**. `MODE STATE:131` types both `Option(...)`, both `None`
until Phase 1 completes. The arrow is unsatisfiable at its own call site, and its own trailing
comment gives it away — "AI **generates** candidate + personalized example + calibration map."

`L` does **not** need a widened `Propose`: it factors through `Calibrate`'s codomain as
`K.label_basis` (`:51`, `:56`), and that triangle commutes by construction. LENS 3 supplied
the reason this rescue works here and cannot work for (ii): `L` is a **Phase-0 constant**,
fixed before `K`'s inputs are, so `K` legitimately memoizes it.

**Resolution**: repair `:28` to match `:70`. Has a truth value; settled by reading.

### (ii) The move-routing gap — a choice of object, never actually deliberated

`Fuse(adjacent)` (`:74`, `:108`), `Reorient(axis)` (`:75`, `:109`), and `candidate'` (`:101`)
reach **no argument position** of Phase 1. Verified by grep at orchestrator level: `axis`
occurs at `:12` (prose), `:71`, `:75`, `:109`; `adjacent` at `:12`, `:71`, `:74`, `:108`,
`:123`, `:153`. Neither ever appears in `Calibrate(Iᵢ, E, L?, ctx)` (`:50`),
`Propose(Iᵢ, E, K, ctx)` (`:70`), or `Phase 1: (Iᵢ, E, L?)` (`:99`).

LENS 3's asymmetry argument: `adjacent` and `axis` arrive at **Phase 3**, after `K`'s entire
input tuple is already fixed. Factorization provably cannot rescue them.

This survives the `:28` repair untouched. It is not a typo to correct — LENS 2's framing:
*"it is which category the protocol lives in."* Is Phase 1's domain `(Iᵢ, E, L?, ctx)` or
`(Iᵢ, E, L?, ctx) × Option(P) × Option(V)`? `type-category-convention.md:37` names both
candidate repairs (widen the field, or let an existing path absorb the case).

**LENS 1's final formulation, endorsed by LENS 2 and LENS 3:** the ledger's "deliberately
open" status attaches to the wrong question. (i) is closed by a one-line repair. **(ii) was
never deliberated — it is open by omission, not by decision.**

`325ea647` rejected widening `Propose` while reasoning about (i), citing `:28` — the broken
line — as its authority. It reached the right conclusion on the wrong ground for (i) and never
reached (ii). `bb42d63a`'s removal of the "Move-typed shaping" Rule was correct for (ii): the
Rule presupposed an answer to a live design question.

### (iii) `neighbors` — the gate's own option set is not a function of declared state

`:153` "Omit Fuse when no adjacent candidate surfaced"; `:151` presents "surfaced neighbors."
`neighbors` is in no block — not TYPES, not `K` (`:51`), not `P` (`:67`), not `Propose`'s
codomain (`:70`), not Λ (`:130-135`). Verified: `neighbor` occurs only at `:74`, `:145`,
`:151`.

LENS 3's statement, the sharpest in the review: **`Out(Λ)` is not a function of the declared
state — two runs with identical Λ admit different edge sets. The spec is therefore not a
transition system over Λ.**

Composite effect with the free-response gap: when `neighbors = ∅`, `Fuse` is not deleted, it
is **demoted** from a typed constructor into the untyped free-response channel — where it has
no write target and no `history` entry. The same user act is traced when a neighbor surfaced
and untraced when one did not, with the difference controlled by a quantity nothing records.

Separate endpoint from (ii): (ii) is a *domain* defect at the Phase-1 target; (iii) is a
*codomain* defect at the Phase-2 source. Disjoint repairs.

---

## 2. Defects found, with the lens that owns each

Ranked by what a maintainer should touch first (LENS 1's re-ranking after the enforcement
facts landed), not by formal decisiveness.

| # | Defect | Lines | Found by |
|---|---|---|---|
| 1 | `Λ.history` element is one field short and one field long — stores `G` (read by nothing) and omits `candidate'` (required by `:83`, `:105`, `:113`) | `:132` vs `:83`/`:113` | L1, L3, L4 |
| 2 | `Λ.candidate` has **no writer anywhere**. Verified: zero occurrences of `Λ.candidate :=`. The only assignment claim lives in MORPHISM `:36` ("candidate mutates per user move"), a `preserves:` clause | `:101`, `:131` | L3 (self-corrected), L4 |
| 3 | Both non-crystallizing exits produce nothing — five rounds of history and an undisposed `K.open` discarded silently | `:21`, `:110` | L1, L3 |
| 4 | `free_response` consumed and never produced. Verified: **one** occurrence in the file, at `:105`, on the consuming side | `:105` | L2, L3, L4 |
| 5 | `neighbors` gates the constructor set; no producer, no Λ field | `:151`, `:153` | L2, L3, L4 |
| 6 | `OpenTrace.status` is stored **and** derived, with nothing binding them — making representable the exact disagreement `:43-44` designs against, three lines earlier in the same block | `:62` vs `:65` | L1, L2 |
| 7 | `status(O)` is written unary but `K` is free in its first clause; `Λ.calibration : Option(K)` so `K.open` can be undefined. Composed repair: delete the stored field, rewrite the `None` branch as `O.items = ∅` | `:65`, `:131` | L1 |
| 8 | Terminal census: four terminals; FLOW under-counts by one, CONVERGENCE by two, MORPHISM by three. `:112`'s termination claim is false at the Dismiss-deactivate exit | `:20-22`, `:110`, `:112`, `:116-118` | L3, corroborated L1/L2, defended by L4 |
| 9 | `crystallize(candidate)` and `derive(…, candidate')` on one line select opposite sides of the prime; `:85` selects the unprimed | `:101`, `:105`, `:85` | L1 |
| 10 | MORPHISM's parenthesis obeys **no** stable convention: argument-list reading holds at 5/7 arrows and fails at `:28`, `:29`; "what the step concerns" reading is unfalsifiable | `:25-33` | L2 |
| 11 | `triangulate` (`:29`) names an operation no other block realizes — FLOW/TYPES/Phase 2/TOOL GROUNDING all call it `Qs` | `:29` | L2 |
| 12 | `framing` consumed at `Qs` in two blocks, declared nowhere | `:19`, `:100` | L2, L3 |
| 13 | `direction ∈ {upward, lateral}` fails the project's own dispatch-structure and openness tests — nothing branches on it, and its three sibling payloads are open natural-language carriers | `:72` | L1, L4 |
| 14 | `progress(Λ)` computed, read nowhere, and its only rendering forbidden by `:155` and by the Output Style's non-linear-loop clause | `:117` | L1, L3, L4 |
| 15 | `early_exit` is a pure alias with no consumer | `:118` | L1, L3, L4 |
| 16 | `K.label_basis` computed at Phase 1, never rendered (`:151` enumerates Keeps/Sharpens/Prunes/Open), never read | `:51`, `:56` | L4 |
| 17 | `CrystallizedAbstraction`'s last two conjuncts take **type names**, so the refinement collapses to `{p : P \| confirmed(p)}` | `:85` | L1 (downgraded to (c) in debate) |
| 18 | `OpenItemDisposition = OpenDisposition \ {None}` inverts the dependency — the per-item space is prior. `OpenDisposition = 1 + OpenItemDisposition` states `:61`'s own comment structurally | `:61` | L1, L2 |

### What is sound — recorded so the file is not read as uniformly negative

- **`DetectResult` (`:42-44`)** is a correct closed coproduct and the comment states the
  correct reason. Three lenses said so independently.
- **Termination (`:79-82`, `:101`, `:111`)** is genuinely well-founded and *proved* rather
  than asserted. LENS 3 surveyed ten sibling protocols: **none** appends unconditionally on
  every loop edge. Because Phase 3's append is on the single mandatory edge, deriving the
  counter from `|Λ.history|` instead of a separate `attempts` field is sound here. This is
  `bb42d63a`'s repair working.
- **`preserves: instance_set(A)` (`:36`)** cashes out precisely: with `U` the projection to
  `Iᵢ`, the claim is `U ∘ f = U` for every step — the protocol is an arrow in the fibre of
  `U` over a fixed `Iᵢ`. A genuine, checkable categorical statement.
- **`P.instance_map` (`:67`) is a cocone over `Iᵢ`**; Widen/Narrow are moves along the cocone
  ordering. LENS 2: the protocol is a search for an approximately-universal object with the
  user as the oracle for universality — and this is exactly why the universal property must
  **not** be claimed literally, since `Calibration authority` (`:160`) makes the mediating
  arrow explicitly non-unique. The file has the right structure and the right reason to
  withhold the strong claim. It says "colimit" (`:165`) about something else instead.

---

## 3. Where the lenses diverged, and what each divergence meant

Recorded because it is the highest-value part of the review. Each of these survived pressure
rather than being smoothed.

### D1 — Repair direction (LENS 1 vs LENS 2). Resolved; LENS 2 withdrew.

LENS 2 argued that repairing `:28` makes the open question **dissolve**, because widening
`Propose` would create two routes to `L` — a non-commuting diagram. LENS 1's widening carries
`prior: Option(P)` and `move: Option(V)`, **not** `L`. Since `axis`/`adjacent` currently reach
zero argument positions, the widening creates a *first* route, not a second; non-commutation
requires two.

LENS 2 withdrew "dissolves" plainly. What survives is narrower and answers a question nobody
asked: `L` specifically needs no direct route. That is item (i); it disposes of nothing else.

**Meaning**: the divergence located the decomposition. Neither lens could have produced it
alone — LENS 2 had the malformed-arrow proof, LENS 1 had the orphaned-payload proof, and only
putting them against each other showed they were answering different questions.

### D2 — Is the loop a fixed point? (LENS 1 vs LENS 2, arbitrated by LENS 3.) Level confusion, now separated.

LENS 1: Phase 1 re-entry applies `Calibrate`/`Propose` to identical arguments, so the user is
handed back the candidate they rejected. LENS 2 and initially LENS 3 rebutted via
`architectural-principles.md` §Session Text Composition — the conversation carries `axis`.

LENS 3 separated the levels: **endorse the fixed-point claim as a claim about the
specification; decline it as a prediction about runs.** LENS 1 accepted the split.

But LENS 1 also produced the argument that the Session Text Composition defence is
**unavailable in this repository**: `bb42d63a` treated `Λ.history`'s missing writer as a
defect *even though natural-language context already carried the rounds*. The author declined
that defence once already.

LENS 4 supplied the decisive framing, which LENS 1 and LENS 2 both adopted:

> A silent channel and a false channel cost differently. `Calibrate(Iᵢ, E, L?, ctx)` at `:99`
> is not an ellipsis — it is a complete-looking **closed** signature. Context does not *fill*
> that gap, it **competes** with it. Dead lines cost tokens; false lines cost behaviour.

**Meaning**: this is the review's most important methodological result. The four lenses had
been arguing about severity while standing on different levels. Naming the levels did not
dissolve the finding — it strengthened it, because the contract-level claim needs no
behavioural evidence to stand.

### D3 — `:112`'s termination claim (LENS 3 withdrew; LENS 4 refused the withdrawal; LENS 3 re-instated).

LENS 3 withdrew its sharpest first-round finding under a defender's reading: `:112` is an
*iteration* guard, and a `while` guard is not falsified by a `break`.

LENS 4 refused, on pragmatic grounds: the runtime reader has no signal that `:112` is a guard,
and both its terms resolve into CONVERGENCE (`:116-118`), one of which is literally named
`early_exit`.

LENS 3 then re-instated at **both** levels, finding that its own formal withdrawal did not
survive either: `docs/structural-specs.md` glosses CONVERGENCE as "Terminal predicates making
LOOP's **termination claims** true." By the repo's own anatomy `:112` is a termination claim,
not a guard, and a `break` is still a termination.

**Meaning**: the charitable reading a human editor applies is not available to the runtime
reader the contract is written for. This is the one place where the pragmatic lens overturned
a formal lens's retraction — and it is why the adversarial lens was worth including.

### D4 — `early_exit` (LENS 3 vs LENS 4). Resolved: delete it *and* repair the census.

LENS 3 held `early_exit` as the only CONVERGENCE-level witness for one terminal. LENS 4: "an
alias is not a census entry" — retaining a line that names one terminal by a second name does
not make CONVERGENCE a census of four. Delete `:118`; widen `:112` separately.

### D5 — Per-file ablation against repo-wide templates (LENS 4 self-corrected under LENS 2).

LENS 4 produced a rule rather than a case-by-case answer: *a per-file ablation may delete
templated content only where the template marks the slot optional **and** the file's instance
carries no protocol-specific content; where the slot is mandatory across the set, the finding
is against the template and the instrument is a template-level change plus a check.*

Applying it, LENS 4 withdrew `cause_tag` as a per-file finding and downgraded COMPOSITION to
an observation, conceding LENS 2's (b). `progress`, `early_exit`, `K.label_basis`, and
`direction` survive as per-file findings — none is a template slot.

### D6 — The forgetful-functor claim (LENS 2 alone; bears on a rejected ledger alternative).

`docs/structural-specs.md:87` calls MORPHISM the image of FLOW under a forgetful functor.
LENS 2, citing nLab (**verified this session** for functor totality, forgetful-functor
informality, faithful ⟺ forgets-at-most-structure, product universal property, product of
morphisms; Mac Lane/Awodey correspondence **reconstructed**, no page numbers, stated as the
report's weakest link):

- **Totality fails** — FLOW's two `deactivate` arrows have no image.
- **Composition** — FLOW has a cycle; a functor into a linear chain must collapse it, so the
  loop is destroyed rather than forgotten, and the loop is the protocol's essential structure.
- **"Forgetful" is the wrong word** — dropping arrows is not faithful. Accurate description:
  *restriction to the principal path, then annotation erasure.*

Bearing on `bb42d63a`'s rejected alternative (adding the `Λ.history` append to FLOW as well):
LENS 2 ruled the rejection **supported**, and supplied the reason the commit did not give.
`:87` posits `F: FLOW → MORPHISM`; functoriality obligates the *image*, imposes nothing on the
source, and there is no declared functor from PHASE TRANSITIONS into FLOW. So `:87` is
**directionally incapable** of ranking FLOW↔PHASE TRANSITIONS. A properly functorial `:87`
would force MORPHISM to carry FLOW's two deactivate exits and nothing else. The two questions
are genuinely independent and the commit was right to keep them apart.

### D7 — `*: product` (LENS 2). Not a periagoge defect.

The objects are ordinary binary products; `*` is misnamed. If `*` were a product *of
morphisms*, each output component would depend only on its own input — which is exactly what
"Dimension resolution emergent via session context" says does **not** happen. The honest
statement: `*` is an arbitrary arrow `D₁ × D₂ → R₁ × R₂`, which by the codomain product's
universal property factors uniquely into cross-dependent components. Repo-wide boilerplate
across 8+ protocols; ranked (b), leave it.

---

## 4. The enforcement gap

LENS 4 ran the static checks. The file passes **every** check with zero warnings, and every
defect above is invisible to them:

- `checkMorphismAnatomy` checks presence, order, and three clause labels — never composability.
- `checkGateTypeSoundness` reports for this file **"3 coproducts, 0 matched to prose"** — not
  a pass, but the check declining to run. The three are `DetectResult` (`:42`),
  `OpenDisposition` (`:57`), `V` (`:71`), and item #4 above is exactly the class it exists to
  catch.
- `checkToolGrounding` cross-checks only `MANDATORY_CLASSIFICATIONS = {'dispatch'}`.

Per `CLAUDE.md` §"Assertion needs an enforcement channel", the green `/verify` result is itself
a claim with nothing re-running it.

**LENS 4's recommended check**, chosen over a composability check and a terminal-census check
by expected catch-rate: a **producer/consumer sweep** over the fenced block. Run in the
consumer direction it catches `neighbors`, `free_response`, `framing`, `candidate'`, `L`,
`axis`, `adjacent` — the review's top finding plus four others, from one check.

Its false positives, and the mitigation that decides whether it ships: prose-valued TYPES
entries (`max_attempts`, `:78`), invariant predicate names (`instance_set`, `:36`),
comment-local binders (`O`, `:66`), Greek/subscript identifiers (`Iᵢ`, `Λ`), and — the real
risk — §Session Text Composition, which licenses undeclared flow by design, so any allowlist
silencing those re-creates the assertion-without-a-channel problem one level up. Mitigation:
scope to identifiers in an argument position `f(…)` or right of `:=`, and run at **warn**, not
fail.

---

## 5. Is the convergence genuine?

Evidence that it is:

1. **Four different methods reached item (ii)**: signature purity (L1), arrow composability
   (L2), reachability enumeration (L3), causal ablation (L4). The methods do not share a
   route to it.
2. **Every lens withdrew or downgraded at least one of its own findings.** L1 moved its #1
   finding to #5 and downgraded Finding 9 to (c); L2 withdrew "dissolves" and its O3 softening;
   L3 withdrew a silent normalization and a sharp claim, then re-instated one under pressure;
   L4 withdrew `cause_tag` and downgraded COMPOSITION.
3. **The lens most adversarial to formal reading escalated the formal lenses' finding.** L4's
   method is "delete it if nothing branches on it" — it had every incentive to deflate item
   (ii) and instead ranked it the review's top finding, refusing the Session Text Composition
   rescue on a ground the formal lenses had not found.
4. **Two head-to-head conflicts were resolved by one side conceding on the merits**, not by
   averaging (D1, D3).

Evidence against, stated honestly:

- All four received the **same supporting-context reading list**. The documents contain none
  of the findings, but they supply shared judgment criteria — so the *standards* applied were
  correlated even where the *observations* were not.
- No lens ran the protocol. Every claim is about the declared contract, not about behaviour.
  There is no trace, eval, or behavioural test anywhere in the repo that would discriminate
  "the contract is broken" from "the contract is loose and the model compensates."
  L1, L2, and L3 each flagged this in their own Horizon Limits.

**Verdict**: the convergence on item (ii) is genuine. The convergence on severity *ordering*
is weaker — it moved substantially once the enforcement facts arrived, which means it was
tracking the lenses' methods rather than the artifact until that point.

---

## 6. What the review does not settle

- Whether item (ii) should be repaired by widening Phase 1's domain or by re-routing
  `Fuse`/`Reorient` to a phase that already holds the operand. That is a design judgment and
  no lens performs it.
- Whether `MORPHISM:28` can be repaired in isolation. LENS 2: no — with no stated convention,
  repairing `:28` converts an inconsistency into a near-consistency (6 of 7 arrows) without
  ever saying what is being conformed to. **State the convention first** ("parentheses list
  the declared domain per TYPES"), after which `:28` and `:29` repair mechanically and
  `checkMorphismAnatomy` gains something enforceable.
- Whether the Greek and categorical vocabulary earns its context cost. L4 flagged
  `Synagoge`/`Diairesis` (`:72-74`) and `colimit-shaped` (`:165`) as undefined for a runtime
  reader of this file alone, against `CLAUDE.md`'s self-containment requirement; L2 judged
  `colimit-shaped` one of only two genuine vocabulary defects (with `:87`) because it sits
  inside a runtime-normative Rule, names no diagram, and — unlike `periagoge/README.md:11`,
  which the project already gets right — carries no informality disclaimer.

---

## 7. Relation to PR #871 — checked after the debate closed

`bb42d63a` is the **direct parent** of `feat/periagoge-alignment-first` (PR #871,
`feat(periagoge)!: 정렬 우선 구조로 재설계 (2.0.0)`). Two commits sit on top of the reviewed
tree — `f6a14612` and `e975c00b` — and they replace the protocol wholesale:
`Propose`/`triangulate`/`integrate` are gone, replaced by
`Pair`/`Align`/`Extract`/`Probe`/`narrow`/`Name`.

This was checked **after** the four lenses reported and the debate closed, so it did not shape
any finding. What it does is split the review's output in two.

### 7a. What #871 already fixes — and the review independently validates

Every one of the three items §1 decomposed is resolved at #871's head, by structure rather
than by patch:

| §1 item | Status at #871 | Where |
|---|---|---|
| (i) `propose` arity disagreement | Moot — `propose` no longer exists | MORPHISM replaced |
| (ii) move payloads reach no argument position | **Fixed** — LOOP now routes every operand explicitly: `Repartner(ref)` → Phase 1 *with ref as the partner*; `AxisMissing(description)` → Phase 2 *over the extended language*; `NotYet(gap)` → Phase 3 *with gap seeding the next Probe* | LOOP `:141-142`, `:152` |
| (iii) `neighbors` gates the constructor set | Moot — no conditional constructor omission remains | `Fuse` removed |

Also resolved: the non-crystallizing exit now has a **named result type carrying what the run
established** (`AlignmentSuspended`, `:113`) — the review's finding #3, fixed. `Λ`'s fields
now have explicit writers at Phases 2, 4, and 5 — finding #2, fixed. `progress(Λ)` is gone
from CONVERGENCE — finding #14, fixed. `direction`'s enumeration, `triangulate`, and
`framing` are all gone. `early_exit` is now a real disjunction
(`budget_spent(Λ) ∨ unalignable(Λ)`, `:160`) rather than an alias.

**The epistemic weight of this is the point.** Four lenses, isolated from each other and from
#871, converged on defects the author had independently already decided to fix by redesign.
That is convergent evidence for the redesign's direction from a source that could not have
been influenced by it.

### 7b. What survives into #871 — actionable there now

All five sit in the open-item/declaration machinery, which #871 carried forward largely
unchanged. Line numbers are against `feat/periagoge-alignment-first`:

1. **`free_response` is consumed and never produced** — now on **two** terminals (`:143`
   Abandon, `:149` Confirm), so the surface grew. `Deferred` (`:101`) is still reachable only
   through it.
2. **`OpenTrace.status` is stored (`:106`) and derived (`:108`)** with nothing binding them —
   still making representable the disagreement `:49-50` designs against.
3. **`status(O)` is written unary but reads `OpenItems(Λ)`**, which is not a component of `O`.
   Same shape as before, new external term.
4. **`alignment_trace_declared(AlignmentTrace)` takes a type name** (`:112`), and #871
   duplicates the pattern onto `AlignmentSuspended` (`:113`).
5. **`OpenItemDisposition = OpenDisposition \ {None}`** (`:102`) — dependency still inverted.

These belong as review comments on #871, not as a defect report against `main`.
