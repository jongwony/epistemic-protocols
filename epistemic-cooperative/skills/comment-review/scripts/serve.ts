#!/usr/bin/env bun
// @ts-nocheck — Bun runtime resolves node:* and Bun globals natively; skip TS-LSP noise.
// comment-review channel-loop server (Bun): live preview + selection-anchored feedback channel.
//
// Usage: bun scripts/serve.ts <draft.md> [<draft.md> ...]
//
// Renders each draft as an interactive markdown preview. The user selects text in the
// browser and attaches a comment via a Medium/Hypothes.is-style popup. Each comment
// POSTs to /feedback and appends to feedback-{slug}.jsonl in the draft's directory.
// A WebSocket pushes 'reload' messages whenever the source markdown changes, so the
// next /comment-review iteration's edits appear immediately without manual refresh.
//
// Stop with Ctrl-C. No port collision: Bun.serve(port: 0) lets the OS pick.

import { watch } from "node:fs";
import { appendFile, readdir, readFile } from "node:fs/promises";
import { basename, dirname, extname, resolve } from "node:path";
import { homedir } from "node:os";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("usage: bun scripts/serve.ts <draft.md> [<draft.md> ...]");
  process.exit(1);
}

// Reject flag-shaped args so they don't become phantom draft paths via `resolve()`.
const unknownFlags = args.filter((a) => a.startsWith("-"));
if (unknownFlags.length > 0) {
  console.error(`unknown flag(s): ${unknownFlags.join(", ")}`);
  console.error("usage: bun scripts/serve.ts <draft.md> [<draft.md> ...]");
  process.exit(1);
}

const drafts = new Map<string, string>(); // slug -> absolute path
for (const arg of args) {
  const abs = resolve(arg);
  const slug = basename(abs, extname(abs));
  drafts.set(slug, abs);
}

const SCRIPT_DIR = new URL(".", import.meta.url).pathname;
const TEMPLATES_DIR = resolve(SCRIPT_DIR, "..", "templates");
const TEMPLATE_PATH = resolve(TEMPLATES_DIR, "preview.html");
const MARKED_PATH = resolve(TEMPLATES_DIR, "marked.min.js");

let template: string;
try {
  template = await readFile(TEMPLATE_PATH, "utf8");
} catch (e) {
  console.error(`fatal: cannot read template ${TEMPLATE_PATH}: ${(e as Error).message}`);
  console.error("the skill installation may be incomplete; verify templates/preview.html ships with the skill.");
  process.exit(1);
}

const escapeForScriptTag = (s: string) => s.replace(/<\/script/gi, "<\\/script");
const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

// Validation caps: protect disk + JSONL schema integrity
const MAX_SLUG_LEN = 200;
const MAX_ANCHOR_LEN = 500;
const MAX_CONTEXT_LEN = 200;
const MAX_COMMENT_LEN = 5000;

const renderIndex = () => {
  const items = [...drafts.keys()]
    .map((s) => `<li><a href="/preview/${encodeURIComponent(s)}">${escapeHtml(s)}</a></li>`)
    .join("\n");
  return `<!doctype html><html><head><meta charset=utf-8>
<title>comment-review</title>
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;max-width:600px;margin:3em auto;padding:0 1em;line-height:1.6;color:#222}
  ul{padding-left:1.2em}li{margin:.4em 0}
  a{color:#2c7be5;text-decoration:none}a:hover{text-decoration:underline}
  code{background:#f3f3f3;padding:.1em .3em;border-radius:3px;font-family:ui-monospace,monospace;font-size:.9em}
</style>
</head><body><h1>comment-review drafts</h1><ul>${items}</ul>
<p>Select text in the rendered draft and leave a comment in the popup. Each comment appends to
<code>feedback-{slug}.jsonl</code> next to the source markdown. The next <code>/comment-review</code>
turn ingests these as <code>&lt;feedback&gt;</code>-anchored directives.</p>
</body></html>`;
};

