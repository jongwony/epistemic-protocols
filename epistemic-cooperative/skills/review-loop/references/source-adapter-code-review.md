# Claude Review Adapter

The host reference supplies isolation and invocation. This adapter maps the available
Claude `/code-review` implementation to the Source Interface in `SKILL.md`.

Before selection, inspect the implementation's accepted scope and output contract.
Pass the resolved **local** base/head (or captured working-tree base and untracked
paths) and design-intent bundle. Establish that the review examined that surface.
A raw PR number alone addresses remote PR state and can omit local or stacked repairs.

Preserve the native result, then normalize only a completed review:

- A findings-array implementation: an explicit valid `[]` yields `approve`; a
  nonempty array yields `needs-attention`. Map file, line, summary, and failure
  scenario to findings, using behavioral consequence for severity rather than rank.
- A narrative implementation: extract its actual findings and explicit assessment.
  An explicit no-issues conclusion on the requested scope may yield `approve`.
- Skipped PRs, unavailable scope, blocked tools, malformed output, or no actual
  assessment contribute no completed review, even if no findings were returned.

Keep any explicit finding cap or scope exclusions in the source trade-off at entry
and residual at exit. In particular, Anthropic's public
[code-review plugin](https://github.com/anthropics/claude-code/blob/main/plugins/code-review/commands/code-review.md)
may have PR eligibility checks and an introduced-issues scope; it is not a universal
contract for every built-in bearing the name. If the implementation cannot honor
this invocation's local pointer, report the incompatibility instead of changing the
review target. Its posting options are separate from returning a review to this loop.

Request reach and direction where the implementation permits them. A fixed findings
array with no reporting fields has no such channel: declare that limit once at entry
and exit. Populate either slot only from what the reviewer actually returned; a
normalizer's guess is not source evidence. Leave direction empty when absent.
