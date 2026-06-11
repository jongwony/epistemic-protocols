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
| `prothesis` | `Skill.md` defines `/frame`, phase flow (0-3), lens selection, inquiry-spec compile + handoff | Short routing cue for framework/perspective selection | Main agent owns Phases 0-3 and stops at handoff; execution belongs to the substrate (no team routing inside frame) | Perspective quality, lens recommendation fit, inquiry-spec compile quality, coverage of alternative lenses |
| `syneidesis` | `Skill.md` defines `/gap`, gap classes, gate outcomes | Short routing cue for unnoticed gaps before decisions | Main agent only; no Task delegation for user-facing gates | Which gaps are most decision-relevant, alternative salience |
| `katalepsis` | `Skill.md` defines `/grasp`, intent-scented entry points, understanding verification, user confirmation | Short routing cue for comprehension verification | User-initiated verification in main agent | Depth of actual user understanding beyond the surfaced check |
| `horismos` | `Skill.md` defines `/bound`, boundary classes, ownership map | Short routing cue for ownership/boundary questions | Main agent only; downstream advisory via graph | Boundary quality, ambiguity resolution quality |
| `aitesis` | `Skill.md` defines `/inquire`, uncertainty surfacing, question-set gate | Short routing cue for missing context | Main agent only; question sequencing inline | Which unknowns matter most, stopping point for inquiry |
| `analogia` | `Skill.md` defines `/ground`, abstract↔concrete mapping, validation gate | Short routing cue for mapping uncertainty | Main agent only; examples/mappings surfaced inline | Mapping elegance, example quality, transfer validity |
| `periagoge` | `Skill.md` defines `/induce`, candidate + personalized grounding, dialectical triangulation gate | Short routing cue for in-process abstraction (colimit-shaped instance set) | Main agent only; candidate proposal + user widen/narrow/fuse/reorient inline | Candidate hypothesis quality, grounding-example personalization, dialectical crystallization fidelity |
| `prosoche` | `Skill.md` defines `/attend`, boundary signal taxonomy, velocity partition, condition compilation gate, TaskCreate emission | Short routing cue for pre-execution guardrail compilation | Main agent only; compiled conditions emitted as coarse TaskCreate entries; `/goal` leaf-executor claim bounded to v2.1.140 | Boundary inference quality, velocity partition accuracy, predicate verifiability |
| `epharmoge` | `Skill.md` defines `/contextualize`, applicability check, adaptation gate | Short routing cue for context mismatch after execution | Main agent only; post-execution applicability review | Whether context mismatch exists, adaptation quality |
| `anamnesis` | `Skill.md` defines `/recollect`, recall scan, recognition gate | Short routing cue for vague recall/context retrieval | Main agent protocol flow; hook scripts exist outside protocol flow | Recall cue quality, recognition salience, retrieval completeness |
| `epistemic-cooperative` utilities | Each packaged `Skill.md` defines its own slash path and workflow | Short routing cue per utility (`/catalog`, `/onboard`, `/dashboard`, `/report`, `/write`, etc.) | Utility realization varies by skill; some use packaged references and subagents | Recommendation quality, analytics interpretation, composition quality |
| `verify` | `Skill.md` defines `/verify` workflow and severity framing | Short routing cue for pre-commit protocol validation | Static checks are deterministic Node scripts; expert review remains optional/operator-invoked | LLM review quality, severity interpretation, human acceptance threshold |

## Runtime Boundary Notes

- `Skill.md` is the only normative runtime contract surface for protocol semantics.
- Plugin description metadata is intentionally weaker. It exists to help discovery and routing under marketplace length/token constraints.
- Contributor docs such as `CLAUDE.md`, `docs/mission-bridge.md`, `.claude/rules/*`, and analysis docs are governance surfaces, not runtime dependencies.
- `artifact-self-containment` enforces this boundary against the packaged runtime-contract view.
