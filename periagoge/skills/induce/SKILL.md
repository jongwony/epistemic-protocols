---
name: induce
description: "Crystallize a shared but unnamed concept from the concrete cases at hand. Type: (AbstractionInProcess, AI, INDUCE, A) → CrystallizedAbstraction"
---

# Periagoge Protocol

Crystallize in-process abstraction by aligning concrete cases first and naming last, with the live alternative readings held visible throughout. Type: `(AbstractionInProcess, AI, INDUCE, A) → CrystallizedAbstraction`.

## Definition

**Periagoge** (περιαγωγή): A dialogical act of turning an in-process abstraction toward its crystallized form, where AI detects when an instance set has converged toward an unnamed essence, puts the two most alignable cases side by side for the user to correspond, extracts the invariant relation that correspondence carries together with the readings it leaves open, probes those open readings apart against further cases and near-misses the user judges, and only then proposes a name and rule for what survived — so the abstraction is located by the correspondences the user built rather than steered from a candidate offered ahead of them (the Greek dialectical vocabulary supplies the source terms).

```
── FLOW ──
Periagoge(A) → Detect(A) →
  InProcess(Iᵢ, E, L?): Pair(Iᵢ, E) → (i₁, i₂) →
         Align(i₁, i₂, ctx) → Stop → M →
         Extract(M, Iᵢ) → (R, H) →
         Probe(H, Iᵢ, ctx) → p → Qp(p, H) → Stop → W → narrow(H, W) → H' →
         loop until settled(H) ∨ budget_spent(Λ) →
         Name(H, R, L?) → Qn → Stop → Nₐ →
         (Confirm: declare(alignment_trace, open_trace) → CrystallizedAbstraction
          | NotYet(gap): re-enter Probe with gap seeded
          | Abandon: declare(partial_trace, open_trace) → AlignmentSuspended)
         or unalignable(Λ) → declare(partial_trace, open_trace) → AlignmentSuspended
  NotInProcess: deactivate

── MORPHISM ──
A
  → detect(instances, essence, locator)   -- verify in-process abstraction exists
  → pair(instances, essence)              -- select the two cases that align most readily
  → align(pair, slots)                    -- user constructs the correspondence; AI supplies the slots
  → extract(correspondence)               -- invariant relation, plus the axes that correspondence leaves live
  → probe(space, instances)               -- select the case that separates live axes rather than confirming the leading one
  → narrow(space, answer)                 -- rule an axis out, extend the language, or repartner, per the user's judgment
  → name(surviving, relation, label)      -- AI proposes name + rule, after the space has narrowed and not before
  → declare(trace, open_trace)            -- terminal evidence trace + open-item disposition
  → CrystallizedAbstraction
requires: in_process(A)                    -- runtime checkpoint (Phase 0)
deficit:  AbstractionInProcess              -- activation precondition (Layer 1/2)
preserves: instance_set(A)                  -- Iᵢ read-only; H.ruled_out append-only within one activation, so a ruled-out axis is never re-proposed
invariant: Correspondence Before Naming through Maintained Alternatives over Single-Candidate Steering

── TYPES ──
A              = AbstractionSeed (in-process state: instances + essence intuition + optional user concept label)
Detect         = A → DetectResult
DetectResult   ∈ {InProcess(Iᵢ, E, L?), NotInProcess}
                 -- closed: Phase 0's two exits; the payload rides the InProcess branch, so no verdict and payload
                 -- can disagree, and InProcess is what witnesses requires: in_process(A)
Iᵢ             = Set(Instance)                             -- instance set observed; |Iᵢ| ≥ 2 is what Pair requires, since a correspondence needs two terms
Instance       = { content: String, context: String }       -- concrete case observed
E              = EssenceIntuition                           -- variation-stable core signal from conversation
L              = Option(TentativeLabel)                     -- user-provided provisional name or concept, if any
ctx            = DomainContext                              -- user's domain context gathered via artifact read, artifact search, and a conditional external fetch
Pair           = (Iᵢ, E) → (i₁, i₂)                        -- the readiest alignment, not the most distant; distance is what Probe is for
Slot           = { role: String, in_first: String, in_second: Option(String) }
                 -- in_second is None exactly where the second case carries no counterpart, and that role joins M.unmatched;
                 -- filling it reads off the cases rather than choosing between readings, which is what H.live and Probe carry
M              = Correspondence { slots: List(Slot), unmatched: Set(String) }
                 -- unmatched holds what one case carries and the other does not; it is evidence, not failure
Align          = (i₁, i₂, ctx) → M                          -- constructed at the Phase 1 gate; the user fills or corrects the slots
Axis           = { relation: String, provenance: AxisProvenance }
AxisProvenance ∈ {AlignmentDerived, ContrastDerived, UserSupplied}
H              = HypothesisSpace { live: Set(Axis), ruled_out: Map(Axis, Ground) }
                 -- live is what the correspondence has not yet decided between; ruled_out records why each was dropped
                 -- invariant: live ∩ dom(ruled_out) = ∅ — an axis is in exactly one of them, which is what makes settled(H) total
Ground         = String                                     -- the probe answer that ruled the axis out, in the user's own terms
R              = InvariantRelation { statement: String, carried_by: List(Slot) }
                 -- carried_by cites the slots the relation reads off, so the relation stays traceable to the correspondence
Extract        = (M, Iᵢ) → (R, H)                           -- internal; no gate
Probe          = (H, Iᵢ, ctx) → p
p              = ProbeCase { content: String, kind: ProbeKind, separates: Set(Axis) }
                 -- separates names which live axes this probe tells apart; a probe separating none is not a probe
ProbeKind      ∈ {DistantInstance, NearNonInstance, UserSupplied}
W              = ProbeAnswer ∈ {Holds, Fails(ground), NotAnInstance(ground), AxisMissing(description), Repartner(ref), Abandon}
                 ground       = the user's reason, recorded verbatim as the Ground for whatever it rules out
                 description  = a dimension the live set does not contain -- extends the language rather than editing a candidate
                 ref          = another instance or a neighbouring abstraction to align against instead
narrow         = (H, W) → H'                                -- Holds/Fails/NotAnInstance move axes from live to ruled_out;
                                                            -- AxisMissing adds a UserSupplied axis to live; Repartner and Abandon leave H unchanged
settled(H)     = |H.live| = 1
unalignable(Λ) = H.live = ∅                                 -- every axis ruled out and none supplied; the seed did not carry one
                 -- settled(H) is false whenever live is empty, so no second conjunct is doing work here
Name           = (H, R, L?) → (N, Rule)
N              = AbstractionName { name: String, label_basis: Option(L) }
Rule           = { statement: String, boundary: List((ProbeCase, Ground)) }
                 -- boundary is built from the NotAnInstance answers, so what the abstraction excludes is shown, not asserted
Nₐ             = NameAnswer ∈ {Confirm, Rename(name), RuleWrong(correction), NotYet(gap), Abandon}
                 gap          = what the user says is still missing; seeds the next Probe
Qp             = Probe judgment interaction [Tool: Constitution interaction]
Qn             = Naming interaction with name + rule + boundary [Tool: Constitution interaction]
max_probes     = the probe cap LOOP fixes per abstraction seed
budget_spent(Λ) = |Λ.probes| ≥ max_probes
                 -- a resource bound on user attention, not a sufficiency criterion: reaching it says the run stopped,
                 -- never that the abstraction formed. Phase 4 still fires, and whatever stayed live goes to the open trace
crystallized(Λ) = Λ.naming = Some(Confirm)
OpenDisposition ∈ {None, Nonblocking, Deferred}
                 None        = no live axis and no unmatched slot remains; explicitly declared
                 Nonblocking = an item remains visible but does not block Confirm
                 Deferred    = user routes an item to later work via free response
OpenItemDisposition = OpenDisposition \ {None}             -- per-item value space; None is a whole-trace verdict only
OpenItems(Λ)   = (H.live \ {chosen}) ∪ ⋃{M.unmatched : M ∈ Λ.correspondences}
                 -- what a run can still owe at its terminal, from both carriers; the union runs over every
                 -- correspondence built, since a slot left unmatched before a repartnering is still unmatched after it
OpenTrace      = { status: OpenDisposition, items: Map(String, OpenItemDisposition) }
                 -- invariant: dom(items) = OpenItems(Λ) — every open item carries exactly one disposition, which makes status(O) total
status(O)      = None if OpenItems(Λ) = ∅; Deferred if ∃ i ∈ dom(O.items) : O.items(i) = Deferred; otherwise Nonblocking
AlignmentTrace = List<(Slot | (ProbeCase, W) | (N, Rule))>
                 -- the run in the order it happened: the correspondence the user built, each probe with its judgment,
                 -- and the naming it terminated on. Derived from Λ.correspondences, Λ.probes, and Λ.naming
CrystallizedAbstraction = (N, Rule) where confirmed via Nₐ = Confirm ∧ alignment_trace_declared(AlignmentTrace) ∧ open_disposition_declared(OpenTrace)
AlignmentSuspended = (R?, H) where alignment_trace_declared(AlignmentTrace) ∧ open_disposition_declared(OpenTrace)
                 -- the non-crystallizing terminal. It carries what the run established so a later run resumes from it
                 -- rather than restarting; R is absent only when Phase 2 was never reached

── A-BINDING ──
bind(A) = explicit_arg ∪ recent_instance_cluster ∪ surfaced_essence
Priority: explicit_arg > recent_instance_cluster > surfaced_essence

/induce "theme"              → A = AbstractionSeed with theme label
/induce (alone)              → A = most recent instance cluster in session
"the pattern across..."      → A = instance cluster under discussion

If no essence signal is detectable (neither user sensing language nor AI-inferrable core pattern): pause activation and surface the scan result before Phase 0, inviting the user to either name what feels in-process or withdraw. If |Iᵢ| < 2, scan the accumulated session context and the user's artifacts for cases that could correspond with the one in hand, and present what the scan found as candidates to recognize or replace before Phase 1. Where it finds nothing, say what was searched and invite a second case.

── PHASE TRANSITIONS ──
Phase 0: A → Detect(A) → InProcess(Iᵢ, E, L?) | NotInProcess               -- detection checkpoint (silent)
Phase 1: (Iᵢ, E) → Pair(Iᵢ, E) → (i₁, i₂) → Align(i₁, i₂, ctx) → Stop → M ; Λ.correspondences := Λ.correspondences ++ [M]   -- correspondence Constitution interaction [Tool]
         -- on re-entry from Repartner(ref), ref is the second term and Pair is skipped: the user already chose the partner
Phase 2: (M, Iᵢ) → Extract(M, Iᵢ) → (R, H) ; Λ.relation := Some(R) ; Λ.space := Some(H)   -- relation + live-axis derivation (track)
Phase 3: H → Probe(H, Iᵢ, ctx) → p → Qp(p, H) → Stop → W                   -- probe Constitution interaction [Tool]
Phase 4: W → narrow(H, W) → H' ; Λ.space := Some(H') ; Λ.probes := Λ.probes ++ [(p, W)]   -- space update + probe record (track)
Phase 5: (H, R, L?) → Name(H, R, L?) → (N, Rule) → Qn → Stop → Nₐ ; Λ.naming := Some(Nₐ)   -- naming Constitution interaction [Tool]

── LOOP ──
After Phase 4: evaluate the probe answer.
If W = Holds: the axes this probe would have separated against are ruled out; return to Phase 3.
If W = Fails(ground): the axis that predicted the probe is ruled out with ground; return to Phase 3.
If W = NotAnInstance(ground): the probe joins Rule.boundary with ground; return to Phase 3.
If W = AxisMissing(description): a UserSupplied axis enters H.live; return to Phase 2 (relation re-extracted over the extended language).
If W = Repartner(ref): return to Phase 1 with ref as the alignment partner and Pair skipped; H and its ruled_out survive the repartnering, and the correspondence already built stays in Λ.correspondences.
If W = Abandon: Λ.alignment_trace := derive(Λ), Λ.open_trace := derive(OpenItems(Λ), free_response), declare both, terminate as AlignmentSuspended.
Continue Phase 3 until: settled(H) ∨ budget_spent(Λ) ∨ unalignable(Λ).
If unalignable(Λ): declare as AlignmentSuspended — every axis was ruled out and none supplied, which is a finding about the seed and is reported as one.
Otherwise proceed to Phase 5.

After Phase 5: evaluate the naming answer.
If Nₐ = Confirm: Λ.crystallized := Some((N, Rule)), Λ.alignment_trace := derive(Λ), Λ.open_trace := derive(OpenItems(Λ), free_response), declare both, terminate as CrystallizedAbstraction.
If Nₐ = Rename(name): N.name := name, re-present at Phase 5 within the same round.
If Nₐ = RuleWrong(correction): Rule.statement := correction, re-present at Phase 5 within the same round.
If Nₐ = NotYet(gap): return to Phase 3 with gap seeding the next Probe; the budget is spent by this round like any other.
If Nₐ = Abandon: declare as AlignmentSuspended.
Cap: max_probes = 5 probes per abstraction seed. This bounds user attention; it is not a claim that five probes suffice to form an abstraction, and reaching it never converts a run into a crystallized one.
Convergence evidence: At crystallized(Λ), present the alignment trace — the correspondence the user built slot by slot, then each probe with the judgment it received, then the name and rule that survived — plus the boundary drawn from the NotAnInstance answers, plus the OpenTrace. Show every axis that was ruled out beside the ground that ruled it out, so the surviving axis is seen to have won rather than asserted to have. OpenTrace status is None when nothing stayed open, Deferred when any item is routed to later work, and Nonblocking otherwise. Convergence is demonstrated, not asserted.

── CONVERGENCE ──
crystallized(Λ): see TYPES (Λ.naming = Some(Confirm))
settled(H): see TYPES (exactly one live axis) — Phase 5's fire condition, not a terminal on its own
early_exit = budget_spent(Λ) ∨ unalignable(Λ)

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 Detect     (sense)   → Internal analysis (no external tool)
Phase 1 Pair+Align (constitution) → present the two cases side by side with every slot filled from the cases themselves and unmatched roles marked as such (mandatory); artifact read, artifact search for the cases' own context
Phase 2 Extract    (track)   → Internal state update: writes Λ.relation and Λ.space, so Phase 3 has a space to probe and the terminal has a relation to name
Phase 3 Probe+Qp   (constitution) → present the probe case with every live axis it separates (mandatory); external fetch (conditional: a probe drawn from outside the user's domain)
Phase 4            (track)   → Internal state update: writes Λ.space and appends Λ.probes, so the cap can advance and the alignment trace has per-probe material to build from
Phase 5 Name+Qn    (constitution) → present name, rule, boundary, and whatever stayed live (mandatory)
converge           (extension)   → TextPresent+Proceed (alignment trace + open disposition; proceed with the crystallized abstraction)
seam               (extension)   → TextPresent+Proceed (fires at deactivation/handoff: a user-declared chain naming the next protocol settles the next move — proceed directly to it, citing that settling source. This protocol declares no wired outbound continuation edge: its only cross-protocol link is an inbound misfit absorption (`Upstream misfit absorption`), not a post-crystallization handoff, so the second trigger is vacuously absent. Every Constitution gate inside this protocol and inside the next protocol fires unchanged)

── MODE STATE ──
Λ = { phase: Phase, A: AbstractionSeed, Iᵢ: Set(Instance), E: EssenceIntuition,
      correspondences: List(M), relation: Option(R), space: Option(H),
      probes: List<(ProbeCase, W)>, naming: Option(Nₐ),
      crystallized: Option((N, Rule)),
      alignment_trace: Option(AlignmentTrace),
      open_trace: Option(OpenTrace),
      active: Bool, cause_tag: String }

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
```

