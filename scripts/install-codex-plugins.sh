#!/bin/bash
# Install or update the Epistemic Protocols Codex marketplace in the user's home directory.
# Idempotent: safe to re-run to refresh the repo clone and marketplace entries.
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/jongwony/epistemic-protocols/main/scripts/install-codex-plugins.sh | bash

set -euo pipefail

REPO_URL="${EPI_REPO_URL:-https://github.com/jongwony/epistemic-protocols.git}"
DEFAULT_BRANCH="${EPI_REPO_BRANCH:-main}"
MARKETPLACE_ROOT="${CODEX_MARKETPLACE_ROOT:-$HOME/.agents/plugins}"
MARKETPLACE_FILE="$MARKETPLACE_ROOT/marketplace.json"
CLONE_DIR="$MARKETPLACE_ROOT/epistemic-protocols-src"
SOURCE_MARKETPLACE_REL=".agents/plugins/marketplace.json"

command -v codex >/dev/null 2>&1 || { echo "Error: codex CLI not found. Install Codex first." >&2; exit 1; }
command -v git >/dev/null 2>&1 || { echo "Error: git not found." >&2; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "Error: python3 not found." >&2; exit 1; }

mkdir -p "$MARKETPLACE_ROOT"

if [ -d "$CLONE_DIR/.git" ]; then
  echo "Updating Epistemic Protocols source..."
  git -C "$CLONE_DIR" fetch --depth 1 origin "$DEFAULT_BRANCH"
  git -C "$CLONE_DIR" checkout "$DEFAULT_BRANCH"
  git -C "$CLONE_DIR" pull --ff-only origin "$DEFAULT_BRANCH"
else
  echo "Cloning Epistemic Protocols source..."
  rm -rf "$CLONE_DIR"
  git clone --depth 1 --branch "$DEFAULT_BRANCH" "$REPO_URL" "$CLONE_DIR"
fi

if [ ! -f "$CLONE_DIR/$SOURCE_MARKETPLACE_REL" ]; then
  echo "Error: source marketplace not found at $CLONE_DIR/$SOURCE_MARKETPLACE_REL" >&2
  echo "Hint: if you are testing an unmerged branch, set EPI_REPO_URL and EPI_REPO_BRANCH." >&2
  exit 1
fi

echo "Updating personal Codex marketplace..."
python3 - "$CLONE_DIR/$SOURCE_MARKETPLACE_REL" "$MARKETPLACE_FILE" <<'PY'
import json
import sys
from pathlib import Path

source_path = Path(sys.argv[1])
target_path = Path(sys.argv[2])

source = json.loads(source_path.read_text(encoding="utf-8"))
if target_path.exists():
    target = json.loads(target_path.read_text(encoding="utf-8"))
else:
    target = {
        "name": "personal-local-plugins",
        "interface": {"displayName": "Personal Local Plugins"},
        "plugins": [],
    }

plugins = target.setdefault("plugins", [])
existing = {entry.get("name"): entry for entry in plugins}

for entry in source.get("plugins", []):
    name = entry["name"]
    rel = entry["source"]["path"].removeprefix("./")
    merged = {
        "name": name,
        "source": {
            "source": "local",
            "path": f"./epistemic-protocols-src/{rel}",
        },
        "policy": {
            "installation": entry["policy"]["installation"],
            "authentication": entry["policy"]["authentication"],
        },
        "category": entry["category"],
    }
    if "policy" in entry and "products" in entry["policy"]:
        merged["policy"]["products"] = entry["policy"]["products"]
    existing[name] = merged

ordered = []
seen = set()
for entry in plugins:
    name = entry.get("name")
    if name in existing and name not in seen:
        ordered.append(existing[name])
        seen.add(name)
for entry in source.get("plugins", []):
    name = entry["name"]
    if name not in seen:
        ordered.append(existing[name])
        seen.add(name)
for name, entry in existing.items():
    if name not in seen:
        ordered.append(entry)

target["plugins"] = ordered
target_path.write_text(json.dumps(target, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
PY

echo ""
echo "Codex marketplace updated at: $MARKETPLACE_FILE"
echo "Cloned source repo at: $CLONE_DIR"
echo ""
echo "Next steps:"
echo "  1. Run: codex"
echo "  2. Open: /plugins"
echo "  3. Install plugins from the personal marketplace"
echo "  4. Invoke them with \$plugin:skill (for example: \$epistemic-cooperative:onboard)"
