#!/bin/bash
# Install every core protocol plugin in the epistemic-protocols marketplace for
# Claude Code. Utility plugins are opt-in — see SKIP_PLUGINS below.
# Idempotent: safe to re-run when new plugins are added
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/jongwony/epistemic-protocols/main/scripts/install.sh | bash

set -eo pipefail

REPO="jongwony/epistemic-protocols"
MARKETPLACE="epistemic-protocols"
MANIFEST_URL="https://raw.githubusercontent.com/$REPO/main/.claude-plugin/marketplace.json"

# Opt-in plugins the default installer leaves out. The plugin list itself is
# derived from the manifest; this is the one hand-maintained exclusion, guarded
# by scripts/package.test.js against naming a plugin the manifest no longer has.
#   epistemic-cooperative — utility skills (/onboard, /catalog, /probe, review
#                           and audit tooling) layered on the protocols, not a
#                           protocol itself; install it when you want them:
#                           claude plugin install epistemic-cooperative@epistemic-protocols
#   route — carries a per-prompt hook; install it deliberately:
#           claude plugin install route@epistemic-protocols
SKIP_PLUGINS="epistemic-cooperative route"

command -v claude >/dev/null 2>&1 || { echo "Error: claude CLI not found. Install Claude Code first." >&2; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "Error: python3 not found." >&2; exit 1; }

echo "Adding marketplace..."
claude plugin marketplace add "https://github.com/$REPO" < /dev/null 2>/dev/null || true

echo "Fetching plugin list..."
plugins=$(curl -fsSL "$MANIFEST_URL" \
  | python3 -c "import json,sys; [print(p['name']) for p in json.load(sys.stdin)['plugins']]")

installed=0
skipped=0
opted_out=""

for p in $plugins; do
  if [[ " $SKIP_PLUGINS " == *" $p "* ]]; then
    opted_out="$opted_out $p"
    continue
  fi
  if claude plugin install "$p@$MARKETPLACE" < /dev/null 2>/dev/null; then
    installed=$((installed + 1))
  else
    echo "  Skipped: $p"
    skipped=$((skipped + 1))
  fi
done

echo ""
echo "Installed $installed plugin(s)."
[[ $skipped -gt 0 ]] && echo "$skipped skipped (already installed or unavailable)."
for p in $opted_out; do
  echo "Not installed (opt-in): $p — add it with: claude plugin install $p@$MARKETPLACE"
done
echo "Get started by invoking a protocol, e.g. /gap before you commit to a decision."
echo "For a guided start, install epistemic-cooperative and run /onboard."