## Mode Activation

`/induce` remains directly invocable. AI-guided activation requires a sensed essence whose name, scope, or position is still unsettled, and at least two concrete cases to correspond; detection stays silent. Existing abstractions awaiting comparison or validation route elsewhere, and a crystallized or suspended `(instance set, essence)` pair stays inactive for the session.

If an explicit invocation has no detectable essence signal, surface that scan result and invite the user to name what feels in process or withdraw. Prior-session recall may seed probe cases or neighbouring abstractions but never settles crystallization.

## Protocol

### User-facing realization

At Phase 1, put the two cases side by side and render the correspondence with every slot filled from what the cases themselves carry, marking any role the second case has no counterpart for. The user corrects a filling that is wrong rather than supplying one that is missing; which reading the correspondence supports is separated at Phase 3, never by an unfilled slot here. Ground both cases in the user's actual domain by artifact read/search; when that domain requires external fetch, cite its URL at the point of use.

At Phase 3, present the probe case together with every axis still live and which of them this probe tells apart. Materialize the `W` constructors as everyday-language options with anticipatable differential futures. A probe that separates nothing is not presented — draw another.

At Phase 5, present the name, the rule, the boundary the near-misses drew, and anything still live. Materialize the `Nₐ` constructors the same way. `Confirm` and `Abandon` remain constitutive even when analysis favours one reading.

