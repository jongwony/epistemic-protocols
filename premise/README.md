# Premise

The cognitive and collaboration premises behind structured human-AI dialogue — stated so they hold on their own, independent of any specific codebase, tool, or harness that happens to implement them.

This is a reference surface, not a package. There is no install script and nothing to run here — it is meant to be reached by URL, read, and used in one of two ways:

- **Link to it** from your own global configuration or notes, the way you would cite any external reference.
- **Copy the parts you want** into your own instructions, verbatim or adapted.

Adoption is scoped either way. A document you adopt governs the general principles within the scope you adopted it for; a document you have not adopted governs nothing. Within that scope, your own instructions supply what the document deliberately leaves open — the concrete surface a principle binds to, the value your project has settled on — rather than restating the general principle in their own words. When a host instruction and an adopted document disagree on a general principle, the document is the one to reason from.

Each document below stands on its own: it does not assume you know any particular project, tool, or vocabulary beyond what it defines itself. Where a document depends on a concept from an earlier one, it says so and names the file.

## Documents

| Document | Covers |
|---|---|
| [`recognition-and-authority.md`](recognition-and-authority.md) | What an AI system may resolve on its own versus what requires the user's judgment, and why options should be presented for recognition rather than left to recall. |
| [`interaction-factorization.md`](interaction-factorization.md) | How a user-facing interaction factors into an abstract design and its concrete realization, and the test for telling a genuine choice from a single dominant answer dressed up as options. |
| [`gate-design.md`](gate-design.md) | The operational discipline for designing and defending a gate: keeping a mode active until convergence, guarding against an AI shortcutting its own process, taxonomy completeness, differential futures between options, and evidence that a process actually converged. |
| [`tiering-and-scope.md`](tiering-and-scope.md) | How to classify a principle by its trajectory as models improve (axiom / derived / architectural / safeguard), and where certain structural, cost, and layering decisions belong. |
| [`calibration-methodology.md`](calibration-methodology.md) | How a project calibrates its own default posture — how much to auto-resolve versus how much to gate for user judgment — from a small set of measurable variables. |
| [`approach-verification.md`](approach-verification.md) | Reading a request's actual intent before acting: matching the level of the ask, proposing the minimal fix, and checking a request's premise against reality before extending it. |
| [`verification-discipline.md`](verification-discipline.md) | What makes a check's verdict trustworthy, and how to verify a delegated agent's reported side effects rather than trusting its narration. |
| [`instruction-authoring.md`](instruction-authoring.md) | Writing instructions and durable records that age well: stating principles instead of examples, not over-mentioning what to avoid, keeping evidence support-linked rather than merely current, audience reach, and ledger/state separation. |
| `delegation-and-subagents.md` | When and how to hand work to another agent or worker: what context it needs restated, and how to state a self-contained brief. |
| `session-and-handoff.md` | What belongs in a durable record across a session boundary versus what stays in working memory, and a termination taxonomy for exiting stateful work cleanly. |
| `externalization-publish-mode.md` | How to judge, per reference point, whether to link to or inline content when publishing an artifact for a human reader. |
| `boundaries-and-safety.md` | General safety classifications: irreversible versus reversible actions, secrets handling, a destructive-restore gate, and large-file handling discipline. |

The first eight exist today; the rest are planned additions to the same collection — a document not yet present is a gap to fill later, not a broken promise.

## Suggested reading order

1. `recognition-and-authority.md` — start here; almost everything else assumes this distinction.
2. `interaction-factorization.md`
3. `gate-design.md`
4. `tiering-and-scope.md`
5. `calibration-methodology.md`
6. `approach-verification.md`
7. `verification-discipline.md`
8. `instruction-authoring.md`
9. `delegation-and-subagents.md`
10. `session-and-handoff.md`
11. `externalization-publish-mode.md`
12. `boundaries-and-safety.md`

Reading in order is not required — each document names its own prerequisites inline.
