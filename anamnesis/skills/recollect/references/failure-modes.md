# Failure modes — cause, detection, recovery

Read when a find returns zero candidates, when a presented candidate is corrected despite a scan match, or when `INDEX_semantic` is empty. This is the operative body of the `── KNOWN FAILURE MODES ──` formal block: runtime-normative contract, not commentary. The mode names stay in `SKILL.md` so a mode is recognizable without a read; cause, detection, and recovery live here.

```
── KNOWN FAILURE MODES ──
FalseAnchor       : extract(s) contains t with high precision but t ≠ recall_target
                    -- cause: precision threshold locally calibrated but semantically wrong, or source_namespace does not authorize this recall claim's kind
                    -- detection: the user corrects the cue despite a scan_entropy match

ExtractorLacking  : recall_target ∈ s ∧ ∄ extractor_i : recall_target ∈ extractor_i(s)
                    -- cause: domain-specific extractor absent from registry
                    -- detection: NullMatch on scan_entropy ∧ user can cite literal

PartialExtract    : extract/detect produces well-formed but semantically partial INDEX from corrupted/truncated source
                    -- cause: continue-on-error parser tolerates malformed lines; anomalous shape logged but not write-gated
                    -- detection: invisible to reader without schema version field or observability log surface

SidechainNoSSOT   : scan_entropy(Store, trace) ≠ ∅ via INDEX_substitute ∧ no top-level SSOT for the recalled id (the id is a sidechain/derived record)
                    -- cause: the recalled id is a sidechain/derived record whose turns live in the originating record + the substitute channel; no top-level SSOT for the id ever existed — distinct from NullMatch₁ (pre-store/lifecycle gap): here the scan SUCCEEDS on the substitute channel, only the top-level SSOT is absent by design
                    -- detection: the recalled id matches a substitute-channel record with no sibling top-level SSOT of its own (substrate mechanism in TOOL GROUNDING)
                    -- recovery: the id is not independently resumable (no top-level record of its own); read the orchestrating parent from the substitute record (backtrace_parent → parent_pointer, parent_cwd) and offer the parent as the resumable candidate; when the parent's record has aged out, mark non-resumable and surface the recoverable artifacts (substitute record + memory)

NullMatch₁        : scan_entropy(Store, trace) = ∅ ∧ InputType = StructuredIdentifier
                    -- cause: literal absent from the searched scope. A miss confined to the index-and-spine depth points at pre-store, lifecycle gap, queued/failed writer, or extractor omission — but note the spine tier survives all four, since it reads the record itself, so a spine miss narrows the cause to the literal never appearing in a record head
                    -- recovery: the open question, then StoreExpansion; after accepted full-text exhaustion, offer Aitesis handoff with accumulated trace

NullMatch₂        : scan_salience(Store, trace) = ∅ ∧ InputType = NaturalRecall
                    -- cause: profile too vague or target session lacks distinctive markers
                    -- recovery: the open question → recue → Phase 1 re-find

MutualNull        : scan_entropy = ∅ ∧ scan_salience = ∅ on Track = hybrid
                    -- structural risk: recall target absent from the searched scope
                    -- action: NullMatch pathway with source-labeled scope disclosure (principal failure mode)
```

## Degraded scan

Read when `INDEX_semantic = ∅`. The `degraded_scan` equation and the partial-INDEX guard stay in `── STORE TOPOLOGY ──`, because the guard binds on every scan; what follows binds once the StoreExpansion checkpoint is reached.

```
degraded_scan rationale:
  -- an empty INDEX_semantic no longer empties the realization: SSOT_spine is already in the initial
     scope, so recency, cwd, origin, and the first human turn still reach ranking. What is lost is the
     extracted semantics, not the realization
  -- SSOT_body broadens coverage further but stays outside initial scope. After the open question,
     Qx lets the user admit the unbounded body scan or stop with a NullMatch scoped to the indexes
     and spines already searched. Ground opens one named record per member at any scope; that
     bounded read is not what the checkpoint governs.
     INDEX_substitute is a separate primary channel (not derived from INDEX_semantic), so the
     sidechain/derived-id match persists before full-text expansion — SidechainNoSSOT stays reachable
     when INDEX_semantic is empty
  -- INDEX_substitute loss non-recoverable (SSOT lacks subagent-channel messages); precondition for
     the Cold-Start invariant
```
