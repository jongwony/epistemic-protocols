# Curses Report Template

CSS and HTML component reference for the Curses report.
Read this when generating the HTML report in Phase 4.

## Design System

Uses the cooperative's dark theme convention with CSS custom properties.
No external font dependencies (system-ui only, self-contained).

```css
:root {
  /* Base */
  --bg-primary: #0f172a;
  --bg-card: #1e293b;
  --bg-deep: #020617;
  --border: #334155;
  --text: #e2e8f0;
  --text-muted: #9ca3af;
  --text-dim: #64748b;

  /* Accents */
  --accent-indigo: #6366f1;
  --accent-green: #22c55e;
  --accent-amber: #f59e0b;
  --accent-rose: #f43f5e;
  --accent-purple: #a855f7;
  --accent-cyan: #06b6d4;

  /* Semantic */
  --strength-bg: #052e16;
  --strength-border: #166534;
  --strength-text: #86efac;
  --cost-bg: #1c1917;
  --cost-border: #78350f;
  --cost-text: #fbbf24;
  --cost-structural: #f43f5e;
  --cost-conditional: #f59e0b;
  --cost-recurring: #ef4444;
  --highlight-bg: #422006;
  --highlight-border: #f59e0b;
  --horizon-bg: #2e1065;
  --horizon-border: #7c3aed;
  --attitude-bg: #1e1b4b;
  --attitude-border: #6366f1;
  --health-green: #22c55e;
  --health-yellow: #eab308;
  --health-red: #ef4444;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--bg-primary);
  color: var(--text);
  line-height: 1.65;
}

h1 { font-size: 2rem; font-weight: 700; text-align: center; margin-bottom: 0.5rem; }
h2 { font-size: 1.25rem; font-weight: 600; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; margin-top: 2.5rem; }
.subtitle { text-align: center; color: var(--text-muted); margin-bottom: 2rem; }
.card { border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin: 1rem 0; background: var(--bg-card); }
```

## Component Patterns

### At a Glance
```html
<div class="card" style="background: var(--highlight-bg); border-color: var(--highlight-border);">
  <h3 style="color: var(--accent-amber); margin-bottom: 1rem;">At a Glance</h3>
  <div style="display: flex; flex-direction: column; gap: 0.75rem;">
    <p><strong>Label:</strong> Text <a href="#id" style="color: var(--accent-amber);">Details &rarr;</a></p>
  </div>
</div>
```

### Dimension Bar
```html
<div style="display: flex; align-items: center; gap: 0.75rem; margin: 0.5rem 0;">
  <div style="width: 130px; text-align: right; font-size: 0.9rem;">D1 Inquiry</div>
  <div style="flex: 1; height: 10px; background: var(--border); border-radius: 5px;">
    <div style="width: 78%; height: 100%; border-radius: 5px; background: var(--accent-indigo);"></div>
  </div>
  <div style="width: 30px; font-size: 0.85rem; color: var(--text-muted);">78</div>
  <div style="width: 80px; font-size: 0.8rem; color: var(--text-dim);">abductive</div>
</div>
```

### Strength Card
```html
<div class="card" style="border-color: var(--strength-border); background: var(--strength-bg);">
  <div style="font-weight: 600; color: var(--strength-text); margin-bottom: 0.5rem;">
    Title <span style="font-size: 0.7rem; background: var(--strength-border); padding: 2px 8px; border-radius: 4px; text-transform: uppercase;">DIMENSION</span>
  </div>
  <div style="color: var(--text); font-size: 0.9rem;">Description</div>
  <div style="color: var(--text-dim); font-size: 0.8rem; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid var(--strength-border);">Evidence: data</div>
</div>
```

