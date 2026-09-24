module

public import EpistemicProtocols.Ground

/-! Proofs of the theorems the GROUND section states. -/

public section

namespace Ground

theorem fuse_extends {P : Type} (c : Context P) (u : Utterance P) :
    ∃ t, fuse c u = c ++ t := ⟨[u.val], rfl⟩

theorem ai_never_grounds {P : Type} (e : Turn P) (h : e.origin = .assistant) :
    e.basis = none := by simp [Turn.basis, h]

end Ground
