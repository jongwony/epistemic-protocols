module

public import Contract.Horismos

/-! The theorems the /bound contract has. `Contract.Horismos` is the SKILL.md Lean block, generated
    by lean-contract.js; `Proofs.lean` proves each theorem stated here, and the lean-definition
    check re-derives every statement from the proved theorem of its name. The runtime surface
    carries only what the model reads, so the statements live here. -/

namespace Horismos

open Ground

variable {P : Type}
variable (respond : Context P → Response P)

/-!
Silence sets no boundary.
theorem silence (c : Context P) : bound respond c [] = .holding c

Continued rounds fold into the context: what follows depends on the context alone.
theorem continue_folds (c : Context P) (xs ys : List (Utterance P))
    (h : AllCont respond c xs) :
    bound respond c (xs ++ ys) = bound respond (foldRounds respond c xs) ys

The boundary is set where the user accepted the closing offer, from the context at that
point; later utterances do not reach it.
theorem stop_here (c : Context P) (u : Utterance P) (us : List (Utterance P))
    (h : verdict (fuse c u) = .finish) :
    bound respond c (u :: us) = .defined (close (fuse c u))

A DefinedBoundary always follows a person's utterance: its context ends with one.
theorem defined_ends_in_utterance (c : Context P) (us : List (Utterance P))
    (b : DefinedBoundary P) (h : bound respond c us = .defined b) :
    ∃ (c₀ : Context P) (u : Utterance P), b.context = fuse c₀ u
-/

end Horismos
