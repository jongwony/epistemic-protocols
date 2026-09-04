// Tests for hooks/route.ts — the function-hooks realization of the trigger
// and the catalog. The module is driven with a fake `on` and a fake `$`, so
// what it registers, what it attaches, and which parts of the engine
// interface it touches are all checked without a host.
// Run with: node --test  (Node strips the module's type-only import itself.)

import { test } from "node:test";
import assert from "node:assert/strict";
import { register } from "./route.ts";
import { DIRECTIVE } from "../../route/scripts/route-prompt.mjs";
import { THIN_OPENER } from "../../route/scripts/route-session.mjs";
import { TABLE_HEADER } from "../../route/scripts/route-protocols.mjs";

const TABLE = `${TABLE_HEADER}\n/induce FrameworkAbsent\n/inquire IntentUnknown`;

// A fake engine interface: every noun is a Proxy that records the path of
// each call, so the trust claim — which parts of `$` the module touches —
// is checked rather than asserted.
function fakeEngine({ table = TABLE, turns = 10, exitCode = 0, store = new Map() } = {}) {
  const touched = new Set();
  const impl = {
    "plugin.root": "/plugins/route-module",
    "process.run": async (argv) => {
      assert.equal(argv[0], "node");
      assert.match(argv[1], /\/plugins\/route-module\/scripts\/catalog\.mjs$/);
      return { exitCode, stdout: `${table}\n`, stderr: "" };
    },
    "session.id": async () => "sess-1",
    "session.turnCount": async () => turns,
    "store.get": async (k) => store.get(k),
    "store.set": async (k, v) => { store.set(k, v); },
    "store.delete": async (k) => { store.delete(k); },
  };
  function node(prefix) {
    return new Proxy(() => {}, {
      get(_, prop) {
        const path = prefix ? `${prefix}.${String(prop)}` : String(prop);
        if (path in impl && typeof impl[path] !== "function") {
          touched.add(path);
          return impl[path];
        }
        return node(path);
      },
      apply(_, __, args) {
        touched.add(prefix);
        if (!(prefix in impl)) throw new Error(`untouched by contract: $.${prefix}`);
        return impl[prefix](...args);
      },
    });
  }
  return { $: node(""), touched, store };
}

async function load(opts) {
  const hooks = new Map();
  register((event, hook) => hooks.set(event, hook), {});
  const eng = fakeEngine(opts);
  await hooks.get("session.start")(eng.$, { cwd: "/w", surface: null, interactive: false }, async (e) => ({ cwd: e.cwd }));
  return { hooks, ...eng };
}

test("registers exactly the four events the trigger and the catalog need", () => {
  const events = [];
  register((event) => events.push(event), {});
  assert.deepEqual(events.sort(), ["prompt.context", "prompt.submit", "session.start", "skill.prompt"]);
});

test("the directive and the opener are the same text route's command hooks emit", () => {
  // Two realizations, one wording: a drift here would make the two hosts
  // read different firing conditions.
  assert.match(DIRECTIVE, /invoke \/route\./);
  assert.match(THIN_OPENER, /invoke \/route before object-level work\./);
});

test("catalog: session.start derives the table on the host, prompt.context appends it as one block", async () => {
  const { hooks, $, touched } = await load();
  const r = await hooks.get("prompt.context")($, { blocks: [{ name: "claudeMd", text: "x" }] }, async (e) => e);
  assert.equal(r.blocks.length, 2);
  assert.deepEqual(r.blocks[0], { name: "claudeMd", text: "x" });
  assert.equal(r.blocks[1].name, "route");
  assert.equal(r.blocks[1].text, TABLE);
  assert.ok(touched.has("process.run"));
});

test("catalog: a derivation shortfall leaves the context untouched (fail open)", async () => {
  const { hooks, $ } = await load({ exitCode: 1 });
  const blocks = [{ name: "claudeMd", text: "x" }];
  const r = await hooks.get("prompt.context")($, { blocks }, async (e) => e);
  assert.deepEqual(r.blocks, blocks);
});

