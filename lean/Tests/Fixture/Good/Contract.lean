import EpistemicProtocols.ToolGrounding

/-! A contract the audit accepts: one documented data judgment and one documented predicate, and
    its operations grounded in the shared vocabulary, the one hand-off wired into a declaration. -/

open ToolGrounding

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

inductive Op | ask | send | converge

def grounding : Op → Annot × String
  | .ask      => (.interaction .constitution, "the number to tag")
  | .send     => (.dispatch, "delegate: the tagged number")
  | .converge => (.interaction .extension, "the tag")

/-- The operation a number is handed off through: none for zero. -/
def sentBy (k : Nat) : Option Op := if k = 0 then none else some .send

end Good
