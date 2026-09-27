import Audit.Check
import Tests.Fixture.Good.Theorems
import Tests.Fixture.Bad.Theorems
import Tests.Fixture.Foreign.Theorems
import Tests.Fixture.Unwired.Theorems

/-! The audit run against fixtures: one contract it accepts, and contracts that between them break
    each rule — `Bad` the declaration rules, and grounding none of its operations; `Foreign` and
    `Unwired` the TOOL GROUNDING rules, which a contract without `Op` never reaches.
    `lake test` builds this library; a report that drifts from the expected text fails it. -/

open Lean Meta Audit

def report (t : Target) : MetaM Unit := do
  let r ← auditTarget t
  IO.println s!"guarantees: {r.guarantees}"
  IO.println s!"helpers: {r.helpers}"
  IO.println s!"judgments: {r.judgments}"
  IO.println s!"witnesses: {r.witnesses}"
  for p in r.problems do IO.println s!"problem: {p}"

def good : Target := { ns := `Good, contract := `Tests.Fixture.Good.Contract, theorems := `Tests.Fixture.Good.Theorems }
def bad : Target := { ns := `Bad, contract := `Tests.Fixture.Bad.Contract, theorems := `Tests.Fixture.Bad.Theorems }
def foreign : Target := { ns := `Foreign, contract := `Tests.Fixture.Foreign.Contract, theorems := `Tests.Fixture.Foreign.Theorems }
def unwired : Target := { ns := `Unwired, contract := `Tests.Fixture.Unwired.Contract, theorems := `Tests.Fixture.Unwired.Theorems }

/--
info: guarantees: #[Good.tagged_is_judged]
helpers: #[Good.helper]
judgments: #[Good.Wanted, Good.reuse, Good.tagOf]
witnesses: #[Good.instNonemptyTag]
-/
#guard_msgs in
#eval report good

/--
info: guarantees: #[Bad._unchecked, Bad.rests_on_cheat, Bad.rests_on_sorry, Bad.unrelated]
helpers: #[Bad.hidden_cheat]
judgments: #[Bad.never, Bad.tagOf]
witnesses: #[Bad.instNonemptyTag]
problem: `theorem Bad.inContract` is proved in `Tests.Fixture.Bad.Contract` — a proof is verification, not contract: state and prove it in `Tests.Fixture.Bad.Theorems`
problem: `axiom Bad.undocumented` has no doc comment — an axiom in the block is a model judgment, and its doc comment says what is judged
problem: `Tests.Fixture.Bad.Contract` declares no `inductive Bad.Op` — each operation the contract grounds is a constructor of `Op`, annotated in `grounding`
problem: `axiom Bad._cheat` is declared in `Tests.Fixture.Bad.Theorems` — only the block declares an axiom, and there it is a documented model judgment
problem: `Bad._unchecked` depends on `Bad._cheat` — only `propext`, `Classical.choice`, `Quot.sound` and the block's own judgments are admitted
problem: guarantee `Bad._unchecked` states nothing about the contract — its statement mentions no declaration of `Tests.Fixture.Bad.Contract` or GROUND; a lemma it needs is `private`
problem: `axiom Bad.cheat` is declared in `Tests.Fixture.Bad.Theorems` — only the block declares an axiom, and there it is a documented model judgment
problem: `Bad.publicDef` is a public definition in `Tests.Fixture.Bad.Theorems` — a definition of the contract lives in the block; a helper is `private`
problem: `Bad.rests_on_cheat` depends on `Bad.cheat` — only `propext`, `Classical.choice`, `Quot.sound` and the block's own judgments are admitted
problem: `Bad.rests_on_sorry` uses `sorry`
problem: guarantee `Bad.unrelated` states nothing about the contract — its statement mentions no declaration of `Tests.Fixture.Bad.Contract` or GROUND; a lemma it needs is `private`
problem: `Bad.hidden_cheat` depends on `Bad.cheat` — only `propext`, `Classical.choice`, `Quot.sound` and the block's own judgments are admitted
problem: `axiom Bad.never` is a judgment whose type has no `Nonempty` instance — declare one in `Tests.Fixture.Bad.Theorems`, so the judgment cannot assume what nothing inhabits
problem: the `Nonempty` witness for `axiom Bad.tagOf` rests on `Bad.tagOf` — a witness may name a judgment's type or predicate, and otherwise rests only on `propext`, `Classical.choice`, `Quot.sound`
-/
#guard_msgs in
#eval report bad

-- GROUND declares no judgment.
/--
info: guarantees: #[Good.tagged_is_judged]
helpers: #[Good.helper]
judgments: #[]
witnesses: #[Good.instNonemptyTag]
problem: `axiom Good.Wanted` is declared in `Tests.Fixture.Good.Contract` — GROUND declares no judgment
problem: `axiom Good.reuse` is declared in `Tests.Fixture.Good.Contract` — GROUND declares no judgment
problem: `axiom Good.tagOf` is declared in `Tests.Fixture.Good.Contract` — GROUND declares no judgment
problem: `Good.tagged_is_judged` depends on `Good.tagOf` — only `propext`, `Classical.choice`, `Quot.sound` and the block's own judgments are admitted
problem: `Good.helper` depends on `Good.tagOf` — only `propext`, `Classical.choice`, `Quot.sound` and the block's own judgments are admitted
-/
#guard_msgs in
#eval report { good with judgmentsAllowed := false }

-- An annotation type of the contract's own admits `inspect`; the shared vocabulary does not.
/--
info: guarantees: #[Foreign.look_inspects]
helpers: #[]
judgments: #[]
witnesses: #[]
problem: `Foreign.Op` has no `converge` constructor — a contract's convergence is an operation, grounded as an interaction with the person
problem: `Foreign.grounding` has type `Foreign.Op → Foreign.Annot × String` — its annotation type is the shared `ToolGrounding.Annot`, so an annotation outside that vocabulary cannot be written
-/
#guard_msgs in
#eval report foreign

-- A guarantee that names the hand-off does not wire it: only a contract declaration does.
/--
info: guarantees: #[Unwired.send_dispatches]
helpers: #[]
judgments: #[]
witnesses: #[]
problem: `Unwired.grounding .converge` is annotated `ToolGrounding.Annot.sense` — convergence is presented to the person, so its annotation is an interaction
problem: the description of `Unwired.Op.ask` opens with `present:` — the realization is carried by the interaction's kind (`Interaction.realization`), not restated in the description
problem: the description of `Unwired.Op.tell` opens with `TextPresent` — the realization is carried by the interaction's kind (`Interaction.realization`), not restated in the description
problem: the description of `Unwired.Op.note` does not reduce to a string literal — a description is read as written, so what it opens with is decided where it is written
problem: `Unwired.Op.send` is a `dispatch` operation no contract declaration other than `grounding` names — a hand-off is wired into the transitions or the data that decide it
-/
#guard_msgs in
#eval report unwired
