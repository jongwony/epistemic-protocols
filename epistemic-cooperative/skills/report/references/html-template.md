# HTML Template Reference

HTML boilerplate for the `epistemic-profile.html` artifact generated in Phase 4. Copy the skeleton structure and replicate card patterns with actual data.

## Data Schema

Prepare these data structures before rendering:

```
stats: { sessions_analyzed, projects_scanned, patterns_found, last_activity }
diagnostics: [{ description, snippet: { user_msg, ai_msg, session_ref }, protocol_cta, resume_cmd }]
patterns: [{ friction_narrative?, snippet?: { user_msg, ai_msg, session_ref }, protocol_cta, resume_cmd, statistical_evidence? }]
recommendations: [{ name, command, rationale, snippet_ref?, install_cmd?, installed: bool }]
quick_start: { protocol, scenario, resume_cmd, install_cmd? }
batch_install: { needed: bool, command }
```

## HTML Boilerplate

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Epistemic Profile</title>
<style>
  /* -- Base -- */
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: system-ui, -apple-system, sans-serif;
    max-width: 800px; margin: 0 auto; padding: 2rem;
    background: #0f172a; color: #e2e8f0;
    line-height: 1.6;
  }
  h1 { font-size: 1.75rem; margin-bottom: 0.5rem; }
  h2 { font-size: 1.25rem; margin: 2rem 0 1rem; color: #94a3b8; border-bottom: 1px solid #334155; padding-bottom: 0.5rem; }

  /* -- Stats Bar -- */
  .stats { display: flex; gap: 2rem; margin: 1.5rem 0; flex-wrap: wrap; }
  .stat { text-align: center; }
  .stat-value { font-size: 2rem; font-weight: bold; color: #818cf8; }
  .stat-label { font-size: 0.8rem; color: #94a3b8; }

  /* -- Cards -- */
  .card {
    border: 1px solid #334155; border-radius: 8px;
    padding: 1.5rem; margin: 1rem 0;
    background: #1e293b;
  }
  .card-title { font-weight: 600; margin-bottom: 0.75rem; }
  .diagnostic-card { border-left: 4px solid #f59e0b; }
  .pattern-card { border-left: 4px solid #6366f1; }
  .recommendation-card { border-left: 4px solid #22c55e; }
  .dashboard-card { border-left: 4px solid #06b6d4; }

  /* -- Snippets -- */
  .snippet {
    background: #0f172a; border-radius: 4px;
    padding: 1rem; margin: 0.75rem 0;
    font-size: 0.9rem;
  }
  .snippet .user-msg { color: #93c5fd; margin-bottom: 0.5rem; }
  .snippet .user-msg::before { content: "User: "; font-weight: 600; }
  .snippet .ai-msg { color: #86efac; margin-bottom: 0.5rem; }
  .snippet .ai-msg::before { content: "AI: "; font-weight: 600; }
  .snippet .session-ref { color: #9ca3af; font-size: 0.8rem; font-style: italic; }

  /* -- Protocol CTA -- */
  .protocol-cta {
    background: #1a2e1a; border-radius: 4px;
    padding: 1rem; margin: 0.75rem 0;
    border-left: 2px solid #22c55e;
  }
  .protocol-cta::before { content: "-> "; color: #22c55e; font-weight: bold; }

  /* -- Friction Narrative -- */
  .friction-narrative { color: #fbbf24; font-style: italic; margin-bottom: 0.75rem; }

  /* -- Commands -- */
  .resume-cmd, .install-cmd {
    font-family: 'SF Mono', 'Fira Code', monospace;
    background: #020617; color: #e2e8f0;
    padding: 0.5rem 1rem; border-radius: 4px;
    display: inline-block; margin-top: 0.5rem;
    user-select: all; font-size: 0.85rem;
  }
  .install-cmd { color: #a5b4fc; }

  /* -- Batch Install -- */
  .batch-install {
    background: #0a1a0a; border: 1px solid #22c55e;
    border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;
  }
  .batch-install h3 { color: #22c55e; margin-bottom: 0.75rem; }

  /* -- CTA Badge -- */
  .cta {
    display: inline-block; background: #6366f1; color: white;
    padding: 0.25rem 0.75rem; border-radius: 4px;
    text-decoration: none; font-family: monospace; font-size: 0.9rem;
  }
  .cta:hover { background: #4f46e5; }

  /* -- Statistical Evidence (fallback) -- */
  .stat-evidence { color: #94a3b8; font-size: 0.9rem; font-style: italic; }

  /* -- Footer -- */
  footer { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #334155; color: #64748b; font-size: 0.8rem; }

  /* -- Responsive -- */
  @media (max-width: 600px) {
    body { padding: 1rem; }
    .stats { gap: 1rem; }
    .stat-value { font-size: 1.5rem; }
  }
</style>
</head>
<body>

<!-- ====================================================
     SECTION: Header + Stats
     Always rendered.
     ==================================================== -->
<h1>Your Epistemic Profile</h1>
<div class="stats">
  <div class="stat">
    <div class="stat-value">12</div>
    <div class="stat-label">Sessions Analyzed</div>
  </div>
  <div class="stat">
    <div class="stat-value">3</div>
    <div class="stat-label">Projects Scanned</div>
  </div>
  <div class="stat">
    <div class="stat-value">7</div>
    <div class="stat-label">Patterns Found</div>
  </div>
</div>

<!-- ====================================================
     SECTION: Dashboard CTA
     Always rendered. Single card.
     ==================================================== -->
<div class="card dashboard-card">
  <div class="card-title">Full Coverage Analysis</div>
  <p>Run <span class="cta">/dashboard</span> for comprehensive coverage analysis across all sessions.</p>
</div>

<!-- ====================================================
     SECTION: Session Diagnostics
     CONDITIONAL: Omit entire section if no anti-patterns detected.
     Render one .diagnostic-card per anti-pattern.
     ==================================================== -->
<h2>Session Diagnostics</h2>

<!-- CARD: Diagnostic (replicate per anti-pattern) -->
<div class="card diagnostic-card">
  <div class="card-title">Vague goal led to 3 direction changes</div>
  <p>Session started with "improve the auth flow" without specifying what improvement means, leading to multiple backtrack cycles.</p>
  <div class="snippet">
    <div class="user-msg">Please improve the auth flow</div>
    <div class="ai-msg">I'll improve the authentication flow. Let me first check the current structure...</div>
    <div class="session-ref">project: ~/myapp · session: a1b2c3d4</div>
  </div>
  <div class="protocol-cta">Using <span class="cta">/goal</span> here would co-construct a defined end state before implementation, preventing direction changes from undefined goals.</div>
  <div class="resume-cmd">cd ~/myapp && claude --resume a1b2c3d4</div>
</div>

<!-- ====================================================
     SECTION: Discovered Patterns
     Always rendered (at least Tier 3 fallback).
     Render one .pattern-card per pattern.
     Three narrative modes (use first available):
       1. Friction narrative + snippet (Path A preferred)
       2. Snippet only (Path B)
       3. Statistical evidence only (fallback)
     ==================================================== -->
<h2>Discovered Patterns</h2>

<!-- CARD: Pattern with friction narrative (Path A preferred) -->
<div class="card pattern-card">
  <div class="card-title">Repeated file edits without intent clarification</div>
  <div class="friction-narrative">"AI modified in the wrong direction, had to fix the same file multiple times"</div>
  <div class="snippet">
    <div class="user-msg">Please fix this component</div>
    <div class="ai-msg">I've updated the component. I improved both the styling and logic together.</div>
    <div class="session-ref">project: ~/webapp · session: e5f6g7h8</div>
  </div>
  <div class="protocol-cta">In this situation, calling <span class="cta">/clarify</span> would help articulate which aspect to modify, preventing rework from misunderstood intent.</div>
  <div class="resume-cmd">cd ~/webapp && claude --resume e5f6g7h8</div>
</div>

<!-- CARD: Pattern with snippet only (Path B) -->
<div class="card pattern-card">
  <div class="card-title">Deploy commands without risk assessment</div>
  <div class="snippet">
    <div class="user-msg">Deploy to production please</div>
    <div class="ai-msg">Deploying now. Running git push origin main...</div>
    <div class="session-ref">project: ~/service · session: i9j0k1l2</div>
  </div>
  <div class="protocol-cta">Using <span class="cta">/attend</span> before execution would surface deployment risks, preventing blind execution of irreversible operations.</div>
  <div class="resume-cmd">cd ~/service && claude --resume i9j0k1l2</div>
</div>

<!-- CARD: Pattern with statistical evidence only (fallback) -->
<div class="card pattern-card">
  <div class="card-title">High exploration ratio without framework</div>
  <p class="stat-evidence">5 sessions, Read:Edit ratio 4.2:1 — sustained exploration without analytical framework selection.</p>
  <div class="protocol-cta">Using <span class="cta">/frame</span> would recommend analytical lenses before exploration, focusing research with a structured perspective.</div>
</div>

<!-- ====================================================
     SECTION: Recommended Protocols
     Always rendered. One .recommendation-card per protocol.
     Include install command if not installed.
     ==================================================== -->
<h2>Recommended Protocols</h2>

<!-- CARD: Recommendation (installed) -->
<div class="card recommendation-card">
  <div class="card-title">Hermeneia <span class="cta">/clarify</span></div>
  <p>Clarify intent-expression gaps through dialogue. Matched from: repeated file edits (3 sessions), communication rules detected.</p>
</div>

<!-- CARD: Recommendation (not installed) -->
<div class="card recommendation-card">
  <div class="card-title">Telos <span class="cta">/goal</span></div>
  <p>Co-construct defined goals from vague intent. Matched from: vague first prompts (4 sessions), wrong_approach friction.</p>
  <div class="install-cmd">claude plugin install epistemic-protocols/telos</div>
</div>

<!-- ====================================================
     SECTION: Batch Install
     CONDITIONAL: Only when 2+ recommended protocols are not installed.
     ==================================================== -->
<div class="batch-install">
  <h3>Install All Recommended</h3>
  <p>Install all recommended protocols at once:</p>
  <div class="install-cmd">bash <(curl -sL https://raw.githubusercontent.com/jongwony/epistemic-protocols/main/scripts/install.sh)</div>
  <p style="margin-top: 0.5rem; color: #94a3b8; font-size: 0.85rem;">Or clone the repo and run: <code>bash scripts/install.sh</code></p>
</div>

<!-- ====================================================
     SECTION: Quick Start
     Always rendered. Top recommendation with concrete scenario.
     ==================================================== -->
<h2>Quick Start</h2>
<div class="card recommendation-card">
  <div class="card-title">Try Hermeneia right now</div>
  <p>You edited <code>src/auth.ts</code> 5 times in recent sessions — using <span class="cta">/clarify</span> to articulate intent first can reduce rework cycles.</p>
  <div class="snippet">
    <div class="user-msg">Please fix this file</div>
    <div class="ai-msg">Which aspect would you like to fix? Here are some options...</div>
    <div class="session-ref">project: ~/webapp · session: e5f6g7h8</div>
  </div>
  <div class="resume-cmd">cd ~/webapp && claude --resume e5f6g7h8</div>
</div>

<!-- ====================================================
     SECTION: Footer
     Always rendered.
     ==================================================== -->
<footer>Generated by /report · 2026-03-06T14:30:00+09:00</footer>

</body>
</html>
```

## Rendering Rules

### Section Conditions

| Section | Condition | If absent |
|---------|-----------|-----------|
| Stats | Always | — |
| Dashboard CTA | Always | — |
| Session Diagnostics | `diagnostics.length > 0` | Omit `<h2>` and all cards entirely |
| Discovered Patterns | Always | Show Tier 3 fallback text |
| Recommended Protocols | Always | Show Tier 3 Starter Trio |
| Batch Install | `uninstalled_count >= 2` | Omit entirely |
| Quick Start | Always | — |

### Card Narrative Priority

For `.pattern-card`, use the first available narrative mode:

| Priority | Mode | Elements | When |
|----------|------|----------|------|
| 1 | Friction + Snippet | `.friction-narrative` + `.snippet` + `.protocol-cta` + `.resume-cmd` | Path A with friction_detail |
| 2 | Snippet only | `.snippet` + `.protocol-cta` + `.resume-cmd` | Path B or Path A without detail |
| 3 | Statistical evidence | `.stat-evidence` + `.protocol-cta` | No quality snippet available |

### Data Insertion Points

Replace example content with actual data at these locations:

| Element | Data source |
|---------|-------------|
| `.stat-value` | Phase 3 aggregation counts |
| `.card-title` | Pattern/diagnostic description from Phase 3 |
| `.friction-narrative` | `friction_detail` text from Phase 2 Path A |
| `.snippet .user-msg` | User message from session context snippet |
| `.snippet .ai-msg` | AI response from session context snippet |
| `.snippet .session-ref` | `project: {path} · session: {id}` from Phase 1 mapping |
| `.protocol-cta` | Protocol name + expected behavior description |
| `.resume-cmd` | `cd {project_path} && claude --resume {session_id}` |
| `.install-cmd` | `claude plugin install epistemic-protocols/{name}` |
| `footer` | `/report` + ISO 8601 timestamp |

## Artifact Guidelines

- Self-contained: inline CSS, no external dependencies
- Dark theme card layout with clear visual hierarchy
- Protocol-specific color coding: diagnostic=amber, pattern=indigo, recommendation=green, dashboard=cyan
- All command blocks use `user-select: all` for copy convenience
- Responsive for different viewport sizes
- Session IDs as copyable `cd ~/project-path && claude --resume <id>` commands
- Include `claude plugin install epistemic-protocols/<name>` for uninstalled protocols
- Timestamp in footer with ISO 8601 format
