---
name: bound
description: "Define epistemic boundaries from a provisional whole map, opening decisions to the depth needed for delegation. Type: (BoundaryUndefined, AI, DEFINE, TaskScope) → DefinedBoundary"
---

# Horismos Protocol

Define epistemic boundaries through a recognizable whole map and progressive examination. Type: `(BoundaryUndefined, AI, DEFINE, TaskScope) → DefinedBoundary`.

## Definition

- **Horismos** (ὁρισμός) takes a task whose boundary is undefined, including one whose decision structure or sufficient depth of examination is not yet recognizable, and produces a source-grounded boundary with its unresolved remainder.
- Before asking the user what to settle or entrust, construct the relevant whole provisional map of decisions, obligations, assumptions, and dependencies. A settled goal and a user-supplied inventory are not prerequisites. Bound this whole to the current context and show what remains unknown.
- Let the user open any axis, see the concrete content and consequences needed to judge it, correct the map, and entrust at the depth they find sufficient. The map remains the object of judgment; opening an axis does not require visiting every other one.
- Keep the boundary question distinct from its settlement disposition and from the content of the decision. For ownership, the disposition assigns the named decision directly; an allocation question is a separate domain only when the source makes allocation itself the subject.

```
── FLOW ──
Horismos(T, B_prior?) → Probe(T, context) → B_provisional → boundary_readout → present provisional whole →
  no undefined boundary: Qc(zero_signal_finding) → Stop → ZeroSignalConfirmation →
    Confirm: deactivate; Reopen(utterance): rebuild from that ground → dispatch
  undefined boundary: dispatch
  Phase 0b: sync_kind_route(B_provisional, T, context) → KindRouteMap →
    single_dominant_kind: relay(captured_kind + basis) → bind_kind
    otherwise: Qs(KindRouteMap) → Stop → KindAnswer → bind_kind
    non-atomic: split the boundary questions → re-sync
    atomic: certify(KindBinding, local_claims) → DeficitFitCertificate →
      route: route_away → deactivate
      ambiguous: Qa(kind, supported claims) → Stop → Attribution → attribute →
        Own: init; Route(d): route_away → deactivate; Unattributable: relay finding → deactivate
      pass: init
  Phase 1: enrich the whole map and requested focus → enriched candidate map → reconcile → update B →
    already_settled: final_readout → DefinedBoundary → converge
    otherwise: Phase 2 boundary_readout(B, kind, focus, context) → BoundaryEssence → Qs → Stop → A
  Phase 3: read the whole utterance → (RoundAnswer?, viable futures) →
    ambiguous handling: Qc(live readings and consequences) → Stop → confirmed_intent ∈ J
    no recognized answer: preserve B and the whole utterance → Phase 2 readout
    recognized Withdraw: reconcile current-kind effects, preserve the correction and unresolved remainder → deactivate
    active answer changing the boundary question: retain requested focus → Phase 0b
    otherwise, for a recognized answer, integrate grounded changes; reconcile affected entries →
      Continue: Phase 1 with the requested focus or correction
      Finish and completion_ready: final_readout → DefinedBoundary → converge
      Finish and further judgment required by the response or changed ground: Phase 1
  A changed-kind re-entry preserves the unserved examination request before further settlement; withdrawal opens no new round.

── MORPHISM ──
TaskScope, B_prior?
  → Probe(T, context) → present_provisional_whole
  → capture_boundary_question → certify_local_fit
  → ground_current_arrangement
  → make_whole_and_focus_recognizable
  → user_examination_and_settlement ↺ affected_revision
  → sufficient_boundary_with_declared_remainder
  → DefinedBoundary
requires: boundary_undefined(T)
deficit: BoundaryUndefined
preserves: task_identity(T)                         -- the purpose and limits actually supplied, including their open coordinates and authorized revisions
invariant: Definition over Assumption
invariant: certificate-before-settlement            -- a passing local fit precedes map settlement; provisional discovery supplies no authority
invariant: proposal-and-settlement-separation       -- presence, inspection, and work allocation supply no boundary-setting act

── TYPES ──
T = TaskScope                                      -- the task or concern needing a boundary; its goal, structure, scope, and desired examination depth may remain open
Evidence = { source: String, content: String }      -- reachable record or artifact, with the decision-bearing wording where that wording determines meaning
Domain = String                                    -- stable identity for a decision, obligation, premise, or unresolved question; runtime-grounded, not a fixed taxonomy
BoundaryMap = Map(Domain, BoundaryEntry)
BoundaryEntry = { question: String, relevance: String, evidence: Set(Evidence),
                  depends_on: Set(Domain), applicability: String,
                  content: Optional(DecisionContent),
                  proposal: Optional(Settlement), settled: Optional(Settlement),
                  remainder: String }
                 -- relevance says why the item bears on this boundary; applicability states its current or conditional reach.
                 -- depends_on names entries whose change may alter this one; unknown prerequisites are entries, not fabricated answers.
                 -- remainder states what is still open, why it is left open, and what must happen before dependent work can rely on it; explicitly empty when none.
DecisionContent = { account: String, evidence: Set(Evidence), setting: Optional(Set(Evidence)) }
                 -- setting identifies the act that settled this content and any grant it exercised. With no setting the content is tentative, even when its author is authorized to propose it.
Settlement = { disposition: BoundaryClassification, question: String, limits: String, source: Set(Evidence) }
                 -- in proposal this is a suggested arrangement; in settled its source records the actual determining instruction, accepting response, or authorized choice.
BoundaryClassification = UserSupplies | AIPropose | AIAutonomous
                 -- UserSupplies: the source's retained judgment holder supplies the value.
                 -- AIPropose: AI develops candidates; selection remains with that holder.
                 -- AIAutonomous: AI chooses within the source-defined limits, including among viable alternatives.
                 -- These forms concern the named boundary question. For ownership they assign that decision directly; for another kind they assign settlement of that boundary value.
                 -- A request to use a displayed default accepts the actual proposal it denotes. A legacy Dismiss entry is read through its setting source to that disposition; the label alone supplies none.
B = Λ.boundary_map                                 -- the sole current map, including settled entries, proposals, and open structure; a readout is not another store
B_prior = Optional(SeededPrior)                     -- the applicable prior bound at entry or re-entry; earlier setting records remain reachable in context
SeededPrior = { map: BoundaryMap, kind: Kind, record: Set(Evidence) }
                 -- a prior result with its setting record. A legacy disposition map is reconstructed from that record before being read as BoundaryEntries.
Probe : (TaskScope, context) → BoundaryMap           -- construct the relevant whole provisional structure; discovery and evidence collection do not constitute its proposals
B_provisional = Probe(T, context)                   -- the actual presented provisional map, recoverable from its conversation record across kind capture; initialization reads that map with later authorized corrections
ZeroSignalConfirmation = Confirm | Reopen(utterance: String)

Kind = the boundary question captured from live ground; direction/priority, scope, type/concept, and ownership are recognition seeds, with emergent kinds remaining open
KindHypothesis = { label: Kind, positive_predicate: String, evidence: Set(Evidence), differential_future: String, route_away_if: String }
KindRouteMap = { hypotheses: List(KindHypothesis), emergent: NamingPath }
sync_kind_route : (BoundaryMap, TaskScope, context) → KindRouteMap
NamingPath = an affordance to name, extend, or replace the framing in the user's own words
KindAnswer = the user's captured boundary question, including an emergent naming or a correction of the provisional framing
KindBinding = { label: Kind, positive_predicate: String, evidence: Set(Evidence), atomicity: {atomic, non-atomic} }
                 -- atomic means one boundary question, which may span many decisions and depths; a whole delegation question is not compound merely because its map has several axes.
single_dominant_kind : (KindRouteMap, TaskScope, context) → Bool
                 -- true only when citable live ground determines one boundary question: one seed holds with the other seeds' route-away conditions established and no emergent question left open, or the user's wording already names one emergent question unambiguously. Quote that naming verbatim on the emergent relay. AI preference and a vague gesture are not determining ground.
Deficit = a label named by a local claim or the user's Route answer
OwnClaim = { deficit: BoundaryUndefined, resolution: DefinedBoundary, in_scope_if: String }
                 -- the whole local morphism: making the boundary question and its decision structure recognizable, then settling its scope and judgment ownership to sufficient depth with residue. A missing goal or unseen structure alone does not make this request a misfit.
RouteClaim = { route_if_predicate: String, routed_deficit: Deficit }
                 -- local alternatives when the requested resolution is instead:
                 -- a missing pre-execution fact → ContextInsufficient (hint: /inquire)
                 -- analytical lenses for an inquiry → FrameworkAbsent (hint: /frame)
                 -- validity of a cross-domain mapping → MappingUncertain (hint: /ground)
                 -- a contrast that must be instantiated before its direction is recognizable → DirectionUnrecognizable (hint: /preview)
                 -- Evidence needed while defining a boundary does not itself change that boundary request into one of these resolutions.
local_claims = (OwnClaim, the RouteClaims above)
DeficitFitCertificate = { own_claim: OwnClaim, route_claims: List(RouteClaim), evidence: Set(Evidence), attribution: certificate(Set(Deficit)) | user(Attribution) }
Attribution = Own | Route(routed_deficit: Deficit) | Unattributable
status(c) = for certificate(S): pass when S = {BoundaryUndefined}, route when S is one local route claim, ambiguous otherwise
          = for user(a): pass for Own, route for Route(d), ambiguous for Unattributable
routed_deficit(c) = the sole local route label on certificate route status, or d on user(Route(d)); read only on route status
attribute(a) = Λ.certificate.attribution := user(a)  -- preserve the control form even when d equals the own-claim label; unchanged ambiguous evidence is not re-certified

BoundaryEssence = a readable account of the relevant whole map, its setting sources, provisional content, conditional dependencies, focused detail, and unresolved remainder
boundary_readout : (BoundaryMap, Optional(Kind), Set(Domain), context) → BoundaryEssence
                 -- With no captured kind, read the structure provisionally. Make the proposed scope and the implications of accepting it recognizable before asking. Render the whole overview even when focus is nonempty; expose details where they change the present judgment. Read current sources, not labels alone. This read does not mutate B.
focus = Set(Domain)                                -- the user's outstanding examination request; empty for an overview only when none is pending. An unseen axis can be added from the utterance. Kind re-entry preserves the request and resolves its domains under the revised question.
A = String                                         -- a complete user utterance; read a confirming response with the original utterance as context. Inspection, correction, acceptance, entrustment, deferral, and finish can coexist.
RoundAnswer = Continue(utterance: A) | Finish(utterance: A) | Withdraw(utterance: A)
                 -- closed handling forms; substantive axes, commitments, and depth remain runtime-bound in the whole utterance.
                 -- Continue keeps the interaction open for requested examination, correction, or further settlement.
                 -- Finish requests closure at the depth the utterance establishes, with only the commitments it actually supplies.
                 -- Withdraw exits without declaring the morphism complete; constituted entries and unresolved material remain attributable.
                 -- These forms assume a coherent handling direction. If several futures remain viable, expose their consequences and obtain confirmation; never ask the user to classify their wording into the formal constructors.
J = {Continue, Finish, Withdraw}
read_answer : (A, BoundaryMap, context) → (Optional(RoundAnswer), Set(J))
                 -- recognize a handling form only when it accounts for all decision-relevant meaning; the second projection records the handling futures still viable. An unsettled reading commits nothing. A request to inspect is not adoption of the inspected proposal.
enrich : (BoundaryMap, Set(Domain), context) → BoundaryMap
                 -- return a candidate map with the requested detail, newly revealed domains, evidence, dependencies, and explicit unknowns. Preserve source/status distinctions. This observation leaves Λ unchanged; reconciliation consumes the returned map before the sole current-map update.
reconcile : (BoundaryMap, context) → BoundaryMap
                 -- read each changed entry and its transitive dependents against current sources. Re-derive relevance, applicability, content, proposals, and settlement separately; retain every still-supported decision. Withdraw only what its ground no longer supports, carrying the displaced source in the trace. Preserve unrelated entries.
integrate : (BoundaryMap, RoundAnswer, context) → BoundaryMap
                 -- apply only the response's grounded commitments and corrections, citing it; adopt exactly the displayed proposals denoted by an informed acceptance or the user's stated replacements. Return the integrated map for reconciliation; unaccepted proposals and open material remain unsettled.
ready : (BoundaryMap, context) → Bool
                 -- true when the current boundary is attributable, every recorded item is accounted for as settled, conditional, excluded by grounded scope, or explicitly unresolved, and no judgment or requested inspection needed by the contemplated next move remains unserved. Open goals and deferred work can remain if the next move respects them.
already_settled : (BoundaryMap, context) → Bool
                 -- ready and citable prior ground already determines the arrangement and sufficient examination for the current request; a grant to carry out work alone does not answer a newly required checkpoint.
completion_ready : (BoundaryMap, RoundAnswer, context) → Bool
                 -- Finish with ready and an attributable sufficiency judgment for the actual current arrangement. If reconciliation reveals a changed implication not covered by that judgment, re-present the affected region; settled independent commitments survive.
Residual = Map(Domain, String)                      -- the projection of nonempty remainders, including unresolved scope, unknown prerequisites, conditional applicability, and pending values even where their settlement is entrusted; reasons and required next treatment remain in the entry
DefinedBoundary = { map: BoundaryMap, kind: Kind, residual: Residual, record: Set(Evidence) }
                 -- emitted only on a CONVERGENCE path. residual is projected from the final map and explicitly ∅ when empty; record reaches the scope and sufficiency ground, entry-setting acts, and any pending obligations.
Phase ∈ {0, 0b, 1, 2, 3}

── PHASE TRANSITIONS ──
Phase 0: T, B_prior? → Λ.B_prior := B_prior → inspect context → Probe(T, context) → B_provisional → boundary_readout → present the provisional whole without a turn yield [Tool]
       → boundary_undefined(T): Phase 0b
       → otherwise: Qc(zero_signal_finding with basis) → Stop → ZeroSignalConfirmation [Tool]
       → Confirm: deactivate; Reopen(utterance): incorporate that ground and present the revised provisional whole → Phase 0b
Phase 0b: B_provisional, T, context → sync_kind_route → KindRouteMap
       → single_dominant_kind: relay captured_kind and basis → bind_kind
       → otherwise: Qs(KindRouteMap beside the provisional whole) → Stop → KindAnswer → bind_kind [Tool]
       → non-atomic KindBinding: separate the questions and their dependencies, preserve the unselected questions provisionally, re-sync before certification
       → atomic KindBinding: certify local_claims → Λ.certificate
       → status = route: route_away(routed_deficit(certificate)) → deactivate
       → status = ambiguous with certificate(S): Qa(kind, supported claims and implications) → Stop → Attribution → attribute [Tool]
       → user(Route(d)): route_away(d) → deactivate; user(Unattributable): relay finding → deactivate
       → status = pass: initialize B by grounding the presented B_provisional with current context and Λ.B_prior; derive focus from outstanding examination requests in context, preserving a re-entry request; use ∅ only when none is pending → Phase 1
       → prior grounding: read Λ.B_prior through its setting record and revisions, retaining earlier reachable records in context; admit only same-kind, current supported settlements. Keep still-relevant unresolved domains even if current discovery omitted them. A kind-mismatched prior is advisory; an unavailable setting source supplies no settlement. Never alter the prior record.
Phase 1: B, focus, context → enrich(B, focus, context) → B_enriched
       → reconcile(B_enriched, context) → B' → Λ.boundary_map := B' [Tool]
       → already_settled(B', context): final_readout → DefinedBoundary → converge [Tool]
       → otherwise: Phase 2
Phase 2: B, captured_kind, focus, context → boundary_readout(B, captured_kind, focus, context) → BoundaryEssence [Tool]
       → Qs(current arrangement, sufficient as shown or open/correct an axis) → Stop → Λ.answer [Tool]
       → Phase 3
Phase 3: read_answer(Λ.answer, B, context) → (RoundAnswer?, viable futures)
       → several viable J futures: Qc(candidate readings with their different consequences) → Stop → confirmed_intent ∈ J [Tool]
       → read the confirming utterance whole with the original source, including corrections and examination requests; while no coherent handling is recognized, hold the checkpoint and clarify from current ground without committing a branch
       → bind the recognized RoundAnswer to the original utterance and any whole confirming source
       → otherwise no recognized answer: preserve B and the complete utterance in context → Phase 2 for a current readout and question
       → Withdraw: reconcile only effects on the current-kind boundary, preserve the correction and any new-kind question as unresolved with their source; present the partial map and residual → deactivate without DefinedBoundary or re-entry
       → an active answer changing the boundary question: bind Λ.B_prior := {map: B, kind: captured_kind, record: current setting sources} while retaining earlier records in context; carry the utterance's outstanding examination into focus, rebuild and present B_provisional from the user-revised concern → Phase 0b before integrating any new-kind settlement
       → otherwise integrate(B, RoundAnswer, context) → B_integrated → reconcile(B_integrated, context) → B' → Λ.boundary_map := B' [Tool]
       → Continue: derive focus from the utterance → Phase 1
       → Finish ∧ completion_ready(B', RoundAnswer, context): final_readout → DefinedBoundary → converge [Tool]
       → Finish ∧ ¬completion_ready: show the unserved judgment or changed implication; set its focus → Phase 1

── LOOP ──
The first presentation concerns the provisional whole, including why decisions arise and how open premises condition them. Kind dispatch uses that recognizable context. A passing certificate opens the whole-map examination loop.
Each Phase 1 takes the scope and focus from current ground. A requested axis can reveal subdecisions, provisional concrete choices, constraints, or dependencies; enrichment carries them and their evidence in its candidate map, which reconciliation reads before updating B. The next readout shows their relationship to the whole. A focus is not a fixed level or mode, and an unchanged source supplies no reason to re-ask a settled decision.
Phase 2 offers acceptance at the displayed depth and continuation through inspection or correction. Materialize the relevant BoundaryClassification forms inside the proposed arrangement or an opened question; use domain-specific language and keep inspection, sufficiency, and withdrawal as interaction-level paths.
Phase 3 reads mixed utterances whole. Commit the portion actually grounded, preserve material the response leaves open, and let its requested inspection or correction determine the next focus. Showing concrete content alone never settles that content or expands the grant.
A correction reopens the affected dependency region, not a sequence of all entries. Newly exposed consequences needed for the pending judgment return to Phase 1 before closure; unrelated settled choices remain intact.
Every unanswered Constitution interaction holds its dependent transition. The loop may continue while the user examines; neither scan exhaustion nor a visit count constitutes sufficiency. A user can finish without opening every axis, leaving explicit residue and choosing a next move consistent with it.
Withdrawal takes precedence over changed-kind re-entry: reconcile current-kind effects and preserve the correction and pending questions as a non-converged record, then deactivate. An active changed-kind response carries its unserved examination into the next presentation; prior settlement is read only under its own source and applicability checks.

── CONVERGENCE ──
converge iff status(certificate) = pass ∧ (already_settled(B, context) ∨ completion_ready(B, RoundAnswer, context))
  final_readout: read the current map and setting sources; derive residual from every nonempty remainder; bind record to the scope, sufficiency, and settlement acts.
  trace: map each recorded boundary instance to its current settlement or explicitly carried remainder, with the source and effect of relevant corrections. Present the whole arrangement and what the next move may and may not settle under it.
  result: DefinedBoundary = {map: B, kind: captured_kind, residual: projected remainder, record: setting sources}.
  limits: closure defines a boundary at its constituted scope and depth; it supplies neither a fixed project goal nor proof of the user's comprehension or exhaustive discovery.
  non-convergent exits: zero-signal Confirm, route attribution, Unattributable, and Withdraw emit no DefinedBoundary and retain their relevant finding or partial record.

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 prior binding (track) → Internal state update (bind the supplied prior to Λ.B_prior; its authority still depends on the source/applicability read)
Phase 0 inspect / Probe (observe) → record read, artifact read, artifact search (read current context and reachable prior records; construct the relevant provisional whole with uncertain goals and dependencies exposed)
Phase 0 provisional readout (sense) → Internal composition (prepare the current whole with its evidential status; no settlement)
Phase 0 / changed-kind provisional presentation (extension) → TextPresent+Proceed (show that provisional whole and its source/assumption distinctions before every kind or attribution judgment; relay the proposed object for recognition, without adopting its content)
Phase 0 zero-signal (constitution) → present (the finding, reasoning, and Confirm/Reopen path)
Phase 0b sync_kind_route (sense) → Internal analysis (one hypothesis for every recognition seed plus an emergent naming path; derive fit and consequences from the provisional whole)
Phase 0b kind capture (constitution) → present (when single_dominant_kind is false, show the hypotheses with evidence, differential future, and route-away conditions before the question; preserve an open naming path)
Phase 0b kind relay (extension) → TextPresent+Proceed (when single_dominant_kind is true, cite the determining source; quote the user's emergent naming verbatim; certify still follows)
Phase 0b bind / certify (track) → Internal state update (record KindBinding and the locally supported claim set before reading status; non-atomic questions re-sync before certification)
Phase 0b Qa (constitution) → present (on ambiguous local fit, show the supported claims or their absence; Own defines here, Route hands off the named deficit, Unattributable ends with the finding; yield once and preserve the actual attribution form)
Phase 0b attribute / initialize (track) → Internal state update (record the actual Attribution, or initialize the sole current map after a pass; derive focus from unserved requests, preserving a request carried through kind re-entry)
Phase 0b prior grounding (observe) → record read, artifact read (read source-defined same-kind settlement and revisions; retain unresolved domains; remembered dispositions with unavailable sources remain advisory)
Phase 0b route / unattributable exit (extension) → TextPresent+Proceed (relay deficit and basis with the local command hint where one exists; a user-named deficit without a hint is emitted bare. On re-entry, include the relevant prior-record pointer with its original kind and limits)
Phase 1 enrich (observe) → record read, artifact read, artifact search (return the candidate map containing collected or derived evidence, newly exposed domains, and tentative concrete content needed for the requested examination; respect the observation boundary, leave unavailable evidence explicit, and mutate no Λ field)
Phase 1/3 reconcile / integrate (track) → Internal state update (execute the source and dependency reconciliation in TYPES; the transcript remains the reachable setting record; an update does not itself require a user-facing log)
Phase 2 boundary_readout (observe) → record read, artifact read (derive the whole map and focused detail beside their current sources at every Phase 2 entry, including a no-recognized-answer return; classify content by its actual setting act)
Phase 2 Qs (constitution) → present (the recognizable arrangement is before the question; ask whether it is sufficient at the displayed scope and depth or which part to open or correct; yield for the whole response)
Phase 3 read_answer (sense) → Internal analysis (conservative recognition of the whole utterance, including reframing, retention, proposed defaults, and requested inspection)
Phase 3 confirmation (constitution) → present (only when several live handling futures remain; show their actual consequences, read confirmation or correction as a whole source with the original utterance, and hold the checkpoint while handling is still unresolved)
Phase 3 focus / question revision (track) → Internal state update (for an active changed-kind answer, bind the current map/kind/setting-source record into Λ.B_prior and carry the unserved focus through dispatch; earlier records remain reachable. For Withdraw, preserve the correction in the partial record and deactivate)
final_readout (observe) → record read, artifact read (derive the final boundary, residual, trace, and pointers from current state and actual setting acts)
converge (extension) → TextPresent+Proceed (present DefinedBoundary with its limits, source-grounded trace, and required next treatment)
withdrawal (extension) → TextPresent+Proceed (present the non-converged partial record with its limits and required next treatment)
Seam transition to declared next protocol (extension) → TextPresent+Proceed (at a user-declared continuation, cite that source and proceed to the named next protocol; every required checkpoint there still fires. No automatic post-convergence protocol is selected here)

── MODE STATE ──
Λ = { phase: Phase, T: TaskScope, B_prior: Optional(SeededPrior),
      boundary_map: BoundaryMap,
      kind_route_map: Optional(KindRouteMap), captured_kind: Optional(Kind),
      kind_binding: Optional(KindBinding), certificate: Optional(DeficitFitCertificate),
      focus: Set(Domain), answer: Optional(A),
      active: Bool, cause_tag: String }
-- Every current entry is in B, even if unsettled or conditional; readouts and residual are derived views.
-- settled and content.setting carry actual setting sources; proposal and content without setting remain provisional.
-- A dependency change invalidates only the portions their sources no longer support; prior setting records remain reachable.

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution remains context-bound.
A receiving protocol or delegate reads DefinedBoundary with its record. It resolves the relevant entry's question, applicability, dependencies, limits, and setting sources before relying on a disposition or content. Use only B[d].settled as a grant; read tentative content and remainder as such.
UserSupplies leaves the source's retained holder to supply the value. AIPropose permits proposal work while retaining that holder's selection. AIAutonomous permits choice only inside the cited grant. A missing entry, unreadable setting source, or changed prerequisite leaves that judgment unresolved; continue independent authorized work and reopen the affected boundary before dependent settlement.
A grant to perform work preserves every checkpoint whose own contract requires the user's response. Reassignment does not enlarge authority. Carry the whole boundary and its residue, citing the setting record rather than converting the map into an uncited task list.
When examination requires another capability, name the evidence or concrete comparison needed and preserve the pending judgment. This protocol defines the boundary; it does not claim to execute or enforce downstream work.
```

