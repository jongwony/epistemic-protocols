# HTML Template Reference

HTML boilerplate for the Growth Map (`growth-map.html`) artifact generated in Phase 4. Structure varies by `growth_map_path`: Path A renders all 7 sections, Path B renders sections ④⑥ with CTA placeholders for ①②③⑦.

## Data Schema

Prepare these data structures before rendering:

```
stats: { sessions_analyzed, projects_scanned, patterns_found, growth_map_path: "A" | "B" }

// Path A only (from insights report.html parsing)
insights: {
  at_a_glance: { whats_working, whats_hindering, quick_wins, ambitious_workflows },
  interaction_style: { narrative, key_pattern },
  what_works: { intro, impressive_workflows: [{ title, description }] },
  friction_analysis: { intro, categories: [{ category, description, examples: [string] }] },
  suggestions: { claude_md_additions: [{ addition, why }], features_to_try: [{ feature, why_for_you }], usage_patterns: [{ title, suggestion, detail }] },
  on_the_horizon: { intro, opportunities: [{ title, whats_possible, how_to_try, copyable_prompt }] },
  project_areas: { areas: [{ name, session_count, description }] }  // reserved for ⑤ Coverage (Phase 2)
}

// Both paths (from report analysis)
diagnostics: [{ description, snippet: { user_msg, ai_msg, session_ref }, protocol_cta, resume_cmd }]
patterns: [{ friction_narrative?, snippet?: { user_msg, ai_msg, session_ref }, protocol_cta, resume_cmd, statistical_evidence? }]
recommendations: [{ name, command, rationale, snippet_ref?, install_cmd?, installed: bool }]
quick_start: { protocol, scenario, resume_cmd, install_cmd? }
batch_install: { needed: bool, command }

// Path A only (dual-layer mapping)
growth_items: [{
  category,
  count,
  execution_layer: { suggestion, source },  // CLAUDE.md rule or config
  epistemic_layer: { protocol, command, rationale },  // protocol CTA
  evidence: { text, resume_cmd? }
}]
```

