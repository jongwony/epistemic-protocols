#!/bin/bash
# Provision Codex, then add the Epistemic Protocols marketplace.
# Installs the Codex CLI when absent and restores a ChatGPT login from
# CODEX_AUTH_JSON_B64 when no auth.json exists, then adds the marketplace.
# Idempotent: safe to re-run after the CLI, login, and marketplace are in place.
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/jongwony/epistemic-protocols/main/scripts/install-codex.sh | bash

set -eo pipefail

REPO="jongwony/epistemic-protocols"
MANIFEST_URL="https://raw.githubusercontent.com/$REPO/main/.agents/plugins/marketplace.json"
MARKETPLACE_SOURCE="https://github.com/$REPO.git"

# --- Codex provisioning probe ---
# A fresh runtime may have neither the Codex CLI nor a stored login, and
# environment variables are not set by default. Install the CLI when it is
# absent, and restore a ChatGPT login from CODEX_AUTH_JSON_B64 only when the
# machine has no auth.json yet — so an interactive machine already logged in via
# `codex login` passes through untouched. When there is no login to restore and
# no credential to restore it from, provisioning cannot produce a usable Codex,
# so it fails loudly rather than adding a marketplace no protocol run can reach.

if ! command -v codex >/dev/null 2>&1; then
  echo "Codex CLI not found; installing @openai/codex..."
  command -v npm >/dev/null 2>&1 || { echo "Error: npm not found; cannot install the Codex CLI." >&2; exit 1; }
  npm install -g @openai/codex
  command -v codex >/dev/null 2>&1 || { echo "Error: Codex CLI is still not on PATH after install." >&2; exit 1; }
fi

CODEX_HOME_DIR="${CODEX_HOME:-$HOME/.codex}"
if [ ! -f "$CODEX_HOME_DIR/auth.json" ]; then
  if [ -n "${CODEX_AUTH_JSON_B64:-}" ]; then
    echo "Restoring Codex login from CODEX_AUTH_JSON_B64..."
    mkdir -p "$CODEX_HOME_DIR" && chmod 700 "$CODEX_HOME_DIR"
    printf '%s' "$CODEX_AUTH_JSON_B64" | base64 -d > "$CODEX_HOME_DIR/auth.json"
    chmod 600 "$CODEX_HOME_DIR/auth.json"
  else
    echo "Error: Codex is not logged in and CODEX_AUTH_JSON_B64 is not set." >&2
    echo "Run 'codex login' interactively, or supply CODEX_AUTH_JSON_B64 to this process." >&2
    exit 1
  fi
fi

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
