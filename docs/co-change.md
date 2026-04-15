# Co-Change Patterns

Protocol modifications require synchronized edits across multiple files. Any protocol change requires `plugin.json` version bump + `/verify`.

| Change | Files to update |
|--------|----------------|
| New/modified phase | SKILL.md (formal block + prose) |
| New tool usage | SKILL.md (PHASE TRANSITIONS `[Tool]` + TOOL GROUNDING entry) |
| New loop option | SKILL.md (LOOP + terminal phase prose + Rules) |
| Delegation change | SKILL.md (isolation section), CLAUDE.md (delegation constraint) |
| Any protocol change | `plugin.json` version bump, then `/verify` |
| New plugin added | `marketplace.json` (plugins array), plugin directory with `plugin.json` |
| New skill added to existing plugin | `SKILL.md`, `plugin.json` (version + description), `marketplace.json` description, `package.js` (PLUGINS + FIRST_RELEASE_HIGHLIGHTS), CLAUDE.md (architecture, plugin section, delegation, static checks if applicable) |
| New protocol added | All of the above, plus: CLAUDE.md (overview, architecture, plugins, precedence, workflow, delegation), `static-checks.js` (`PROTOCOL_FILES`, `PRECEDENCE_FILES`, `CANONICAL_PRECEDENCE`, `CANONICAL_CLUSTERS`, `CANONICAL_PROTOCOLS` in `checkCrossRefScan`), ALL existing SKILL.md (precedence descriptions + distinction tables), onboard (`SKILL.md` Data Sources + `references/scenarios.md` + `references/workflow.md`), catalog SKILL.md, README.md + README_ko.md |
| Precedence change | CLAUDE.md (precedence section + concern cluster table), ALL SKILL.md precedence descriptions, `graph.json` |
| Initiator taxonomy change | CLAUDE.md (initiator taxonomy), ALL SKILL.md (distinction tables + Rule #1), READMEs, `review-checklists.md` |
| Protocol nudge pattern change | Output Style nudge section, plugin.json version bumps |
| Convergence-awareness nudge wording | epistemic-ink.md (Protocol Nudge), `.claude/rules/architectural-principles.md` (Dual Advisory Layer), `.claude/rules/derived-principles.md` (Full Taxonomy) |
| Gate interaction pattern change | ALL SKILL.md Rules + PHASE TRANSITIONS + TOOL GROUNDING + phase prose + plugin.json version bumps |
| Relay interaction pattern change | SKILL.md TOOL GROUNDING + `.claude/rules/derived-principles.md` (Convergence Evidence) + criteria.md + static-checks.js + plugin.json version bumps |
| SKILL.md frontmatter description change (type signature 포함) | `scripts/package.js` DESCRIPTION_OVERRIDES (morphism notation 동기화) |
| Hypomnesis store write pipeline change (mjs harness) | `anamnesis/hooks/hooks.json` (SessionEnd hook registration), `anamnesis/scripts/hypomnesis-write.mjs` (mjs harness implementation), `anamnesis/skills/recollect/SKILL.md` Scan section (read-side pattern), `anamnesis/.claude-plugin/plugin.json` version bump |
| Axiom change (A1-A7 definition or summary) | `.claude/rules/axioms.md` (source of truth) → `CLAUDE.md` (reference) |
| Mission/vision wording change | `CLAUDE.md` (maintainer umbrella), `docs/mission-bridge.md` (audience boundary + derivation rule), `README.md` + `README_ko.md` (public framing), `src/lib/i18n.tsx` (hero badge/subtitle — EN+KO must match when protocol scope changes), `src/App.tsx` (`protocols` array length — must match badge integer); verify runtime users still rely on `SKILL.md` + plugin descriptions rather than mission docs |
| Editing/Git convention change | `.claude/rules/editing-conventions.md` (primary) → `CLAUDE.md` (reference) |
