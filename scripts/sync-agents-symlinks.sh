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

PLUGINS=(
  prothesis syneidesis hermeneia katalepsis telos horismos
  aitesis analogia periagoge euporia prosoche epharmoge anamnesis
  epistemic-cooperative
)

mkdir -p .agents/skills

# Drop existing top-level symlinks so removed/renamed skills do not linger.
find .agents/skills -maxdepth 1 -mindepth 1 -type l -delete

for plugin in "${PLUGINS[@]}"; do
  for skill_dir in "$plugin"/skills/*/; do
    [ -d "$skill_dir" ] || continue
    name=$(basename "$skill_dir")
    target="../../${skill_dir%/}"
    ln -s "$target" ".agents/skills/$name"
  done
done

echo "✓ .agents/skills/ synchronized — $(find .agents/skills -maxdepth 1 -mindepth 1 -type l | wc -l | tr -d ' ') symlinks"
