# HTML Template Reference

HTML skeleton and guidelines for the `dashboard.html` artifact generated in Phase 4.

## HTML Skeleton

```html
<!-- Minimal structure reference -->
<html lang="en">
<head><meta charset="utf-8"><title>Epistemic Coverage Dashboard</title>
<style>
  :root {
    --bg-primary: #0f172a; --bg-card: #1e293b; --bg-deep: #020617;
    --border: #334155; --text: #e2e8f0; --text-muted: #9ca3af; --text-dim: #64748b;
    --accent-indigo: #6366f1; --accent-green: #22c55e; --accent-amber: #f59e0b;
    --accent-cyan: #06b6d4; --accent-rose: #f43f5e; --accent-purple: #a855f7;
  }
  body { font-family: system-ui, sans-serif; max-width: 900px; margin: 0 auto; padding: 2rem; background: var(--bg-primary); color: var(--text); }
  h1 { text-align: center; margin-bottom: 0.5rem; }
  h2 { border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; margin-top: 2.5rem; }
  .subtitle { text-align: center; color: var(--text-muted); margin-bottom: 2rem; }

  /* Cards */
  .card { border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin: 1rem 0; background: var(--bg-card); }

  /* Section 1: Coverage */
  .coverage-section { margin: 1.5rem 0; }
  .coverage-radar { text-align: center; margin: 1.5rem 0; }
  .coverage-bars { margin: 1rem 0; }
  .coverage-bar { display: flex; align-items: center; gap: 0.75rem; margin: 0.5rem 0; }
  .coverage-bar-label { width: 110px; text-align: right; font-size: 0.9rem; }
  .coverage-bar-track { flex: 1; height: 10px; background: var(--border); border-radius: 5px; }
  .coverage-bar-fill { height: 100%; border-radius: 5px; transition: width 0.3s; }
  .coverage-bar-value { width: 80px; font-size: 0.85rem; color: var(--text-muted); }
  .na-protocol { color: var(--text-dim); font-style: italic; }

  /* Section 2: Protocol Usage */
  .usage-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin: 1rem 0; }
  .usage-badge { background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px; padding: 1rem; text-align: center; }
  .usage-badge .count { font-size: 1.5rem; font-weight: bold; color: var(--accent-indigo); }
  .usage-badge .command { font-family: monospace; color: var(--accent-cyan); margin-top: 0.25rem; }
  .usage-badge .first-use { font-size: 0.75rem; color: var(--text-dim); margin-top: 0.25rem; }
  .bar-chart { margin: 1rem 0; }
  .bar-row { display: flex; align-items: center; gap: 0.5rem; margin: 0.3rem 0; }
  .bar-label { width: 80px; text-align: right; font-family: monospace; font-size: 0.85rem; color: var(--accent-cyan); }
  .bar-track { flex: 1; height: 20px; background: var(--border); border-radius: 4px; }
  .bar-fill { height: 100%; border-radius: 4px; background: var(--accent-indigo); }
  .bar-value { width: 40px; font-size: 0.85rem; color: var(--text-muted); }

  /* Section 3: Friction Mapping */
  .friction-table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
  .friction-table th, .friction-table td { padding: 0.75rem; text-align: left; border-bottom: 1px solid var(--border); }
  .friction-table th { color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase; }
  .friction-key { font-family: monospace; color: var(--accent-amber); }
  .friction-protocol { color: var(--accent-green); }
  .friction-env { color: var(--text-dim); font-style: italic; }

  /* Section 4: Improvement Opportunities */
  .opportunity-card { border-left: 4px solid var(--accent-amber); }
  .opportunity-card .priority { font-size: 0.75rem; text-transform: uppercase; color: var(--accent-amber); letter-spacing: 0.05em; }
  .opportunity-card .gap-desc { margin: 0.5rem 0; }
  .opportunity-card .action { color: var(--accent-green); }
  .cta { display: inline-block; background: var(--accent-indigo); color: white; padding: 0.5rem 1rem; border-radius: 4px; text-decoration: none; font-family: monospace; }
  .cta:hover { background: #4f46e5; }

  /* Section 5: Growth Timeline */
  .timeline-chart { text-align: center; margin: 1.5rem 0; }
  .adoption-list { list-style: none; padding: 0; }
  .adoption-list li { padding: 0.5rem 0; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; }
  .adoption-date { color: var(--text-muted); font-size: 0.85rem; }

  /* Section 6: Achievements */
  .badge-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; margin: 1rem 0; }
  .badge { background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px; padding: 1rem; text-align: center; }
  .badge.unlocked { border-color: var(--accent-green); }
  .badge.locked { opacity: 0.4; }
  .badge .icon { font-size: 1.5rem; margin-bottom: 0.25rem; }
  .badge .title { font-size: 0.85rem; font-weight: bold; }
  .badge .desc { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem; }

  /* Section 7: Satisfaction */
  .gauge-container { text-align: center; margin: 1.5rem 0; }
  .score-display { font-size: 3rem; font-weight: bold; color: var(--accent-green); }
  .trend-indicator { font-size: 0.9rem; color: var(--text-muted); margin-top: 0.5rem; }
  .distribution-bar { display: flex; height: 24px; border-radius: 4px; overflow: hidden; margin: 1rem 0; }
  .distribution-bar > div { transition: width 0.3s; }

  /* Section 8: Quality Score */
  .quality-score { text-align: center; margin: 1.5rem 0; }
  .quality-score .score { font-size: 4rem; font-weight: bold; }
  .quality-score .label { color: var(--text-muted); }
  .component-bars { margin: 1rem 0; }
  .component-bar { display: flex; align-items: center; gap: 0.75rem; margin: 0.5rem 0; }
  .component-label { width: 120px; text-align: right; font-size: 0.85rem; }
  .component-weight { width: 40px; font-size: 0.75rem; color: var(--text-dim); }
  .component-track { flex: 1; height: 8px; background: var(--border); border-radius: 4px; }
  .component-fill { height: 100%; border-radius: 4px; }

  /* Section 9: Gate Efficiency */
  .gate-efficiency-table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
  .gate-efficiency-table th, .gate-efficiency-table td { padding: 0.5rem; border-bottom: 1px solid var(--border); text-align: right; }
  .gate-efficiency-table th:first-child, .gate-efficiency-table td:first-child { text-align: left; }

  /* Section 10: Relay Erosion */
  .erosion-summary { margin: 1rem 0; }
  .erosion-event { display: flex; align-items: center; gap: 0.5rem; margin: 0.5rem 0; padding: 0.5rem; border-radius: 4px; background: var(--bg-deep); }
  .erosion-label { font-size: 0.85rem; color: var(--text-muted); }
  .erosion-badge-stable { color: var(--accent-green); }
  .erosion-badge-eroded { color: var(--accent-amber); }
  .erosion-badge-stabilized { color: var(--accent-cyan); }

  /* Section 11: Quick Actions */
  .action-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem; margin: 1rem 0; }
  .action-card { border-left: 4px solid var(--accent-green); }
  .action-card .action-title { font-weight: bold; margin-bottom: 0.5rem; }
  .action-card .action-desc { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 0.75rem; }
  .resume-cmd { font-family: monospace; background: var(--bg-deep); color: var(--text); padding: 0.5rem 1rem; border-radius: 4px; display: inline-block; margin-top: 0.5rem; user-select: all; font-size: 0.85rem; }

  /* Degradation notice */
  .degraded-notice { background: #1a1a2e; border: 1px dashed var(--border); border-radius: 8px; padding: 1rem; text-align: center; color: var(--text-muted); margin: 1rem 0; }
  .degraded-notice .hint { color: var(--accent-cyan); font-size: 0.85rem; margin-top: 0.5rem; }

  /* Stats row */
  .stats { display: flex; gap: 2rem; margin: 1.5rem 0; flex-wrap: wrap; justify-content: center; }
  .stat { text-align: center; min-width: 100px; }
  .stat-value { font-size: 2rem; font-weight: bold; color: var(--accent-indigo); }
  .stat-label { font-size: 0.8rem; color: var(--text-muted); }

  footer { text-align: center; color: var(--text-dim); margin-top: 3rem; padding-top: 1rem; border-top: 1px solid var(--border); font-size: 0.85rem; }
</style>
</head>
<body>
  <h1>Epistemic Coverage Dashboard</h1>
  <p class="subtitle">Comprehensive usage analytics across all sessions</p>
  <div class="stats">
    <!-- stat: total sessions, protocols used, quality score, streak -->
  </div>

  <h2>1. Epistemic Coverage</h2>
  <div class="coverage-section">
    <!-- .coverage-radar: inline SVG radar chart
      - One axis per protocol with detected situations
      - Filled area = usage ratio (situations used / situations occurred)
      - Protocols with no situations = excluded from radar, listed as N/A with .na-protocol
      - Minimum 3 axes required; if fewer, use bar chart only
      Graceful degradation: Path B limited data → show available bars, note data limitations
    -->
    <!-- .coverage-bars: progress bar per protocol
      - Label: protocol name (/command)
      - Bar fill: situation_used / situation_occurred ratio
      - Value: "N/M situations" or "N/A"
    -->
  </div>

  <h2>2. Protocol Usage</h2>
  <!-- .usage-grid: badge per protocol with invocation count
    .bar-chart: horizontal bars showing relative usage
  -->

  <h2>3. Friction → Protocol Mapping</h2>
  <!-- .friction-table: friction keys → protocol groups
    - Primary friction keys with protocol mapping (green)
    - Environmental friction keys (dim, no mapping)
    Path B degradation: .degraded-notice with hint to run more sessions
  -->

  <h2>4. Improvement Opportunities</h2>
  <!-- .opportunity-card (max 5): coverage gaps × friction frequency
    - Priority based on: high friction + low coverage = highest priority
    - Each card: gap description, friction evidence, protocol CTA
  -->

  <h2>5. Growth Timeline</h2>
  <!-- .timeline-chart: inline SVG area chart
    - X axis: weeks
    - Y axis: session count
    - Overlay: protocol adoption markers
    .adoption-list: protocol first-use dates
  -->

  <h2>6. Achievements</h2>
  <!-- .badge-grid: milestone badges
    - .badge.unlocked: achieved milestones (green border)
    - .badge.locked: upcoming milestones (dimmed)
    Categories: Session, Protocol, Code, Streak
  -->

  <h2>7. Satisfaction Trends</h2>
  <!-- .gauge-container: weighted satisfaction score (0-100)
    .distribution-bar: satisfaction rating distribution
    .trend-indicator: first-half vs second-half comparison
    Path B degradation: .degraded-notice
  -->

  <h2>8. Quality Score</h2>
  <!-- .quality-score: composite score display
    .component-bars: 4 component breakdowns
      - Outcome (35%): success ratio
      - Friction rate (20%): inverse friction per session
      - Satisfaction (25%): weighted score
      - Coverage (20%): average coverage ratio
    Path B degradation: .degraded-notice (only Outcome + Coverage available)
  -->

  <h2>9. Gate Efficiency</h2>
  <!-- .gate-efficiency-table: per-protocol gate interaction ratio
    Columns: Protocol | Avg Gate Efficiency | Relay Gates | Gated Gates | Total Sessions
    Gate efficiency = gated_interactions / total_gates (1.0 = all user-facing)
  -->

  <h2>10. Relay Erosion</h2>
  <!-- .erosion-summary: relay stability tracking for protocols with 3+ sessions
    .erosion-event items with .erosion-badge-{stable|eroded|stabilized}
    - Stable: gate consistently auto-resolved across sessions
    - Eroded: gate was relay, became gated in later sessions
    - Stabilized: gate was gated, became relay with experience
    If < 3 sessions: .degraded-notice "Insufficient data for erosion tracking"
  -->

  <h2>11. Quick Actions</h2>
  <!-- .action-grid: top 3 CTAs based on analysis
    Each .action-card:
    - Action title (e.g., "Start using /clarify")
    - Action description with evidence
    - .resume-cmd for immediate action
  -->

  <footer>Generated by /dashboard · {timestamp}</footer>
</body>
</html>
```

