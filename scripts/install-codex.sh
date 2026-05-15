#!/bin/bash
# Add the Epistemic Protocols marketplace to Codex
# Idempotent: safe to re-run after the marketplace is already added
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/jongwony/epistemic-protocols/main/scripts/install-codex.sh | bash

set -eo pipefail

REPO="jongwony/epistemic-protocols"
MANIFEST_URL="https://raw.githubusercontent.com/$REPO/main/.agents/plugins/marketplace.json"
MARKETPLACE_SOURCE="https://github.com/$REPO.git"

command -v codex >/dev/null 2>&1 || { echo "Error: codex CLI not found. Install Codex first." >&2; exit 1; }
command -v curl >/dev/null 2>&1 || { echo "Error: curl not found." >&2; exit 1; }

echo "Adding Codex marketplace..."
codex plugin marketplace add "$MARKETPLACE_SOURCE"

echo ""

if manifest=$(curl -fsSL "$MANIFEST_URL" 2>/dev/null); then
  if command -v python3 >/dev/null 2>&1; then
    marketplace=$(printf '%s' "$manifest" \
      | python3 -c "import json,sys; print(json.load(sys.stdin)['name'])")
    plugin_count=$(printf '%s' "$manifest" \
      | python3 -c "import json,sys; print(len(json.load(sys.stdin)['plugins']))")
    echo "Added marketplace '$marketplace' with $plugin_count plugin(s)."
  else
    echo "Added marketplace. Install python3 to display the plugin count."
  fi
else
  echo "Added marketplace. Skipped manifest summary because the manifest could not be fetched."
fi

echo "Run /onboard to get started."
