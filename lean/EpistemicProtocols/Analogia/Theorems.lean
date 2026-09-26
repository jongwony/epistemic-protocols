module

public import Contract.Analogia

/-! The theorems the /ground contract has. `Contract.Analogia` is the SKILL.md Lean block, generated
    by lean-contract.js; `Proofs.lean` proves each theorem stated here, and the lean-definition
    check re-derives every statement from the proved theorem of its name. The runtime surface
    carries only what the model reads, so the statements live here. -/

namespace Analogia

variable {P : Type}

/-!
With no new evidence, collection leaves the context, and so every reading, unchanged.
theorem no_evidence_no_change (c : Context P) (h : observe c = []) : collect c = c

A settlement that narrows `K` without basis holds at the focus gate rather than reading the
unchanged context again.
theorem narrowing_holds_at_gate (c : Context P) (hu : Uncertain c)
    (hn : UnsupportedNarrowing c) : report c = .focusGate

While the focus gate holds, a later utterance collects no evidence.
theorem held_gate_collects_nothing (respond : Context P → Response P) (c : Context P)
    (u : Utterance P) (us : List (Utterance P)) (hs : ¬ Supersedes (fuse c u))
    (hf : FocusHeld (fuse c u)) :
    ground respond c (u :: us) = ground respond (fuse c u ++ [(respond (fuse c u)).val]) us

theorem assessment_converged (c : Context P) (h : report c = .assessment) :
    focusSettled c ∧ converged c

The comparison purpose is filled only by the user's own words.
theorem purpose_by_person {c : Context P} {s : Cite c}
    (ok : (axisCoord (P := P) .purpose).admits s.src) : s.src.val = .person

A replacement of a committed domain closes the activation at once.
theorem superseded_first (respond : Context P → Response P) (c : Context P)
    (u : Utterance P) (us : List (Utterance P)) (h : Supersedes (fuse c u)) :
    ground respond c (u :: us) = ⟨fuse c u, .superseded⟩
-/

end Analogia
