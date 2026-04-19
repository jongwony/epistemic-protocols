#!/usr/bin/env bun
// @ts-nocheck — Bun runtime resolves node:* and Bun globals natively; skip TS-LSP noise.
// write-review channel-loop server (Bun): live preview + selection-anchored feedback channel.
//
// Usage: bun scripts/serve.ts <draft.md> [<draft.md> ...]
//
// Renders each draft as an interactive markdown preview. The user selects text in the
// browser and attaches a comment via a Medium/Hypothes.is-style popup. Each comment
// POSTs to /feedback and appends to feedback-{slug}.jsonl in the draft's directory.
// A WebSocket pushes 'reload' messages whenever the source markdown changes, so the
// next /write-review iteration's edits appear immediately without manual refresh.
//
// Stop with Ctrl-C. No port collision: Bun.serve(port: 0) lets the OS pick.

import { watch } from "node:fs";
import { appendFile, readFile } from "node:fs/promises";
import { basename, dirname, extname, resolve } from "node:path";

const args = process.argv.slice(2);
if (args.length === 0) {
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

// Validation caps (M5): protect disk + JSONL schema integrity
const MAX_ANCHOR_LEN = 500;
const MAX_CONTEXT_LEN = 200;
const MAX_COMMENT_LEN = 5000;

const renderIndex = () => {
  const items = [...drafts.keys()]
    .map((s) => `<li><a href="/preview/${encodeURIComponent(s)}">${escapeHtml(s)}</a></li>`)
    .join("\n");
  return `<!doctype html><html><head><meta charset=utf-8>
<title>write-review</title>
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;max-width:600px;margin:3em auto;padding:0 1em;line-height:1.6;color:#222}
  ul{padding-left:1.2em}li{margin:.4em 0}
  a{color:#2c7be5;text-decoration:none}a:hover{text-decoration:underline}
  code{background:#f3f3f3;padding:.1em .3em;border-radius:3px;font-family:ui-monospace,monospace;font-size:.9em}
</style>
</head><body><h1>write-review drafts</h1><ul>${items}</ul>
<p>Select text in the rendered draft and leave a comment in the popup. Each comment appends to
<code>feedback-{slug}.jsonl</code> next to the source markdown. The next <code>/write-review</code>
turn ingests these as <code>&lt;feedback&gt;</code>-anchored directives.</p>
</body></html>`;
};

// Strip YAML frontmatter so marked.js renders body only. Anchor matching in the revision
// loop still works because feedback anchors are captured from rendered body text and then
// located in the source file via plain string search — frontmatter rarely shares verbatim
// runs with body prose.
const stripFrontmatter = (md: string) => {
  const m = md.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  return m ? md.slice(m[0].length) : md;
};

const renderPreview = async (slug: string) => {
  const path = drafts.get(slug);
  if (!path) return null;
  const md = stripFrontmatter(await readFile(path, "utf8"));
  // C3: title goes into HTML context (escape & < > " '); slug goes into JS string literal context (JSON.stringify)
  return template
    .replaceAll("__TITLE_PLACEHOLDER__", escapeHtml(slug))
    .replaceAll("__SLUG_PLACEHOLDER__", JSON.stringify(slug))
    .replace("__MARKDOWN_CONTENT_PLACEHOLDER__", escapeForScriptTag(md));
};

interface FeedbackBody {
  slug: string;
  anchor: string;
  context_before?: string;
  context_after?: string;
  comment: string;
}

const server = Bun.serve({
  hostname: "127.0.0.1", // M2: bind to loopback only — drafts and feedback are user-private
  port: 0,
  async fetch(req, srv) {
    const url = new URL(req.url);

    if (url.pathname === "/") {
      return new Response(renderIndex(), { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    if (url.pathname.startsWith("/preview/")) {
      const slug = decodeURIComponent(url.pathname.slice("/preview/".length));
      const html = await renderPreview(slug);
      if (!html) return new Response("not found", { status: 404 });
      return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    if (url.pathname === "/marked.min.js") {
      return new Response(Bun.file(MARKED_PATH), {
        headers: { "Content-Type": "application/javascript; charset=utf-8" },
      });
    }

    if (url.pathname === "/feedback" && req.method === "POST") {
      let body: FeedbackBody;
      try {
        body = (await req.json()) as FeedbackBody;
      } catch {
        return new Response("invalid JSON", { status: 400 });
      }
      // M5: type guards + length caps to protect disk and JSONL schema
      const isStr = (v: unknown): v is string => typeof v === "string";
      if (!isStr(body.slug) || !isStr(body.anchor) || !isStr(body.comment)) {
        return new Response("missing or non-string fields", { status: 400 });
      }
      if (body.context_before != null && !isStr(body.context_before)) return new Response("context_before must be string", { status: 400 });
      if (body.context_after != null && !isStr(body.context_after)) return new Response("context_after must be string", { status: 400 });
      if (body.anchor.length === 0 || body.comment.length === 0) {
        return new Response("anchor and comment must be non-empty", { status: 400 });
      }
      if (body.anchor.length > MAX_ANCHOR_LEN) return new Response(`anchor exceeds ${MAX_ANCHOR_LEN} chars`, { status: 413 });
      if (body.comment.length > MAX_COMMENT_LEN) return new Response(`comment exceeds ${MAX_COMMENT_LEN} chars`, { status: 413 });
      if ((body.context_before?.length ?? 0) > MAX_CONTEXT_LEN) return new Response(`context_before exceeds ${MAX_CONTEXT_LEN} chars`, { status: 413 });
      if ((body.context_after?.length ?? 0) > MAX_CONTEXT_LEN) return new Response(`context_after exceeds ${MAX_CONTEXT_LEN} chars`, { status: 413 });
      const draft = drafts.get(body.slug);
      if (!draft) return new Response("unknown slug", { status: 400 });
      const entry = {
        slug: body.slug,
        anchor: body.anchor,
        context_before: body.context_before ?? "",
        context_after: body.context_after ?? "",
        comment: body.comment,
        timestamp: new Date().toISOString(),
      };
      const feedbackPath = resolve(dirname(draft), `feedback-${body.slug}.jsonl`);
      // C2: surface I/O failures (disk full, permission denied) instead of silent loss
      try {
        await appendFile(feedbackPath, JSON.stringify(entry) + "\n", "utf8");
      } catch (e) {
        const msg = (e as Error).message;
        console.error(`[feedback] FAILED to append ${feedbackPath}: ${msg}`);
        return new Response(`feedback write failed: ${msg}`, { status: 500 });
      }
      console.error(`[feedback] ${body.slug} ← "${body.anchor.slice(0, 50)}${body.anchor.length > 50 ? "…" : ""}"`);
      return Response.json({ ok: true, path: feedbackPath });
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
  watch(path, () => {
    const now = Date.now();
    const prev = lastFire.get(slug) ?? 0;
    if (now - prev < WATCH_DEBOUNCE_MS) return;
    lastFire.set(slug, now);
    console.error(`[watch] ${slug} changed → publish reload`);
    server.publish("reload", JSON.stringify({ slug }));
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
