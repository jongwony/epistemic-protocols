#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const MAX_EVIDENCE_CHARS = 2000;
const MAX_ARTIFACT_BYTES = 16 * 1024 * 1024;
const LIMITATION_KINDS = new Set(['input_failed', 'invocation_failed', 'validation_failed', 'skipped', 'execution_failed']);
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
      item && typeof item.path === 'string' && /^[a-f0-9]{64}$/.test(item.sha256) && (item.revision === undefined || isRevision(item.revision)) && (item.receipt_id === undefined || typeof item.receipt_id === 'string')
      && (item.append_qualification === undefined || (typeof item.append_qualification.prior_origin_unknown === 'boolean'
        && item.append_qualification.prior_detail_omitted === true && Array.isArray(item.append_qualification.observed_limitations)
        && item.append_qualification.observed_limitations.length <= LIMITATION_KINDS.size
        && item.append_qualification.observed_limitations.every((kind) => LIMITATION_KINDS.has(kind)))));
    if (value.runtime !== candidate || value.schema_version !== 1 || value.session_id !== String(id)
      || !['claude', 'codex'].includes(value.runtime) || !isRevision(value.revision)
      || typeof value.attempt_id !== 'string' || !['in_progress', 'complete', 'superseded'].includes(value.state)
      || !value.extractors || typeof value.extractors !== 'object' || Array.isArray(value.extractors)
      || !Object.values(value.extractors).every((item) => item && ['succeeded', 'empty', 'invocation_failed', 'validation_failed', 'input_failed', 'skipped'].includes(item.state))
      || !value.publication || !['none', 'complete', 'partial', 'failed'].includes(value.publication.state)
      || !validArtifacts(value.publication.artifacts)
      || (value.retained_artifacts && !validArtifacts(value.retained_artifacts))
      || (value.last_publication && (!['complete', 'partial', 'failed'].includes(value.last_publication.state) || !validArtifacts(value.last_publication.artifacts)))
      || (value.receipts && (typeof value.receipts !== 'object' || Array.isArray(value.receipts) || Object.keys(value.receipts).length > 64
        || !Object.values(value.receipts).every((receipt) => receipt && isRevision(receipt.revision) && typeof receipt.attempt_id === 'string' && receipt.extractors && typeof receipt.extractors === 'object')))) continue;
    return value;
  } catch {}
  }
  return null;
}

export { takeSessionLock } from './session-lock.mjs';

function effectiveArtifacts(attempt) {
  return [...new Map([
    ...(attempt.retained_artifacts ?? []),
    ...(attempt.last_publication?.artifacts ?? []),
    ...attempt.publication.artifacts,
  ].map((artifact) => [artifact.path, artifact])).values()];
}

function compactReceipts(root, attempt) {
  let artifacts = effectiveArtifacts(attempt);
  if (attempt.runtime === 'codex') {
    const session = sessionKey('codex', attempt.session_id);
    const pointerPaths = [path.join(root, session, 'current.json'), path.join(root, 'catalog', `${session}.json`)];
    const keep = new Set([...(attempt.last_publication?.artifacts ?? []).map((a) => a.path), ...pointerPaths]);
    for (const filename of pointerPaths) {
      const descriptor = artifacts.find((a) => a.path === filename);
      if (!descriptor || !verifyArtifact(root, attempt.session_id, 'codex', descriptor).verified) continue;
      try {
        const pointer = JSON.parse(fs.readFileSync(filename, 'utf8'));
        if (typeof pointer.generation === 'string') keep.add(path.resolve(root, session, pointer.generation));
        if (typeof pointer.record_path === 'string') keep.add(path.resolve(pointer.record_path));
      } catch {}
    }
    artifacts = artifacts.filter((artifact) => keep.has(artifact.path));
  }
  const represented = new Set([...(attempt.last_publication?.artifacts ?? []), ...attempt.publication.artifacts].map((a) => a.path));
  attempt.retained_artifacts = artifacts.filter((artifact) => !represented.has(artifact.path));
  const referenced = new Set(artifacts.map((a) => a.receipt_id).filter(Boolean));
  attempt.receipts = Object.fromEntries(Object.entries(attempt.receipts ?? {}).filter(([id]) => referenced.has(id)));
}

function beginAttempt(root, sessionId, info) {
  const previous = loadAttempt(root, sessionId, info.runtime);
  const attempt = {
    schema_version: 1, attempt_id: randomUUID(), session_id: String(sessionId),
    runtime: info.runtime, revision: info.revision ?? null,
    source_transcript: info.source_transcript, source_event: info.source_event,
    started_at: new Date().toISOString(), state: 'in_progress', extractors: {},
    publication: { state: 'none', artifacts: [] }, last_publication: previous?.last_publication ?? null,
    receipts: previous?.receipts ?? {},
    retained_artifacts: previous ? effectiveArtifacts(previous).filter((artifact) => !['missing', 'mismatch', 'outside_scope'].includes(verifyArtifact(root, sessionId, info.runtime, artifact).verification)) : [],
  };
  compactReceipts(root, attempt);
  atomicJson(outcomePath(root, sessionId, info.runtime), attempt);
  return attempt;
}