// Strip YAML frontmatter so marked.js renders body only. Anchor matching in the revision
// loop still works because feedback anchors are captured from rendered body text and then
// located in the source file via plain string search — frontmatter rarely shares verbatim
// runs with body prose.
const stripFrontmatter = (md: string) => {
  const m = md.match(/^---\r?\n[\s\S]*?\r?\n---\r?(?:\n|$)/);
  return m ? md.slice(m[0].length) : md;
};

// TaskList-backed finding store — read-only view onto the harness task store.
// Per SKILL.md "TaskList File as Sync Medium": tasks live under
// ~/.claude/tasks/<session-uuid>/<task-id>.json (per-session directories).
// We scan every session subdirectory and filter entries whose description carries
// the artifact slug tag, so findings created in earlier sessions remain visible
// until completed (preserves hermeneutic cycle across sessions).
//
// Override the task root via COMMENT_REVIEW_TASK_ROOT for testing; defaults to
// the harness-managed location.
const TASK_ROOT = process.env.COMMENT_REVIEW_TASK_ROOT
  ? resolve(process.env.COMMENT_REVIEW_TASK_ROOT)
  : resolve(homedir(), ".claude", "tasks");

interface TaskEntry {
  id?: string;
  subject?: string;
  description?: string;
  activeForm?: string;
  status?: string;
  blocks?: unknown;
  blockedBy?: unknown;
  owner?: string;
}

interface Finding {
  id: string;
  subject: string;
  description: string;
  status: string;
  // Parsed inline tags (best-effort; missing tags become empty strings)
  anchor: string;       // [anchor: ...] payload — empty when absent
  anchorId: string;     // [anchor-id: <UUID>] payload — preferred over anchor for ambiguity-free DOM lookup
  subProtocol: string;  // [sub-protocol: ...] payload — empty when absent
  round: string;        // [round: K] payload — empty when absent
  // The raw description body with inline tags stripped, for display
  body: string;
}

// Inline-tag parser: extracts `[key: value]` from description text.
// Returns the payload string or "" when the tag is absent. Tag bodies may not
// contain ']' (the inline format does not escape closing brackets).
const extractTag = (text: string, key: string): string => {
  const re = new RegExp("\\[" + key + ":\\s*([^\\]]*)\\]");
  const m = text.match(re);
  return m ? m[1].trim() : "";
};

// Strip all known inline tags from the description so the displayed body is clean.
const stripTags = (text: string): string =>
  text.replace(/\[(?:anchor|anchor-id|sub-protocol|round|slug|disposition-options):\s*[^\]]*\]/g, "").trim();

const readTaskListForSlug = async (slug: string): Promise<Finding[]> => {
  let sessions: string[];
  try {
    sessions = await readdir(TASK_ROOT);
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
    console.error(`[tasks] readdir ${TASK_ROOT} failed: ${(e as Error).message}`);
    return [];
  }

  const slugTag = `[slug: ${slug}]`;

  // Sessions and per-session task files scan in parallel — pure I/O, trivially batchable.
  // Per-session readdir failure (ENOTDIR for plain files, ENOENT for vanished entries)
  // is treated as "no tasks here, skip" via the catch — no separate stat pre-check.
  const perSession = await Promise.all(
    sessions.map(async (sessionDir): Promise<Finding[]> => {
      const sessionPath = resolve(TASK_ROOT, sessionDir);
      let taskFiles: string[];
      try {
        taskFiles = await readdir(sessionPath);
      } catch {
        return [];
      }

      const perFile = await Promise.all(
        taskFiles
          .filter((f) => f.endsWith(".json"))
          .map(async (file): Promise<Finding | null> => {
            const taskPath = resolve(sessionPath, file);
            let raw: string;
            try {
              raw = await readFile(taskPath, "utf8");
            } catch {
              return null; // task disappeared or unreadable
            }
            // Pre-parse fast path: skip JSON.parse for tasks not carrying this slug.
            // Most session dirs hold tasks unrelated to the current draft.
            if (!raw.includes(slugTag)) return null;
            let task: TaskEntry;
            try {
              task = JSON.parse(raw) as TaskEntry;
            } catch {
              return null; // malformed JSON
            }
            const desc = typeof task.description === "string" ? task.description : "";
            if (!desc.includes(slugTag)) return null;
            if (task.status === "completed" || task.status === "deleted") return null;

            return {
              id: typeof task.id === "string" ? task.id : file.replace(/\.json$/, ""),
              subject: typeof task.subject === "string" ? task.subject : "",
              description: desc,
              status: typeof task.status === "string" ? task.status : "pending",
              anchor: extractTag(desc, "anchor"),
              anchorId: extractTag(desc, "anchor-id"),
              subProtocol: extractTag(desc, "sub-protocol"),
              round: extractTag(desc, "round"),
              body: stripTags(desc),
            };
          }),
      );

      return perFile.filter((f): f is Finding => f !== null);
    }),
  );

  return perSession.flat();
};