### Cost Card
```html
<div class="card">
  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
    <div style="font-weight: 600;">Title</div>
    <span style="font-size: 0.7rem; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; background: #7f1d1d; color: #fca5a5;">STRUCTURAL</span>
  </div>
  <div style="color: var(--text-dim); font-size: 0.85rem; margin-bottom: 0.5rem;">Source: strength origin</div>
  <div style="font-size: 0.9rem; margin-bottom: 0.75rem;">Description</div>
  <div style="background: var(--strength-bg); border: 1px solid var(--strength-border); border-radius: 6px; padding: 0.75rem;">
    <div style="font-size: 0.7rem; font-weight: 600; text-transform: uppercase; color: var(--strength-text); margin-bottom: 0.25rem;">MITIGATION</div>
    <div style="font-size: 0.85rem; color: var(--strength-text);">Strategy</div>
  </div>
</div>
```

Severity badge colors: structural (#7f1d1d bg), conditional (#78350f bg), recurring (#7f1d1d bg, --accent-rose text)

### Attitude Card
```html
<div class="card" style="background: var(--attitude-bg); border-color: var(--attitude-border);">
  <div style="font-size: 0.7rem; font-weight: 700; color: var(--accent-purple); margin-bottom: 0.25rem;">Principle N - Highest ROI</div>
  <div style="font-weight: 600; font-size: 1.1rem; margin-bottom: 0.5rem;">Title</div>
  <div style="font-size: 0.9rem; margin-bottom: 0.75rem;">Explanation</div>
  <div style="background: rgba(255,255,255,0.05); border-radius: 6px; padding: 0.75rem;">
    <div style="font-size: 0.7rem; font-weight: 600; text-transform: uppercase; color: var(--text-dim); margin-bottom: 0.25rem;">APPLICATION</div>
    <div style="font-size: 0.85rem;">How to apply</div>
  </div>
</div>
```

### Practice Matrix
```html
<table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
  <thead>
    <tr style="border-bottom: 1px solid var(--border);">
      <th style="padding: 0.75rem; text-align: left; font-size: 0.8rem; text-transform: uppercase; color: var(--text-dim);">Situation</th>
      <th style="padding: 0.75rem; text-align: left; font-size: 0.8rem; text-transform: uppercase; color: var(--text-dim);">Principle</th>
      <th style="padding: 0.75rem; text-align: left; font-size: 0.8rem; text-transform: uppercase; color: var(--text-dim);">Action</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid rgba(51,65,85,0.5);">
      <td style="padding: 0.75rem; font-size: 0.9rem;">When X</td>
      <td style="padding: 0.75rem; font-size: 0.9rem;">Principle N</td>
      <td style="padding: 0.75rem; font-size: 0.9rem;">Do Y<div style="font-size: 0.75rem; color: var(--text-dim); margin-top: 0.25rem;">trigger: condition</div></td>
    </tr>
  </tbody>
</table>
```

### Health Indicator
```html
<div class="card" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
  <div>
    <div style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: var(--text-dim); margin-bottom: 0.75rem;">CATEGORY</div>
    <div style="display: flex; align-items: center; gap: 0.5rem; margin: 0.4rem 0;">
      <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--health-green);"></div>
      <div style="font-size: 0.85rem; flex: 1;">Metric name</div>
      <div style="font-size: 0.8rem; color: var(--text-dim);">Status</div>
    </div>
  </div>
</div>
```

### Horizon Card
```html
<div class="card" style="background: var(--horizon-bg); border-color: var(--horizon-border);">
  <div style="font-weight: 600; color: var(--accent-purple); margin-bottom: 0.5rem;">Title</div>
  <div style="font-size: 0.9rem; margin-bottom: 0.75rem;">Description</div>
  <div style="font-size: 0.85rem; color: var(--accent-purple); background: rgba(255,255,255,0.05); padding: 0.5rem 0.75rem; border-radius: 4px;"><strong>Tip:</strong> Advice</div>
</div>
```

### Fun Ending
```html
<div class="card" style="background: var(--highlight-bg); border-color: var(--highlight-border); text-align: center;">
  <div style="font-size: 1.1rem; font-weight: 600; color: var(--accent-amber); margin-bottom: 0.5rem;">"Quote"</div>
  <div style="font-size: 0.9rem; color: var(--text-muted);">Explanation</div>
</div>
```

## Responsive
```css
@media (max-width: 640px) {
  .card[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
}
```
