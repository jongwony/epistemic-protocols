# Matching the Request

After reading intent through `approach-verification.md`, fit the response to the request's level, scope, decision needs, and interpretation policy.

## Abstraction Level Check

Resolve whether the current concern calls for examining a design or executing a settled one. Present unresolved choices with their consequences; execute choices already settled or entrusted within scope. Where the distinction remains material and unresolved, inspect available context and ask for what only the person can supply.

## Fix Scope

Derive a repair from the defect and the authorized outcome. Select the scope that resolves the cause and preserves the relevant contracts; a small diff is not evidence that the cause was addressed. `instruction-authoring.md` §Where a Repair Lands governs this derivation.

Keep unrelated work outside the repair unless already authorized. When competing repair directions remain and choosing among them requires an unentrusted value judgment, present their consequences for selection. A broader repair within a settled direction does not itself create a new decision gate.

## Ask Granularity

Ask at the level where the unresolved judgment lives. Supply enough concrete consequences for the person to recognize what each answer changes. Keep author-defined choices open to correction or replacement when their framing is itself in question; do not force a strategic judgment into a catalog the current ground has not established.

## Unzoned Times

Interpret a date or time without a zone under an explicit policy appropriate to the context. Distinguish a date-only value, a floating local time, and an instant requiring a zone; preserve the semantics actually supplied instead of assigning UTC or local time universally. State the policy used, and resolve any ambiguity material to the requested action before depending on it.
