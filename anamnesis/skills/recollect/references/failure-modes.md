# Failure modes — cause, detection, recovery

Read when a pass finds nothing to present, when a presented candidate is corrected despite a match, when an index is empty or its capture failed, or when a capture outcome qualifies the searched scope. This is the operative body of SKILL.md's Known failure modes: runtime-normative contract, not commentary. The mode names stay in SKILL.md so a mode is recognizable without a read; cause, detection, and recovery live here.

```
── KNOWN FAILURE MODES ──
FalseAnchor        : an identifier matched, and its record is not the one meant — or the identifier names a different kind of thing than the cue claims
                     -- cause: a match on the literal alone. An identifier anchors a candidate only where the kind of thing it names fits what the cue claims — an issue number anchors an issue or the changes that cite it, not an arbitrary commit; a path anchors the artifact at that path. A bare number carries no repository until one is read from the record around it, and a number that labels a list item, a rule, a finding, or an image placeholder names nothing at all
                     -- detection: the person corrects the cue despite the match, or the record around the identifier shows it names something else
                     -- recovery: drop the anchor, keep the record only if other axes still reach it, and search the corrected cue as given

IndexLacking       : the record carries the past meant, and its index entry does not
                     -- cause: the index is a lossy extraction; an extractor did not capture what the cue names
                     -- detection: the person can name a literal the index does not hold; the records reached by other axes carry it
                     -- recovery: search the records themselves along the cue's axes; an index miss is never a record miss

PartialExtract     : an index entry built from a source its capture did not read whole
                     -- cause: a malformed line skipped, a bounded extraction that dropped part of a long session, an extraction that failed while others succeeded
                     -- detection: the member's capture outcome — an extractor state other than succeeded, or a recorded count of characters not received
                     -- recovery: disclose it on the member (Reach); ground on the record, never on the partial index

SidechainNoSSOT    : the id found belongs to a fork with no record of its own
                     -- cause: forked work's turns live in the orchestrating record and the substitute channel; no top-level record for the id ever existed
                     -- detection: the id matches a substitute-channel capture with no sibling top-level record
                     -- recovery: the id is not resumable; read the orchestrating parent from the capture and offer the parent (fork-resume.md); where the parent's record has aged out, mark it non-resumable and surface the capture and any memory

Ungroundable       : candidates found, and no member's record opens
                     -- cause: the records the candidates point at are gone, rotated out, moved to another root, or were never written; the index or a head outlived the record
                     -- detection: `opened` returns none for every member of the leading recognizable, so its story is empty
                     -- recovery: never present it — the story is composed from opened records, and with none there is nothing to assert; the next recognizable found is grounded instead. Whatever the round presents names the records that did not open, because "found nothing" and "found it and could not open it" are different answers, and only the second tells the person a record was lost. Consider whether another root holds them

IndexAsEvidence    : a presented sentence rests on what only an index's gist carried
                     -- structural guard: every sentence of a story is a Claim citing an opened record, so the mode arises only where grounding was skipped or a record was read past
                     -- recovery: ground again; never hedge the gist

ChronologyFromHits : a line or a history composed from the changes a search happened to match, as if they were every change
                     -- cause: a content search returns only the changes that touched the searched text; a change that shaped the same thing without touching that text is not among them
                     -- detection: gaps in the story's order, a development the matched changes cannot explain, a later record that names an earlier step not found
                     -- recovery: before telling an order, read the history of the span itself — every change to it, not only the matched ones — or say that the order covers only the matched changes

AttributionLoss    : a past statement read as the person's decision because a tool returned it, its speaker dropped
                     -- cause: a record opened is evidence of what was recorded; the speaker inside it is part of the evidence
                     -- detection: a story sentence says "decided" or "agreed" where the opened span shows only the assistant saying it
                     -- recovery: tell who said it; a decision is the person's only where the person's own turn in the record carries it
```

## When nothing can be presented

A pass that leaves nothing to present runs in the turn the searches ran in; nothing needs carrying to a later turn.

```
before the person has added to the cue
  -- report what was searched, per root, and which records did not open, then the one open question
after the person has added to the cue
  -- a search past the boundary still worth offering: the wider search with what it would read and its cost, against stopping here
  -- nothing further worth reaching for: close unresolved with the scope searched per root and the causes the evidence supports
an index that is empty or whose capture failed
  -- the records themselves remain searchable along the cue's axes; the capture outcome says whether the index was validated empty, failed, unfinished, or never written, and that is what the round reports about it
  -- an empty index says nothing about whether the past took place
the substitute channel
  -- a separate capture, not derived from the index: a fork's id stays findable there when the index is empty; its loss is not recoverable from the conversation records
```
