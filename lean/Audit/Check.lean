import Lean

/-! The lean-definition audit, read from the elaborated environment rather than from text.

For one protocol it inspects two modules: the contract `Contract.<NS>`, generated from the SKILL.md
Lean block, and `EpistemicProtocols.<NS>.Theorems`, where the contract's guarantees are stated and
proved together. GROUND is audited the same way, as the pair `EpistemicProtocols.Ground` and
`EpistemicProtocols.Ground.Theorems`, with no judgments. Every verdict here follows from the
environment: which module owns a declaration, what kind it is, its doc string, and the axioms it
transitively depends on (`Lean.collectAxioms`). Markdown extraction, the textual GROUND comparison,
and the repository inventory stay with the Node orchestrator. -/

open Lean Meta

namespace Audit

/-- The axioms a proof may rest on, beyond the contract's own documented judgments. -/
def allowedAxioms : List Name := [``propext, ``Classical.choice, ``Quot.sound]

/-- The two modules that make up one audited unit. -/
structure Target where
  ns : Name
  contract : Name
  theorems : Name
  /-- GROUND declares no judgments; a protocol contract may. -/
  judgmentsAllowed : Bool := true

def Target.protocol (ns : Name) : Target :=
  { ns, contract := `Contract ++ ns, theorems := `EpistemicProtocols ++ ns ++ `Theorems }

def Target.ground : Target :=
  { ns := `Ground, contract := `EpistemicProtocols.Ground,
    theorems := `EpistemicProtocols.Ground.Theorems, judgmentsAllowed := false }

structure Report where
  ns : String
  guarantees : Array String := #[]
  helpers : Array String := #[]
  judgments : Array String := #[]
  witnesses : Array String := #[]
  problems : Array String := #[]
  deriving ToJson, FromJson, Inhabited

def moduleOf (env : Environment) (n : Name) : Option Name :=
  (env.getModuleIdxFor? n).bind fun i => env.header.moduleNames[i.toNat]?

/-- A declaration the author wrote: it has source ranges, and it is neither a structure projection
    nor a compiler-generated auxiliary. -/
def authored (n : Name) : MetaM Bool := do
  let env ← getEnv
  if ((privateToUserName? n).getD n).isInternalDetail || env.isProjectionFn n then return false
  return (← findDeclarationRanges? n).isSome

/-- An instance of `Nonempty _`: the witness a judgment's type needs. -/
def isNonemptyWitness (n : Name) (ci : ConstantInfo) : MetaM Bool := do
  return (Meta.isInstanceCore (← getEnv) n) && ci.type.getForallBody.isAppOf ``Nonempty

def userName (n : Name) : Name := (privateToUserName? n).getD n

/-- The axioms `n` transitively depends on that are neither allowed nor among `judgments`. -/
def axiomsOutside (n : Name) (judgments : List Name) : MetaM (Array Name) := do
  let axs ← collectAxioms n
  return axs.filter fun a => !allowedAxioms.contains a && !judgments.contains a

def showNames (ns : Array Name) : String :=
  ", ".intercalate (ns.toList.map fun n => s!"`{n}`")

/-- Escape hatches the environment still records after elaboration. -/
def escapes (n : Name) (ci : ConstantInfo) : MetaM (List String) := do
  let env ← getEnv
  let mut out := []
  if ci.isUnsafe then out := out ++ ["is `unsafe`"]
  if (Compiler.getImplementedBy? env n).isSome then out := out ++ ["carries `implemented_by`"]
  if isExtern env n then out := out ++ ["carries `extern`"]
  return out