## Mode Activation

- `/bound` remains directly invocable.
- When a decision boundary or the structure needed to judge it is undefined, invoke the protocol with the available task context. Keep goal, success criteria, and scope open where the user has left them open.
- During AI-guided activation, apply current safety boundaries, capability limits, and explicit instructions. Skip activation when source-defined direction already settles the requested boundary, when the user expressly requests proceeding without this interaction, or when the same unresolved finding was dismissed and its ground has not changed.
- On explicit invocation with no undefined boundary, present the zero-signal finding and correction path. A single localized issue can still receive a concise whole-map presentation.

## Protocol

- At the first presentation, show the relevant whole draft before asking the user to choose its boundary kind, applicable parts, or examination depth. Give every included item its decision-relevant reason and conditional connections. State the scope of discovery and what is unknown; do not require the user to invent an obligation inventory.
- When the goal is open, distinguish the work that can investigate it, the judgment that would select it, and obligations conditional on that selection. Propose a way to handle those questions without supplying an unchosen goal.
- At a whole-map gate, make existing user decisions, exercised AI discretion, unaccepted proposals, and unresolved items recognizable through their source and setting status. Show the proposed continuation and retained judgments so that accepting the displayed arrangement has a visible consequence.
- When the user opens an axis, show the concrete content, assumptions, alternatives, and dependent consequences needed for that axis. Keep the whole overview in view and offer deeper examination or correction where it matters. Decision-rights detail and proposed-content detail can differ by axis; derive the depth from the response rather than a fixed menu of levels.
- At an opened settlement question, materialize UserSupplies, AIPropose, and AIAutonomous in the user's idiom: the named person supplies the decision, AI proposes for that person's selection, or AI chooses within stated limits. A displayed default is one of these proposals and binds only through its actual acceptance.
- When the user corrects an assumption or scope, revise affected content and obligations, show their changed implications, and preserve independent commitments. Keep excluded or conditional parts legible in the remainder where they matter to later reliance.
- When an answer says the map is sufficient, close at that depth once its commitments and residue are consistent with the next move. An unvisited axis stays exactly as grounded; finishing does not itself entrust unresolved decisions. Present the constituted whole and remaining questions without demanding a second approval of the same arrangement.
- Before handing off or using a resulting boundary, read the COMPOSITION contract with its source record. Preserve the holder of every retained judgment, the reach of each grant, and any condition that must be revisited.
- When composing a round whose terminology, quotation, neighboring material, or phase order needs attention, read `references/round-composition.md` before presenting it.

