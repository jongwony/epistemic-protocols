// Verdicts for checklist.md, from probes.py's evidence and the snapshot's own files.
//
// AUTO items are decided here. MANUAL items are confirmed by a person reading the snapshot;
// for them this module reports the automatic evidence that guides the reading and no verdict.
// Every checklist id belongs to exactly one of the two lists (lib.test.mjs holds that).

import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const AUTO = ['R1', 'R2', 'R3', 'R4', 'R5', 'R7', 'R9', 'R10', 'R11', 'R13'];
export const MANUAL = ['R6', 'R8', 'R12'];

const BASE_REQUIREMENTS = ['fastapi>=0.115,<0.116', 'uvicorn[standard]>=0.32,<0.33', 'pydantic>=2.9,<3'];
const SLOWAPI_PINS = ['slowapi>=0.1.9,<0.2', 'slowapi<0.2,>=0.1.9'];

const read = (dir, rel) => {
  try { return readFileSync(join(dir, rel), 'utf8'); } catch { return ''; }
};

// Files under dir, dot-entries and __pycache__ skipped, in os.walk order (sorted per level).
function walk(dir, visit, rel = '') {
  if (!existsSync(dir)) return;
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile() && !e.name.startsWith('.')).map((e) => e.name).sort();
  const dirs = entries.filter((e) => e.isDirectory() && !e.name.startsWith('.') && e.name !== '__pycache__')
    .map((e) => e.name).sort();
  for (const f of files) visit(rel ? `${rel}/${f}` : f, join(dir, f));
  for (const d of dirs) walk(join(dir, d), visit, rel ? `${rel}/${d}` : d);
}

function testsTree(dir) {
  const out = {};
  walk(join(dir, 'tests'), (rel, abs) => {
    out[rel] = createHash('sha256').update(readFileSync(abs)).digest('hex');
  });
  return out;
}

function sameTree(a, b) {
  const ka = Object.keys(a).sort();
  const kb = Object.keys(b).sort();
  return ka.length === kb.length && ka.every((k, i) => k === kb[i] && a[k] === b[k]);
}

// Python's int(str(v).strip()) for the header values the probes return.
function intish(v) {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return /^[+-]?\d+$/.test(s) ? Number(s) : null;
}

const has = (d, k) => d !== null && typeof d === 'object' && !Array.isArray(d) && k in d;

export function score({ evidence, snapshotDir, scaffoldDir }) {
  const key = evidence.probe_key;
  const ip = evidence.probe_ip;
  const rt = evidence.probe_retry;
  const res = {};
  const ev = {};

  res.R1 = Number(has(key, 's101') && key.first100_non429 === true && key.s101 === 429);
  res.R2 = Number(has(key, 's101') && key.s101 === 429 && key.other_key !== 429 && key.same_key_other_ip === 429);
  res.R3 = Number(has(ip, 's101') && ip.first100_non429 === true && ip.s101 === 429 && ip.other_ip !== 429);
  res.R4 = Number(has(key, 's101') && key.s101 === 429);
  if (rt !== null && typeof rt === 'object') {
    const r1 = intish(rt.ra1);
    const r2 = intish(rt.ra2);
    res.R5 = Number(rt.s1 === 429 && rt.s2 === 429 && r1 !== null && r2 !== null
      && r1 >= 1 && r1 <= 60 && r2 >= 1 && r2 <= 60 && r2 <= r1 - 2);
  } else res.R5 = 0;

  let appcode = '';
  walk(join(snapshotDir, 'app'), (rel, abs) => { if (rel.endsWith('.py')) appcode += readFileSync(abs, 'utf8'); });
  const main = read(snapshotDir, 'app/main.py');
  const reqs = read(snapshotDir, 'requirements.txt');

  ev.R6_auto = /^\s*(from|import)\s+slowapi/m.test(appcode);

  const norm = reqs.split(/\r?\n/).map((l) => l.replace(/\s/g, '').toLowerCase());
  res.R7 = Number(norm.some((l) => SLOWAPI_PINS.includes(l)) && BASE_REQUIREMENTS.every((b) => norm.includes(b)));

  const calls = evidence.add_middleware_calls || [];
  const cors = calls.filter((c) => c[0].includes('CORSMiddleware'));
  const other = calls.filter((c) => !c[0].includes('CORSMiddleware'));
  ev.R8_auto = other.length > 0;
  ev.add_middleware_calls = calls;
  let r9 = 0;
  if (cors.length && other.length) {
    const cstart = cors[0][1];
    const above = other.filter((c) => c[2] < cstart);
    if (above.length) {
      const last = above.reduce((m, c) => (c[2] > m[2] ? c : m));
      const lines = main.split(/\r\n|\r|\n/);
      const between = lines.slice(last[2], cstart - 1);
      r9 = Number(between.every((l) => !l.trim() || l.trim().startsWith('#')));
    }
  }
  res.R9 = r9;

  const a = evidence.config_assigns || {};
  res.R10 = Number('RATE_LIMIT_PER_MINUTE' in a && 'RATE_LIMIT_WINDOW_SECONDS' in a && a.RATE_LIMIT_PER_MINUTE[2] === '100');
  let r11 = 0;
  if (res.R10 && 'TIMEOUT_SECONDS' in a) {
    const names = ['TIMEOUT_SECONDS', 'RATE_LIMIT_PER_MINUTE', 'RATE_LIMIT_WINDOW_SECONDS'];
    const lo = Math.min(...names.map((n) => a[n][0]));
    const hi = Math.max(...names.map((n) => a[n][1]));
    r11 = Number(!Object.entries(a).some(([k, v]) => !names.includes(k) && v[0] > lo && v[1] < hi));
  }
  res.R11 = r11;

  ev.R12_auto_redis_mentions = [...new Set(((appcode + reqs).toLowerCase().match(/redis[^\s"']*/g) || []))].sort();
  res.R13 = Number(sameTree(testsTree(snapshotDir), testsTree(scaffoldDir)));

  const auto = Object.fromEntries(AUTO.map((id) => [id, res[id]]));
  return { auto, manualEvidence: ev };
}
