/-! A contract the audit accepts: one documented data judgment and one documented predicate. -/

namespace Good

structure Tag where
  n : Nat

/-- Judge the tag of a number. -/
axiom tagOf : Nat → Tag

/-- Judge whether a number is wanted. -/
axiom Wanted : Nat → Prop

/-- Return the supplied evidence: inhabited by the evidence its own binder carries. -/
axiom reuse : (p : Prop) → p → p

noncomputable def tagged (k : Nat) : Tag := tagOf k

end Good
