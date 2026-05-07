#!/usr/bin/env bash
# Sync .agents/skills/ symlinks — Agent Skills cross-tool standard view.
#
# .agents/skills/<name>/SKILL.md is the discovery path used by Cursor,
# GitHub Copilot, Devin, OpenCode, Codex CLI, Gemini CLI, and other tools
# implementing the Agent Skills specification (https://agentskills.io).
# Claude Code itself uses its own plugin marketplace (.claude-plugin/) and
# does not scan this directory.
#
# This script materializes the cross-tool view by symlinking each
# protocol/utility skill directory into .agents/skills/. The single source
# of truth remains the per-plugin skill directory (e.g. prothesis/skills/
# frame/). Symlinks are relative so the layout survives repository
# relocation. The companion static-check `agents-symlinks-sync` fails when
# the materialized view drifts from the source set.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

mkdir -p .agents/skills

# Drop existing top-level symlinks so removed/renamed skills do not linger.
find .agents/skills -maxdepth 1 -mindepth 1 -type l -delete

# Skill tuples come from the loader's CLI mode — JSON-strict deprecated
# equality lives in load-protocols.js, so this script inherits the same
# semantics the JS code uses (PR #351 review M2: prior grep pattern could
# false-positive on description text containing the substring).
script_dir="$(cd "$(dirname "$0")" && pwd)"
while IFS= read -r tuple; do
  [ -n "$tuple" ] || continue
  skill_name="${tuple#*/}"
  target="../../${tuple%/*}/skills/${skill_name}"
  ln -s "$target" ".agents/skills/$skill_name"
done < <(node "$script_dir/load-protocols.js" --list-skill-tuples)

echo "✓ .agents/skills/ synchronized — $(find .agents/skills -maxdepth 1 -mindepth 1 -type l | wc -l | tr -d ' ') symlinks"
