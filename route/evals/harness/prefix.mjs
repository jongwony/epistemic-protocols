/**
 * The synthetic prefix a `long` cell places before the case's conversation.
 *
 * What a late-turn arm needs is distance: the session-start index sitting far
 * from the end of the context, with ordinary work in between. So the prefix
 * is a coding session on an unrelated service — a ledger API in TypeScript —
 * in user/assistant text turns: a request, then an answer carrying code and
 * its explanation. It names no file the case scaffolds hold, touches none of
 * the moments the cases grade (no rule to record, no delegation, no open
 * judgment, no report to accept), and its assistant turns propose rather than
 * claim to have run anything, so what it adds is length rather than a
 * precedent the graded action could follow.
 *
 * It is generated, not stored, and deterministic: the same seed and size give
 * the same turns, so every cell of a run — and every run at that size — sees
 * one prefix. Text turns only: a real session's tool calls and results are
 * not reproduced, which is a known difference from the conversation a long
 * session actually accumulates.
 *
 * Zero external dependencies: Node.js standard library only.
 */

/** Token estimate used everywhere in this harness: characters over four. */
function estimateTokens(text) {
  return Math.ceil(String(text ?? "").length / 4);
}

/** mulberry32 — a small deterministic PRNG. */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ENTITIES = [
  { name: "account", plural: "accounts", type: "Account", field: "balanceCents" },
  { name: "transfer", plural: "transfers", type: "Transfer", field: "amountCents" },
  { name: "invoice", plural: "invoices", type: "Invoice", field: "totalCents" },
  { name: "journal entry", plural: "journal-entries", type: "JournalEntry", field: "debitCents" },
  { name: "statement", plural: "statements", type: "Statement", field: "closingCents" },
  { name: "payout", plural: "payouts", type: "Payout", field: "netCents" },
  { name: "refund", plural: "refunds", type: "Refund", field: "amountCents" },
  { name: "ledger", plural: "ledgers", type: "Ledger", field: "openingCents" },
];

const camel = (s) => s.replace(/[- ](\w)/g, (_, c) => c.toUpperCase());

