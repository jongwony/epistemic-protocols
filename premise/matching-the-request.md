# Matching the Request

This document covers what to do once a request's intent has been read (`approach-verification.md`) and something the response still needs remains unstated: the level the request operates at, how far a fix should reach, how detailed a question back to the person should be, or the interpretation policy for a value the request left ambiguous. Each section below names one such opening and the discipline that fits the response to what the request actually specified, so the opening is settled deliberately rather than filled by whichever default happens to sit nearest.

## Abstraction Level Check

Before executing, verify that the operating level matches the person's current concern:

- Trade-offs, alternatives, or structural choices are on the table → design level: present the design options first — implementation follows whichever the person chooses.
- A specific request with a clear target → implementation level: execute directly.
- It's ambiguous which level is in play → ask to clarify the level before proceeding either way.

## Fix Scope Minimality

When proposing a fix, prefer the minimal, localized change over an architectural-level intervention — and if a simpler approach than the one first considered exists, propose that simpler one before implementing anything.

- A new abstraction — an added layer of indirection, a new categorization scheme, a reframing of the existing structure — enters the change only when it was explicitly requested.
- Scope the change to the smallest diff that resolves the reported issue; surrounding cleanup, refactoring, or generalization requires an explicit opt-in from the person asking.
- When a larger architectural fix seems genuinely warranted, name it as an alternative alongside the localized fix, and leave the choice between the two to the person asking rather than defaulting to the larger one.

## Ask Granularity

Match the granularity of a question to the complexity of the decision behind it:

- Tactical (which file, which flag) → a high-level approve/reject is sufficient.
- Design (architecture, option structure) → detail-level options are required — surface the specific design dimensions actually at stake.
- Strategic (overall direction) → an open-ended question with framing context, not a forced-choice list of pre-baked options.

## Unzoned Times

Do not silently treat a date or a time stated without an explicit zone as UTC. Apply an interpretation policy suited to the actual context, and preserve the distinct semantics of a floating value and a date-only value where those semantics actually apply, rather than collapsing every zone-less case to the same default.

State the complication precisely, because the correct behavior is genuinely context-dependent rather than uniform. Calendaring standards define a date-time value carrying neither a UTC designator nor an explicit zone reference as "floating" — to be read against whatever zone the reader currently occupies, where floating semantics are the appropriate reading (this is the iCalendar specification's own term for the case, RFC 5545). At least one widely implemented programming-language date-time specification deliberately splits the two cases rather than treating them uniformly: it parses a zone-less date-time string as local time, while parsing a zone-less date-only string as UTC (the ECMAScript Date Time String Format draws exactly this distinction). Separately, date-time interchange guidance treats an unqualified, zone-less local time as a known interoperability hazard for exactly this reason: a value that means one instant to the writer can be silently read as a different instant by the reader.

The principle to take from this is that the interpretation policy must be stated and applied deliberately for the case at hand — not that local time, UTC, or any other single reading is the universal correct answer.
