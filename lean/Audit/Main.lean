import Audit.Check

/-! The lint driver (`lake lint`): imports every audited unit's modules and prints one
    `AUDIT {json}` line with a report per unit. Arguments name the protocol namespaces; with none,
    every generated `lean/.contract/Contract/<NS>.lean` is one. GROUND and the TOOL GROUNDING
    vocabulary are always audited. The exit code is 1 when any report carries a problem.
    `lake lint` does not build; build first. -/

open Lean Audit

def generatedNamespaces : IO (Array Name) := do
  let dir : System.FilePath := "lean" / ".contract" / "Contract"
  unless ← dir.pathExists do return #[]
  let mut out := #[]
  for entry in ← dir.readDir do
    if entry.fileName.endsWith ".lean" then
      out := out.push (Name.mkSimple (entry.fileName.dropEnd ".lean".length).toString)
  return out.qsort (·.toString < ·.toString)

unsafe def main (args : List String) : IO UInt32 := do
  let namespaces ← if args.isEmpty then generatedNamespaces else pure (args.toArray.map String.toName)
  let targets := #[Target.ground, Target.toolGrounding] ++ namespaces.map Target.protocol
  initSearchPath (← findSysroot)
  enableInitializersExecution
  let mut imports : Array Import := #[]
  for t in targets do
    for m in [t.contract, t.theorems] do
      let file := System.FilePath.mk "lean" / System.mkFilePath (m.components.map toString) |>.addExtension "lean"
      let generated := System.FilePath.mk "lean" / ".contract" / System.mkFilePath (m.components.map toString) |>.addExtension "lean"
      if (← file.pathExists) || (← generated.pathExists) then imports := imports.push { module := m }
  let env ← importModules imports {} (trustLevel := 1024) (loadExts := true)
  let ctx : Core.Context := { fileName := "<audit>", fileMap := default, maxHeartbeats := 0 }
  let reports ← (targets.mapM fun t => auditTarget t).run' {} {} |>.toIO' ctx { env }
  IO.println s!"AUDIT {(toJson reports).compress}"
  return if reports.any (fun r => !r.problems.isEmpty) then 1 else 0