## Rules

- **Recognition over Recall**: Present structured options with anticipatable post-selection states.
- **Round composition**: Keep each judgment beside its nearest evidence and next-move implication, and place analytical context before the gate.
- **Whole before selection**: Construct and present the relevant provisional whole before asking what to settle, inspect, or entrust; the user's existing goal and map can remain incomplete.
- **Progressive examination**: Let the user's response open, deepen, replace, or close axes of that whole. Bind requested examination to the next presentation and to completion readiness, including through kind re-entry; a request to see content adopts none of it.
- **Dynamic rendering**: Keep boundary kinds and examination dimensions runtime-grounded, with recognizable seeds and a path to extend or replace the framing.
- **Source-bound settlement**: Distinguish proposals, content-setting acts, and boundary-setting acts. Apply acceptance only within its actual referent and limits; a displayed or completed AI proposal does not become the retained holder's choice.
- **Dependency revision**: Reconcile changed ground and transitive dependents before a gate or terminal read, retaining supported decisions and recording unresolved consequences. An active answer changing the boundary question re-enters dispatch; a recognized withdrawal preserves the correction and exits without another round.
- **Prior-map provenance**: Read prior same-kind boundaries through their setting record and authorized revisions. Preserve still-relevant unresolved domains and treat unavailable or mismatched prior authority as advisory.
- **Settlement across delegation**: Carry and read the source-defined question, judgment holder, limits, dependencies, and residual at downstream use; work reassignment and a summary supply no additional grant.
- **Sufficient closure**: Require an attributable sufficiency judgment for the current arrangement, preserve explicit residue, and continue only work consistent with it. Already-determined boundaries relay; silence and scan exhaustion supply no new answer.
- **Zero-signal surfacing**: Present a zero-signal finding with its reasoning and a path to reopen missed structure.
- **Ambiguous response routing**: Read mixed responses whole; when materially different futures remain viable, present those readings and their consequences before routing. Commit nothing from an unresolved reading.
- **Option-set relay test**: Relay the captured kind only when citable live ground determines it; otherwise retain the kind question and emergent path. A relay still undergoes fail-closed local fit certification.
- **Ambiguity surfaces**: A locally ambiguous certificate opens Qa before settlement; preserve Own, Route(d), or Unattributable as the actual control form, and do not re-certify unchanged evidence in place of the answer.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction until countermanded. Change the form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
