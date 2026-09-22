#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const MAX_EVIDENCE_CHARS = 2000;
const MAX_ARTIFACT_BYTES = 16 * 1024 * 1024;
const safeId = (id) => String(id).replace(/[^A-Za-z0-9._-]/g, '_');
const outcomePath = (root, id) => path.join(root, '.outcomes', `${safeId(id)}.json`);
const compareRevision = (a, b) => (a?.mtime_ms ?? 0) - (b?.mtime_ms ?? 0) || (a?.size ?? 0) - (b?.size ?? 0);

function boundedText(raw, limit = MAX_EVIDENCE_CHARS) {
  const value = String(raw ?? '');
  if (value.length <= limit) return { text: value, omitted_chars: 0 };
  const head = Math.floor(limit / 2);
  return { text: value.slice(0, head) + value.slice(-(limit - head)), omitted_chars: value.length - limit, split_at: head };
}

function errorEvidence(error) {
  return {
    message: boundedText(error?.message ?? error), stderr: boundedText(error?.stderr),
    code: typeof error?.code === 'string' ? error.code : null,
    status: Number.isInteger(error?.status) ? error.status : null,
    signal: typeof error?.signal === 'string' ? error.signal : null,
  };
}

function atomicJson(target, value) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const tmp = `${target}.${randomUUID()}.tmp`;
  try { fs.writeFileSync(tmp, JSON.stringify(value) + '\n'); fs.renameSync(tmp, target); }
  finally { try { fs.unlinkSync(tmp); } catch {} }
}

function loadAttempt(root, id) {
  try {
    const target = outcomePath(root, id);
    if (fs.statSync(target).size > 256 * 1024) return null;
    const value = JSON.parse(fs.readFileSync(target, 'utf8'));
    const isRevision = (r) => r === null || (r && Number.isFinite(r.mtime_ms) && Number.isFinite(r.size) && r.size >= 0);
    const validArtifacts = (items) => Array.isArray(items) && items.length <= 64 && items.every((item) =>
      item && typeof item.path === 'string' && /^[a-f0-9]{64}$/.test(item.sha256) && (item.revision === undefined || isRevision(item.revision)));
    if (value.schema_version !== 1 || value.session_id !== String(id)
      || !['claude', 'codex'].includes(value.runtime) || !isRevision(value.revision)
      || typeof value.attempt_id !== 'string' || !['in_progress', 'complete', 'superseded'].includes(value.state)
      || !value.extractors || typeof value.extractors !== 'object' || Array.isArray(value.extractors)
      || !Object.values(value.extractors).every((item) => item && ['succeeded', 'empty', 'invocation_failed', 'validation_failed', 'input_failed', 'skipped'].includes(item.state))
      || !value.publication || !['none', 'complete', 'partial', 'failed'].includes(value.publication.state)
      || !validArtifacts(value.publication.artifacts)
      || (value.retained_artifacts && !validArtifacts(value.retained_artifacts))
      || (value.last_success && (!isRevision(value.last_success.revision) || !validArtifacts(value.last_success.artifacts)))) return null;
    return value;
  } catch { return null; }
}

// Callers serialize publication per session; each completion names its own attempt.
function takeSessionLock(root, id) {
  const lock = path.join(root, ".locks", id);
  fs.mkdirSync(path.dirname(lock), { recursive: true });
  const create = () => {
    fs.mkdirSync(lock);
    fs.writeFileSync(path.join(lock, "owner.json"), JSON.stringify({ pid: process.pid, token: randomUUID() }));
    return () => fs.rmSync(lock, { recursive: true, force: true });
  };
  try { return create(); } catch (error) { if (error.code !== "EEXIST") throw error; }
  let owner;
  try {
    owner = fs.readFileSync(path.join(lock, "owner.json"), "utf8");
    const pid = JSON.parse(owner).pid;
    if (!Number.isInteger(pid) || pid <= 0) return null;
    try { process.kill(pid, 0); return null; } catch (error) { if (error.code !== "ESRCH") return null; }
  } catch { return null; }
  const stale = `${lock}.${randomUUID()}.stale`;
  try {
    fs.renameSync(lock, stale);
    if (fs.readFileSync(path.join(stale, "owner.json"), "utf8") !== owner) {
      fs.renameSync(stale, lock);
      return null;
    }
    fs.rmSync(stale, { recursive: true, force: true });
    return create();
  } catch { return null; }
}

function beginAttempt(root, sessionId, info) {
  const previous = loadAttempt(root, sessionId);
  if (previous?.revision && info.revision && compareRevision(previous.revision, info.revision) > 0
    && !(previous.state === 'superseded' && (!previous.last_success?.revision
      || compareRevision(previous.last_success.revision, info.revision) <= 0))) return null;
  const attempt = {
    schema_version: 1, attempt_id: randomUUID(), session_id: String(sessionId),
    runtime: info.runtime, revision: info.revision ?? null,
    source_transcript: info.source_transcript, source_event: info.source_event,
    started_at: new Date().toISOString(), state: 'in_progress', extractors: {},
    publication: { state: 'none', artifacts: [] }, last_success: previous?.last_success ?? null,
    retained_artifacts: previous ? readOutcome(root, sessionId).artifacts.filter((a) => a.verified
      && (info.runtime !== 'codex' || [...(previous.last_success?.artifacts ?? []), ...previous.publication.artifacts].some((current) => current.path === a.path)))
      .map(({ verified, ...artifact }) => artifact) : [],
  };
  atomicJson(outcomePath(root, sessionId), attempt);
  return attempt;
}