// Each template takes an entity and a variant number and returns one
// exchange. The variant only changes names and numbers, so two exchanges
// built from one template differ the way two days' work on one codebase do.
const TEMPLATES = [
  (e, v) => ({
    user: `GET /${e.plural}/:id returns 500 when the ${e.name} has no rows yet. Stack trace points at services/ledger/src/routes/${e.plural}.ts line ${40 + v}. Can you look at the handler?`,
    assistant: `The handler reads \`rows[0].${e.field}\` without checking that the query returned anything, so an empty result throws a TypeError that the error middleware turns into a 500. A missing ${e.name} should be a 404, and an existing one with no activity should report zero.

\`\`\`ts
router.get("/${e.plural}/:id", async (req, res, next) => {
  try {
    const ${camel(e.name)} = await repo.find${e.type}(req.params.id);
    if (!${camel(e.name)}) return res.status(404).json({ error: "${e.name} not found" });
    const rows = await repo.list${e.type}Rows(${camel(e.name)}.id, { limit: ${50 + v} });
    const ${e.field} = rows.length ? rows[0].${e.field} : 0;
    res.json({ id: ${camel(e.name)}.id, ${e.field}, updatedAt: rows[0]?.createdAt ?? null });
  } catch (err) {
    next(err);
  }
});
\`\`\`

Two things change: the lookup distinguishes "no such ${e.name}" from "no rows", and \`${e.field}\` falls back to 0 instead of dereferencing \`undefined\`. The \`updatedAt\` uses optional chaining for the same reason. If you want the empty case covered, a test that seeds a ${e.name} with no rows and expects \`{ ${e.field}: 0, updatedAt: null }\` would pin it.`,
  }),
  (e, v) => ({
    user: `Write a unit test for the ${e.name} serializer in services/ledger/src/serializers/${e.plural}.ts — it should cover the cents-to-decimal conversion and negative amounts.`,
    assistant: `Here is a test using the existing vitest setup. It drives the serializer through its public function rather than the private helpers, so it survives refactors of the formatting code.

\`\`\`ts
import { describe, expect, it } from "vitest";
import { serialize${e.type} } from "../src/serializers/${e.plural}";

describe("serialize${e.type}", () => {
  it("converts cents to a decimal string", () => {
    expect(serialize${e.type}({ id: "x${v}", ${e.field}: ${1000 + v * 7} }).${e.field.replace("Cents", "")}).toBe("${((1000 + v * 7) / 100).toFixed(2)}");
  });

  it("keeps the sign on negative amounts", () => {
    expect(serialize${e.type}({ id: "y${v}", ${e.field}: -${250 + v} }).${e.field.replace("Cents", "")}).toBe("-${((250 + v) / 100).toFixed(2)}");
  });

  it("formats zero without a sign", () => {
    expect(serialize${e.type}({ id: "z${v}", ${e.field}: 0 }).${e.field.replace("Cents", "")}).toBe("0.00");
  });
});
\`\`\`

The zero case is there because \`-0 / 100\` formats as "-0.00" with \`toFixed\` if the value ever comes through as negative zero, which happens when a debit and a credit of the same size are summed in floating point upstream.`,
  }),
  (e, v) => ({
    user: `The ${e.plural} list endpoint is slow on big tenants — ${2 + (v % 5)}s p95. What would you change?`,
    assistant: `The query plan is the first thing to check, but from the code there are two likely causes. The list query sorts on \`created_at\` without an index that starts with \`tenant_id\`, so Postgres scans every tenant's rows and filters; and the handler loads each ${e.name}'s owner in a loop, which is an N+1.

An index that matches the filter and the sort:

\`\`\`sql
CREATE INDEX CONCURRENTLY idx_${e.plural.replace(/-/g, "_")}_tenant_created
  ON ${e.plural.replace(/-/g, "_")} (tenant_id, created_at DESC);
\`\`\`

And one query for the owners instead of one per row:

\`\`\`ts
const rows = await db.${camel(e.plural)}.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" }, take: ${100 + v} });
const owners = await db.users.findMany({ where: { id: { in: [...new Set(rows.map((r) => r.ownerId))] } } });
const byId = new Map(owners.map((o) => [o.id, o]));
return rows.map((r) => ({ ...r, owner: byId.get(r.ownerId) ?? null }));
\`\`\`

\`CONCURRENTLY\` avoids locking writes while the index builds, at the cost of not being allowed inside a transaction — so it needs its own migration file rather than joining one that does other work.`,
  }),
  (e, v) => ({
    user: `I'm getting "Type '${e.type} | undefined' is not assignable to type '${e.type}'" in services/ledger/src/jobs/reconcile-${e.plural}.ts after the TypeScript bump. What's the right fix?`,
    assistant: `The bump turned on \`noUncheckedIndexedAccess\` (it came in with the shared tsconfig), so indexing an array or a record now yields \`T | undefined\`. The error is pointing at a real gap: \`batch[i]\` can be undefined when the batch is shorter than expected.

Rather than a non-null assertion, iterate the values directly:

\`\`\`ts
for (const ${camel(e.name)} of batch) {
  const expected = totals.get(${camel(e.name)}.id);
  if (expected === undefined) {
    log.warn({ id: ${camel(e.name)}.id }, "no expected total; skipping");
    continue;
  }
  if (expected !== ${camel(e.name)}.${e.field}) mismatches.push({ id: ${camel(e.name)}.id, expected, actual: ${camel(e.name)}.${e.field} });
}
\`\`\`

\`Map.get\` already returns \`T | undefined\`, so the explicit check there is what the compiler wants anyway. Batch size ${200 + v * 3} stays as it is; the loop no longer depends on it.`,
  }),
  (e, v) => ({
    user: `Can you explain what the ${e.name} rounding helper in services/ledger/src/money.ts is doing? Someone asked in review and I couldn't answer.`,
    assistant: `It implements banker's rounding (round half to even) on integer cents after a rate is applied:

\`\`\`ts
export function applyRate(cents: number, rate: number): number {
  const raw = cents * rate;
  const floor = Math.floor(raw);
  const frac = raw - floor;
  if (Math.abs(frac - 0.5) < 1e-9) return floor % 2 === 0 ? floor : floor + 1;
  return Math.round(raw);
}
\`\`\`

The reason is aggregate bias. Rounding every half up adds, on average, a quarter cent per half-way value; over ${1000 * (v + 1)} ${e.plural} a day that drifts the ledger away from the processor's totals, which round half to even. Matching their rule means a reconciliation compares like with like.

The \`1e-9\` tolerance is there because \`cents * rate\` is a float multiplication, and a value that is exactly .5 on paper can come out as .49999999 or .50000001.`,
  }),
  (e, v) => ({
    user: `Add pagination to GET /${e.plural} — cursor-based, not offset.`,
    assistant: `A cursor encodes the sort key of the last row returned, so the next page starts strictly after it and inserts between requests do not shift pages. Since the list is ordered by \`(created_at, id)\`, the cursor carries both:

\`\`\`ts
const PAGE = ${25 + (v % 4) * 25};

function encodeCursor(row: { createdAt: Date; id: string }) {
  return Buffer.from(JSON.stringify([row.createdAt.toISOString(), row.id])).toString("base64url");
}

function decodeCursor(cursor: string): [string, string] {
  return JSON.parse(Buffer.from(cursor, "base64url").toString("utf8"));
}

router.get("/${e.plural}", async (req, res) => {
  const after = typeof req.query.cursor === "string" ? decodeCursor(req.query.cursor) : null;
  const rows = await repo.list${e.type}s({ tenantId: req.tenantId, after, limit: PAGE + 1 });
  const page = rows.slice(0, PAGE);
  res.json({ items: page, nextCursor: rows.length > PAGE ? encodeCursor(page[page.length - 1]) : null });
});
\`\`\`

Fetching \`PAGE + 1\` rows tells you whether there is a next page without a second count query. The repository query needs \`WHERE (created_at, id) < ($1, $2)\` for the descending order; the tuple comparison keeps ties on \`created_at\` stable.`,
  }),
  (e, v) => ({
    user: `The migration that adds ${e.plural}.currency failed in staging with "column contains null values". How do we get it through?`,
    assistant: `The migration adds the column as \`NOT NULL\` in one step, and staging has existing rows, so Postgres cannot satisfy the constraint. Split it into add, backfill, constrain:

\`\`\`sql
-- ${String(v).padStart(4, "0")}_add_${e.plural.replace(/-/g, "_")}_currency.sql
ALTER TABLE ${e.plural.replace(/-/g, "_")} ADD COLUMN currency char(3);

UPDATE ${e.plural.replace(/-/g, "_")} t
   SET currency = l.currency
  FROM ledgers l
 WHERE t.ledger_id = l.id AND t.currency IS NULL;

ALTER TABLE ${e.plural.replace(/-/g, "_")} ALTER COLUMN currency SET NOT NULL;
\`\`\`

On a large table the \`UPDATE\` should run in batches outside the migration, because one statement holds row locks for its whole duration. For staging's size a single statement is fine. Rows whose ledger has no currency would still block the last step; a \`SELECT count(*) ... WHERE currency IS NULL\` after the backfill tells you whether any exist.`,
  }),
  (e, v) => ({
    user: `What's a clean way to make the ${e.name} webhook handler idempotent? We get retries from the processor.`,
    assistant: `Record each delivery's event id under a unique constraint and do the work in the same transaction, so a retry either finds the id already there or races and loses on the constraint:

\`\`\`ts
export async function handle${e.type}Event(evt: ProcessorEvent) {
  await db.$transaction(async (tx) => {
    const inserted = await tx.$executeRaw\`
      INSERT INTO processed_events (event_id, received_at) VALUES (\${evt.id}, now())
      ON CONFLICT (event_id) DO NOTHING\`;
    if (inserted === 0) return; // already handled
    await apply${e.type}Change(tx, evt.data);
  });
}
\`\`\`

The order matters: inserting the id first and applying the change in the same transaction means a crash between them rolls both back, and the retry does the work. Keep \`processed_events\` pruned to the processor's retry window — ${3 + (v % 4)} days is their documented maximum — so the table does not grow without bound.`,
  }),
];

