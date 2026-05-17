# Prothesis Evaluation Methodology

This reference defines how to evaluate Prothesis when its specialized epistemic behavior differs from generic agent-team best-practice compliance. Use it together with [`agent-teams-bp-applicability.md`](./agent-teams-bp-applicability.md), which marks which best practices are active, restricted, environment-dependent, or not applicable by phase.

## Evaluation Unit

Evaluate a Prothesis run as a phase-scoped protocol trace, not as a generic agent-team session snapshot.

Minimum trace record:

- input deficit: whether the user actually presented `FrameworkAbsent`
- selected mode: Recommend or Inquire
- phase path: Phase 0 through terminal phase reached
- perspective set: options presented, selected perspectives, and rationale
- team behavior when Inquire mode is used
- synthesis output: Lens, convergence/divergence, routing, and residual uncertainties
- verification signals: user recognition, follow-up correction, review findings, or downstream protocol fit

## Multi-Session Method

Do not judge the whole protocol from one execution path. Sample across at least these shapes before making a protocol-level claim:

- Recommend mode with a lightweight framing request
- Inquire mode with distinct selected perspectives
- high-ambiguity request where perspective selection is the main value
- high-complexity request where synthesis quality is the main value
- a case where a best practice is intentionally restricted by the applicability table

Session-level findings may justify a local patch, but claims about Prothesis as a protocol require cross-session recurrence or a structural proof tied to the formal block.

## Specialized-Use Criteria

Generic agent-team best practices are evidence only after phase applicability is established.

| Criterion | Evaluation question |
|---|---|
| Phase applicability | Is the best practice active, restricted, environment-dependent, or not applicable for this phase? |
| Epistemic purpose | Does the observed behavior help resolve `FrameworkAbsent` into `FramedInquiry`? |
| Isolation warrant | If communication is restricted, does the restriction preserve independent perspective formation? |
| Synthesis warrant | Does cross-dialogue or synthesis integrate findings without flattening perspective differences? |
| Recognition burden | Did the user need only to recognize suitable perspectives, or were they forced to invent the framework? |
| Routing fit | Did the output point to the next appropriate protocol or execution path when framing alone was not enough? |

## Hidden Assumptions To Check

### Completeness = Quality

Completeness is not sufficient evidence of quality. A Prothesis output is good when it exposes the load-bearing perspectives needed for the user's inquiry and preserves meaningful divergence. Exhaustive perspective lists can lower quality if they dilute the user's recognition task.

### Session Representativeness

A single trace is not representative by default. Mode, stakes, ambiguity, and selected perspectives change the relevant evaluation criteria. Treat one-session critiques as instance findings unless the same failure recurs or the formal block makes the defect inevitable.

### Cost = Tokens

Token usage is only one cost surface. Also evaluate recognition burden, review burden, unnecessary team coordination, false-positive perspective inflation, and downstream rework prevented by better framing.

### No Communication = Isolation Failure

No communication is not automatically a failure. In Phase 3, isolation can be intentional because independent perspectives reduce premature convergence. Use the applicability table before applying cross-team communication expectations.

### Static Snapshot Evaluation

Static snapshots miss whether Prothesis correctly routes, corrects, or preserves residual uncertainty over the loop. Evaluate the phase trace plus follow-up signals: user recognition, reviewer challenges, downstream protocol fit, and whether a later session had to re-derive the same framing.

## Verdict Structure

Use this shape for review notes:

```text
Scope: [phase/mode/session set]
Applicability basis: [active/restricted/environment-dependent/not applicable, with table row]
Finding: [observed behavior]
Protocol relevance: [effect on FrameworkAbsent -> FramedInquiry]
Evidence: [trace citation or repeated-session pattern]
Disposition: [local issue / protocol patch / no action / needs more sessions]
```

Avoid verdicts that say only "violates agent-team best practice." The missing step is whether that practice applies to the Prothesis phase under evaluation.
