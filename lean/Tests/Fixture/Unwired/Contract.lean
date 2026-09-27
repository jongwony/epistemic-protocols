import EpistemicProtocols.ToolGrounding

/-! A contract over the shared vocabulary that breaks the rest of the grounding rules: its
    convergence is not an interaction, two descriptions restate a realization, a third is computed
    rather than written, and its hand-off is named only by `grounding`. -/

open ToolGrounding

namespace Unwired

inductive Op | ask | tell | note | send | converge

def grounding : Op → Annot × String
  | .ask      => (.interaction .constitution, "present: the question")
  | .tell     => (.interaction .extension, "TextPresent+Stop: the answer")
  | .note     => (.interaction .extension, "TextPresent+" ++ "Proceed: a note")
  | .send     => (.dispatch, "delegate: the answer")
  | .converge => (.sense, "Internal analysis: the trace")

end Unwired
