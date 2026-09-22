import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

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
  let owner;
  try { owner = JSON.parse(state.owner); } catch {}
  if (Number.isSafeInteger(owner?.pid) && owner.pid > 0) {
    try { process.kill(owner.pid, 0); return false; }
    catch (error) { return error.code === 'ESRCH'; }
  }
  return Date.now() - state.mtimeMs > staleAfterMs;
}

function takeSessionLock(root, key, { staleAfterMs = 30 * 60 * 1000 } = {}) {
  const directory = path.join(root, '.locks', key);
  fs.mkdirSync(path.dirname(directory), { recursive: true });
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
        if (!record || record.token === owner.token) {
          const detached = detach(directory, current);
          if (detached) fs.rmSync(detached, { recursive: true, force: true });
        }
      }
      throw error;
    }
    const expected = { ...created, owner: serialized };
    if (!same(snapshot(directory), expected)) return null;
    const release = () => {
      const detached = detach(directory, expected);
      if (detached) fs.rmSync(detached, { recursive: true, force: true });
    };
    release.owned = () => same(snapshot(directory), expected);
    return release;
  };
  try { return create(); }
  catch (error) { if (error.code !== 'EEXIST') throw error; }
  const previous = snapshot(directory);
  if (!stale(previous, staleAfterMs)) return null;
  const detached = detach(directory, previous);
  if (!detached) return null;
  fs.rmSync(detached, { recursive: true, force: true });
  try { return create(); }
  catch (error) { if (error.code === 'EEXIST') return null; throw error; }
}

export { takeSessionLock };
