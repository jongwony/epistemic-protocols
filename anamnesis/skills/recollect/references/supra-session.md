# Supra-Session Recall — When the Unit Is Above One Session

Anamnesis resolves a recall to one candidate by default. This reference binds when the recall's right unit is not any one session but the whole its deposits already imply: a connected line of work across sessions, a topic worked out in scattered pieces, or a concept prior work already settled. The protocol is unchanged — same store, same scan, same recognition gate, same recall-try budget. What changes is the recognized object: it is composed from several candidates instead of picked from among them.

## When to read this

- The user names a whole rather than an occasion: "that whole thread we kept coming back to", "everything we worked out about X", "the concept we ended up calling Y".
- Ranked candidates fall on one line: several deposits share anchors, keywords, or a working directory across sessions, and no single one is the answer.
- A single-session candidate was presented and the user says it is one piece of something larger — a Refine or Reorient that asks for the unit above the session.
- Not this reference: a single session would answer (the default path); the cases must be newly found (`/inquire`); the concept is not yet formed and must be crystallized (`/induce`); the recall is of decision intent to be reverse-traced (`/elicit`).

## Unit shapes

Classify the shape from the recall trace and context. A Reorient that describes a different shape re-dispatches.

- **Connected-session chain** — the origin deposit, the line of deposits it developed through, the arrival deposit. Presented as where it began, how it moved, where it landed.
- **Topic cluster** — the topic, the deposits that carry fragments of it, and where the deposits attest it last stood. Presented as fragments plus standing.
- **Sedimented concept** — the concept, the deposits that forged it, and the deposit where it settled. Recognized only, never formed here: if no deposit already carries the concept as settled, the recall is not this shape.

## Assembling the unit

- Start from the ranked candidates as entry deposits. Read each one's stored anchors (`cross_refs`), keywords, and session metadata (cwd, date, topic).
- Discover related deposits across partitions by shared anchors, keywords, and metadata, over the read-only store paths the runtime reference declares (`references/claude.md`, `references/codex.md`). Connections are inferred at read time from what the deposits already store; no cross-session graph is stored, and nothing is written.
- Compose the unit by following those connections outward from the entry deposits, never by a global join over the whole store.
- A connection whose target has no written deposit is not-yet-written knowledge: skip it, and carry it into the presentation as a scope note. It is never an error.
- Rank assembled units by alignment with the recall trace and by how densely their deposits connect. `Candidate.confidence` carries over to the unit: one densely connected unit at high confidence is `SingleObvious`; two or more units, or a thinly connected one, keep the gate.

## Confirming before surfacing

- A unit spans several deposits, each with its own authoritative record; there is no single record for the whole. Every claim the narrative will surface as fact — where it began, when a term was coined, a quoted decision — is checked against the record of the one deposit it originates from before it is asserted.
- An index-only reading stays provisional and is said to be provisional. A claim the record corrects is asserted with the record's value. A claim the record does not attest is not asserted as fact.
- This is `Recalled context currency is not fidelity` applied per deposit: the unit establishes that these deposits form this whole, not that its outcome still holds.

## Presenting the unit

- Render one narrative in the unit's shape (origin → development → arrival; topic → fragments → standing; concept → forged by → settled at), and put it first.
- Every composing deposit carries its own source locator and the resume handle its runtime reference validates — the non-resumable note when cwd is absent, the parent's handle for a fork (`references/fork-resume.md`).
- State the connections that support the assembly, the scope covered, and the gaps left by missing deposits.
- The recognition gate and its answers are the protocol's own: Recognize; Refine adjusts the unit's boundary or the scope traversed; Reorient names a different shape or recall dimension. `SingleObvious` emits inline with the divergence affordance and no turn yield, exactly as for one candidate.
- Each re-assembly spends one recall try. At the cap with a unit in hand, surface the best one and deactivate (AttemptsExhausted).

## When nothing assembles

- Entry deposits exist but no connections join them: the line has not yet sedimented enough shared anchors or keywords. Run the Refine probe as a rescope — widen the boundary, or change the unit shape — before any NullMatch; the deposits are present, so the store is not empty.
- NullMatch follows only when the rescoped assembly is also empty. Report the scope actually traversed and the gaps noted, as the NullMatch rule requires.
