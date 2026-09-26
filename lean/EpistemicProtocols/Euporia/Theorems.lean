module

public import Contract.Euporia

/-! The theorems the /elicit contract has. `Contract.Euporia` is the SKILL.md Lean block, generated
    by lean-contract.js; `Proofs.lean` proves each theorem stated here, and the lean-definition
    check re-derives every statement from the proved theorem of its name. The runtime surface
    carries only what the model reads, so the statements live here. -/

namespace Euporia

variable {P : Type}

/-!
theorem acceptedAux_skip (x : Coordinate) (pre ts : Context P) (acc : Option Value)
    (h : ∀ t ∈ ts, t.origin ≠ .person) :
    acceptedAux x pre ts acc = acc

theorem acceptedAux_append (x : Coordinate) (pre c e : Context P) (acc : Option Value) :
    acceptedAux x pre (c ++ e) acc = acceptedAux x (pre ++ c) e (acceptedAux x pre c acc)

Coordinate Monotonicity: turns that are not a person's utterance — a re-trace, a substrate
read, an AI response — leave every accepted value as it was.
theorem accepted_revised_only_by_utterance (c e : Context P) (x : Coordinate)
    (h : ∀ t ∈ e, t.origin ≠ .person) : accepted (c ++ e) x = accepted c x

theorem silence (respond : Context P → Response P) (c : Context P) :
    elicit respond c [] = .holding c

theorem resolved_here (respond : Context P → Response P) (c : Context P) (u : Utterance P)
    (us : List (Utterance P)) (h : answer (fuse c u) = .resolved) :
    elicit respond c (u :: us) = .resolved (endpoint (fuse c u) false)

Nothing parked is dropped at termination.
theorem parked_in_residual (c : Context P) (d : Bool) (x : Coordinate) (hx : x ∈ parked c) :
    ResidualItem.coordinate x ∈ residualAt c d

An endpoint always follows a person's utterance.
theorem endpoint_ends_in_utterance (respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) (r : ResolvedEndpoint P) (h : elicit respond c us = .resolved r) :
    ∃ (c₀ : Context P) (u : Utterance P), r.context = fuse c₀ u
-/

end Euporia
