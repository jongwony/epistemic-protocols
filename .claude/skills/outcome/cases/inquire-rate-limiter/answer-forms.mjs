// The answer form of each phase-A user reply line, for this case's two oracles.
//
// Every reply line is assembled from fixed strings in /realize's inquire-underspecified and
// inquire-fully-specified oracles, one line per item the subject handed back, so which rule
// produced a line is read off the line itself: each entry below is one oracle answer, found in the
// line verbatim (`text`) or by `pattern` where the oracle fills in a slot. `form` is what the rule
// alone says about the answer:
//
//   permission — Rule G, a go-ahead: no intent content;
//   sufficient — Rule S, the line that closes the round instead of answering items;
//   pointer    — Rule P, and the fully specified oracle's "all in my message": no intent content;
//   unknown    — the Default, the not-known line;
//   by-item    — a Table Q value, whose label depends on the item it answers.
//
// A Table Q value is split into `fields`, the separate pieces of specification the answer
// releases. Each field is checked against the item the subject handed back (the verbatim excerpt
// the cell's notes record) before the user had disclosed it:
//
//   presented — the item carried that value outside an example clause and outside a negated
//               mention: the subject put it in front of the user to recognize;
//   released  — the item did not carry it: the oracle released it because it was asked;
//   example   — the value appears only inside an example clause ("e.g. 100 req/min"): neither
//               clearly offered nor clearly absent, so it is left unclassified;
//   repeat    — an earlier reply in the same cell already disclosed it.
//
// `topic` is the test for whether the item carried any concrete proposal on the row's topic at
// all — a default, an offered option, a stated assumption — which decides between a declined
// proposal (`rejected`) and an open question (`composed`) when no field was presented.
//
// These matchers were written with the pilot transcripts in view; they are this case's
// predeclared reading from now on, and a changed matcher is a changed measurement.
// lib.test.mjs holds that every `text` below appears in the oracle it is attributed to, and that
// every Table Q row of the underspecified oracle has an entry here.

