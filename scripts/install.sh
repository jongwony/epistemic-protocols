#!/bin/bash
# Install epistemic protocol plugins for Claude Code
# Zero external dependencies: requires only `claude` CLI
#
# Usage:
#   bash scripts/install.sh          # Install 10 protocols + epistemic-cooperative
#   bash scripts/install.sh --all    # Include reflexion, write

PROTOCOLS=(prothesis syneidesis hermeneia katalepsis telos aitesis epitrope analogia prosoche epharmoge)
TOOLS=(epistemic-cooperative)
OPTIONAL=(reflexion write)

plugins=("${PROTOCOLS[@]}" "${TOOLS[@]}")

if [[ "$1" == "--all" ]]; then
  plugins+=("${OPTIONAL[@]}")
fi

installed=0
failed=0

for p in "${plugins[@]}"; do
  if claude plugin install "epistemic-protocols/$p"; then
    ((installed++))
  else
    ((failed++))
    echo "Failed: $p" >&2
  fi
done

echo ""
echo "Installed $installed/${#plugins[@]} plugins."
[[ $failed -gt 0 ]] && echo "$failed failed. Re-run to retry." >&2
echo "Run /onboard to get started."
