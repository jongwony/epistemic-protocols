import Tests.Fixture.Bad.Contract

/-! A Theorems module that breaks each of the audit's theorem-side rules. -/

namespace Bad

/-- The witness for `tagOf` built from `tagOf` itself. -/
instance : Nonempty Tag := ⟨tagOf 0⟩

axiom cheat : False

theorem rests_on_cheat : (tagOf 0).n = (tagOf 0).n ∧ False := ⟨rfl, cheat⟩

theorem rests_on_sorry : (tagOf 0).n = 1 := sorry

theorem unrelated : 1 + 1 = 2 := rfl

private theorem hidden_cheat : False := cheat

def publicDef : Nat := 0

/-- An underscore-prefixed name hides nothing from the audit. -/
axiom _cheat : False

theorem _unchecked : False := _cheat

end Bad
