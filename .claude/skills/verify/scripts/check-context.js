/**
 * The run context every static-check layer reads: the project root, the
 * shared result buckets, and the plugin records discovered once per run.
 *
 * A layer module exports its checks as functions of this context; the
 * orchestrator (static-checks.js) builds one context and runs every layer
 * against it, so each check pushes `{ check, file, message }` entries into
 * the same `{ pass, fail, warn }` buckets.
 */

const fs = require('fs');
const path = require('path');
const {
  discoverPlugins,
  protocolFiles,
} = require(path.resolve(__dirname, '../../../../scripts/load-protocols.js'));

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function createContext(projectRoot) {
  const results = { pass: [], fail: [], warn: [] };

  // Single discoverPlugins() call shared across every check. plugin.json reads
  // are memoized inside the helper, so the verifier pays one read per
  // plugin.json regardless of how many checks consume the records below.
  const records = discoverPlugins({ projectRoot });
  const protocolRecords = records.filter(r => r.isProtocol);

  const PROTOCOL_FILES = protocolFiles({ projectRoot });

  // Protocol display name → {deficit, resolution}. Derived from the Type
  // signature each protocol SKILL.md carries in its body (extractTypeSignature
  // also accepts one in the description); capitalize(dir) for display name.
  //
  // Loud-fail: extractTypeSignature returns null when the Type pattern is
  // absent or malformed. Null values would silently flow into comparisons as
  // the literal string "null", masking the real parse failure (PR #351
  // review H2). Validate at construction.
  const CANONICAL_PROTOCOLS = Object.fromEntries(
    protocolRecords.map(r => [
      r.dir[0].toUpperCase() + r.dir.slice(1),
      { deficit: r.deficit, resolution: r.resolution },
    ])
  );
  {
    const incomplete = Object.entries(CANONICAL_PROTOCOLS)
      .filter(([, m]) => !m.deficit || !m.resolution)
      .map(([k]) => k);
    if (incomplete.length) {
      throw new Error(
        `[static-checks] CANONICAL_PROTOCOLS missing deficit/resolution for: ${incomplete.join(', ')}. ` +
        `Likely cause: SKILL.md Type signature (description or body) absent or malformed for these protocols.`
      );
    }
  }

  // Shared directory walker for file collection
  function walkFiles(dir, predicate, checkName) {
    const collected = [];
    function walk(d) {
      try {
        const entries = fs.readdirSync(d, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(d, entry.name);
          if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
            walk(fullPath);
          } else if (predicate(entry)) {
            collected.push(fullPath);
          }
        }
      } catch (e) {
        if (e.code !== 'EACCES' && e.code !== 'ENOENT') {
          results.warn.push({ check: checkName, file: path.relative(projectRoot, d), message: `Directory walk error: ${e.code || e.message}` });
        }
      }
    }
    walk(dir);
    return collected;
  }

  return {
    projectRoot,
    results,
    records,
    protocolRecords,
    PROTOCOL_FILES,
    CANONICAL_PROTOCOLS,
    walkFiles,
  };
}

module.exports = { createContext, escapeRegex };