## Artifact Guidelines

The HTML artifact should:
- Be self-contained (inline CSS, inline SVG for charts, no external dependencies)
- Use a dark theme with CSS custom properties for consistent theming
- Support 11 distinct sections with clear visual hierarchy
- **Section 1 (Coverage)**: Radar chart (inline SVG) + progress bars. Minimum 3 protocols for radar; otherwise bars only
- **Section 2 (Protocol Usage)**: Badge grid + horizontal bar chart for relative comparison
- **Section 3 (Friction Mapping)**: Table with friction keys color-coded by type (Primary=amber, Environmental=dim)
- **Section 4 (Opportunities)**: Priority cards (max 5) sorted by impact (high friction × low coverage)
- **Section 5 (Growth)**: SVG area chart with weekly binning + protocol adoption date markers
- **Section 6 (Achievements)**: Badge grid with locked/unlocked states
- **Section 7 (Satisfaction)**: Score gauge + distribution bar + trend indicator
- **Section 8 (Quality Score)**: Large score display + 4 component breakdown bars with weights
- **Section 9 (Gate Efficiency)**: Table with per-protocol gate efficiency ratio + relay/gated counts
- **Section 10 (Relay Erosion)**: Erosion/stabilization events with color-coded badges (green=stable, amber=eroded, cyan=stabilized)
- **Section 11 (Quick Actions)**: Top 3 actionable CTAs with resume commands
- Path B degradation: Sections 3, 7, 8 show `.degraded-notice` with hint text "Facets data enables richer analysis"
- Use `user-select: all` on command blocks for copy convenience
- Be responsive for different viewport sizes
- Include timestamp and "generated by /dashboard" footer

Adapt section content and styling to match the analysis results.
