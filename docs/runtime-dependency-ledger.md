# Runtime Dependency Ledger

This ledger separates four claim-strength buckets that often get conflated in protocol prose.

| Bucket | Meaning |
|--------|---------|
| `Normative contract` | What the runtime user may rely on from packaged `Skill.md` |
| `Runtime description metadata` | Plugin `description` field used for discovery/routing under tight length budget |
| `Claude Code realization` | How the current platform typically realizes the contract (slash invocation, Agent/Task, hooks, packaging) |
| `Heuristic/advisory only` | Model judgment or soft safeguards with no hard runtime guarantee |

## Protocol Ledger

| Plugin | Normative contract | Runtime description metadata | Claude Code realization | Heuristic/advisory only |
|--------|--------------------|------------------------------|-------------------------|-------------------------|
| `prothesis` | `Skill.md` defines `/frame`, phase flow, synthesis gate, perspective typing | Short routing cue for framework/perspective selection | Main agent owns Phases 0-2; team routing appears only where `Skill.md` allows it | Perspective quality, synthesis depth, coverage of alternative lenses |
| `syneidesis` | `Skill.md` defines `/gap`, gap classes, gate outcomes | Short routing cue for unnoticed gaps before decisions | Main agent only; no Task delegation for user-facing gates | Which gaps are most decision-relevant, alternative salience |
| `hermeneia` | `Skill.md` defines `/clarify`, intent-expression repair, confirmation gate | Short routing cue for intent/articulation mismatch | Hybrid initiation path with main-agent confirmation | Whether mismatch exists, refinement quality |
| `katalepsis` | `Skill.md` defines `/grasp`, understanding verification, user confirmation | Short routing cue for comprehension verification | User-initiated verification in main agent | Depth of actual user understanding beyond the surfaced check |
| `telos` | `Skill.md` defines `/goal`, GoalContract construction, decision gate | Short routing cue for vague or unstable goals | Main agent only; user-facing goal gate stays inline | Goal decomposition quality, latent constraint discovery |
| `horismos` | `Skill.md` defines `/bound`, boundary classes, ownership map | Short routing cue for ownership/boundary questions | Main agent only; downstream advisory via graph | Boundary quality, ambiguity resolution quality |
| `aitesis` | `Skill.md` defines `/inquire`, uncertainty surfacing, question-set gate | Short routing cue for missing context | Main agent only; question sequencing inline | Which unknowns matter most, stopping point for inquiry |
| `analogia` | `Skill.md` defines `/ground`, abstract↔concrete mapping, validation gate | Short routing cue for mapping uncertainty | Main agent only; examples/mappings surfaced inline | Mapping elegance, example quality, transfer validity |
| `periagoge` | `Skill.md` defines `/induce`, candidate + personalized grounding, dialectical triangulation gate | Short routing cue for in-process abstraction (colimit-shaped instance set) | Main agent only; candidate proposal + user widen/narrow/fuse/reorient inline | Candidate hypothesis quality, grounding-example personalization, dialectical crystallization fidelity |
| `prosoche` | `Skill.md` defines `/attend`, risk tiers, execution routing, gate path | Short routing cue for execution-time risk checking | Main agent owns gate paths; Phase 0 low-risk execution may delegate | Risk scoring quality, latent hazard detection, materialization quality |
| `epharmoge` | `Skill.md` defines `/contextualize`, applicability check, adaptation gate | Short routing cue for context mismatch after execution | Main agent only; post-execution applicability review | Whether context mismatch exists, adaptation quality |
| `anamnesis` | `Skill.md` defines `/recollect`, recall scan, recognition gate | Short routing cue for vague recall/context retrieval | Main agent protocol flow; hook scripts exist outside protocol flow | Recall cue quality, recognition salience, retrieval completeness |
| `epistemic-cooperative` utilities | Each packaged `Skill.md` defines its own slash path and workflow | Short routing cue per utility (`/catalog`, `/onboard`, `/dashboard`, `/report`, `/compose`, `/write`, etc.) | Utility realization varies by skill; some use packaged references and subagents | Recommendation quality, analytics interpretation, composition quality |
| `verify` | `Skill.md` defines `/verify` workflow and severity framing | Short routing cue for pre-commit protocol validation | Static checks are deterministic Node scripts; expert review remains optional/operator-invoked | LLM review quality, severity interpretation, human acceptance threshold |

## Runtime Boundary Notes

- `Skill.md` is the only normative runtime contract surface for protocol semantics.
- Plugin description metadata is intentionally weaker. It exists to help discovery and routing under marketplace length/token constraints.
- Contributor docs such as `CLAUDE.md`, `docs/mission-bridge.md`, `.claude/rules/*`, and analysis docs are governance surfaces, not runtime dependencies.
- `artifact-self-containment` enforces this boundary against the packaged runtime-contract view.
