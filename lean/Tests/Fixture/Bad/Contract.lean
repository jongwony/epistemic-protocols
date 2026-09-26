/-! A contract that breaks the audit's contract-side rules. -/

namespace Bad

structure Tag where
  n : Nat

/-- Judge the tag of a number. -/
axiom tagOf : Nat → Tag

axiom undocumented : Nat

/-- Judge an element of the empty type. -/
axiom never : Empty

theorem inContract : True := trivial

end Bad
