#!/usr/bin/env bash
# Sync .agents/skills/ symlinks for Devin compatibility.
#
# Devin scans .agents/skills/<skill-name>/SKILL.md (its native skill path),
# while Claude Code/Agent SDK scan .claude/skills/ and plugin directories.
# This script materializes a Devin-discoverable view by symlinking each
# protocol/utility skill directory into .agents/skills/.
#
# Single source of truth remains the per-plugin skill directory (e.g.
# prothesis/skills/frame/). Symlinks are relative so the layout survives
# repository relocation. The companion static-check `agents-symlinks-sync`
# fails when the materialized view drifts from the source set.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

PLUGINS=(
  prothesis syneidesis hermeneia katalepsis telos horismos
  aitesis analogia periagoge prosoche epharmoge anamnesis
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