Frame the correspondence currently being built or the reading currently being separated, rather than a progress fraction. Read `references/round-composition.md` before composing when terminology must remain stable, wording must be carried unchanged, material belongs to another round or trace, or phase order determines placement relative to the gate.

## Rules

- **Recognition over Recall**: Present structured options with anticipatable post-selection states and yield for the user's judgment.
- **Correspondence before naming**: Build the correspondence between concrete cases before proposing any name or rule for what they share. A name offered ahead of the correspondence conditions every later judgment on its own vocabulary, so the ordering is the operation rather than a presentation preference.
- **Alternatives stay visible**: Show every live reading at each gate, alongside the one the analysis currently favours. A single reading handed over on its own is the condition under which a judgment bends toward it hardest, so the alternatives are what make the user's answer their own.
- **Ruling out is recorded, not repeated**: When a reading is ruled out, record it with the user's own ground and never propose it again within the activation. What was already shown to lead nowhere is not offered as a choice.
- **Probes separate rather than confirm**: Choose the next case for how well it tells the live readings apart, not for how well it fits the leading one. A case that every live reading predicts alike costs a round and settles nothing.
- **The name is a locator, not a compression**: Deliver the name together with the relation, the correspondence it was read off, and the boundary the near-misses drew. The name is what returns the user to those cases; it does not stand in for them.
- **Label as ground, not verdict**: Read the user's tentative label as the naming ground Phase 5 works from. It grounds the name and its provenance without fixing either, so what the label survives as stays a judgment made in the run.
- **Personalized grounding**: Draw cases and probes from the user's own domain and keep external provenance visible.
- **Periagoge boundary**: Form an abstraction around a sensed but unlocated essence. Comparison or validation of an already located abstraction remains outside this operation.
- **Round composition**: Compose each round in everyday language, keep each judgment beside its evidence and next-move implication, and place analysis before the gate.
- **Upstream misfit absorption**: Accept a routed colimit-shaped signal as activation ground and show its cited essence-and-locator basis before Phase 1.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction until countermanded. Change the form directly. Elements fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
