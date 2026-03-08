#!/bin/bash
# Install all epistemic protocol plugins for Claude Code
# Idempotent: safe to re-run when new plugins are added
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/jongwony/epistemic-protocols/main/scripts/install.sh | bash

set -eo pipefail

REPO="jongwony/epistemic-protocols"
MARKETPLACE="epistemic-protocols"
MANIFEST_URL="https://raw.githubusercontent.com/$REPO/main/.claude-plugin/marketplace.json"

command -v claude >/dev/null 2>&1 || { echo "Error: claude CLI not found. Install Claude Code first." >&2; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "Error: python3 not found." >&2; exit 1; }

echo "Adding marketplace..."
claude plugin marketplace add "https://github.com/$REPO" 2>/dev/null || true

echo "Fetching plugin list..."
plugins=$(curl -fsSL "$MANIFEST_URL" \
  | python3 -c "import json,sys; [print(p['name']) for p in json.load(sys.stdin)['plugins']]")

installed=0
skipped=0

for p in $plugins; do
  if claude plugin install "$p@$MARKETPLACE" 2>/dev/null; then
    ((installed++))
  else
    ((skipped++))
  fi
done

echo ""
echo "Installed $installed plugin(s)."
[[ $skipped -gt 0 ]] && echo "$skipped skipped (already installed or unavailable)."
echo "Run /onboard to get started."
