#!/usr/bin/env node
/**
 * Static checks for epistemic protocol consistency
 * Zero-context execution: outputs JSON, consumes no context window
 *
 * Usage: node static-checks.js [project-root]
 * Output: JSON { pass: [], fail: [], warn: [] }
 *
 * The orchestrator: it builds one run context and runs every layer's checks
 * against it. The checks live in their layer files —
 *   lean-bridge.js         the Definition block handed to Lean (lean-definition)
 *   contract-structure.js  provisional text checks on contract structure
 *   artifact-sync.js       repository artifacts Lean does not see
 *   prose-surface.js       lexical obligations on Markdown and packaged prose
 * and each layer file's CHECKS list is what runs.
 */

const { createContext } = require('./check-context');
const LAYERS = [
  require('./lean-bridge'),
  require('./contract-structure'),
  require('./artifact-sync'),
  require('./prose-surface'),
];

try {
  const ctx = createContext(process.argv[2] || process.cwd());
  for (const layer of LAYERS) {
    for (const check of layer.CHECKS) check(ctx);
  }

  // Output results as JSON
  console.log(JSON.stringify(ctx.results, null, 2));

  // Exit code based on failures
  process.exit(ctx.results.fail.length > 0 ? 1 : 0);

} catch (e) {
  console.error(JSON.stringify({
    error: e.message,
    stack: e.stack
  }));
  process.exit(2);
}
