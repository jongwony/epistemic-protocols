import Tests.Fixture.Good.Contract

/-! Guarantees the audit accepts: public theorems about the contract, a private helper, and a
    witness that assumes nothing. -/

namespace Good

instance : Nonempty Tag := ⟨⟨0⟩⟩

private theorem helper (k : Nat) : tagged k = tagOf k := rfl

theorem tagged_is_judged (k : Nat) : tagged k = tagOf k := helper k

end Good
