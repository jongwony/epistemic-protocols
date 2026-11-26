#!/bin/bash
# Install all core protocol plugins from epistemic-protocols for Antigravity (agy).
# Uses the Antigravity packaging profile (thin SKILL.md entrypoint + CONTRACT.md)
# so every protocol loads without hitting Antigravity's 24 KB SKILL.md body cap.
# `route` is deliberately excluded.
#
# Usage (from GitHub Releases):
#   curl -fsSL https://raw.githubusercontent.com/jongwony/epistemic-protocols/main/scripts/install-agy.sh | bash
#
# Usage (from a local checkout — builds and installs dist/antigravity/*.zip):
#   ./scripts/install-agy.sh /path/to/epistemic-protocols

set -eo pipefail

REPO="jongwony/epistemic-protocols"
MARKETPLACE_URL="https://github.com/$REPO/releases/latest/download/marketplace.json"
LOCAL_ROOT="${1:-}"

command -v agy >/dev/null 2>&1 || { echo "Error: agy CLI not found. Install Antigravity CLI first." >&2; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "Error: python3 not found." >&2; exit 1; }

installed=0
skipped=0

if [[ -n "$LOCAL_ROOT" ]]; then
  command -v node >/dev/null 2>&1 || { echo "Error: node not found. Node.js 22+ is required to build local Antigravity packages." >&2; exit 1; }
  echo "Building Antigravity plugin packages from $LOCAL_ROOT..."
  (cd "$LOCAL_ROOT" && node scripts/package.js --profile antigravity >/dev/null)
  dist_dir="$LOCAL_ROOT/dist/antigravity"
  manifest_path="$dist_dir/marketplace.json"
  [[ -f "$manifest_path" ]] || { echo "Error: built marketplace not found at $manifest_path" >&2; exit 1; }

  while IFS=$'\t' read -r name url; do
    zip_file="$dist_dir/$(basename "$url")"
    if agy plugin install "$zip_file" < /dev/null; then
      installed=$((installed + 1))
      agy plugin enable "$name" < /dev/null >/dev/null 2>&1 || true
    else
      echo "  Skipped: $name"
      skipped=$((skipped + 1))
    fi
  done < <(python3 -c "import json,sys; [print(p['name'] + '\t' + p['source']['url']) for p in json.load(open(sys.argv[1]))['plugins']]" "$manifest_path")
else
  command -v curl >/dev/null 2>&1 || { echo "Error: curl not found." >&2; exit 1; }
  echo "Fetching Antigravity marketplace from latest release..."
  manifest=$(curl -fsSL "$MARKETPLACE_URL")

  while IFS=$'\t' read -r name url; do
    if agy plugin install "$url" < /dev/null; then
      installed=$((installed + 1))
      agy plugin enable "$name" < /dev/null >/dev/null 2>&1 || true
    else
      echo "  Skipped: $name"
      skipped=$((skipped + 1))
    fi
  done < <(printf '%s' "$manifest" | python3 -c "import json,sys; [print(p['name'] + '\t' + p['source']['url']) for p in json.load(sys.stdin)['plugins']]")
fi

echo ""
echo "Installed $installed plugin(s)."
[[ $skipped -gt 0 ]] && echo "$skipped skipped (unavailable or failed)."
echo "Run 'agy plugin list' or '/plugins' to verify, and invoke a protocol such as /inquire or /elicit."