function foldAppendQualification(previous, priorReceipt, current) {
  const inherited = previous?.append_qualification;
  const observed = new Set(inherited?.observed_limitations ?? []);
  for (const receipt of [priorReceipt, current]) {
    for (const stage of Object.values(receipt?.extractors ?? {})) {
      if (LIMITATION_KINDS.has(stage.state)) observed.add(stage.state);
    }
    if (receipt?.execution?.state === 'failed') observed.add('execution_failed');
  }
  return {
    prior_origin_unknown: !!inherited?.prior_origin_unknown || !priorReceipt,
    prior_detail_omitted: true,
    observed_limitations: [...observed].sort(),
  };
}

function finishAttempt(root, attempt, result) {
  if (!attempt) return false;
  const current = loadAttempt(root, attempt.session_id, attempt.runtime);
  if (current?.attempt_id !== attempt.attempt_id) return false;
  const final = { ...current, ...result, retained_artifacts: effectiveArtifacts(current) };
  if (result.state !== undefined && current.state === 'in_progress') final.finished_at = new Date().toISOString();
  if (result.publication && result.publication.state !== 'none') {
    const at = final.finished_at ?? new Date().toISOString();
    final.receipts = { ...(current.receipts ?? {}) };
    final.publication = { ...result.publication, artifacts: result.publication.artifacts.map((artifact) => {
      const { revision: _revision, appended_from_sha256, ...descriptor } = artifact;
      const receipt_id = artifact.receipt_id && final.receipts[artifact.receipt_id] ? artifact.receipt_id : final.attempt_id;
      if (!final.receipts[receipt_id]) final.receipts[receipt_id] = {
        attempt_id: final.attempt_id, revision: final.revision, source_transcript: final.source_transcript,
        source_event: final.source_event, at, extractors: final.extractors,
        ...(final.execution ? { execution: final.execution } : {}),
      };
      if (appended_from_sha256) {
        const previous = effectiveArtifacts(current).find((prior) => prior.path === artifact.path && prior.sha256 === appended_from_sha256);
        descriptor.append_qualification = foldAppendQualification(previous, current.receipts?.[previous?.receipt_id], final);
      }
      return { ...descriptor, receipt_id };
    }) };
    final.last_publication = { ...final.publication, at, attempt_id: final.attempt_id };
  }
  compactReceipts(root, final);
  atomicJson(outcomePath(root, attempt.session_id, attempt.runtime), final);
  return true;
}

function captureArtifacts(paths) {
  return paths.map((filename) => {
    const fd = fs.openSync(filename, 'r');
    try {
      const hash = createHash('sha256');
      const chunk = Buffer.alloc(64 * 1024);
      let size = 0;
      for (;;) {
        const count = fs.readSync(fd, chunk, 0, chunk.length, null);
        if (!count) break;
        hash.update(chunk.subarray(0, count));
        size += count;
      }
      return { path: path.resolve(filename), sha256: hash.digest('hex'), size };
    } finally { fs.closeSync(fd); }
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
      || relative.split(path.sep).includes('.outcomes')) return { ...artifact, verified: false, verification: 'outside_scope' };
    if (fs.statSync(resolved).size > MAX_ARTIFACT_BYTES) return { ...artifact, verified: false, verification: 'unverified' };
    const actual = captureArtifacts([resolved])[0];
    return { ...artifact, verified: actual.sha256 === artifact.sha256, verification: actual.sha256 === artifact.sha256 ? 'verified' : 'mismatch' };
  } catch (error) { return { ...artifact, verified: false, verification: error.code === 'ENOENT' ? 'missing' : 'unverified' }; }
}

function readOutcome(root, id, runtime) {
  const attempt = loadAttempt(root, id, runtime);
  if (!attempt) return { record_state: 'unknown', session_id: String(id), attempt: null, artifacts: [], source_revision: null, source_changed: null };
  const artifacts = effectiveArtifacts(attempt).map((artifact) => {
    const receipt = attempt.receipts?.[artifact.receipt_id] ?? null;
    return { ...verifyArtifact(root, id, attempt.runtime, artifact), revision: receipt?.revision ?? artifact.revision ?? null };
  });
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
    publication: result.attempt?.publication ?? null, receipts: result.attempt?.receipts ?? {}, execution: result.attempt?.execution ?? null, artifacts: result.artifacts });
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
