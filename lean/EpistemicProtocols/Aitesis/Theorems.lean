module

public import Contract.Aitesis

/-! The theorems the /inquire contract has. `Contract.Aitesis` is the SKILL.md Lean block, generated
    by lean-contract.js; `Proofs.lean` proves each theorem stated here, and the lean-definition
    check re-derives every statement from the proved theorem of its name. The runtime surface
    carries only what the model reads, so the statements live here. -/

namespace Aitesis

variable {P : Type}

/-!
The sets are disjoint by construction: an item's landing names one state.
theorem state_unique {c : Context P} {i : Item} {s s' : State}
    (h : inState c s i) (h' : inState c s' i) : s = s'

A dismissed item never re-enters a pass: the person's dismissal keeps it out of `live`, and
registration keeps it out of what the scan raises.
theorem no_reentry (c : Context P) (i : Item) (hreg : Registered c i) (hself : SameItem c i i)
    (hd : (dismissal c i).isSome = true) : ¬ working c i

What sufficed for a resolved item is never an AI turn.
theorem resolved_not_ai {c : Context P} {i : Item} {f w : String} {s : Cite c}
    {sup : LandSupported i c (c[s.idx]'s.lt) f} (_ : landing c i = .resolved f s sup w) :
    (c[s.idx]'s.lt).origin ≠ .assistant

A pass only adds to the context: what collection returned, then the pass's record.
theorem pass_extends (c : Context P) : ∃ t, pass c = c ++ t

theorem ends_sufficient {c c' : Context P} (h : CollectionEnds c c') :
    ∃ c₀, c' = pass c₀ ∧ (¬ PassChanged c₀ (pass c₀) ∨ ¬ WorthAnotherPass (pass c₀))

The Sufficient answer converges at once, with no further pass.
theorem sufficient_opens_no_pass (respond : Context P → Response P) (c : Context P)
    (u : Utterance P) (us : List (Utterance P)) (h : answer (fuse c u) = some .sufficient) :
    inquire respond c (u :: us) = .declared (fuse c u)
-/

end Aitesis
