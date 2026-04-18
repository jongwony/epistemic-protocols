# Report Generation Guide

CSS and HTML component reference for the Introspect report.
Read this when generating the HTML report in Phase 4.

## Design Tokens

```css
/* Typography */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif
h1: 32px/700, color #0f172a
h2: 20px/600, color #0f172a
body: 14px/400, color #334155, line-height 1.65
label: 11px/600, uppercase, color #64748b

/* Colors */
background: #f8fafc
card-bg: white
card-border: #e2e8f0
text-primary: #0f172a
text-secondary: #475569
text-muted: #64748b

/* Semantic colors */
strength: bg #f0fdf4, border #86efac, text #166534
cost-structural: bg #fce7f3, text #9d174d
cost-conditional: bg #fef3c7, text #92400e
cost-recurring: bg #fee2e2, text #991b1b
highlight: bg gradient(135deg, #fef3c7, #fde68a), border #f59e0b
horizon: bg gradient(135deg, #faf5ff, #f5f3ff), border #c4b5fd
attitude-primary: bg gradient(135deg, #faf5ff, #f5f3ff), border #c4b5fd
attitude-default: bg gradient(135deg, #eff6ff, #f0f9ff), border #93c5fd
insight: bg #f0fdf4, border #bbf7d0, text #166534
health-green: #22c55e
health-yellow: #eab308
health-red: #ef4444

/* Layout */
container: max-width 800px, margin 0 auto
card: border-radius 8px, padding 16px
grid-2col: grid-template-columns 1fr 1fr, gap 16px
```

## Component Patterns

### At a Glance (top summary)
```html
<div class="at-a-glance">
  <div class="glance-title">At a Glance</div>
  <div class="glance-sections">
    <div class="glance-section"><strong>Label:</strong> Text <a href="#id" class="see-more">Link →</a></div>
  </div>
</div>
```

### Philosophy Card (2x2 grid)
```html
<div class="philosophy-grid"> <!-- grid-template-columns: 1fr 1fr -->
  <div class="philosophy-card [type]"> <!-- type: popper, extended, zen, bridge -->
    <div class="philosophy-dim">DIMENSION LABEL</div>
    <div class="philosophy-name">Framework Name</div>
    <div class="philosophy-desc">Description text</div>
    <div class="philosophy-role"><span>Mapping:</span> Correspondence</div>
  </div>
</div>
```
Each card has a colored 3px top border via `::before`.

### Strength Card
```html
<div class="strength-card">
  <div class="strength-title">Title <span class="strength-tag">DIMENSION</span></div>
  <div class="strength-desc">Description</div>
  <div class="strength-evidence">Evidence: specific data</div>
</div>
```

### Cost Card
```html
<div class="cost-card">
  <div class="cost-header">
    <div class="cost-title">Title</div>
    <span class="cost-severity [level]">LEVEL</span> <!-- structural|conditional|recurring -->
  </div>
  <div class="cost-source">Source: strength shadow origin</div>
  <div class="cost-desc">Description</div>
  <div class="cost-mitigation">
    <div class="cost-mitigation-label">MITIGATION</div>
    <div class="cost-mitigation-text">Strategy text</div>
  </div>
</div>
```

### Attitude Card
```html
<div class="attitude-card [primary]"> <!-- add .primary for highest ROI -->
  <div class="attitude-number">Principle N</div>
  <div class="attitude-title">Title</div>
  <div class="attitude-principle">Explanation</div>
  <div class="attitude-application">
    <div class="attitude-app-label">APPLICATION</div>
    <div class="attitude-app-text">How to apply</div>
  </div>
</div>
```

### Practice Matrix
```html
<table class="practice-table">
  <thead><tr><th>Situation</th><th>Principle</th><th>Action</th></tr></thead>
  <tbody>
    <tr>
      <td>When X</td>
      <td>Principle N</td>
      <td>Do Y<div class="practice-when">trigger: condition</div></td>
    </tr>
  </tbody>
</table>
```

### Health Indicator
```html
<div class="health-card">
  <div class="health-title">CATEGORY</div>
  <div class="health-metric">
    <div class="health-dot [green|yellow|red]"></div>
    <div class="health-label">Metric name</div>
    <div class="health-status">Status text</div>
  </div>
</div>
```

### Horizon Card
```html
<div class="horizon-card">
  <div class="horizon-title">Title</div>
  <div class="horizon-possible">Description</div>
  <div class="horizon-tip"><strong>Tip:</strong> Actionable advice</div>
</div>
```

### Division Diagram
```html
<div class="division-diagram">
  <div class="division-row">
    <div class="division-actor"><div class="division-label">ACTOR</div></div>
    <div class="division-bar">
      <div class="division-segment" style="flex: N; background: COLOR;">Label</div>
    </div>
  </div>
  <div class="division-arrow">&darr; Bridge &darr;</div>
  <!-- second row -->
</div>
```

### Fun Ending
```html
<div class="fun-ending">
  <div class="fun-headline">"Quote or insight"</div>
  <div class="fun-detail">Explanation</div>
</div>
```

## Google Fonts

Always include in `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## Responsive

Add at end of CSS:
```css
@media (max-width: 640px) {
  .philosophy-grid, .health-grid { grid-template-columns: 1fr; }
}
```
