import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

// A live pid keeps its lock only this many times longer than an unowned one: past it the pid is
// taken to be recycled or hung, and the holder's own ownership check stops it from publishing.
const LIVE_OWNER_FACTOR = 4;
// Removal of a lock directory — a reap or a release — happens only while holding the guard, so a
// lock can be removed only by the one process that just verified it; creation needs no guard,
// because it succeeds only on a vacant path and only a guarded removal makes one vacant.
const GUARD_STALE_MS = 60 * 1000;
const GUARD_POLL_MS = 5;

function snapshot(directory) {
  try {
    const stat = fs.statSync(directory);
    if (!stat.isDirectory()) return null;
    let owner = null;
    try { owner = fs.readFileSync(path.join(directory, 'owner.json'), 'utf8'); } catch {}
    return { dev: stat.dev, ino: stat.ino, mtimeMs: stat.mtimeMs, owner };
  } catch { return null; }
}

function same(left, right) {
  return !!left && !!right && left.dev === right.dev && left.ino === right.ino && left.owner === right.owner;
}

function pause(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function guarded(directory, waitMs, action) {
  const guard = `${directory}.guard`;
  const deadline = Date.now() + waitMs;
  for (;;) {
    try { fs.mkdirSync(guard); break; }
    catch (error) {
      if (error.code !== 'EEXIST') throw error;
      try {
        if (Date.now() - fs.statSync(guard).mtimeMs > GUARD_STALE_MS) { fs.rmdirSync(guard); continue; }
      } catch { continue; }
      if (Date.now() >= deadline) return null;
      pause(GUARD_POLL_MS);
    }
  }
  try { return action(); } finally { try { fs.rmdirSync(guard); } catch {} }
}

function detach(directory, expected) {
  if (!same(snapshot(directory), expected)) return null;
  const detached = `${directory}.reap.${randomUUID()}`;
  try { fs.renameSync(directory, detached); } catch { return null; }
  if (same(snapshot(detached), expected)) return detached;
  if (!fs.existsSync(directory)) {
    try { fs.renameSync(detached, directory); } catch {}
  }
  return null;
}

function stale(state, staleAfterMs) {
  if (!state) return false;
  const age = Date.now() - state.mtimeMs;
  let owner;
  try { owner = JSON.parse(state.owner); } catch {}
  if (Number.isSafeInteger(owner?.pid) && owner.pid > 0) {
    try { process.kill(owner.pid, 0); }
    catch (error) { if (error.code === 'ESRCH') return true; }
    return age > staleAfterMs * LIVE_OWNER_FACTOR;
  }
  return age > staleAfterMs;
}

function takeSessionLock(root, key, { staleAfterMs = 30 * 60 * 1000, reapWaitMs = 2000 } = {}) {
  const directory = path.join(root, '.locks', key);
  fs.mkdirSync(path.dirname(directory), { recursive: true });
  const remove = (expected) => guarded(directory, reapWaitMs, () => {
    const detached = detach(directory, expected);
    if (detached) fs.rmSync(detached, { recursive: true, force: true });
    return !!detached;
  });
  const create = () => {
    fs.mkdirSync(directory);
    const created = snapshot(directory);
    const owner = { pid: process.pid, token: randomUUID(), acquired_at: new Date().toISOString() };
    const serialized = JSON.stringify(owner);
    try { fs.writeFileSync(path.join(directory, 'owner.json'), serialized, { flag: 'wx' }); }
    catch (error) {
      const current = snapshot(directory);
      if (current && current.dev === created.dev && current.ino === created.ino) {
        let record;
        try { record = JSON.parse(current.owner); } catch {}
        if (!record || record.token === owner.token) remove(current);
      }
      throw error;
    }
    const expected = { ...created, owner: serialized };
    if (!same(snapshot(directory), expected)) return null;
    const release = () => { remove(expected); };
    release.owned = () => same(snapshot(directory), expected);
    return release;
  };
  try { return create(); }
  catch (error) { if (error.code !== 'EEXIST') throw error; }
  const reaped = guarded(directory, reapWaitMs, () => {
    const previous = snapshot(directory);
    if (!stale(previous, staleAfterMs)) return false;
    const detached = detach(directory, previous);
    if (!detached) return false;
    fs.rmSync(detached, { recursive: true, force: true });
    return true;
  });
  if (!reaped) return null;
  try { return create(); }
  catch (error) { if (error.code === 'EEXIST') return null; throw error; }
}

export { takeSessionLock };
