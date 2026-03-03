# HTML Template Reference

HTML skeleton and guidelines for the `epistemic-profile.html` artifact generated in Phase 4.

## HTML Skeleton

```html
<!-- Minimal structure reference -->
<html lang="en">
<head><meta charset="utf-8"><title>Epistemic Profile</title>
<style>
  body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; background: #0f172a; color: #e2e8f0; }
  .card { border: 1px solid #334155; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; background: #1e293b; }
  .pattern-card { border-left: 4px solid #6366f1; }
  .recommendation-card { border-left: 4px solid #22c55e; }
  .diagnostic-card { border-left: 4px solid #f59e0b; }
  .snippet { background: #0f172a; border-radius: 4px; padding: 1rem; margin: 0.75rem 0; font-size: 0.9rem; }
  .snippet .user-msg { color: #93c5fd; margin-bottom: 0.5rem; }
  .snippet .ai-msg { color: #86efac; margin-bottom: 0.5rem; }
  .snippet .session-ref { color: #9ca3af; font-size: 0.8rem; }
  .protocol-cta { background: #1a2e1a; border-radius: 4px; padding: 1rem; margin: 0.75rem 0; }
  .resume-cmd { font-family: monospace; background: #020617; color: #e2e8f0; padding: 0.5rem 1rem; border-radius: 4px; display: inline-block; margin-top: 0.5rem; user-select: all; }
  .install-cmd { font-family: monospace; background: #020617; color: #a5b4fc; padding: 0.5rem 1rem; border-radius: 4px; display: inline-block; margin-top: 0.5rem; user-select: all; }
  .batch-install { background: #0a1a0a; border: 1px solid #22c55e; border-radius: 8px; padding: 1rem; margin: 1.5rem 0; }
  .cta { display: inline-block; background: #6366f1; color: white; padding: 0.5rem 1rem; border-radius: 4px; text-decoration: none; font-family: monospace; }
  .cta:hover { background: #4f46e5; }
  .stats { display: flex; gap: 2rem; margin: 1rem 0; }
  .stat { text-align: center; }
  .stat-value { font-size: 2rem; font-weight: bold; color: #818cf8; }
  .coverage-section { margin: 2rem 0; }
  .coverage-radar { text-align: center; margin: 1.5rem 0; }
  .coverage-bars { margin: 1rem 0; }
  .coverage-bar { display: flex; align-items: center; gap: 0.75rem; margin: 0.5rem 0; }
  .coverage-bar-label { width: 100px; text-align: right; font-size: 0.9rem; }
  .coverage-bar-track { flex: 1; height: 8px; background: #334155; border-radius: 4px; }
  .coverage-bar-fill { height: 100%; border-radius: 4px; }
  .coverage-bar-value { width: 60px; font-size: 0.85rem; color: #9ca3af; }
  .na-protocol { color: #64748b; font-style: italic; }
  .friction-narrative { color: #fbbf24; font-style: italic; margin-bottom: 0.75rem; }
</style>
</head>
<body>
  <h1>Your Epistemic Profile</h1>
  <div class="stats"><!-- analysis statistics --></div>
  <h2>Epistemic Coverage</h2>
  <div class="coverage-section">
    <!-- .coverage-radar: inline SVG radar chart
      - One axis per protocol with detected situations
      - Filled area = usage ratio (situations used / situations occurred)
      - Protocols with no situations = excluded from radar, listed as N/A with .na-protocol
      - Minimum 3 axes required; if fewer than 3 protocols have situations, replace radar with bar chart only
      Graceful degradation: Tier 3 → "Run more sessions for coverage data"
    -->
    <!-- .coverage-bars: progress bar per protocol
      - Label: protocol name (/command)
      - Bar fill: situation_used / situation_occurred ratio
      - Value: "N/M situations" or "N/A"
    -->
  </div>
  <h2>Session Diagnostics</h2>
  <!-- .diagnostic-card per anti-pattern:
    1. Description: what happened and why it matters
    2. .snippet: (user message, AI response) pair from session
    3. .protocol-cta: "Using /command here would: ..."
    4. .resume-cmd: cd ~/project-path && claude --resume <session-id>
    Graceful degradation: if no anti-patterns detected, omit section entirely
  -->
  <h2>Discovered Patterns</h2>
  <!-- .pattern-card per pattern: narrative structure
    1. .friction-narrative: friction_detail text as situation description (Path A, if available)
    2. .snippet: (user message, AI response) pair
    3. .protocol-cta: "In this situation, calling /command would: ..."
    4. .resume-cmd: cd ~/project-path && claude --resume <session-id>
    Graceful degradation chain: friction_detail+snippet → snippet only → statistical evidence
  -->
  <h2>Recommended Protocols</h2>
  <!-- .recommendation-card per protocol:
    - Mapping rationale + usage scenario
    - Cross-reference to relevant pattern/diagnostic snippet
    - /command .cta badge
    - .install-cmd: claude plugin add epistemic-protocols/<name> (if not installed)
  -->
  <!-- Batch Install (conditional: shown when 2+ protocols not installed):
    - .batch-install: green-tinted background (#0a1a0a)
    - Heading: "Install All Recommended"
    - .install-cmd: one-line batch install command (user-select: all)
    - Brief note: "Or clone the repo and run: bash scripts/install.sh"
  -->
  <h2>Quick Start</h2>
  <!-- Top recommendation with snippet-based scenario:
    - Reference actual session context
    - Show what protocol invocation would do
    - Include cd ~/project-path && claude --resume for immediate action
    - Include install command if protocol not installed
  -->
  <footer>Generated by /onboard · {timestamp}</footer>
</body>
</html>
```

## Artifact Guidelines

The HTML artifact should:
- Be self-contained (inline CSS, inline SVG for radar chart, no external dependencies)
- Use a dark theme card-based layout with clear visual hierarchy
- Assign distinct colors per protocol for quick scanning (diagnostic=amber, pattern=indigo, recommendation=green)
- Include `/command` CTAs (displayed as styled badges)
- **Epistemic Coverage**: radar chart (inline SVG) + progress bars showing situation coverage per protocol. Minimum 3 protocols with detected situations for radar; otherwise use bar chart only. Tier 3 fallback: "Run more sessions for coverage data"
- **Session Diagnostics**: anti-pattern cards with context snippets + protocol CTA. Omit section if no anti-patterns detected
- Show context snippets in pattern cards: (user message, AI response) pair → protocol CTA → resume command
- When friction_detail is available: use it as lead paragraph in pattern card, snippet as supporting evidence
- Graceful degradation: if no quality snippet available, show statistical evidence (e.g., "5 sessions, 12 Edit calls on same file")
- Cross-reference pattern/diagnostic snippets in recommendation cards where available
- Use snippet-based concrete scenario in Quick Start section
- Full session IDs as copyable `cd ~/project-path && claude --resume <id>` commands (project path from Phase 1 scan). Apply `user-select: all` CSS on command blocks for copy convenience
- Include `claude plugin add epistemic-protocols/<name>` install commands for uninstalled protocols
- Be responsive for different viewport sizes
- Include a timestamp and "generated by /onboard" footer

Adapt card content and styling to match the analysis results.
