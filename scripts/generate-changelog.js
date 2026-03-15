#!/usr/bin/env node
/**
 * Parse git conventional commits between tags for release notes
 * Zero external dependencies: Node.js standard library only
 *
 * Usage:
 *   node scripts/generate-changelog.js              # latest_tag..HEAD (local dev)
 *   node scripts/generate-changelog.js v2026.03.15  # prev_tag..v2026.03.15 (CI: current tag)
 *
 * Output: JSON { range, groups, ungrouped } to stdout
 * Exit 0 with empty groups when no previous tag exists
 */

const { execFileSync } = require('child_process');

const COMMIT_RE = /^([a-f0-9]+)\s+(feat|fix|refactor|style|docs|test|ci|chore)(?:\(([^)]+)\))?\s*:\s*(.+)$/;

/**
 * Find the commit range for changelog generation.
 * @param {string|null} currentTag - The current release tag (CI mode) or null (local mode)
 * @returns {{ from: string, to: string } | null} - Tag range or null if no tags exist
 */
function findRange(currentTag) {
  if (currentTag) {
    // CI mode: find the tag before currentTag
    try {
      const tags = execFileSync('git', ['tag', '--sort=-v:refname'], {
        encoding: 'utf8',
      }).trim().split('\n').filter(Boolean);
      const currentIdx = tags.indexOf(currentTag);
      if (currentIdx === -1 || currentIdx >= tags.length - 1) return null;
      return { from: tags[currentIdx + 1], to: currentTag };
    } catch {
      return null;
    }
  }

  // Local mode: find latest tag, range to HEAD
  try {
    const latestTag = execFileSync('git', ['describe', '--tags', '--abbrev=0', 'HEAD'], {
      encoding: 'utf8',
    }).trim();
    return { from: latestTag, to: 'HEAD' };
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
  const currentTag = process.argv[2] || null;
  const range = findRange(currentTag);

  if (!range) {
    // No tags or no previous tag — output empty result (Phase A fallback)
    console.log(JSON.stringify({ range: { from: null, to: currentTag || 'HEAD' }, groups: {}, ungrouped: [] }));
    return;
  }

  const rangeStr = `${range.from}..${range.to}`;
  const commits = parseCommits(rangeStr);
  const { groups, ungrouped } = groupByScope(commits);

  console.log(JSON.stringify({ range, groups, ungrouped }, null, 2));
}

main();
