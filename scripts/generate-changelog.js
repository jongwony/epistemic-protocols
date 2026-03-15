#!/usr/bin/env node
/**
 * Parse git conventional commits between tags for release notes
 * Zero external dependencies: Node.js standard library only
 *
 * Usage:
 *   node scripts/generate-changelog.js          # prev_tag..HEAD
 *   node scripts/generate-changelog.js v1.0.0   # explicit base tag
 *
 * Output: JSON { range, groups, ungrouped } to stdout
 * Exit 0 with empty groups when no previous tag exists
 */

const { execFileSync } = require('child_process');

const COMMIT_RE = /^([a-f0-9]+)\s+(feat|fix|refactor|style|docs|test|ci|chore)(?:\(([^)]+)\))?\s*:\s*(.+)$/;

function findPreviousTag(baseTag) {
  if (baseTag) return baseTag;
  try {
    return execFileSync('git', ['describe', '--tags', '--abbrev=0', 'HEAD'], {
      encoding: 'utf8',
    }).trim();
  } catch {
    return null;
  }
}

function parseCommits(range) {
  const raw = execFileSync('git', ['log', '--format=%h %s', range], {
    encoding: 'utf8',
  }).trim();

  if (!raw) return [];

  return raw.split('\n').flatMap(line => {
    const m = line.match(COMMIT_RE);
    if (!m) return [{ hash: line.slice(0, 7), type: null, scope: null, message: line.slice(8) }];
    const scopes = m[3] ? m[3].split(',').map(s => s.trim()) : [null];
    return scopes.map(scope => ({ hash: m[1], type: m[2], scope, message: m[4] }));
  });
}

function groupByScope(commits) {
  const groups = {};
  const ungrouped = [];

  for (const c of commits) {
    if (c.scope) {
      if (!groups[c.scope]) groups[c.scope] = [];
      groups[c.scope].push({ hash: c.hash, type: c.type, message: c.message });
    } else {
      ungrouped.push(c);
    }
  }

  return { groups, ungrouped };
}

function main() {
  const baseTag = process.argv[2] || null;
  const prevTag = findPreviousTag(baseTag);

  if (!prevTag) {
    // No previous tag — output empty result (Phase A fallback)
    console.log(JSON.stringify({ range: { from: null, to: 'HEAD' }, groups: {}, ungrouped: [] }));
    return;
  }

  const range = `${prevTag}..HEAD`;
  const commits = parseCommits(range);
  const { groups, ungrouped } = groupByScope(commits);

  console.log(JSON.stringify({ range: { from: prevTag, to: 'HEAD' }, groups, ungrouped }, null, 2));
}

main();
