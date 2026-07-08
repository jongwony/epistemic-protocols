#!/usr/bin/env node
/**
 * SessionStart hook emitter for the agent-facing routing map.
 *
 * Injects the deficit-framed routing directive (routing-map.md) into the
 * session as `additionalContext`, so any consuming project can plug it in: a
 * passive skill `description:` under-triggers invocation, whereas this active
 * directive routes from the deficit. Distinct from the human `/catalog` skill,
 * which stays a browse-view reference.
 *
 * routing-map.md is generated (see scripts/generate-routing-map.js in the repo);
 * this emitter never regenerates — it only reads and optionally filters the
 * committed artifact, so it is self-contained in the packaged skill.
 *
 * Usage (SessionStart hook, type "command"):
 *   node <plugin>/skills/catalog/scripts/session-context.js
 *   node .../session-context.js --only=/grasp,/gap
 *   node .../session-context.js --cluster=Analysis,Decision
 *
 * Filters (inject only the parts a project needs; the preamble directive is
 * always kept). With no filter, the full map is emitted. When both filters are
 * given, an entry is kept if it matches EITHER (union).
 *
 * Output (stdout, exactly):
 *   {"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":<map text>}}
 *
 * Zero external dependencies: Node.js standard library only.
 */

const fs = require('fs');
const path = require('path');

// routing-map.md sits one level up from this scripts/ dir — in both the repo
// layout and the packaged skill layout (catalog/routing-map.md).
const ROUTING_MAP_PATH = path.join(__dirname, '..', 'routing-map.md');

/** Parse a comma-separated CLI filter value (e.g. --only=/grasp,/gap). */
function parseListArg(args, name) {
  const prefix = `--${name}=`;
  const arg = args.find(a => a.startsWith(prefix));
  if (!arg) return [];
  return arg.slice(prefix.length).split(',').map(s => s.trim()).filter(Boolean);
}

/**
 * Split the map into a verbatim preamble (everything before the first `##`
 * cluster heading) and per-cluster entry lists.
 *
 * @returns {{ preamble: string, clusters: Array<{ name, entries }> }}
 *   entries: { cmd: '/x', head: string, when: string }
 */
function parseRoutingMap(text) {
  const lines = text.split('\n');
  const clusterHeadingRe = /^##\s+(.+?)\s*$/;
  const entryHeadRe = /^\*\*`(\/[a-z]+)`\*\*/;
  const whenRe = /^\s+when:/;

  // Preamble = up to the first cluster heading.
  let firstCluster = lines.findIndex(l => clusterHeadingRe.test(l));
  if (firstCluster === -1) firstCluster = lines.length;
  const preamble = lines.slice(0, firstCluster).join('\n').replace(/\n+$/, '');

  const clusters = [];
  let cur = null;      // current cluster
  let curEntry = null; // current entry
  for (let i = firstCluster; i < lines.length; i++) {
    const line = lines[i];
    const h = line.match(clusterHeadingRe);
    if (h) {
      cur = { name: h[1], entries: [] };
      clusters.push(cur);
      curEntry = null;
      continue;
    }
    const e = line.match(entryHeadRe);
    if (e && cur) {
      curEntry = { cmd: e[1], head: line, when: null };
      cur.entries.push(curEntry);
      continue;
    }
    if (curEntry && whenRe.test(line) && curEntry.when === null) {
      curEntry.when = line;
    }
  }

  return { preamble, clusters };
}

/** Reconstruct map text from the preamble + selected clusters/entries. */
function renderFiltered(preamble, clusters, keep) {
  let out = preamble + '\n';
  for (const cluster of clusters) {
    const kept = cluster.entries.filter(e => keep(e, cluster));
    if (kept.length === 0) continue;
    out += `\n## ${cluster.name}\n`;
    for (const e of kept) {
      out += `\n${e.head}\n`;
      if (e.when !== null) out += `${e.when}\n`;
    }
  }
  return out;
}

function buildContext(text, { only = [], cluster = [] } = {}) {
  const onlySet = new Set(only);
  const clusterSet = new Set(cluster.map(c => c.toLowerCase()));
  if (onlySet.size === 0 && clusterSet.size === 0) return text; // full map

  const { preamble, clusters } = parseRoutingMap(text);
  const keep = (entry, clusterObj) =>
    onlySet.has(entry.cmd) || clusterSet.has(clusterObj.name.toLowerCase());
  return renderFiltered(preamble, clusters, keep);
}

function main() {
  const args = process.argv.slice(2);
  let text;
  try {
    text = fs.readFileSync(ROUTING_MAP_PATH, 'utf8');
  } catch (e) {
    process.stderr.write(`[session-context] cannot read routing map at ${ROUTING_MAP_PATH}: ${e.message}\n`);
    process.exit(1);
  }

  const additionalContext = buildContext(text, {
    only: parseListArg(args, 'only'),
    cluster: parseListArg(args, 'cluster'),
  });

  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext,
    },
  }));
}

module.exports = { parseListArg, parseRoutingMap, renderFiltered, buildContext };

if (require.main === module) {
  main();
}
