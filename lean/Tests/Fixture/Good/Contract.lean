/-! A contract the audit accepts: one documented data judgment and one documented predicate. -/

namespace Good

structure Tag where
  n : Nat

/-- Judge the tag of a number. -/
axiom tagOf : Nat → Tag

/-- Judge whether a number is wanted. -/
axiom Wanted : Nat → Prop

noncomputable def tagged (k : Nat) : Tag := tagOf k

end Good
