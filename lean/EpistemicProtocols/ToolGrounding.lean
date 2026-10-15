module

/-! The TOOL GROUNDING vocabulary every protocol Lean block carries verbatim at the head of its
    TOOL GROUNDING section; lean-definition compares each copy against the text between this
    file's `namespace ToolGrounding` and `end ToolGrounding`. -/

@[expose] public section

namespace ToolGrounding

/-! ── TOOL GROUNDING ──
What each operation of this contract does. An interaction with the person is one of two kinds,
and its kind fixes how it continues once its text is presented. A Constitution settles a judgment
through the person's turn. An Extension settles none for the person: it passes on a result its
cited ground fixes, or carries reversible work forward on a judgment the AI states, which stays
the AI's proposal until the person takes it.
-/

inductive Interaction | constitution | extension

inductive Continuation | stop | proceed

inductive Annot | sense | observe | track | transform | dispatch | interaction (kind : Interaction)

/-- Every interaction presents its text; a Constitution then stops for the person's turn, and an
    Extension proceeds. -/
def Interaction.realization : Interaction → Continuation
  | .constitution => .stop
  | .extension    => .proceed

end ToolGrounding
