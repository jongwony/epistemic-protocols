import Lean

/-! The lean-definition audit, read from the elaborated environment rather than from text.

For one protocol it inspects two modules: the contract `Contract.<NS>`, generated from the SKILL.md
Lean block, and `EpistemicProtocols.<NS>.Theorems`, where the contract's guarantees are stated and
proved together. GROUND and the TOOL GROUNDING vocabulary are audited the same way, each as the
pair of its canonical module and that module's `Theorems`, with no judgments. Every verdict here
follows from the environment: which module owns a declaration, what kind it is, its doc string, the
axioms it transitively depends on (`Lean.collectAxioms`), what a declaration's type and value name,
and what `grounding` reduces to. Markdown extraction, the textual comparison of each block's shared
sections with their canonical modules, and the repository inventory stay with the Node
orchestrator. -/

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
  /-- A protocol contract grounds its operations; a shared section has none. -/
  groundsOperations : Bool := true

def Target.protocol (ns : Name) : Target :=
  { ns, contract := `Contract ++ ns, theorems := `EpistemicProtocols ++ ns ++ `Theorems }

def Target.ground : Target :=
  { ns := `Ground, contract := `EpistemicProtocols.Ground,
    theorems := `EpistemicProtocols.Ground.Theorems, judgmentsAllowed := false,
    groundsOperations := false }

