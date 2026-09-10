# Claude Code Host

Load at source selection. Availability is the running host's advertised capability,
not the model name or the presence of a plugin directory alone.

- `code-review`: resolve the advertised skill and isolation route. Reuse matching
  contract evidence under [Claude review output](source-adapter-code-review.md), and
  confirm scope and reporting limits through the first read-only review call.
  When exposed metadata establishes `context: fork`, invoke that fork with the advertised skill name;
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
