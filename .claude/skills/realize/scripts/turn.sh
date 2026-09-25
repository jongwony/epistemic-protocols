#!/usr/bin/env bash
# Drive one subject turn of one multi-turn cell, by hand. The harness runs one turn per
# cell, so a case whose graders read later turns is walked turn by turn with this script,
# the case's oracle.md composing every user reply in between.
#
#   ./turn.sh <cell_dir> <plugin_dir|-> <message_file> [session_id]
#
# <cell_dir>/work must already hold the case scaffold. Without a session id this is turn 1:
# the scaffold's digest is written as turn-0.digest before anything runs. Each turn writes
# turn-<n>.jsonl (stream-json), turn-<n>.txt (final assistant text), turn-<n>.err and
# turn-<n>.digest, and prints the session id to pass back for the next turn. `-` in place
# of a plugin dir is the arm without the protocol.
#
# Isolation is per cell, as in setup.sh: an empty CLAUDE_CONFIG_DIR at <cell_dir>/cfg, and
# the variables through which an enclosing Claude Code session would reach the child
# (its session identity, its extra CLAUDE.md directories) removed from its environment.
set -euo pipefail

SKILL="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

fail() { printf 'turn: %s\n' "$1" >&2; exit 1; }

[ "$#" -ge 3 ] || fail "usage: ./turn.sh <cell_dir> <plugin_dir|-> <message_file> [session_id]"
cell="$(cd "$1" && pwd)"; plugin="$2"; msgfile="$3"; sid="${4:-}"

command -v node   >/dev/null 2>&1 || fail "node not on PATH"
command -v claude >/dev/null 2>&1 || fail "claude not on PATH"
[ -d "$cell/work" ] || fail "$cell/work not found -- run the case scaffold there first"
[ -f "$msgfile" ]   || fail "message file not found: $msgfile"
message="$(cat "$msgfile")"
[ -n "${CLAUDE_CODE_OAUTH_TOKEN:-}" ] || fail "CLAUDE_CODE_OAUTH_TOKEN is not set (see run.sh)"

# The same tree digest harness.mjs computes: sha256 per file over sorted relative paths,
# dotfiles (including .git) and __pycache__ excluded.
digest() {
  node - "$1" <<'JS'
const { createHash } = require('node:crypto');
const { existsSync, readdirSync, readFileSync } = require('node:fs');
const { join } = require('node:path');
const out = [];
const walk = (d, rel) => {
  for (const e of readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (e.name === '__pycache__' || e.name.startsWith('.')) continue;
    const p = join(d, e.name); const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) walk(p, r);
    else out.push(`${r}:${createHash('sha256').update(readFileSync(p)).digest('hex')}`);
  }
};
if (existsSync(process.argv[2])) walk(process.argv[2], '');
process.stdout.write(out.join('\n'));
JS
}

cfg() { node -p "const c = require('$SKILL/harness.config.json'); $1"; }
model="${MODEL:-$(cfg 'c.models[0]')}"
read -r -a tools <<< "$(cfg "c.allowedTools.join(' ')")"

mkdir -p "$cell/cfg"
n=$( (ls "$cell"/turn-*.jsonl 2>/dev/null || true) | wc -l); n=$((n + 1))
[ -n "$sid" ] || [ -f "$cell/turn-0.digest" ] || digest "$cell/work" > "$cell/turn-0.digest"

args=(-p --verbose --output-format stream-json --model "$model"
      --permission-mode "$(cfg 'c.permissionMode')" --max-turns "${MAX_TURNS:-12}"
      --allowedTools "${tools[@]}")
[ "$plugin" = "-" ] || args+=(--plugin-dir "$(cd "$plugin" && pwd)")
[ -z "$sid" ] || args+=(--resume "$sid")

( cd "$cell/work" && env -u CLAUDE_CODE_SESSION_ID -u CLAUDE_CODE_REMOTE_SESSION_ID \
    -u CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD -u CLAUDE_ADDITIONAL_DIRECTORIES \
    CLAUDE_CONFIG_DIR="$cell/cfg" \
    timeout "${TIMEOUT:-600}" claude "${args[@]}" -- "$message" \
    > "$cell/turn-$n.jsonl" 2> "$cell/turn-$n.err" ) || echo "exit=$?" >> "$cell/turn-$n.err"

digest "$cell/work" > "$cell/turn-$n.digest"

node - "$cell/turn-$n.jsonl" "$cell/turn-$n.txt" <<'JS'
const { readFileSync, writeFileSync } = require('node:fs');
const [src, dst] = process.argv.slice(2);
let sid = null; let result = null; const texts = [];
for (const line of readFileSync(src, 'utf8').split('\n')) {
  let e; try { e = JSON.parse(line); } catch { continue; }
  sid = e.session_id || sid;
  if (e.type === 'assistant') {
    for (const c of e.message?.content || []) if (c.type === 'text') texts.push(c.text);
  }
  if (e.type === 'result') result = e;
}
let body = texts.length ? texts[texts.length - 1] : '';
if (result) body += `\n\n<!-- is_error=${result.is_error ?? ''} turns=${result.num_turns ?? ''} cost=${result.total_cost_usd ?? ''} -->\n`;
writeFileSync(dst, body);
process.stdout.write(`${sid || ''}\n`);
JS
