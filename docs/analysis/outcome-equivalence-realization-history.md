# Outcome Equivalence — Realization-Failure History

Historical record of realization-completeness failures for `derived-principles.md §Outcome Equivalence`. The rules layer carries the abstract falsifiability statement; concrete instances live here (grounded exposition per Design Placement).

## Instance 1: Prothesis v6 `Await` / SubagentStop (refuted → resolved)

- **Claim refuted**: Prothesis v6 TOOL GROUNDING `Await` depended on SubagentStop — a Claude Code substrate guarantee. Platforms without equivalent teammate-termination semantics could not preserve the gate semantics (`present → yield turn → parse response` extended with a passive completion barrier), partially refuting Outcome Equivalence at that realization boundary.
- **What survived**: A4 (Semantic Autonomy) remained intact — the protocol definition stayed autonomous; the failure was local to the realization.
- **Resolution (frame v7, PR #518)**: the execution surface was removed entirely (`compile → handoff → STOP`); `Await` and the SubagentStop dependency no longer exist in the protocol definition. The realization-completeness assumption for Prothesis now covers only text presentation and turn-yield, which every target platform satisfies.
- **What the instance demonstrates**: the falsifiability template — a protocol operation depending on a substrate guarantee that a target platform lacks refutes Outcome Equivalence locally; removing or delegating the dependent operation restores it.
