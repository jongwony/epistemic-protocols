# Agent-Teams Best Practice Applicability (Substrate Execution of a frame SubstrateCorrespondence Handoff)

Since frame v8, frame is a pure object supplier / substrate-binder: it supplies the lens, declares each lens's `substrate_need` (authoritative) with `binding_hints` (advisory), then hands off and stops (frame Rule 3), and never synthesizes in its own context (frame Rule 5). **frame applies none of the agent-team execution best practices itself** — execution belongs to the substrate. This table maps which agent-teams best practices the **substrate** applies when it executes a frame `SubstrateCorrespondence` handoff on an agent-team realization, so that an evaluator does not attribute these BPs to frame (which no longer owns them) or read their absence in frame as a compliance gap.

The phase columns refer to the **substrate's** execution stages of the handoff's default directive (isolated inquiry → conditional dialogue → synthesis), not to frame's phases (frame's Phase 0–3 are confirm / gather / select / bind-substrate-and-handoff, none of which spawn or execute). When the arrangement is non-trivial, `/conduct` designs it and the same substrate executes it.

Use [`evaluation-methodology.md`](./evaluation-methodology.md) for the method that separates evaluating frame's *object-supply* quality from evaluating the substrate's *realization* of the handoff.

| Best Practice | frame (supply) | Substrate: isolated inquiry | Substrate: conditional dialogue + synthesis |
|---------------|-----------------|-----------------------------|---------------------------------------------|
| BP1: Context in spawn prompts | Compiles the Mission Brief + per-perspective directive *into the handoff* | **Active** (substrate puts the handoff's Mission Brief in each spawn prompt) | — |
| BP2: Distinct teammate roles | Supplies the lens (perspective = role) + per-lens `substrate_need`/`binding_hints` | **Active** (substrate binds each perspective to a role using the binding hints, falling back from `general-purpose`) | — |
| BP3: Wait for completion | — | **Active** (substrate awaits all perspectives) | — |
| BP4: Research-oriented tasks | — | **Active** (perspectives analyze) | — |
| BP5: Scope-limited tasks | Compiles scope_constraint into the handoff | **Active** (1 perspective = 1 scope) | — |
| BP6: Mid-flight monitoring | — | Optional (substrate's choice) | — |
| BP7: Cross-dialogue | Compiles the dialogue triggers into the directive | **Restricted** (default `isolated` — no cross-dialogue during inquiry) | **Active** when the directive's reconciliation permits it (default: conditional peer reconciliation on triggered tensions; non-default debate/refute is a `/conduct` arrangement) |
| BP8: Graceful shutdown | — | — | **Active** at the substrate's terminal |
| BP9: Shared task list | — | **Active** (substrate tracks per-perspective progress) | — |
| BP10: Cross-team communication | — | **Restricted** (isolation directive) | — |
| BP11: Hook integration | — | Environment-dependent | Environment-dependent |
| BP12: Error handling | — | **Active** | — |
| BP13: Team lifecycle | — | Substrate creates the team | Substrate retains until its terminal |

**Reading this table**: The "frame (supply)" column shows that frame's only role is supplying the lens + substrate need and compiling the relevant requirement *into the handoff* — it never spawns, awaits, coordinates, or synthesizes. "Active" / "Restricted" in the substrate columns describe what the substrate does when it executes the handoff: "Restricted" means the directive intentionally suppresses the BP for an epistemic reason (e.g. isolation suppresses cross-dialogue during inquiry), not a compliance gap; "—" means the BP does not apply at that stage; "Environment-dependent" means the BP is configurable outside both frame and the handoff. If the executing substrate cannot realize a BP the directive requires, the substrate — or `/conduct` at arrangement time — declares the degradation rather than silently dropping it (see [`isolation-rationale.md`](./isolation-rationale.md)).
