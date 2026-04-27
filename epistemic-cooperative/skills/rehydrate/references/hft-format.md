# HFT (Horizon-Fusion Text) Format Specification

Shared substrate format for `/crystallize` (writer) and `/rehydrate` (reader).

## Definition

A **Horizon-Fusion Text (HFT)** is a single Markdown file that carries a session's hermeneutic residue — the residue a fresh session must absorb to enter the same horizon as the originating session. The format reframes session handoff from *operational data preservation* to *interpretive continuity inscription*: a fresh session reads the file once and is primed to first-utter from the same Vorverständnis (pre-understanding) as the originating session.

The format collapses prior multi-substrate handoff patterns (plan + memory addendum + index + tasks) into a single Markdown file with four declared layers. Auxiliary substrates (auto-memory `MEMORY.md`, hypomnesis sub-index) remain operationally distinct and are reachable only as anchors, never absorbed into HFT body.

## Layer Anatomy

An HFT file has exactly four layers, identified by H2 headings and ordered as below. The order is normative — readers parse top-down and the order encodes priority (Surface Text first because it is the primer; Excluded last because it is a topology declaration that frames what was deliberately not absorbed).

### Layer 1: Surface Text

**Purpose**: 1-pass-readable primer. A fresh session must enter the same horizon by reading this layer once, without consulting external substrates.

**Required subsections** (H3 headings, in order):

1. `### Design Concept` — the invisible theory of the work; strategic intent compressed into one paragraph
2. `### Ubiquitous Language` — domain vocabulary settled in this session; bullet list of `term — meaning` pairs
3. `### Sache` — the subject matter of the dialogue; one sentence answering "what is this conversation about?"

**Length constraint**: combined Surface Text body should fit in one page (≤ ~1500 words / ~120 lines) so 1-pass readability is structural, not aspirational.

**Refresh policy**: on every new stage, Surface Text is replaced (not appended). Surface Text is the *current* horizon; prior horizons live in Wirkungsgeschichte.

### Layer 2: Wirkungsgeschichte (Effective History)

**Purpose**: the trajectory of how the current horizon came to be. Without this layer, HFT degrades into a static data store and loses Gadamer's effective-historical consciousness — the next session would not know which alternatives were closed off, which traditions fused, or which prior horizons preceded the present one.

**Required subsections** (H3 headings, in order):

1. `### Formation Trajectory` — ordered list of stage transitions or decision moments leading to the current horizon. Each entry: timestamp or stage-id + one-line summary
2. `### Rejected Alternatives` — alternatives considered and dismissed, with the reason for dismissal. Each entry: alternative description + dismissal rationale
3. `### External Priors` — outside traditions (cited works, prior memos, frameworks) that fused into the current horizon. Each entry: source citation + how it shaped the horizon

**Append-only policy**: on every new stage, Wirkungsgeschichte appends new entries; prior entries are never removed or rewritten. Accumulation is structural — a stage-N HFT contains the full Wirkungsgeschichte of stages 1 through N.

**Length growth**: Wirkungsgeschichte grows linearly with stage count. Reader is expected to scan top-to-bottom or jump to most recent entries; structural compactness is enforced per-entry (one-line summaries, not paragraphs).

### Layer 3: Reference Shells

**Purpose**: anchors to auxiliary substrates that remain operationally distinct from HFT. Reference Shells contain pointers only — never copied data. A fresh session uses these anchors when Surface Text + Wirkungsgeschichte alone are insufficient and the next session decides to consult external substrates explicitly.

**Required subsections** (H3 headings, in order):

1. `### Session Anchors` — `previous_session_id`, `branch`, optional `pr_number`. One key per line.
2. `### File Anchors` — file paths the work touched or depends on. One path per line.
3. `### External References` — URLs to external materials (videos, articles, prior memos). One URL per line.

**No-data invariant**: Reference Shells must contain only identifiers and paths, never copied content. Inlining the referenced data into HFT body violates the topology-separation invariant (auto-memory and hypomnesis are operationally distinct substrates and must stay distinct).

### Layer 4: Excluded (Topology Declaration)

**Purpose**: explicit declaration of substrates that are *intentionally* not absorbed into HFT body, with the rationale. This layer makes the topological choice visible to the reader so the next session does not mistake absence for oversight.

**Required content**: a bullet list of excluded substrates, each with a one-line rationale. Default entries (always present unless the rationale changes):

- `auto-memory MEMORY.md body` — separate topology; reachable via its own auto-load mechanism
- `hypomnesis sub-index body` — separate topology; reachable via `/recollect` or `/inquire`
- `tactical execution traces` — regenerable by fresh session from Surface Text + Wirkungsgeschichte

Project-specific exclusions extend this list.

## Frontmatter

The HFT file opens with a YAML frontmatter block carrying machine-readable metadata:

```yaml
---
hft_format_version: 1
stage: <kebab-case stage identifier>
generated_at: <YYYY-MM-DD>
git_head: <full SHA at write time>
inherits_from: <path to predecessor HFT, or null for first stage>
stage_classification: stage-1-conjecture
n1_dogfooding_caveat: true
---
```

