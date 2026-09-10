# Claude Code Host

Load at source selection. Availability is the running host's advertised capability,
not the model name or the presence of a plugin directory alone.

- `code-review`: resolve the installed/built-in Claude review skill and its contract.
  It must accept the captured local diff pointer and intent bundle and return review
  results to the caller. Inspect its scope, output limits, reach channel, and whether
  it is a `context: fork` skill. Invoke that fork with the advertised skill name;
  otherwise use an available isolated reviewer subagent that calls the skill with
  only the review request. An inline `Skill(...)` call alone does not establish a
  fork. If neither route exists, report this source unavailable.
- `codex`: resolve the `codex` executable and usable local configuration. This is an
  external CLI review, regardless of which model drives Claude Code.

After designation, load only the selected adapter:
[Claude review output](source-adapter-code-review.md) or
[Codex CLI](source-adapter-codex.md).

The Claude review request carries the local base/head or working-tree pointer and
intent, not the loop's conversation history. Use the host's completion mechanism
and return the actual review output. Review is read-only and returns to the loop;
posting comments, editing, and disposition belong to separately authorized actions.

For implementation-specific invocation details, check the installed skill and
[Claude skill execution](https://code.claude.com/docs/en/skills#run-skills-in-a-subagent).
