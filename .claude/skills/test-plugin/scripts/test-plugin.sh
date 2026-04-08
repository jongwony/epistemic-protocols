#!/usr/bin/env bash
set -euo pipefail

# Plugin test runner with clean stream separation
# Usage: test-plugin.sh <plugin-dir> [prompt] [verbosity]
#   verbosity: quiet (summary only), normal (default), verbose (full debug log)

PLUGIN_DIR="${1:?Usage: test-plugin.sh <plugin-dir> [prompt] [verbosity]}"
PROMPT="${2:-"What skills, agents, and commands are available from the loaded plugins? List them with brief descriptions."}"
VERBOSITY="${3:-normal}"

# Resolve to absolute path
PLUGIN_DIR="$(cd "$PLUGIN_DIR" && pwd)"

# Output directory
OUTPUT_DIR="/tmp/plugin-test-$(date +%s)"
mkdir -p "$OUTPUT_DIR"

# --- Validate ---

if [[ ! -f "$PLUGIN_DIR/.claude-plugin/plugin.json" ]]; then
  echo "FAIL: No .claude-plugin/plugin.json found in $PLUGIN_DIR" >&2
  exit 1
fi

# Extract plugin metadata via Node.js (project requires Node 22+)
PLUGIN_NAME=$(node -e "console.log(require('$PLUGIN_DIR/.claude-plugin/plugin.json').name)" 2>/dev/null || echo "unknown")
PLUGIN_VERSION=$(node -e "console.log(require('$PLUGIN_DIR/.claude-plugin/plugin.json').version || 'unknown')" 2>/dev/null || echo "unknown")

echo "Plugin:    $PLUGIN_NAME v$PLUGIN_VERSION"
echo "Directory: $PLUGIN_DIR"
echo "Prompt:    ${PROMPT:0:80}$([ ${#PROMPT} -gt 80 ] && echo '...')"
echo "Output:    $OUTPUT_DIR"
echo "---"

# --- Execute ---
# Stream separation:
#   stdout  → stdout.txt   (model response)
#   debug   → debug.log    (--debug-file keeps debug out of stderr)
#   stderr  → stderr.log   (process errors only)

set +e
claude -p \
  --debug \
  --debug-file "$OUTPUT_DIR/debug.log" \
  --plugin-dir "$PLUGIN_DIR" \
  --permission-mode bypassPermissions \
  "$PROMPT" \
  1>"$OUTPUT_DIR/stdout.txt" \
  2>"$OUTPUT_DIR/stderr.log"
EXIT_CODE=$?
set -e

# --- Parse & Report ---

{
  echo ""
  echo "=== Plugin Test Results ==="
  echo "Plugin: $PLUGIN_NAME v$PLUGIN_VERSION"
  echo "Exit code: $EXIT_CODE"
  echo ""

  echo "--- Loading Events ---"
  grep -iE "(plugin|loaded|registered|enabled|discovered)" "$OUTPUT_DIR/debug.log" 2>/dev/null | head -20 || echo "(none found)"
  echo ""

  echo "--- Components ---"
  grep -iE "(skill|agent|command|hook)" "$OUTPUT_DIR/debug.log" 2>/dev/null | grep -v "^$" | head -20 || echo "(none found)"
  echo ""

  echo "--- Errors/Warnings ---"
  # Check both debug.log and stderr.log for errors
  {
    grep -iE "(error|warn|fail|exception)" "$OUTPUT_DIR/debug.log" 2>/dev/null || true
    grep -iE "(error|warn|fail|exception)" "$OUTPUT_DIR/stderr.log" 2>/dev/null || true
  } | grep -v "^$" | sort -u | head -10 || echo "(none)"
  echo ""

  if [[ "$VERBOSITY" != "quiet" ]]; then
    echo "--- Response (stdout) ---"
    if [[ -s "$OUTPUT_DIR/stdout.txt" ]]; then
      cat "$OUTPUT_DIR/stdout.txt"
    else
      echo "(empty)"
    fi
    echo ""
  fi
} | tee "$OUTPUT_DIR/summary.txt"

# Verbose: show full debug log
if [[ "$VERBOSITY" == "verbose" ]]; then
  echo "--- Full Debug Log ---"
  cat "$OUTPUT_DIR/debug.log" 2>/dev/null || echo "(empty)"
  echo ""
fi

# --- Verdict ---

echo "---"
if [[ $EXIT_CODE -eq 0 ]]; then
  ERRORS_FOUND=$(grep -ciE "(error|fail|exception)" "$OUTPUT_DIR/debug.log" 2>/dev/null || echo "0")
  STDERR_ERRORS=$(grep -ciE "(error|fail|exception)" "$OUTPUT_DIR/stderr.log" 2>/dev/null || echo "0")

  if [[ "$ERRORS_FOUND" -gt 0 || "$STDERR_ERRORS" -gt 0 ]]; then
    echo "VERDICT: WARN (exit 0 but errors detected in logs)"
  else
    echo "VERDICT: PASS"
  fi
else
  echo "VERDICT: FAIL (exit code: $EXIT_CODE)"
fi

echo "Artifacts: $OUTPUT_DIR/"