test("trigger: prompt.submit attaches the directive as context, not as prompt text", async () => {
  const { hooks, $ } = await load({ turns: 10 });
  const e = { text: "fix the bug", wait: false, origin: { kind: "user" } };
  const r = await hooks.get("prompt.submit")($, e, async (x) => ({ text: x.text, context: ["other"] }));
  assert.equal(r.text, "fix the bug");
  assert.deepEqual(r.context, ["other", DIRECTIVE]);
});

test("trigger: the thin opener precedes the directive while the session has few turns, then stops", async () => {
  const thin = await load({ turns: 1 });
  const r1 = await thin.hooks.get("prompt.submit")(thin.$, { text: "hi", wait: false, origin: { kind: "user" } }, async (x) => ({ text: x.text }));
  assert.deepEqual(r1.context, [THIN_OPENER, DIRECTIVE]);
  const settled = await load({ turns: 3 });
  const r2 = await settled.hooks.get("prompt.submit")(settled.$, { text: "hi", wait: false, origin: { kind: "user" } }, async (x) => ({ text: x.text }));
  assert.deepEqual(r2.context, [DIRECTIVE]);
});

test("trigger: a dropped prompt passes through untouched", async () => {
  const { hooks, $ } = await load();
  const r = await hooks.get("prompt.submit")($, { text: "x", wait: false, origin: { kind: "user" } }, async () => ({ drop: "no" }));
  assert.deepEqual(r, { drop: "no" });
});

test("state: a prompt that invokes a catalog protocol gets no directive", async () => {
  const { hooks, $ } = await load({ turns: 10 });
  for (const text of ["/induce", "  /periagoge:induce  something", "/inquire why"]) {
    const r = await hooks.get("prompt.submit")($, { text, wait: false, origin: { kind: "user" } }, async (x) => ({ text: x.text }));
    assert.equal(r.context, undefined, text);
  }
  const r = await hooks.get("prompt.submit")($, { text: "/route", wait: false, origin: { kind: "user" } }, async (x) => ({ text: x.text }));
  assert.deepEqual(r.context, [DIRECTIVE], "/route is not in the catalog and is not suppressed");
});

test("state: skill.prompt on a catalog protocol suppresses the directive on the next prompt only", async () => {
  const { hooks, $, store } = await load({ turns: 10 });
  const sp = await hooks.get("skill.prompt")($, { skill: "periagoge:induce", text: "..." }, async (e) => ({ text: e.text }));
  assert.equal(sp.text, "...");
  assert.equal(store.get("invoked:sess-1"), true);
  const prompt = { text: "the answer", wait: false, origin: { kind: "user" } };
  const r1 = await hooks.get("prompt.submit")($, prompt, async (x) => ({ text: x.text }));
  assert.equal(r1.context, undefined);
  assert.equal(store.has("invoked:sess-1"), false, "the flag is consumed");
  const r2 = await hooks.get("prompt.submit")($, prompt, async (x) => ({ text: x.text }));
  assert.deepEqual(r2.context, [DIRECTIVE]);
});

test("state: a skill outside the catalog sets nothing", async () => {
  const { hooks, $, store } = await load();
  await hooks.get("skill.prompt")($, { skill: "commit", text: "" }, async (e) => ({ text: e.text }));
  assert.equal(store.size, 0);
});

test("trust: the module touches only plugin, process.run, session, store — never http, model, fs, ui", async () => {
  const { hooks, $, touched } = await load({ turns: 1 });
  await hooks.get("prompt.context")($, { blocks: [] }, async (e) => e);
  await hooks.get("skill.prompt")($, { skill: "induce", text: "" }, async (e) => ({ text: e.text }));
  await hooks.get("prompt.submit")($, { text: "x", wait: false, origin: { kind: "user" } }, async (x) => ({ text: x.text }));
  const nouns = new Set([...touched].map((p) => p.split(".")[0]));
  assert.deepEqual([...nouns].sort(), ["plugin", "process", "session", "store"]);
});