## HTML Boilerplate

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Growth Map</title>
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
  h3 { font-size: 1.1rem; margin-bottom: 0.5rem; }

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

  /* -- Growth Map: Section Cards -- */
  .profile-card { border-left: 4px solid #8b5cf6; }
  .success-card { border-left: 4px solid #10b981; }
  .horizon-card { border-left: 4px solid #f97316; }

  /* -- Growth Map: Dual-Layer Cards -- */
  .growth-item { margin: 1rem 0; }
  .growth-item h3 { color: #f8fafc; }
  .growth-item .count { color: #94a3b8; font-size: 0.9rem; }
  .layer {
    border-radius: 6px; padding: 1rem; margin: 0.5rem 0;
    font-size: 0.95rem;
  }
  .layer .tag {
    display: inline-block; padding: 0.15rem 0.5rem;
    border-radius: 3px; font-size: 0.75rem; font-weight: 600;
    margin-bottom: 0.5rem;
  }
  .layer.execution {
    background: #1a1a2e; border-left: 3px solid #60a5fa;
  }
  .layer.execution .tag {
    background: #1e3a5f; color: #93c5fd;
  }
  .layer.epistemic {
    background: #1a2e1a; border-left: 3px solid #22c55e;
  }
  .layer.epistemic .tag {
    background: #14532d; color: #86efac;
  }
  .evidence {
    background: #0f172a; border-radius: 4px;
    padding: 0.75rem 1rem; margin-top: 0.5rem;
    font-size: 0.85rem; color: #94a3b8; font-style: italic;
  }

  /* -- CTA Card (Path B placeholder) -- */
  .insights-cta {
    border: 1px dashed #475569; border-radius: 8px;
    padding: 1.5rem; margin: 1rem 0;
    background: #1e293b; text-align: center;
    color: #94a3b8;
  }
  .insights-cta .cta { margin-top: 0.75rem; }

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
  .protocol-cta::before { content: "\2192 "; color: #22c55e; font-weight: bold; }

  /* -- Friction Narrative -- */
  .friction-narrative { color: #fbbf24; font-style: italic; margin-bottom: 0.75rem; }

  /* -- Glance Grid -- */
  .glance-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0; }
  .glance-block { background: #0f172a; border-radius: 6px; padding: 1rem; }
  .glance-block h4 { font-size: 0.85rem; color: #94a3b8; margin-bottom: 0.5rem; }

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

  /* -- Narrative Text -- */
  .narrative { line-height: 1.7; margin: 0.75rem 0; }
  .key-pattern { color: #a5b4fc; font-weight: 500; margin-top: 0.5rem; }

  /* -- Footer -- */
  footer { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #334155; color: #64748b; font-size: 0.8rem; }

  /* -- Responsive -- */
  @media (max-width: 600px) {
    body { padding: 1rem; }
    .stats { gap: 1rem; }
    .stat-value { font-size: 1.5rem; }
    .glance-grid { grid-template-columns: 1fr; }
  }
</style>
</head>
<body>

<!-- ====================================================
     SECTION: Header + Stats
     Always rendered.
     ==================================================== -->
<h1>Your Growth Map</h1>
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
     SECTION ①: At a Glance
     PATH A: Four-quadrant summary from insights.at_a_glance
     PATH B: CTA card
     ==================================================== -->
<!-- PATH A -->
<h2>At a Glance</h2>
<div class="glance-grid">
  <div class="glance-block">
    <h4>What's Working</h4>
    <p>Your epistemic protocol system turns Claude into a structured reasoning partner...</p>
  </div>
  <div class="glance-block">
    <h4>What's Hindering</h4>
    <p>Claude frequently jumps to the wrong approach or misdiagnoses problems...</p>
  </div>
  <div class="glance-block">
    <h4>Quick Wins</h4>
    <p>Package your most common git + review + PR sequence into a custom skill...</p>
  </div>
  <div class="glance-block">
    <h4>Ambitious Workflows</h4>
    <p>Your review phases could run as truly parallel specialized agents...</p>
  </div>
</div>

<!-- PATH B (replace above with .insights-cta) -->
<!-- Sections ①②③⑦ use this same CTA card in Path B: -->
<div class="insights-cta">
  <p>Run <span class="cta">/insights</span> first for a richer Growth Map with behavioral analysis, success patterns, and growth opportunities.</p>
</div>

<!-- ====================================================
     SECTION ②: Profile
     PATH A: Interaction style narrative from insights
     PATH B: .insights-cta (see above)
     ==================================================== -->
<!-- PATH A -->
<h2>Profile</h2>
<div class="card profile-card">
  <div class="card-title">Interaction Style</div>
  <p class="narrative">You are a highly systematic, protocol-driven power user who has built an elaborate epistemic framework around Claude Code...</p>
  <p class="key-pattern">Key pattern: You operate Claude Code as a protocol-orchestrated development system.</p>
</div>

<!-- ====================================================
     SECTION ③: Success Patterns
     PATH A: Impressive workflows from insights.what_works
     PATH B: CTA card
     ==================================================== -->
<!-- PATH A -->
<h2>Success Patterns</h2>

<!-- CARD: Success (replicate per impressive_workflow) -->
<div class="card success-card">
  <div class="card-title">Structured Epistemic Protocol System</div>
  <p>You've developed a remarkable framework of named protocols that you invoke as structured thinking tools for verification, gap analysis, and comprehension...</p>
</div>

<!-- ====================================================
     SECTION ④: Growth Opportunities
     PATH A: Dual-layer cards from friction + suggestions
     PATH B: Existing anti-pattern cards (diagnostics + patterns)
     ==================================================== -->
<h2>Growth Opportunities</h2>

<!-- PATH A: CARD: Growth Item (replicate per growth_item) -->
<div class="card growth-item">
  <h3>Wrong Initial Approach <span class="count">(81 instances)</span></h3>
  <div class="layer execution">
    <span class="tag">Execution</span>
    <p>CLAUDE.md: "For debugging, code review, and analysis tasks, always state your approach in 2-3 sentences before executing."</p>
  </div>
  <div class="layer epistemic">
    <span class="tag">Epistemic</span>
    <p>Using <span class="cta">/goal</span> would co-construct a defined end state before implementation, preventing direction changes from undefined goals.</p>
  </div>
  <div class="evidence">
    "Claude misdiagnosed a root cause as a deferred tool loading issue until you corrected it"
  </div>
  <div class="resume-cmd">cd ~/myapp && claude --resume a1b2c3d4</div>
</div>

<!-- PATH B: CARD: Diagnostic (existing pattern, replicate per anti-pattern) -->
<div class="card diagnostic-card">
  <div class="card-title">Vague goal led to 3 direction changes</div>
  <p>Session started with "improve the auth flow" without specifying what improvement means.</p>
  <div class="snippet">
    <div class="user-msg">Please improve the auth flow</div>
    <div class="ai-msg">I'll improve the authentication flow. Let me first check the current structure...</div>
    <div class="session-ref">project: ~/myapp &middot; session: a1b2c3d4</div>
  </div>
  <div class="protocol-cta">Using <span class="cta">/goal</span> here would co-construct a defined end state before implementation.</div>
  <div class="resume-cmd">cd ~/myapp && claude --resume a1b2c3d4</div>
</div>

<!-- PATH B: CARD: Pattern (existing pattern, replicate per pattern) -->
<div class="card pattern-card">
  <div class="card-title">Repeated file edits without intent clarification</div>
  <div class="friction-narrative">"AI modified in the wrong direction, had to fix the same file multiple times"</div>
  <div class="snippet">
    <div class="user-msg">Please fix this component</div>
    <div class="ai-msg">I've updated the component. I improved both the styling and logic together.</div>
    <div class="session-ref">project: ~/webapp &middot; session: e5f6g7h8</div>
  </div>
  <div class="protocol-cta">Calling <span class="cta">/clarify</span> would help articulate which aspect to modify, preventing rework.</div>
  <div class="resume-cmd">cd ~/webapp && claude --resume e5f6g7h8</div>
</div>

<!-- ====================================================
     SECTION ⑥: Recommendations + Install
     Always rendered. One .recommendation-card per protocol.
     Include install command if not installed.
     ==================================================== -->
<h2>Recommendations</h2>

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

<!-- Batch Install: CONDITIONAL, only when 2+ not installed -->
<div class="batch-install">
  <h3>Install All Recommended</h3>
  <p>Install all recommended protocols at once:</p>
  <div class="install-cmd">bash <(curl -sL https://raw.githubusercontent.com/jongwony/epistemic-protocols/main/scripts/install.sh)</div>
  <p style="margin-top: 0.5rem; color: #94a3b8; font-size: 0.85rem;">Or clone the repo and run: <code>bash scripts/install.sh</code></p>
</div>

<!-- Quick Start: Always rendered in PATH B, optional supplement in PATH A -->
<div class="card recommendation-card">
  <div class="card-title">Try Hermeneia right now</div>
  <p>You edited <code>src/auth.ts</code> 5 times in recent sessions. Using <span class="cta">/clarify</span> to articulate intent first can reduce rework cycles.</p>
  <div class="resume-cmd">cd ~/webapp && claude --resume e5f6g7h8</div>
</div>

<!-- ====================================================
     SECTION ⑦: On the Horizon
     PATH A: Future opportunities from insights.on_the_horizon
     PATH B: CTA card
     ==================================================== -->
<!-- PATH A -->
<h2>On the Horizon</h2>

<!-- CARD: Horizon (replicate per opportunity) -->
<div class="card horizon-card">
  <div class="card-title">Autonomous PR Pipeline with Parallel Agents</div>
  <p>Your top activities — git operations (84), code review (53), and commit/PR (18) — are still sequential and human-gated. Claude Code can orchestrate a full pipeline using parallel sub-agents...</p>
  <div class="resume-cmd">claude -p "Implement changes autonomously..." --allowedTools "Bash,Read,Grep"</div>
</div>

<!-- ====================================================
     SECTION: Footer
     Always rendered.
     ==================================================== -->
<footer>Generated by /report (Growth Map) &middot; 2026-03-15T14:30:00+09:00</footer>

</body>
</html>
```

## Rendering Rules

### Path Selection

| `growth_map_path` | Rendering Mode | Sections |
|-------------------|----------------|----------|
| A | Growth Map | ①②③④⑥⑦ (all with insights data) |
| B | Epistemic Profile | ④⑥ (report data) + ①②③⑦ (CTA placeholders) |

### Section Conditions

| Section | Path A | Path B |
|---------|--------|--------|
| Header + Stats | Always | Always |
| ① At a Glance | `insights.at_a_glance` present | `.insights-cta` placeholder |
| ② Profile | `insights.interaction_style` present | `.insights-cta` placeholder |
| ③ Success Patterns | `insights.what_works` present | `.insights-cta` placeholder |
| ④ Growth Opportunities | `.growth-item` dual-layer cards | `.diagnostic-card` + `.pattern-card` (existing) |
| ⑥ Recommendations | Always | Always |
| Batch Install | `uninstalled_count >= 2` | `uninstalled_count >= 2` |
| Quick Start | Optional supplement | Always |
| ⑦ On the Horizon | `insights.on_the_horizon` present | `.insights-cta` placeholder |

### Card Type Reference

| Card Class | Color | Usage |
|------------|-------|-------|
| `.glance-grid` + `.glance-block` | — (grid layout) | ① At a Glance section |
| `.profile-card` | Purple (#8b5cf6) | ② Profile section |
| `.success-card` | Emerald (#10b981) | ③ Success Patterns |
| `.growth-item` | — (contains layers) | ④ Growth Opportunities (Path A) |
| `.diagnostic-card` | Amber (#f59e0b) | ④ Growth Opportunities (Path B, anti-patterns) |
| `.pattern-card` | Indigo (#6366f1) | ④ Growth Opportunities (Path B, patterns) |
| `.recommendation-card` | Green (#22c55e) | ⑥ Recommendations |
| `.horizon-card` | Orange (#f97316) | ⑦ On the Horizon |
| `.insights-cta` | Dashed border | Path B CTA placeholder |

### Dual-Layer Card Structure (Path A ④)

Each `.growth-item` contains:

| Element | Class | Content |
|---------|-------|---------|
| Title + count | `h3` + `.count` | Friction category name + instance count |
| Execution layer | `.layer.execution` + `.tag` | CLAUDE.md rule or config suggestion |
| Epistemic layer | `.layer.epistemic` + `.tag` | Protocol command CTA + rationale |
| Evidence | `.evidence` | Friction detail or session snippet |
| Resume | `.resume-cmd` | `cd {path} && claude --resume {id}` |

### Card Narrative Priority (Path B ④)

For `.pattern-card` and `.diagnostic-card`, use the first available narrative mode:

| Priority | Mode | Elements | When |
|----------|------|----------|------|
| 1 | Friction + Snippet | `.friction-narrative` + `.snippet` + `.protocol-cta` + `.resume-cmd` | Facets Path A with friction_detail |
| 2 | Snippet only | `.snippet` + `.protocol-cta` + `.resume-cmd` | Facets Path B or Path A without detail |
| 3 | Statistical evidence | `.stat-evidence` + `.protocol-cta` | No quality snippet available |

### Data Insertion Points

Replace example content with actual data at these locations:

| Element | Data source |
|---------|-------------|
| `.stat-value` | Phase 3 aggregation counts |
| `.glance-block p` | `insights.at_a_glance` fields |
| `.narrative` | `insights.interaction_style.narrative` |
| `.key-pattern` | `insights.interaction_style.key_pattern` |
| `.success-card p` | `insights.what_works.impressive_workflows[].description` |
| `.growth-item h3` | `growth_items[].category` + count |
| `.layer.execution p` | `growth_items[].execution_layer.suggestion` |
| `.layer.epistemic p` | `growth_items[].epistemic_layer.rationale` + command CTA |
| `.evidence` | `growth_items[].evidence.text` |
| `.horizon-card p` | `insights.on_the_horizon.opportunities[].whats_possible` |
| `.card-title` (pattern/diagnostic) | Pattern/diagnostic description from Phase 3 |
| `.friction-narrative` | `friction_detail` text from Phase 2 Facets Path A |
| `.snippet .user-msg` | User message from session context snippet |
| `.snippet .ai-msg` | AI response from session context snippet |
| `.snippet .session-ref` | `project: {path} &middot; session: {id}` |
| `.protocol-cta` | Protocol name + expected behavior description |
| `.resume-cmd` | `cd {project_path} && claude --resume {session_id}` |
| `.install-cmd` | `claude plugin install epistemic-protocols/{name}` |
| `footer` | `/report (Growth Map)` + ISO 8601 timestamp |

## Artifact Guidelines

- Self-contained: inline CSS, no external dependencies
- Dark theme with clear visual hierarchy
- Growth Map sections use distinct color coding per card type table above
- Dual-layer cards visually distinguish execution (blue) from epistemic (green) resolution
- Path B CTA cards use dashed borders to indicate "available with /insights"
- All command blocks use `user-select: all` for copy convenience
- Responsive for different viewport sizes
- Session IDs as copyable `cd ~/project-path && claude --resume <id>` commands
- Include `claude plugin install epistemic-protocols/<name>` for uninstalled protocols
- Timestamp in footer with ISO 8601 format