const renderPreview = async (slug: string) => {
  const path = drafts.get(slug);
  if (!path) return null;
  const md = stripFrontmatter(await readFile(path, "utf8"));
  const findings = await readTaskListForSlug(slug);
  // title goes into HTML context (escape & < > " '); slug goes into JS string literal context (JSON.stringify)
  // findings goes into JS context (JSON.stringify with script-tag-safe escaping)
  return template
    .replaceAll("__TITLE_PLACEHOLDER__", escapeHtml(slug))
    .replaceAll("__SLUG_PLACEHOLDER__", JSON.stringify(slug))
    .replace("__FINDINGS_PLACEHOLDER__", escapeForScriptTag(JSON.stringify(findings)))
    .replace("__MARKDOWN_CONTENT_PLACEHOLDER__", escapeForScriptTag(md));
};

interface FeedbackBody {
  slug: string;
  anchor: string;
  context_before?: string;
  context_after?: string;
  comment: string;
  id?: string; // optional on POST: present for edits (re-uses original id), absent for new entries
}

interface DeleteBody {
  slug: string;
  id: string;
}

const MAX_ID_LEN = 128;

const server = Bun.serve({
  hostname: "127.0.0.1", // bind to loopback only — drafts and feedback are user-private
  port: 0,
  async fetch(req, srv) {
    const url = new URL(req.url);

    if (url.pathname === "/") {
      return new Response(renderIndex(), { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
    }

    if (url.pathname.startsWith("/preview/")) {
      const slug = decodeURIComponent(url.pathname.slice("/preview/".length));
      try {
        const html = await renderPreview(slug);
        if (!html) return new Response("not found", { status: 404 });
        return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
      } catch (e) {
        console.error(`[preview] render failed for slug=${slug}: ${(e as Error).message}`);
        return new Response("render failed", { status: 500 });
      }
    }

    if (url.pathname === "/marked.min.js") {
      return new Response(Bun.file(MARKED_PATH), {
        headers: { "Content-Type": "application/javascript; charset=utf-8" },
      });
    }

    // Server is tag-agnostic: persists every comment as one JSONL line; the apply
    // step interprets `[disposition: …] [task: …]` tags downstream (see SKILL.md).
    if (url.pathname === "/feedback" && req.method === "POST") {
      let body: FeedbackBody;
      try {
        body = (await req.json()) as FeedbackBody;
      } catch {
        return new Response("invalid JSON", { status: 400 });
      }
      // type guards + length caps to protect disk and JSONL schema
      const isStr = (v: unknown): v is string => typeof v === "string";
      if (!isStr(body.slug) || !isStr(body.anchor) || !isStr(body.comment)) {
        return new Response("missing or non-string fields", { status: 400 });
      }
      if (body.context_before != null && !isStr(body.context_before)) return new Response("context_before must be string", { status: 400 });
      if (body.context_after != null && !isStr(body.context_after)) return new Response("context_after must be string", { status: 400 });
      if (body.anchor.length === 0 || body.comment.length === 0) {
        return new Response("anchor and comment must be non-empty", { status: 400 });
      }
      if (body.slug.length > MAX_SLUG_LEN) return new Response(`slug exceeds ${MAX_SLUG_LEN} chars`, { status: 413 });
      if (body.anchor.length > MAX_ANCHOR_LEN) return new Response(`anchor exceeds ${MAX_ANCHOR_LEN} chars`, { status: 413 });
      if (body.comment.length > MAX_COMMENT_LEN) return new Response(`comment exceeds ${MAX_COMMENT_LEN} chars`, { status: 413 });
      if ((body.context_before?.length ?? 0) > MAX_CONTEXT_LEN) return new Response(`context_before exceeds ${MAX_CONTEXT_LEN} chars`, { status: 413 });
      if ((body.context_after?.length ?? 0) > MAX_CONTEXT_LEN) return new Response(`context_after exceeds ${MAX_CONTEXT_LEN} chars`, { status: 413 });
      const draft = drafts.get(body.slug);
      if (!draft) return new Response("unknown slug", { status: 400 });
      // Edit case: client supplies the original id so the new entry shares the dedup key
      // (latest-timestamp wins). New case: server mints a UUID — guarantees uniqueness so
      // two distinct annotations with identical (anchor, context) windows never collide.
      let id: string;
      if (isStr(body.id) && body.id.length > 0 && body.id.length <= MAX_ID_LEN) {
        id = body.id;
      } else if (body.id != null) {
        return new Response(`id must be string ≤${MAX_ID_LEN} chars`, { status: 400 });
      } else {
        id = crypto.randomUUID();
      }
      const entry = {
        id,
        slug: body.slug,
        anchor: body.anchor,
        context_before: body.context_before ?? "",
        context_after: body.context_after ?? "",
        comment: body.comment,
        timestamp: new Date().toISOString(),
      };
      const feedbackPath = resolve(dirname(draft), `feedback-${body.slug}.jsonl`);
      // surface I/O failures (disk full, permission denied) instead of silent loss
      try {
        await appendFile(feedbackPath, JSON.stringify(entry) + "\n", "utf8");
      } catch (e) {
        const msg = (e as Error).message;
        console.error(`[feedback] FAILED to append ${feedbackPath}: ${msg}`);
        return new Response(`feedback write failed: ${msg}`, { status: 500 });
      }
      console.error(`[feedback] ${body.slug} id=${id.slice(0, 8)}… ← "${body.anchor.slice(0, 50)}${body.anchor.length > 50 ? "…" : ""}"`);
      return Response.json({ ok: true, id, path: feedbackPath });
    }

    if (url.pathname === "/feedback" && req.method === "DELETE") {
      // Tombstone strategy keyed by stable id. Existence check guards against ghost
      // tombstones (DELETE for non-matching key would silently no-op under the prior
      // tuple-based contract). Append-only invariant preserved.
      let body: Partial<DeleteBody>;
      try {
        body = (await req.json()) as Partial<DeleteBody>;
      } catch {
        return new Response("invalid JSON", { status: 400 });
      }
      const isStr = (v: unknown): v is string => typeof v === "string";
      if (!isStr(body.slug) || !isStr(body.id)) {
        return new Response("missing or non-string fields (slug, id)", { status: 400 });
      }
      if (body.id.length === 0) return new Response("id must be non-empty", { status: 400 });
      if (body.slug.length > MAX_SLUG_LEN) return new Response(`slug exceeds ${MAX_SLUG_LEN} chars`, { status: 413 });
      if (body.id.length > MAX_ID_LEN) return new Response(`id exceeds ${MAX_ID_LEN} chars`, { status: 413 });
      const draft = drafts.get(body.slug);
      if (!draft) return new Response("unknown slug", { status: 400 });
      const feedbackPath = resolve(dirname(draft), `feedback-${body.slug}.jsonl`);

      // Existence check: scan JSONL, find latest entry for this id, ensure it is a live
      // (non-tombstoned) annotation. Linear scan acceptable — feedback files are per-draft,
      // typically <1 MB.
      let liveEntry: any = null;
      try {
        const content = await readFile(feedbackPath, "utf8");
        let latest: any = null;
        for (const line of content.split("\n")) {
          if (!line.trim()) continue;
          try {
            const e = JSON.parse(line);
            if (e.id !== body.id) continue;
            if (!latest || (typeof e.timestamp === "string" && (typeof latest.timestamp !== "string" || e.timestamp > latest.timestamp))) {
              latest = e;
            }
          } catch {
            // skip malformed lines — preserves resilience to manual edits
          }
        }
        if (latest && !latest.deleted) liveEntry = latest;
      } catch (e) {
        if ((e as NodeJS.ErrnoException).code !== "ENOENT") {
          const msg = (e as Error).message;
          console.error(`[feedback] DELETE existence check failed for ${feedbackPath}: ${msg}`);
          return new Response(`existence check failed: ${msg}`, { status: 500 });
        }
        // ENOENT — file does not exist, so target id cannot exist; fall through to 404
      }
      if (!liveEntry) {
        return new Response(JSON.stringify({ ok: false, deleted: false, reason: "not found or already deleted" }), {
          status: 404,
          headers: { "Content-Type": "application/json; charset=utf-8" },
        });
      }

      const tombstone = {
        id: body.id,
        slug: body.slug,
        anchor: liveEntry.anchor,
        context_before: liveEntry.context_before ?? "",
        context_after: liveEntry.context_after ?? "",
        comment: "",
        deleted: true,
        timestamp: new Date().toISOString(),
      };
      try {
        await appendFile(feedbackPath, JSON.stringify(tombstone) + "\n", "utf8");
      } catch (e) {
        const msg = (e as Error).message;
        console.error(`[feedback] FAILED to append tombstone ${feedbackPath}: ${msg}`);
        return new Response(`tombstone write failed: ${msg}`, { status: 500 });
      }
      console.error(`[feedback] DELETE ${body.slug} id=${body.id.slice(0, 8)}… ← "${(liveEntry.anchor ?? "").slice(0, 50)}${(liveEntry.anchor ?? "").length > 50 ? "…" : ""}"`);
      return Response.json({ ok: true, id: body.id, deleted: true, path: feedbackPath });
    }

    if (url.pathname === "/ws") {
      if (srv.upgrade(req)) return;
      return new Response("upgrade failed", { status: 400 });
    }

    return new Response("not found", { status: 404 });
  },
  websocket: {
    open(ws) {
      ws.subscribe("reload");
    },
    message() {
      // no inbound traffic expected
    },
  },
});

const lastFire = new Map<string, number>();
const WATCH_DEBOUNCE_MS = 150;
for (const [slug, path] of drafts) {
  const watcher = watch(path, () => {
    const now = Date.now();
    const prev = lastFire.get(slug) ?? 0;
    if (now - prev < WATCH_DEBOUNCE_MS) return;
    lastFire.set(slug, now);
    console.error(`[watch] ${slug} changed → publish reload`);
    server.publish("reload", JSON.stringify({ slug }));
  });
  watcher.on("error", (err: NodeJS.ErrnoException) => {
    console.error(`[watch] error on ${path}: ${err.message} (code=${err.code ?? "unknown"})`);
  });
}

const url = `http://localhost:${server.port}/`;
console.error(`serving at ${url}`);
console.error(`drafts: ${[...drafts.keys()].join(", ")}`);
console.error("Ctrl-C to stop.");

const opener = Bun.which("open") ?? Bun.which("xdg-open");
if (opener) {
  Bun.spawn([opener, url], { stdout: "ignore", stderr: "ignore" });
}