def Target.toolGrounding : Target :=
  { ns := `ToolGrounding, contract := `EpistemicProtocols.ToolGrounding,
    theorems := `EpistemicProtocols.ToolGrounding.Theorems, judgmentsAllowed := false,
    groundsOperations := false }

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

/-- A declaration the author wrote: it has source ranges and is not a structure projection. Only
    what is listed turns on this; the axiom, dependency and escape readouts cover every declaration a
    module owns, so a name — an underscore-prefixed one among them — hides nothing from them. -/
def authored (n : Name) : MetaM Bool := do
  if (← getEnv).isProjectionFn n then return false
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

/-- The annotation type every contract's `grounding` uses: the shared TOOL GROUNDING vocabulary. -/
def sharedAnnot : Name := `ToolGrounding.Annot

/-- A declaration's type or value names `c`. -/
def names (ci : ConstantInfo) (c : Name) : Bool :=
  ci.type.getUsedConstants.contains c ||
    (ci.value? (allowOpaque := true)).any (·.getUsedConstants.contains c)

/-- How a description may not open: the realization an interaction's kind already carries. -/
def realizationPrefixes : List String := ["TextPresent", "present:"]

/-- TOOL GROUNDING, read from the environment: the contract declares its operations as `Op` and
    grounds each by `grounding : Op → ToolGrounding.Annot × String`, so no annotation outside the
    shared vocabulary can be written; `.converge` is an operation, annotated as an interaction,
    since convergence is presented to the person; no description restates the realization its
    annotation's kind carries; and each `dispatch` operation is named by a contract declaration
    other than `grounding`, so the hand-off is wired into the contract rather than only listed.
    Annotations and descriptions are read by reducing `grounding` at each constructor. -/
def auditGrounding (u : Target) (contractDecls : Array (Name × ConstantInfo)) :
    MetaM (Array String) := do
  let env ← getEnv
  let op := u.ns ++ `Op
  let grounding := u.ns ++ `grounding
  let owned (n : Name) := moduleOf env n == some u.contract
  let some (.inductInfo opInfo) := (env.find? op).filter (fun _ => owned op)
    | return #[s!"`{u.contract}` declares no `inductive {op}` — each operation the contract grounds is a constructor of `Op`, annotated in `grounding`"]
  let some gci := (env.find? grounding).filter (fun _ => owned grounding)
    | return #[s!"`{u.contract}` declares no `{grounding}` — each operation's annotation and description is an arm of `grounding : Op → Annot × String`"]
  let mut problems : Array String := #[]
  let converge := op ++ `converge
  if !opInfo.ctors.contains converge then
    problems := problems.push s!"`{op}` has no `converge` constructor — a contract's convergence is an operation, grounded as an interaction with the person"
  unless env.contains sharedAnnot do
    return problems.push s!"`{sharedAnnot}` is not in the environment — the shared TOOL GROUNDING vocabulary is `EpistemicProtocols.ToolGrounding`"
  let expected ← mkArrow (mkConst op) (← mkAppM ``Prod #[mkConst sharedAnnot, mkConst ``String])
  unless ← isDefEq gci.type expected do
    return problems.push s!"`{grounding}` has type `{← ppExpr gci.type}` — its annotation type is the shared `{sharedAnnot}`, so an annotation outside that vocabulary cannot be written"
  let arm (proj : Name) (c : Name) : MetaM Expr := do
    whnf (← mkAppM proj #[mkApp (mkConst grounding) (mkConst c)])
  if opInfo.ctors.contains converge then
    let a ← arm ``Prod.fst converge
    unless a.isAppOfArity (sharedAnnot ++ `interaction) 1 do
      problems := problems.push s!"`{grounding} .converge` is annotated `{← ppExpr a}` — convergence is presented to the person, so its annotation is an interaction"
  for c in opInfo.ctors do
    match ← arm ``Prod.snd c with
    | .lit (.strVal d) =>
      if let some p := realizationPrefixes.find? (fun p => d.startsWith p) then
        problems := problems.push s!"the description of `{c}` opens with `{p}` — the realization is carried by the interaction's kind (`Interaction.realization`), not restated in the description"
    | _ =>
      problems := problems.push s!"the description of `{c}` does not reduce to a string literal — a description is read as written, so what it opens with is decided where it is written"
    if (← arm ``Prod.fst c).isConstOf (sharedAnnot ++ `dispatch) then
      let mut wired := false
      for (n, ci) in contractDecls do
        if grounding.isPrefixOf n || op.isPrefixOf n || Meta.isInstanceCore env n || !names ci c then
          continue
        if ← authored n then
          wired := true
          break
      unless wired do
        problems := problems.push s!"`{c}` is a `dispatch` operation no contract declaration other than `grounding` names — a hand-off is wired into the transitions or the data that decide it"
  return problems

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
  if u.groundsOperations then
    r := { r with problems := r.problems ++ (← auditGrounding u contractDecls) }

  -- The Theorems module: public theorems are the guarantees, private ones helpers; it adds no
  -- axiom and no public definition, and every declaration rests only on allowed axioms and the
  -- contract's judgments.
  let judgmentList := judgments.toList
  for (n, ci) in theoremDecls do
    if let .axiomInfo _ := ci then
      r := { r with problems := r.problems.push s!"`axiom {userName n}` is declared in `{u.theorems}` — only the block declares an axiom, and there it is a documented model judgment" }
      continue
    let outside ← axiomsOutside n judgmentList
    if outside.contains ``sorryAx then
      r := { r with problems := r.problems.push s!"`{userName n}` uses `sorry`" }
    let rest := outside.filter (· != ``sorryAx)
    if !rest.isEmpty then
      r := { r with problems := r.problems.push s!"`{userName n}` depends on {showNames rest} — only {showNames allowedAxioms.toArray} and the block's own judgments are admitted" }
    for e in ← escapes n ci do
      r := { r with problems := r.problems.push s!"`{userName n}` in `{u.theorems}` {e}" }
    if !(← authored n) then continue
    let isWitness ← isNonemptyWitness n ci
    match ci with
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
    -- A witness for the whole type first; failing that, inhabited under every instantiation of
    -- its binders: evidence a binder already carries, or an instance for the codomain in their
    -- context. A binder is a variable, so it brings no declaration to audit.
    let full? ← try synthInstance? (← mkAppM ``Nonempty #[ci.type]) catch _ => pure none
    let witness? ← match full? with
      | some w => pure (some w)
      | none => forallTelescopeReducing ci.type fun xs body => do
        for x in xs do
          if ← isDefEq (← inferType x) body then return some x
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