`stage_classification` defaults to `stage-1-conjecture` until Stage 2 use-corroboration accumulates per the project's Deficit Empiricism framework. `n1_dogfooding_caveat: true` causes both `/crystallize` and `/rehydrate` to surface a Stage 1 caveat in their convergence reports.

## Multi-Stage Asymmetry

The two layers behave asymmetrically across stage transitions:

| Layer | Stage transition behavior | Rationale |
|-------|---------------------------|-----------|
| Surface Text | Replaced (current horizon refreshes) | Sache must remain *live*; stale primer would mis-prime the next session |
| Wirkungsgeschichte | Appended (history accumulates) | Wirkungsgeschichte loses meaning if rewritten — accumulation IS its function |
| Reference Shells | Updated in place (new anchors added, stale anchors marked) | Anchors point to live or archived substrates; stale anchors retained with archive marker |
| Excluded | Updated only when topology changes | Topology choice is stable across stages by default |

Multi-stage HFT inherits its Wirkungsgeschichte from the predecessor file (declared by `inherits_from` frontmatter), copies it verbatim, then appends new stage entries.

## Inscription Order (`/crystallize` writes)

A writer protocol inscribes layers in the following order, because each layer depends on the prior layer being decided:

1. Determine `stage` and load predecessor (if any) — establishes inheritance baseline
2. Inscribe `### Design Concept` and `### Ubiquitous Language` — fresh per stage
3. Inscribe `### Sache` — the live subject for the new stage
4. Append new entries to `### Formation Trajectory`, `### Rejected Alternatives`, `### External Priors` — preserves prior content
5. Update `### Session Anchors`, `### File Anchors`, `### External References`
6. Refresh `### Excluded` only if topology choice changed
7. Write frontmatter with current `git_head` and `generated_at`

## Activation Order (`/rehydrate` reads)

A reader protocol parses layers in the order they appear, but uses them with different intents:

1. Read frontmatter — verify `hft_format_version`, surface `stage_classification` and `n1_dogfooding_caveat` to user
2. 1-pass read Surface Text — form Vorverständnis; this primes the session
3. Scan Wirkungsgeschichte top-to-bottom — answer "how did we get here?"; informs but does not redirect the session
4. Note Reference Shells — do not auto-fetch; surface as available anchors for the user to invoke explicitly
5. Acknowledge Excluded — confirm topology boundary; do not attempt to absorb excluded substrates

## Validation Rules

The following constraints are statically checkable and SHOULD be enforced by `/verify` if the project's verify pipeline is configured to scan HFT files:

| Check | Rule | Severity |
|-------|------|----------|
| `hft-frontmatter-present` | YAML frontmatter with required keys exists | error |
| `hft-layer-order` | Layers appear in order: Surface Text → Wirkungsgeschichte → Reference Shells → Excluded | error |
| `hft-layer-completeness` | All four layers present with required H3 subsections | error |
| `hft-surface-length` | Surface Text body ≤ 1500 words | warning |
| `hft-reference-shell-no-data` | Reference Shell entries are paths or URLs only, no inlined content | warning |
| `hft-wirkungsgeschichte-append-only` | When `inherits_from` is set, predecessor's Formation Trajectory entries appear verbatim in current file | error |
| `hft-frontmatter-stage` | `stage` matches kebab-case `^[a-z0-9]+(-[a-z0-9]+)*$` | error |
| `hft-frontmatter-version` | `hft_format_version` matches a known version (currently 1) | error |

These rules apply to HFT files; project SKILL.md and other Markdown files are out of scope for HFT-specific validation.

## Anti-Patterns

- Embedding excluded-substrate body (e.g., copying `MEMORY.md` lines into Surface Text or Wirkungsgeschichte) — collapses topology separation
- Rewriting Wirkungsgeschichte across stages — destroys effective-historical consciousness
- Surface Text growing without bound — defeats 1-pass primer function; move detail to Wirkungsgeschichte
- Reference Shells with inlined data instead of pointers — creates substrate-coupling
- Skipping `### Rejected Alternatives` because "nothing was rejected" — explicit empty section with `_(none in this stage)_` is required; silent omission loses the negative-information signal
- Treating HFT as a free-form scratchpad — the four layers are the contract; freeform additions go in a separate file referenced via Reference Shells

## Stage 1 Conjecture (N=1 Dogfooding)

This format spec is a Stage 1 (Compile) conjecture. Structural fit was established via a single dogfooding session crystallizing the format from concrete instance set (substrate-coupling temptations, Pocock's Design Concept / Ubiquitous Language, Gadamer's Horizontverschmelzung) into the four-layer abstraction. Stage 2 (Runtime) use-corroboration is pending — accumulating cross-session inscriptions across user-context variation. Architectural inscription (e.g., promoting HFT as a normative substrate format for other utilities) is deferred until variation-stable retention evidence accumulates.

When in doubt about a layer or rule under live use, prefer fidelity to the four-layer contract over local convenience; report any tension as Stage 2 evidence rather than silently relaxing the constraint.
