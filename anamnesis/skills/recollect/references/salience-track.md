# Salience track — marker detection and coinage

Read when `Track = salience` or `Track = hybrid` — whenever `scan_salience` is about to run. This is the `── SALIENCE MARKERS ──` formal block: runtime-normative contract, not commentary.

```
── SALIENCE MARKERS ──
detect : Session × DateAnchor? → MarkerProfile     -- DateAnchor? = optional ISO date for temporal normalization (e.g., session start)
categories: { coinage, actor, temporal, emotional, cognitive, singularity }   -- working hypothesis (Emergent admitted)

semantic invariants:
  traceability:    detect(s) contains only markers grounded in SSOT session content or normalized from session-anchored context
  boundedness:     ∀c ∈ categories, |detect(s).c| ≤ category_limit
  stability:       repeated detect(s) under the same extractor version should preserve recall-relevant category intent, but exact set equality is not required (idempotence not claimed — LLM-extracted categories are non-deterministic; stability subsumes intent-level repeatability)
  locality*:       detect is applied per session; cross-session comparison is ranking-layer only, except corpus-statistical coinage
  monotonicity*:   adding content may refine, normalize, merge, or reject prior candidate markers; exact set inclusion is not guaranteed
  -- Provisional invariant relaxation (exact laws → starred semantic invariants) justified by 88.5% noise rate in MarkerProfile.temporal corpus-wide audit (2026-05-04); the coinage formula below remains deterministic and is unaffected.

coinage(s, corpus, θ) = { t ∈ s : salience_precision(t, s, corpus) ≥ θ }
  where salience_precision(t, s, corpus) = |occ(t, s)| / (1 + |occ(t, corpus \ {s})|)
  -- Zipf deviation: rare in corpus, repeated within session (low-frequency high-entropy)
```
