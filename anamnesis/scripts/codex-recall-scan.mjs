#!/usr/bin/env node
/**
 * Read-only Codex session scanner for /recollect.
 *
 * Codex stores live sessions under ~/.codex/sessions/YYYY/MM/DD/ and can move
 * recent sessions into ~/.codex/archived_sessions/. session_index.jsonl and
 * history.jsonl are index-lite adjuncts, not replacements for the rollout JSONL.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const DEFAULT_LIMIT = 10;
const SESSION_ID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

function usage() {
  process.stderr.write(`Usage: codex-recall-scan.mjs --query <text> [--cwd <path>] [--limit N] [--json]\n`);
}

function parseArgs(argv) {
  const args = { query: "", cwd: "", limit: DEFAULT_LIMIT, json: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--query" || arg === "-q") args.query = argv[++i] ?? "";
    else if (arg === "--cwd") args.cwd = argv[++i] ?? "";
    else if (arg === "--limit" || arg === "-n") args.limit = Math.max(1, Number(argv[++i] ?? DEFAULT_LIMIT) || DEFAULT_LIMIT);
    else if (arg === "--json") args.json = true;
    else if (arg === "--help" || arg === "-h") {
      usage();
      process.exit(0);
    } else if (!args.query) {
      args.query = arg;
    }
  }
  return args;
}

function codexHome() {
  return process.env.ANAMNESIS_CODEX_HOME ||
    process.env.CODEX_HOME ||
    path.join(os.homedir(), ".codex");
}

function readJsonl(file) {
  const entries = [];
  let raw;
  try {
    raw = fs.readFileSync(file, "utf8");
  } catch {
    return entries;
  }
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    try {
      entries.push(JSON.parse(line));
    } catch {
      // A partially written final line should not break recall scanning.
    }
  }
  return entries;
}

function walkFiles(root, predicate) {
  const out = [];
  const stack = [root];
  while (stack.length > 0) {
    const current = stack.pop();
    let stat;
    try {
      stat = fs.statSync(current);
    } catch {
      continue;
    }
    if (stat.isDirectory()) {
      let entries = [];
      try {
        entries = fs.readdirSync(current, { withFileTypes: true });
      } catch {
        continue;
      }
      for (const entry of entries) stack.push(path.join(current, entry.name));
    } else if (stat.isFile() && predicate(current)) {
      out.push(current);
    }
  }
  return out;
}

function codexRolloutFiles(home, hookIndex = new Map()) {
  const files = new Set();
  for (const hook of hookIndex.values()) {
    if (hook.transcript_path && fs.existsSync(hook.transcript_path)) {
      files.add(hook.transcript_path);
    }
  }
  const sessionsRoot = path.join(home, "sessions");
  const archivedRoot = path.join(home, "archived_sessions");
  for (const file of walkFiles(sessionsRoot, (f) => path.basename(f).startsWith("rollout-") && f.endsWith(".jsonl"))) files.add(file);
  for (const file of walkFiles(archivedRoot, (f) => path.basename(f).startsWith("rollout-") && f.endsWith(".jsonl"))) files.add(file);
  return [...files].sort();
}

function loadSessionIndex(home) {
  const map = new Map();
  for (const entry of readJsonl(path.join(home, "session_index.jsonl"))) {
    if (!entry?.id) continue;
    map.set(entry.id, {
      title: entry.thread_name ?? "",
      updated_at: entry.updated_at ?? "",
    });
  }
  return map;
}

function loadHistory(home) {
  const map = new Map();
  for (const entry of readJsonl(path.join(home, "history.jsonl"))) {
    if (!entry?.session_id || !entry?.text) continue;
    const arr = map.get(entry.session_id) ?? [];
    arr.push({ text: entry.text, ts: entry.ts ?? null });
    map.set(entry.session_id, arr);
  }
  return map;
}

function loadHookIndex(home) {
  const map = new Map();
  for (const entry of readJsonl(path.join(home, "logs", "hooks.log"))) {
    if (!entry?.session_id) continue;
    const existing = map.get(entry.session_id) ?? { event_count: 0, events: new Set() };
    existing.event_count += 1;
    if (entry.event) existing.events.add(entry.event);
    if (entry.hook_event_name) existing.hook_event_name = entry.hook_event_name;
    if (entry.transcript_path) existing.transcript_path = entry.transcript_path;
    if (entry.cwd) existing.cwd = entry.cwd;
    if (entry.timestamp) existing.last_hook_at = entry.timestamp;
    map.set(entry.session_id, existing);
  }
  return map;
}

function contentText(content) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .map((part) => {
      if (!part || typeof part !== "object") return "";
      if (typeof part.text === "string") return part.text;
      if (typeof part.input_text === "string") return part.input_text;
      if (typeof part.output_text === "string") return part.output_text;
      return "";
    })
    .filter(Boolean)
    .join("\n");
}

function parseCodexSession(file, index, history, hookIndex) {
  const entries = readJsonl(file);
  const idFromFile = path.basename(file).match(SESSION_ID_RE)?.[0] ?? "";
  const session = {
    runtime: "codex",
    session_id: idFromFile,
    cwd: "",
    title: "",
    started_at: "",
    updated_at: "",
    path: file,
    source: file.includes(`${path.sep}archived_sessions${path.sep}`) ? "archived_sessions" : "sessions",
    user_texts: [],
    assistant_texts: [],
  };

  for (const entry of entries) {
    if (!session.started_at && entry.timestamp) session.started_at = entry.timestamp;
    if (entry.type === "session_meta") {
      const payload = entry.payload ?? {};
      if (payload.id) session.session_id = payload.id;
      if (payload.cwd) session.cwd = payload.cwd;
      if (payload.timestamp) session.started_at = payload.timestamp;
    } else if (entry.type === "turn_context") {
      if (entry.payload?.cwd) session.cwd = entry.payload.cwd;
    } else if (entry.type === "response_item") {
      const payload = entry.payload ?? {};
      if (payload.type === "message") {
        const text = contentText(payload.content);
        if (!text) continue;
        if (payload.role === "user") session.user_texts.push(text);
        else if (payload.role === "assistant") session.assistant_texts.push(text);
      }
    }
  }

  const indexed = index.get(session.session_id);
  if (indexed) {
    session.title = indexed.title;
    session.updated_at = indexed.updated_at;
  }
  const hook = hookIndex.get(session.session_id);
  if (hook) {
    if (!session.cwd && hook.cwd) session.cwd = hook.cwd;
    session.last_hook_at = hook.last_hook_at ?? "";
    session.hook_events = [...hook.events].sort();
  }
  const prompts = history.get(session.session_id) ?? [];
  for (const prompt of prompts) session.user_texts.push(prompt.text);
  return session;
}

function normalize(s) {
  return String(s ?? "").toLocaleLowerCase();
}

function snippet(text, query) {
  const lower = normalize(text);
  const q = normalize(query);
  const idx = lower.indexOf(q);
  if (idx === -1) return String(text).slice(0, 220);
  const start = Math.max(0, idx - 80);
  return String(text).slice(start, idx + q.length + 140).replace(/\s+/g, " ");
}

function snippetForAnyTerm(text, searchTerms) {
  for (const term of searchTerms) {
    if (normalize(text).includes(term)) return snippet(text, term);
  }
  return String(text).slice(0, 220).replace(/\s+/g, " ");
}

function terms(query) {
  return normalize(query).split(/\s+/).filter((t) => t.length > 1);
}

function scoreSession(session, query, cwdFilter) {
  if (cwdFilter && session.cwd !== cwdFilter) return null;
  const q = normalize(query);
  const ts = terms(query);
  const fields = [
    ["title", session.title, 8],
    ["cwd", session.cwd, 4],
    ["user", session.user_texts.join("\n"), 6],
    ["assistant", session.assistant_texts.join("\n"), 3],
    ["session_id", session.session_id, 20],
    ["path", session.path, 2],
  ];
  let score = 0;
  const matches = [];
  for (const [name, value, weight] of fields) {
    const text = String(value ?? "");
    const lower = normalize(text);
    if (!lower) continue;
    if (q && lower.includes(q)) {
      score += weight * 3;
      matches.push({ field: name, snippet: snippet(text, query) });
    }
    let termMatched = false;
    for (const term of ts) {
      if (lower.includes(term)) {
        score += weight;
        termMatched = true;
      }
    }
    if (termMatched && !matches.some((match) => match.field === name)) {
      matches.push({ field: name, snippet: snippetForAnyTerm(text, ts) });
    }
  }
  if (score === 0) return null;
  return {
    runtime: session.runtime,
    session_id: session.session_id,
    cwd: session.cwd,
    title: session.title,
    started_at: session.started_at,
    updated_at: session.updated_at,
    last_hook_at: session.last_hook_at ?? "",
    hook_events: session.hook_events ?? [],
    source: session.source,
    path: session.path,
    score,
    resume: session.cwd && session.session_id ? `cd ${session.cwd} && codex resume ${session.session_id}` : "",
    matches: matches.slice(0, 3),
  };
}

function scan({ query, cwd, limit }) {
  const home = codexHome();
  const index = loadSessionIndex(home);
  const history = loadHistory(home);
  const hookIndex = loadHookIndex(home);
  const files = codexRolloutFiles(home, hookIndex);
  const candidates = [];
  for (const file of files) {
    const parsed = parseCodexSession(file, index, history, hookIndex);
    const scored = scoreSession(parsed, query, cwd);
    if (scored) candidates.push(scored);
  }
  candidates.sort((a, b) => b.score - a.score || String(b.updated_at || b.started_at).localeCompare(String(a.updated_at || a.started_at)));
  return {
    query,
    cwd_filter: cwd || null,
    codex_home: home,
    candidates: candidates.slice(0, limit),
    scanned: {
      rollout_files: files.length,
      indexed_sessions: index.size,
      history_sessions: history.size,
      hook_sessions: hookIndex.size,
    },
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.query) {
    usage();
    process.exit(2);
  }
  const result = scan(args);
  if (args.json) {
    process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  } else {
    for (const c of result.candidates) {
      process.stdout.write(`${c.score}\t${c.session_id}\t${c.source}\t${c.title || "(untitled)"}\n`);
      if (c.resume) process.stdout.write(`${c.resume}\n`);
    }
  }
}

main();
