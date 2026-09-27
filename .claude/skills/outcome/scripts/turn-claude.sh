#!/usr/bin/env bash
# One subject turn of one outcome cell on the Claude runner — the counterpart of /realize's
# scripts/turn.sh, with the same isolation: an empty CLAUDE_CONFIG_DIR per cell, the protocol
# present only through --plugin-dir, and the variables through which an enclosing Claude Code
# session would reach the child removed. Here that is every CLAUDE* variable except
# CLAUDE_CODE_OAUTH_TOKEN, the one /realize's runbook authenticates with, since an enclosing
# session can export more of them than turn.sh names. outcome.mjs calls this and parses what it
# writes.
#
#   OUTCOME_MODEL=<id> OUTCOME_BUDGET=<usd> \
#     ./turn-claude.sh <work_dir> <config_dir> <out_prefix> <plugin_dir|-> <message_file> [session_id]
#
# Optional: OUTCOME_TIMEOUT (s, default 900), OUTCOME_SETTINGS (per-arm settings file),
# OUTCOME_ALLOWED_TOOLS (comma list), OUTCOME_PERMISSION_MODE, OUTCOME_MAX_TURNS.
# Writes <out_prefix>.jsonl (stream-json) and <out_prefix>.err.
set -euo pipefail

fail() { printf 'turn-claude: %s\n' "$1" >&2; exit 1; }

[ "$#" -ge 5 ] || fail "usage: ./turn-claude.sh <work_dir> <config_dir> <out_prefix> <plugin_dir|-> <message_file> [session_id]"
work="$1"; cfg="$2"; out="$3"; plugin="$4"; msgfile="$5"; sid="${6:-}"

command -v claude >/dev/null 2>&1 || fail "claude not on PATH"
[ -d "$work" ]    || fail "$work not found -- plan the run first"
[ -f "$msgfile" ] || fail "message file not found: $msgfile"
: "${OUTCOME_MODEL:?OUTCOME_MODEL is required}" "${OUTCOME_BUDGET:?OUTCOME_BUDGET is required}"
message="$(cat "$msgfile")"
mkdir -p "$cfg"

args=(-p --verbose --output-format stream-json --model "$OUTCOME_MODEL"
      --max-budget-usd "$OUTCOME_BUDGET"
      --permission-mode "${OUTCOME_PERMISSION_MODE:-acceptEdits}"
      --allowed-tools "${OUTCOME_ALLOWED_TOOLS:-Read,Grep,Glob,Bash,Write,Edit}")
[ -z "${OUTCOME_SETTINGS:-}" ]  || args+=(--settings "$OUTCOME_SETTINGS")
[ -z "${OUTCOME_MAX_TURNS:-}" ] || args+=(--max-turns "$OUTCOME_MAX_TURNS")
[ "$plugin" = "-" ]             || args+=(--plugin-dir "$(cd "$plugin" && pwd)")
[ -z "$sid" ]                   || args+=(--resume "$sid")

unset_args=()
for v in $(compgen -e); do
  case "$v" in
    CLAUDE_CODE_OAUTH_TOKEN) ;;
    CLAUDE*|OUTCOME_*) unset_args+=(-u "$v") ;;
  esac
done

( cd "$work" && env "${unset_args[@]}" CLAUDE_CONFIG_DIR="$cfg" \
    timeout "${OUTCOME_TIMEOUT:-900}" claude "${args[@]}" -- "$message" < /dev/null \
    > "$out.jsonl" 2> "$out.err" ) || echo "exit=$?" >> "$out.err"
