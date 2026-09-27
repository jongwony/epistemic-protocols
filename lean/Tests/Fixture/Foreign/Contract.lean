/-! A contract that grounds its operations in an annotation type of its own, one that admits an
    annotation outside the shared vocabulary, and has no convergence operation. -/

namespace Foreign

inductive Annot | sense | inspect

inductive Op | look

def grounding : Op → Annot × String
  | .look => (.inspect, "a look outside the vocabulary")

end Foreign
