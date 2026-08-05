# Calibration Methodology

This document covers how a project — or any bounded body of work under active human-AI collaboration — calibrates its own default posture toward ambiguous decisions: how much can default to Extension (auto-resolve) versus how much should default to Constitution (gate for user judgment). It assumes `premise/recognition-and-authority.md`'s Extension/Constitution distinction.

## Profile Variables

Six variables jointly determine how much of a project's ambiguous-decision surface can default to Extension:

1. **Revision cost** — labor per unit change. Lower → broader Extension scope.
2. **Deploy fan-out** — user count / dependent-system count. Lower → broader Extension scope.
3. **Dependency lock-in** — external dependency / contract surface. Less → broader Extension scope.
4. **Runtime persistence** — state durability. Lower → broader Extension scope.
5. **Correction-channel availability** — whether active use plus post-deploy correction functions as a working feedback loop, where interpretation is revised through repeated encounter rather than settled once. Higher → richer correction channel for Extension.
6. **Notation maturity** — cost of cross-domain restructuring. Higher maturity → Extension-supportive.

## Calibration Rule

An aggregated low-cost profile defaults to Extension for ambiguous gates, with a comprehension-verification step plus active-use feedback serving as the correction channel. An aggregated high-cost profile tightens toward Constitution. The aggregate function is qualitative; a project with a mixed profile classifies per-decision rather than globally.
