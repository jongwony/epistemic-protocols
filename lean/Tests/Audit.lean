import Audit.Check
import Tests.Fixture.Good.Theorems
import Tests.Fixture.Bad.Theorems

/-! The audit run against fixtures: one contract it accepts, and one that breaks each rule.
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