// Openers vary how a request arrives, and the ticket reference makes every
// request text unique, as two days' requests on one codebase are.
const OPENERS = [
  "", "Next one.", "Okay, moving on.", "Another from the backlog:", "Quick one:", "From this morning's standup:",
  "Ops flagged this:", "While we're in there:", "Different area now.", "Picking up the next ticket:",
];

/**
 * User/assistant turns totalling about `tokens` (characters over four),
 * starting with a user turn and ending with an assistant turn.
 */
function syntheticPrefix({ tokens = 40000, seed = 152 } = {}) {
  if (!Number.isFinite(tokens) || tokens <= 0) return [];
  const next = rng(seed);
  const turns = [];
  let used = 0;
  let v = 0;
  while (used < tokens) {
    const template = TEMPLATES[Math.floor(next() * TEMPLATES.length)];
    const entity = ENTITIES[Math.floor(next() * ENTITIES.length)];
    const opener = OPENERS[Math.floor(next() * OPENERS.length)];
    const { user, assistant } = template(entity, v);
    const text = `${opener ? `${opener} ` : ""}${user} (LED-${412 + v * 3})`;
    v++;
    turns.push({ role: "user", text }, { role: "assistant", text: assistant });
    used += estimateTokens(text) + estimateTokens(assistant);
  }
  return turns;
}

export { estimateTokens, syntheticPrefix };
