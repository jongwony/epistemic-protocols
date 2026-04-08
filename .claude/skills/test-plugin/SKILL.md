---
name: test-plugin
description: "Test Claude Code plugins in headless mode with debug output. Use when the user asks to 'test plugin', 'smoke test', 'verify plugin loading', 'check plugin works', 'debug plugin', or after modifying a plugin to verify it loads correctly."
allowed-tools: Bash, Read, Grep, Glob
---

# Plugin Test

Smoke-test Claude Code plugins using headless mode (`claude -p`) with debug output to verify loading, component registration, and basic functionality.

## When to Use

- After modifying SKILL.md, plugin.json, or agent definitions
- Before committing plugin changes (complement to `/verify`)
- When debugging plugin loading issues
- Batch regression testing after cross-plugin changes

## Core Command

```bash
bash .claude/skills/test-plugin/scripts/test-plugin.sh <plugin-dir> [prompt] [verbosity]
```

## Important: Nested Session Restriction

`claude -p` cannot run inside another Claude Code session. This skill operates in two modes depending on context:

- **Inside Claude Code session**: Generate the command and present it for the user to run in a separate terminal. Then analyze the output artifacts.
- **Outside Claude Code session (terminal, CI)**: Execute the script directly.

## Workflow

### 1. Target Resolution

If user specifies a plugin directory, use it directly.

If not specified, list directories containing `.claude-plugin/plugin.json`:
```bash
ls -d */  # then check for .claude-plugin/plugin.json
```
Present the list for user selection.

### 2. Pre-flight (Optional)

Run static checks before headless test if user requests:
```bash
node .claude/skills/verify/scripts/static-checks.js <plugin-dir>
```

### 3. Execute Test

**If inside a Claude Code session** (nested session detected):

Generate the command for the user to copy-paste into a separate terminal:

```
Run this command in a separate terminal:

  bash .claude/skills/test-plugin/scripts/test-plugin.sh <plugin-dir> "<prompt>" <verbosity>

Then come back here and I'll analyze the results from the output directory.
```

After the user confirms execution, read the artifacts from `/tmp/plugin-test-*` (most recent) and proceed to Step 4.

**If outside Claude Code** (terminal, CI):

Call the test script directly:

```bash
# Default — loading summary + response
bash .claude/skills/test-plugin/scripts/test-plugin.sh ./horismos

# Custom prompt
bash .claude/skills/test-plugin/scripts/test-plugin.sh ./prothesis "What frameworks can you recommend?"

# Verbose — includes full debug log
bash .claude/skills/test-plugin/scripts/test-plugin.sh ./horismos "" verbose

# Quiet — summary only, no response body
bash .claude/skills/test-plugin/scripts/test-plugin.sh ./horismos "" quiet
```

#### Stream Separation Strategy

The script uses `--debug-file` to write debug logs to a dedicated file, keeping stderr clean. Model response goes to stdout file via `1>`. This avoids the common problem of debug noise contaminating response output when using `2>` redirection.

```
stdout  → OUTPUT_DIR/stdout.txt   (model response)
debug   → OUTPUT_DIR/debug.log    (--debug-file, plugin loading events)
stderr  → OUTPUT_DIR/stderr.log   (process errors only)
```

### 4. Analyze Results

Read the script output or artifacts. Key signals:

| Check | Source | Look For |
|-------|--------|----------|
| Loading | debug.log | Plugin name, version, successful load |
| Skills | debug.log | Registered skill names matching SKILL.md |
| Agents | debug.log | Registered agent names matching agents/*.md |
| Process errors | stderr.log | Non-debug errors (crashes, missing deps) |
| Response | stdout.txt | Model output for the test prompt |

### 5. Verdict

- **PASS**: Plugin loaded, expected components registered, no errors
- **WARN**: Plugin loaded but warnings or missing optional components detected
- **FAIL**: Plugin failed to load, missing required components, or errors present

## Batch Testing

Test all plugins in the repository:

```bash
for dir in prothesis syneidesis hermeneia katalepsis telos horismos aitesis analogia prosoche epharmoge reflexion epistemic-cooperative write; do
  echo "=== $dir ==="
  bash .claude/skills/test-plugin/scripts/test-plugin.sh "./$dir" "" quiet
  echo ""
done
```

## Limitations

- `-p` mode cannot test AskUserQuestion interactions — protocols exit at the first AskUserQuestion call
- Best for: loading verification, component registration, non-interactive functionality
- For full protocol flow testing: use `claude --plugin-dir <dir>` interactively instead

## Tips

- `--output-format json` can be added in the script for structured response parsing
- `--allowedTools` restricts tool access during test runs (useful for isolating behavior)
- Compare debug.log across plugin versions to detect registration changes