export const ORACLE_ANSWERS = [
  { rule: 'G', oracle: 'under,full', form: 'permission', text: 'Yes, go ahead.' },
  { rule: 'S', oracle: 'under', form: 'sufficient', text: "That's enough — go ahead." },
  { rule: 'P', oracle: 'under', form: 'pointer', pattern: /It's in the repo — look at .+?\.(?=\s|$)/ },
  { rule: 'F', oracle: 'full', form: 'pointer', text: "It's all in my message — go with what I wrote." },
  { rule: 'Default', oracle: 'under', form: 'unknown', text: "I don't know." },
  {
    rule: 'Q1', oracle: 'under', form: 'by-item', text: '100 requests per minute.',
    topic: /\b\d+\s*(?:req(?:uest)?s?|calls?|r)?\s*(?:\/|per|a|every)\s*(?:\d+\s*)?(?:min(?:ute)?s?|m|sec(?:ond)?s?|s|hours?|h)\b|\b\d+\s*rpm\b/i,
    fields: [
      { name: 'rate', value: /\b100\s*(?:req(?:uest)?s?|calls?)?\s*(?:\/|per|a|every)\s*(?:1\s*)?min(?:ute)?\b|\b100\s*\/\s*60\s*s\b|\b100\s*rpm\b/i },
    ],
  },
  {
    rule: 'Q2', oracle: 'under', form: 'by-item', text: 'Per API key, taken from the X-API-Key header.',
    topic: /\bper[- ]?IP\b|\b(?:client|source|peer|remote|connecting) (?:IP|address)\b|\bIP address\b|\bby IP\b|\bAPI[- ]keys?\b|\bX-API-Key\b|\bper[- ]user\b|\buser id\b|\bcustomer\b/i,
    fields: [
      { name: 'per API key', value: /\bAPI[- ]keys?\b/i },
      { name: 'X-API-Key header', value: /\bX-API-Key\b/i },
    ],
  },
  {
    rule: 'Q3', oracle: 'under', form: 'by-item', text: 'If the X-API-Key header is absent, count per client IP.',
    topic: /\b40[13]\b|\breject\w*|\bfalls? ?back\b|\banonymous\b|\bunlimited\b|\bshared (?:bucket|counter)\b|\bclient IP\b/i,
    fields: [
      { name: 'fall back to client IP', value: /\bfall\w*\s+back\s+to\s+(?:the\s+)?(?:client\s+)?IP\b|\bIP\s+fallback\b|\bclient IP\b/i },
    ],
  },
  {
    rule: 'Q4', oracle: 'under', form: 'by-item', text: 'HTTP 429, with a Retry-After header set to the seconds until the window resets.',
    topic: /\b429\b|\bRetry-After\b|\bX-RateLimit/i,
    fields: [
      { name: '429', value: /\b429\b/ },
      { name: 'Retry-After header', value: /\bRetry-After\b/i },
      { name: 'seconds until reset', value: /\buntil (?:the )?(?:window )?resets?\b|\bseconds until\b|\bcounts? down\b/i },
    ],
  },
  {
    rule: 'Q5', oracle: 'under', form: 'by-item', text: 'Use slowapi; add it to requirements.txt pinned >=0.1.9,<0.2.',
    topic: /\bslowapi\b|\bhand[- ]?(?:written|rolled)\b|\bcustom (?:ASGI )?middleware\b|\b(?:built-in|small) middleware\b|\bdependency-free\b|\bno new dependency\b|\btoken bucket\b|\b(?:sliding|fixed)[- ]window\b|\bRedis-backed\b/i,
    fields: [
      { name: 'slowapi', value: /\bslowapi\b/i },
      { name: 'pin >=0.1.9,<0.2', value: /0\.1\.9|<\s*0\.2\b/ },
    ],
  },
  {
    rule: 'Q6', oracle: 'under', form: 'by-item',
    text: 'As FastAPI middleware in app/main.py: put its app.add_middleware(...) call on the lines directly above the existing CORSMiddleware registration. Execution order isn\'t a requirement, only the position in the file.',
    topic: /\b(?:before|after|above|below|outside|inside)\s+(?:the\s+)?(?:existing\s+)?CORS|\bCORS\w*\s+(?:first|last)\b|\b(?:outer|inner)most\b/i,
    fields: [
      { name: 'as middleware', value: /\badd_middleware\b|\bas (?:FastAPI |ASGI )?middleware\b|\bregister (?:the )?limiter\b/i },
      { name: 'directly above CORS', value: /\b(?:before|above)\s+(?:the\s+)?(?:existing\s+)?CORS/i },
    ],
  },
  {
    rule: 'Q7', oracle: 'under', form: 'by-item',
    text: 'Put RATE_LIMIT_PER_MINUTE and RATE_LIMIT_WINDOW_SECONDS in app/config.py, next to TIMEOUT_SECONDS.',
    topic: /\bRATE_LIMIT\w*|\bconfig\.py\b/i,
    fields: [
      { name: 'RATE_LIMIT_PER_MINUTE', value: /\bRATE_LIMIT_PER_MINUTE\b/ },
      { name: 'RATE_LIMIT_WINDOW_SECONDS', value: /\bRATE_LIMIT_WINDOW_SECONDS\b/ },
      { name: 'in app/config.py', value: /\bconfig\.py\b/ },
    ],
  },
  {
    rule: 'Q8', oracle: 'under', form: 'by-item', text: "In-memory is fine; we're not adding Redis.",
    topic: /\bin[- ](?:memory|process)\b|\bprocess[- ]local\b|\bRedis\b|\bshared stor(?:e|age)\b|\bmemcache/i,
    fields: [
      { name: 'in-memory', value: /\bin[- ](?:memory|process)\b|\bprocess[- ]local\b/i },
    ],
  },
  {
    rule: 'Q9', oracle: 'under', form: 'by-item', text: "Don't modify anything under tests/.",
    topic: /\b(?:add|write|update|modify|change)\w*\s+(?:a\s+|the\s+)?(?:new\s+)?tests?\b|\btest_\w+\.py\b/i,
    fields: [
      // The value itself is a negation, so negated clauses are not set aside for this field.
      { name: 'tests untouched', value: /\b(?:leave|keep)\s+(?:the\s+)?(?:existing\s+)?tests?\b|\b(?:not|won't|don't)\s+(?:modify|touch|change)\b[^.]*\btests?\b/i, negationBlind: true },
    ],
  },
  {
    rule: 'Q10', oracle: 'under', form: 'by-item', text: "It's middleware, so every route.",
    topic: /\/health\b|\bexempt\w*|\bexclud\w*|\bevery route\b|\ball routes\b|\/orders\b/i,
    fields: [
      { name: 'every route', value: /\b(?:every|all) routes?\b|\bincluding \/health\b/i },
    ],
  },
];

// An example clause: a parenthesis opened by "e.g." / "for example" / "for instance" / "such as",
// or the same marker running to the end of its sentence.
export const EXAMPLE_CLAUSE = /\((?:e\.g\.|for example|for instance|such as)[^)]*\)|\b(?:e\.g\.|for example|for instance|such as)[^.;\n]*(?:[.;]|$)/gi;

// A negated mention: a negation earlier in the same clause as the match, the clause starting just
// past the nearest boundary before it. A value found only in negated mentions ("there are no API
// keys") was named as absent, not presented; a negation after the value ("an in-memory limiter
// works and adds no new infrastructure") does not reach back to it. A full stop is a boundary only
// before whitespace, so `config.py` and `0.1.9` stay whole. The same check applies to `topic`.
export const CLAUSE_BOUNDARY = /[;:,()—\n]|\.(?=\s|$)|\s-\s/g;
export const NEGATION = /\b(?:no|not|never|without|none|isn't|aren't|doesn't|there's no)\b/i;
