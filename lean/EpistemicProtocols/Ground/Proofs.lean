module

public import EpistemicProtocols.Ground

/-! Proofs of the theorems the GROUND section states. -/

public section

namespace Ground

theorem fuse_extends {P : Type} (c : Context P) (u : Utterance P) :
    ∃ t, fuse c u = c ++ t := ⟨[u.val], rfl⟩

theorem cited_not_assistant {P : Type} {c : Context P} (s : Cite c) :
    (c[s.idx]'s.lt).origin ≠ .assistant := by
  rw [s.ok]; exact s.src.property.1

theorem cited_not_injected {P : Type} {c : Context P} (s : Cite c) :
    (c[s.idx]'s.lt).origin ≠ .injected := by
  rw [s.ok]; exact s.src.property.2.1

end Ground