def auditTarget (u : Target) : MetaM Report := do
  let env ← getEnv
  let mut r : Report := { ns := u.ns.toString }
  unless env.header.moduleNames.contains u.contract do
    return { r with problems := #[s!"module `{u.contract}` is not in the environment"] }
  unless env.header.moduleNames.contains u.theorems do
    return { r with problems := #[s!"module `{u.theorems}` is not in the environment — state and prove the contract's guarantees there"] }
  let mut contractDecls : Array (Name × ConstantInfo) := #[]
  let mut theoremDecls : Array (Name × ConstantInfo) := #[]
  for (n, ci) in env.constants.toList do
    match moduleOf env n with
    | some m =>
      if m == u.contract then contractDecls := contractDecls.push (n, ci)
      else if m == u.theorems then theoremDecls := theoremDecls.push (n, ci)
    | none => pure ()
  contractDecls := contractDecls.qsort (fun a b => a.1.toString < b.1.toString)
  theoremDecls := theoremDecls.qsort (fun a b => a.1.toString < b.1.toString)

  -- The contract: judgments are its only axioms, each documented; it proves nothing.
  let mut judgments : Array Name := #[]
  for (n, ci) in contractDecls do
    match ci with
    | .axiomInfo _ =>
      if !u.judgmentsAllowed then
        r := { r with problems := r.problems.push s!"`axiom {n}` is declared in `{u.contract}` — GROUND declares no judgment" }
      else if (← findDocString? env n).isNone then
        r := { r with problems := r.problems.push s!"`axiom {n}` has no doc comment — an axiom in the block is a model judgment, and its doc comment says what is judged" }
      else judgments := judgments.push n
    | .thmInfo _ =>
      if (← authored n) && !(← isNonemptyWitness n ci) then
        r := { r with problems := r.problems.push s!"`theorem {n}` is proved in `{u.contract}` — a proof is verification, not contract: state and prove it in `{u.theorems}`" }
    | _ => pure ()
    for e in ← escapes n ci do
      r := { r with problems := r.problems.push s!"`{n}` in `{u.contract}` {e}" }
  r := { r with judgments := judgments.map toString }

  -- The Theorems module: public theorems are the guarantees, private ones helpers; it adds no
  -- axiom and no public definition, and every declaration rests only on allowed axioms and the
  -- contract's judgments.
  let judgmentList := judgments.toList
  for (n, ci) in theoremDecls do
    if !(← authored n) then continue
    let isWitness ← isNonemptyWitness n ci
    match ci with
    | .axiomInfo _ =>
      r := { r with problems := r.problems.push s!"`axiom {userName n}` is declared in `{u.theorems}` — only the block declares an axiom, and there it is a documented model judgment" }
      continue
    | .thmInfo _ =>
      if isWitness then r := { r with witnesses := r.witnesses.push (userName n).toString }
      else if isPrivateName n then r := { r with helpers := r.helpers.push (userName n).toString }
      else
        r := { r with guarantees := r.guarantees.push n.toString }
        if !(n.getPrefix == u.ns) then
          r := { r with problems := r.problems.push s!"guarantee `{n}` is not declared in `namespace {u.ns}`" }
        let about := ci.type.getUsedConstants.any fun c =>
          match moduleOf env c with
          | some m => m == u.contract || m == `EpistemicProtocols.Ground
          | none => false
        if !about then
          r := { r with problems := r.problems.push s!"guarantee `{n}` states nothing about the contract — its statement mentions no declaration of `{u.contract}` or GROUND; a lemma it needs is `private`" }
    | _ =>
      if isWitness then r := { r with witnesses := r.witnesses.push (userName n).toString }
      else if !isPrivateName n then
        r := { r with problems := r.problems.push s!"`{n}` is a public definition in `{u.theorems}` — a definition of the contract lives in the block; a helper is `private`" }
    let outside ← axiomsOutside n judgmentList
    if outside.contains ``sorryAx then
      r := { r with problems := r.problems.push s!"`{userName n}` uses `sorry`" }
    let rest := outside.filter (· != ``sorryAx)
    if !rest.isEmpty then
      r := { r with problems := r.problems.push s!"`{userName n}` depends on {showNames rest} — only {showNames allowedAxioms.toArray} and the block's own judgments are admitted" }
    for e in ← escapes n ci do
      r := { r with problems := r.problems.push s!"`{userName n}` in `{u.theorems}` {e}" }

  if u.judgmentsAllowed && r.guarantees.isEmpty then
    r := { r with problems := r.problems.push s!"`{u.theorems}` states no public theorem — the contract's guarantees are its public theorems" }

  -- Every judgment's type is inhabited, by a witness that assumes nothing. The witness is the
  -- synthesized instance application; what it rests on is read from the instance declarations it
  -- applies, each quantified over its own indices. A judgment that forms a type or a predicate
  -- (its type ends in a `Sort`) may appear there — naming a type assumes no inhabitant; a judgment
  -- whose value it uses, `sorry`, or any other axiom would assume what the witness is meant to show.
  let mut formers : List Name := []
  for j in judgments do
    let some ci := env.find? j | continue
    if ← forallTelescopeReducing ci.type fun _ body => return body.isSort then formers := j :: formers
  for j in judgments do
    let some ci := env.find? j | continue
    -- Inhabited under every instantiation of its binders: the codomain, in their context.
    let witness? ← forallTelescopeReducing ci.type fun _ body => do
      try synthInstance? (← mkAppM ``Nonempty #[body]) catch _ => pure none
    match witness? with
    | none =>
      r := { r with problems := r.problems.push s!"`axiom {j}` is a judgment whose type has no `Nonempty` instance — declare one in `{u.theorems}`, so the judgment cannot assume what nothing inhabits" }
    | some w =>
      let mut deps : Array Name := #[]
      for c in w.getUsedConstants do
        unless Meta.isInstanceCore env c do continue
        for a in ← collectAxioms c do
          if !allowedAxioms.contains a && !formers.contains a && !deps.contains a then deps := deps.push a
      if !deps.isEmpty then
        r := { r with problems := r.problems.push s!"the `Nonempty` witness for `axiom {j}` rests on {showNames deps} — a witness may name a judgment's type or predicate, and otherwise rests only on {showNames allowedAxioms.toArray}" }
  return r

end Audit
