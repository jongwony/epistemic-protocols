#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const MAX_EVIDENCE_CHARS = 2000;
const MAX_ARTIFACT_BYTES = 16 * 1024 * 1024;
function sessionKey(runtime, id) {
  if (runtime === 'codex') return String(id ?? 'unknown').replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 160) || 'unknown';
  if (runtime === 'claude' && typeof id === 'string' && /^[A-Za-z0-9_-]+$/.test(id)) return id;
  throw new Error('invalid runtime/session identity');
}
const outcomePath = (root, id, runtime = 'claude') => path.join(root, '.outcomes', `${sessionKey(runtime, id)}.json`);
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

function loadAttempt(root, id, runtime) {
  for (const candidate of runtime ? [runtime] : ['claude', 'codex']) {
  try {
    const target = outcomePath(root, id, candidate);
    if (fs.statSync(target).size > 256 * 1024) continue;
    const value = JSON.parse(fs.readFileSync(target, 'utf8'));
    const isRevision = (r) => r === null || (r && Number.isFinite(r.mtime_ms) && Number.isFinite(r.size) && r.size >= 0);
    const validArtifacts = (items) => Array.isArray(items) && items.length <= 64 && items.every((item) =>
      item && typeof item.path === 'string' && /^[a-f0-9]{64}$/.test(item.sha256) && (item.revision === undefined || isRevision(item.revision)));
    if (value.runtime !== candidate || value.schema_version !== 1 || value.session_id !== String(id)
      || !['claude', 'codex'].includes(value.runtime) || !isRevision(value.revision)
      || typeof value.attempt_id !== 'string' || !['in_progress', 'complete', 'superseded'].includes(value.state)
      || !value.extractors || typeof value.extractors !== 'object' || Array.isArray(value.extractors)
      || !Object.values(value.extractors).every((item) => item && ['succeeded', 'empty', 'invocation_failed', 'validation_failed', 'input_failed', 'skipped'].includes(item.state))
      || !value.publication || !['none', 'complete', 'partial', 'failed'].includes(value.publication.state)
      || !validArtifacts(value.publication.artifacts)
      || (value.retained_artifacts && !validArtifacts(value.retained_artifacts))
      || (value.last_success && (!isRevision(value.last_success.revision) || !validArtifacts(value.last_success.artifacts)))) continue;
    return value;
  } catch {}
  }
  return null;
}

export { takeSessionLock } from './session-lock.mjs';

function beginAttempt(root, sessionId, info) {
  const previous = loadAttempt(root, sessionId, info.runtime);
  if (previous?.revision && info.revision && compareRevision(previous.revision, info.revision) > 0
    && !(previous.state === 'superseded' && (!previous.last_success?.revision
      || compareRevision(previous.last_success.revision, info.revision) <= 0))) return null;
  const attempt = {
    schema_version: 1, attempt_id: randomUUID(), session_id: String(sessionId),
    runtime: info.runtime, revision: info.revision ?? null,
    source_transcript: info.source_transcript, source_event: info.source_event,
    started_at: new Date().toISOString(), state: 'in_progress', extractors: {},
    publication: { state: 'none', artifacts: [] }, last_success: previous?.last_success ?? null,
    retained_artifacts: previous ? readOutcome(root, sessionId, info.runtime).artifacts.filter((a) => a.verified
      && (info.runtime !== 'codex' || [...(previous.last_success?.artifacts ?? []), ...previous.publication.artifacts].some((current) => current.path === a.path)))
      .map(({ verified, ...artifact }) => artifact) : [],
  };
  atomicJson(outcomePath(root, sessionId, info.runtime), attempt);
  return attempt;
}

function finishAttempt(root, attempt, result) {
  if (!attempt || loadAttempt(root, attempt.session_id, attempt.runtime)?.attempt_id !== attempt.attempt_id) return false;
  const final = { ...attempt, ...result, finished_at: new Date().toISOString() };
  if (final.publication.state === 'complete') {
    final.last_success = { revision: final.revision, artifacts: final.publication.artifacts, at: final.finished_at };
    if (final.runtime === 'codex') final.retained_artifacts = [];
  }
  atomicJson(outcomePath(root, attempt.session_id, attempt.runtime), final);
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
    const session = sessionKey(runtime, id);
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

function readOutcome(root, id, runtime) {
  const attempt = loadAttempt(root, id, runtime);
  if (!attempt) return { record_state: 'unknown', session_id: String(id), attempt: null, artifacts: [], source_revision: null, source_changed: null };
  const descriptors = [
    ...(attempt.last_success?.artifacts ?? []).map((a) => ({ ...a, revision: a.revision ?? attempt.last_success.revision })),
    ...(attempt.retained_artifacts ?? []),
    ...attempt.publication.artifacts.map((a) => ({ ...a, revision: a.revision ?? attempt.revision })),
  ];
  const byPath = new Map(descriptors.map((a) => [a.path, a]));
  const artifacts = [...byPath.values()].map((a) => verifyArtifact(root, id, attempt.runtime, a));
  let source_revision = null;
  let source_changed = null;
  try {
    const stat = fs.statSync(attempt.source_transcript);
    source_revision = { mtime_ms: Math.floor(stat.mtimeMs), size: stat.size };
    if (attempt.revision) source_changed = compareRevision(source_revision, attempt.revision) !== 0;
  } catch {}
  return { record_state: 'known', session_id: String(id), attempt, artifacts, source_revision, source_changed };
}

function formatOutcome(result) {
  return JSON.stringify({ session_id: result.session_id, record_state: result.record_state,
    state: result.attempt?.state ?? null, attempt_id: result.attempt?.attempt_id ?? null, started_at: result.attempt?.started_at ?? null, revision: result.attempt?.revision ?? null, source_changed: result.source_changed ?? null, source_revision: result.source_revision ?? null, extractors: result.attempt?.extractors ?? {},
    publication: result.attempt?.publication ?? null, artifacts: result.artifacts });
}

export { beginAttempt, finishAttempt, readOutcome, captureArtifacts, errorEvidence, outcomePath, boundedText, formatOutcome, sessionKey };

let isMain = false;
try { isMain = !!process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url)); } catch {}
function readOutcomes(sources) {
  if (!Array.isArray(sources) || sources.some((source) => !source || !['claude', 'codex'].includes(source.runtime)
    || typeof source.root !== 'string' || !path.isAbsolute(source.root) || typeof source.session_id !== 'string')) {
    throw new Error('batch requires an array of runtime, absolute root, and session_id bindings');
  }
  return sources.map(({ runtime, root, session_id }) => ({ runtime, root, ...readOutcome(root, session_id, runtime) }));
}
export { readOutcomes };

if (isMain) {
  try {
    if (process.argv[2] === '--batch') {
      const raw = fs.readFileSync(0, 'utf8');
      if (Buffer.byteLength(raw) > 8 * 1024 * 1024) throw new Error('batch input exceeds 8 MiB');
      process.stdout.write(JSON.stringify(readOutcomes(JSON.parse(raw))) + '\n');
    } else {
      const [root, id, runtime] = process.argv.slice(2);
      if (!root || !id) throw new Error('usage: hypomnesis-outcome.mjs <store-root> <session-id> [runtime] | --batch');
      process.stdout.write(JSON.stringify(readOutcome(root, id, runtime)) + '\n');
    }
  } catch (error) { process.stderr.write(error.message + '\n'); process.exitCode = 2; }
}