function finishAttempt(root, attempt, result) {
  if (!attempt || loadAttempt(root, attempt.session_id)?.attempt_id !== attempt.attempt_id) return false;
  const final = { ...attempt, ...result, finished_at: new Date().toISOString() };
  if (final.publication.state === 'complete') {
    final.last_success = { revision: final.revision, artifacts: final.publication.artifacts, at: final.finished_at };
    if (final.runtime === 'codex') final.retained_artifacts = [];
  }
  atomicJson(outcomePath(root, attempt.session_id), final);
  return true;
}

function captureArtifacts(paths) {
  return paths.map((filename) => {
    const content = fs.readFileSync(filename);
    if (content.length > MAX_ARTIFACT_BYTES) throw new Error('artifact exceeds outcome verification bound');
    return { path: path.resolve(filename), sha256: createHash('sha256').update(content).digest('hex') };
  });
}

function verifyArtifact(root, id, runtime, artifact) {
  try {
    const resolvedRoot = fs.realpathSync(root);
    const resolved = fs.realpathSync(artifact.path);
    const relative = path.relative(resolvedRoot, resolved);
    const session = safeId(id);
    const allowed = runtime === 'claude'
      ? ['clue', 'vector', 'narrative', 'markers', 'entropy', 'coinage'].some((name) => relative === path.join(session, `${name}.md`))
      : relative === path.join('catalog', `${session}.json`) || relative === path.join(session, 'current.json')
        || (relative.startsWith(path.join(session, 'generations') + path.sep) && path.basename(relative) === 'record.json');
    if (!allowed || !relative || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)
      || relative.split(path.sep).includes('.outcomes')) return { ...artifact, verified: false };
    if (fs.statSync(resolved).size > MAX_ARTIFACT_BYTES) return { ...artifact, verified: false };
    const actual = captureArtifacts([resolved])[0];
    return { ...artifact, verified: actual.sha256 === artifact.sha256 };
  } catch { return { ...artifact, verified: false }; }
}

function readOutcome(root, id) {
  const attempt = loadAttempt(root, id);
  if (!attempt) return { availability: 'unknown', session_id: String(id), attempt: null, artifacts: [] };
  const descriptors = [
    ...(attempt.last_success?.artifacts ?? []).map((a) => ({ ...a, revision: a.revision ?? attempt.last_success.revision })),
    ...(attempt.retained_artifacts ?? []),
    ...attempt.publication.artifacts.map((a) => ({ ...a, revision: a.revision ?? attempt.revision })),
  ];
  const byPath = new Map(descriptors.map((a) => [a.path, a]));
  const artifacts = [...byPath.values()].map((a) => verifyArtifact(root, id, attempt.runtime, a));
  const verified = artifacts.filter((a) => a.verified);
  const states = Object.values(attempt.extractors).map((item) => item.state);
  const failed = states.some((state) => state.endsWith('_failed'));
  let availability;
  if (attempt.state === 'in_progress') availability = 'in_progress';
  else if (attempt.state === 'superseded') availability = 'stale';
  else if (attempt.publication.state === 'partial') availability = 'partial';
  else if (attempt.publication.state === 'failed' || failed) {
    availability = attempt.publication.artifacts.length && verified.length ? 'partial' : verified.length ? 'stale' : 'failed';
  } else if (states.length && states.every((s) => s === 'empty' || s === 'skipped') && states.includes('empty')) availability = 'empty';
  else if (attempt.publication.state === 'complete') availability = artifacts.every((a) => a.verified) && artifacts.length ? 'available' : 'partial';
  else availability = states.includes('skipped') && verified.length ? 'stale' : 'unknown';
  let source_changed = null;
  try {
    const stat = fs.statSync(attempt.source_transcript);
    if (attempt.revision) source_changed = compareRevision({ mtime_ms: Math.floor(stat.mtimeMs), size: stat.size }, attempt.revision) !== 0;
  } catch {}
  return { availability, session_id: String(id), attempt, artifacts, source_changed };
}

function formatOutcome(result) {
  return JSON.stringify({ session_id: result.session_id, availability: result.availability,
    state: result.attempt?.state ?? null, attempt_id: result.attempt?.attempt_id ?? null, started_at: result.attempt?.started_at ?? null, revision: result.attempt?.revision ?? null, source_changed: result.source_changed ?? null, extractors: result.attempt?.extractors ?? {},
    publication: result.attempt?.publication ?? null, artifacts: result.artifacts });
}

export { beginAttempt, finishAttempt, readOutcome, captureArtifacts, errorEvidence, outcomePath, boundedText, formatOutcome, takeSessionLock };

let isMain = false;
try { isMain = !!process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url)); } catch {}
if (isMain) {
  const [root, id] = process.argv.slice(2);
  if (!root || !id) { process.stderr.write('usage: hypomnesis-outcome.mjs <store-root> <session-id>\n'); process.exitCode = 2; }
  else process.stdout.write(JSON.stringify(readOutcome(root, id)) + '\n');
}
