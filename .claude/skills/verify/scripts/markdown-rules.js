'use strict';

// ============================================================
// Markdown rule extraction, over a CommonMark parse
// ============================================================
// Two checks in static-checks.js read `## Rules` entries out of Markdown: one
// asserts a required rule label is present, the other asserts one rule's body
// is the same in every copy. Both previously read the file as lines and
// approximated Markdown's block structure with regexes, and both leaked in the
// same direction. A line inside a fenced code block depicts a rule, it does not
// carry one — so a rule moved into a fence stops being a rule while a
// line-shaped reading still reports it present and identical, which is the
// packaged contract losing the rule with nothing red anywhere. Patching that
// meant naming fences; then HTML comments; and nothing bounded what came next,
// because the requirement was never "outside a fence" but "outside any
// container that hides content from Markdown's block structure" — an open
// class that cannot be closed by enumerating its members.
//
// Delegating the structure to a CommonMark implementation closes it by
// construction rather than by enumeration: every container the spec defines is
// already a container to the parser, including whichever one nobody here
// thought to name. That is the whole reason a parser is worth a dependency —
// the alternative is re-deriving CommonMark block parsing in regex and calling
// the result Markdown, which is the shape of reasoning the rule under check
// exists to remove.
//
// The dependency's cost is bounded and stated where it is paid: it is a
// devDependency, it is not packaged (nothing under `.claude/skills/verify/`
// ships in a release ZIP), and the enforcement channel that runs these checks
// already presupposes an install. When it is absent the caller reports a fail
// naming the install command — never a silent skip, which would leave the
// assertion standing with nothing re-running it.

let Parser = null;
let parserLoadError = null;
try {
  ({ Parser } = require('commonmark'));
} catch (error) {
  parserLoadError = error;
}

const PARSER_AVAILABLE = Parser !== null;
const PARSER_MISSING_MESSAGE =
  'CommonMark parser unavailable (`commonmark` devDependency not installed) — ' +
  'run `npm install` at the repository root, then re-run static checks. ' +
  `Underlying error: ${parserLoadError ? parserLoadError.message : 'unknown'}`;

function parseDocument(source) {
  return new Parser().parse(source);
}

// ------------------------------------------------------------
// Walking helpers
// ------------------------------------------------------------

function childrenOf(node) {
  const out = [];
  for (let child = node.firstChild; child; child = child.next) out.push(child);
  return out;
}

// The concatenated plain text a node encloses. Used to identify a bold label by
// what it says rather than by the delimiters that produced it.
function textOf(node) {
  let text = '';
  const walker = node.walker();
  let event;
  while ((event = walker.next())) {
    if (!event.entering) continue;
    if (event.node.type === 'text' || event.node.type === 'code') text += event.node.literal;
  }
  return text;
}

// Ancestor type names from the node's parent up to the document root. A rule's
// published shape is a statement about this chain, so comparing the whole chain
// (rather than testing one level) is what rejects an item nested in a
// blockquote or in a sublist while accepting the shape each source publishes.
function ancestorChain(node) {
  const chain = [];
  for (let parent = node.parent; parent; parent = parent.parent) chain.push(parent.type);
  return chain;
}

function startLineOf(node) {
  // Block nodes always carry sourcepos; inline nodes only under the parser's
  // sourcepos option. Reporting the enclosing block's line is enough to point a
  // reader at the offending item and costs no extra parse configuration.
  for (let current = node; current; current = current.parent) {
    if (current.sourcepos) return current.sourcepos[0][0];
  }
  return null;
}

// ------------------------------------------------------------
// Canonical form
// ------------------------------------------------------------
// Identity is compared over what CommonMark says the rule says, not over the
// bytes that encoded it. The two source classes encode the same rule
// differently on purpose — a protocol carries it as an ordered-list item and so
// prefixes an ordinal that differs per protocol, an Output Style carries it as
// a plain paragraph — and a comparison sensitive to that difference could only
// ever be satisfied by making the sources wrong. Working from the parse drops
// the ordinal and the item indentation as list structure, without a
// normalization step of this module's own invention.
//
// Soft line breaks are normalized to a single space for the same reason: where
// a copy wraps is a fact about the file, not about the rule, and a copy rewrapped
// at a different column is still the same rule to every reader of it. A hard
// break is kept, because that one does change what is read. Everything else
// that can differ — the text, emphasis, code spans, link destinations, inline
// HTML — is carried into the comparison verbatim and type-tagged, so a
// divergence in any of them is a divergence here.
//
// The form is a nested array serialized as JSON: unambiguous by construction,
// where a delimiter-joined string would be ambiguous against text that happens
// to contain the delimiter.

function mergeAdjacentText(parts) {
  const merged = [];
  for (const part of parts) {
    const last = merged[merged.length - 1];
    if (last && last[0] === 't' && part[0] === 't') last[1] += part[1];
    else merged.push(part);
  }
  return merged;
}

function canonicalNode(node) {
  const kids = () => mergeAdjacentText(childrenOf(node).map(canonicalNode));
  switch (node.type) {
    case 'text': return ['t', node.literal];
    case 'softbreak': return ['t', ' '];
    case 'linebreak': return ['break'];
    case 'code': return ['code', node.literal];
    case 'html_inline': return ['html', node.literal];
    case 'emph': return ['em', kids()];
    case 'strong': return ['strong', kids()];
    case 'link': return ['link', node.destination || '', node.title || '', kids()];
    case 'image': return ['image', node.destination || '', node.title || '', kids()];
    case 'paragraph': return ['p', kids()];
    case 'heading': return ['heading', node.level, kids()];
    case 'block_quote': return ['quote', kids()];
    case 'item': return ['item', kids()];
    // The ordinal a list starts at is deliberately absent: it is the coordinate
    // the two source classes are entitled to differ on.
    case 'list': return ['list', node.listType, kids()];
    case 'code_block': return ['codeblock', node.info || '', node.literal];
    case 'html_block': return ['htmlblock', node.literal];
    case 'thematic_break': return ['rule'];
    default: return [`unknown:${node.type}`, node.literal || '', kids()];
  }
}

function canonicalForm(nodes) {
  return JSON.stringify(nodes.map(canonicalNode));
}

// A readable rendering of the same nodes, for divergence excerpts. Not used for
// comparison — an excerpt that reads well is not required to be injective.
function plainRendering(nodes) {
  return nodes
    .map(node => {
      let text = '';
      const walker = node.walker();
      let event;
      while ((event = walker.next())) {
        if (!event.entering) continue;
        const current = event.node;
        if (current.type === 'text' || current.type === 'code') text += current.literal;
        else if (current.type === 'softbreak' || current.type === 'linebreak') text += ' ';
      }
      return text;
    })
    .join(' ');
}

// ------------------------------------------------------------
// Rule shapes
// ------------------------------------------------------------
// Each source class is held to the shape it publishes, rather than to the union
// of both — a union is a shape no file actually publishes, so accepting it
// would pass a copy that is malformed everywhere it appears.

const RULE_SHAPES = Object.freeze({
  // `## Rules` entry in a protocol SKILL.md: `N. **Label**: body`
  orderedListItem: {
    describe: 'a top-level ordered-list item whose paragraph opens with the bold label',
    chain: ['paragraph', 'item', 'list', 'document'],
    requireOrderedList: true,
    // The rule unit is the whole list item, so a second paragraph added under
    // the item is part of the body being compared rather than silently outside it.
    unitBlocks: strong => childrenOf(strong.parent.parent),
  },
  // Output Style section: `**Label**: body` as a top-level paragraph
  topLevelParagraph: {
    describe: 'a top-level paragraph opening with the bold label',
    chain: ['paragraph', 'document'],
    requireOrderedList: false,
    unitBlocks: strong => [strong.parent],
  },
});

function sameChain(actual, expected) {
  return actual.length === expected.length && actual.every((type, i) => type === expected[i]);
}

// Detection is loose, validation strict. A label in the wrong shape must fail as
// malformed rather than vanish into "not found": a detector strict enough to
// require the published shape up front would let exactly the drift this guards
// slip out the silent door. So every bold node saying the label is collected,
// then the collection is held to "exactly one", then that one is held to the
// shape. Note what identifies the rule is the label's text, not the punctuation
// after it — carrying the colon into detection would make a look-alike colon
// defeat detection outright, where holding it in the shape check below makes a
// wrong colon fail loudly, which is where a wrong colon belongs.
function findLabelNodes(doc, label) {
  const hits = [];
  const walker = doc.walker();
  let event;
  while ((event = walker.next())) {
    if (!event.entering) continue;
    if (event.node.type !== 'strong') continue;
    if (textOf(event.node) === label) hits.push(event.node);
  }
  return hits;
}

// Every bold label the document carries, as a Set — the container-proof
// replacement for a raw `**Label**` substring test.
function boldLabels(doc) {
  const labels = new Set();
  const walker = doc.walker();
  let event;
  while ((event = walker.next())) {
    if (!event.entering) continue;
    if (event.node.type === 'strong') labels.add(textOf(event.node));
  }
  return labels;
}

// Extract the single well-formed rule unit for `label` from `source`.
// Returns `{ canonical, rendering, line }` or `{ error }`.
function extractRuleUnit(source, label, shapeName) {
  const shape = RULE_SHAPES[shapeName];
  const doc = parseDocument(source);
  const hits = findLabelNodes(doc, label);

  if (hits.length === 0) {
    return {
      error: `No **${label}** rule found. A copy inside a code fence, an HTML comment, or any other ` +
        'container is not a rule to Markdown, and is not counted here',
    };
  }
  if (hits.length > 1) {
    const lines = hits.map(node => startLineOf(node)).join(', ');
    return {
      error: `Expected exactly one **${label}** rule, found ${hits.length} at lines ${lines} — ` +
        'a second one can contradict the first while the one being compared stays identical',
    };
  }

  const strong = hits[0];
  const line = startLineOf(strong);
  const chain = ancestorChain(strong);
  if (!sameChain(chain, shape.chain)) {
    return {
      error: `**${label}** at line ${line} is not the shape this source publishes — expected ${shape.describe}, ` +
        `found it inside: ${chain.join(' < ')}`,
    };
  }
  if (shape.requireOrderedList && strong.parent.parent.parent.listType !== 'ordered') {
    return { error: `**${label}** at line ${line} is in a bullet list; this source publishes it as a numbered rule` };
  }
  if (strong.parent.firstChild !== strong) {
    return { error: `**${label}** at line ${line} does not open its ${shape.chain[0]}; the rule begins with its label` };
  }

  const after = strong.next;
  if (!after || after.type !== 'text' || !after.literal.startsWith(': ')) {
    const found = after ? JSON.stringify((after.literal || `<${after.type}>`).slice(0, 12)) : '<nothing>';
    return {
      error: `**${label}** at line ${line} is not followed by ": " — found ${found}. ` +
        'A look-alike colon reads as this rule and is not one',
    };
  }

  const blocks = shape.unitBlocks(strong);
  return { canonical: canonicalForm(blocks), rendering: plainRendering(blocks), line };
}

module.exports = {
  PARSER_AVAILABLE,
  PARSER_MISSING_MESSAGE,
  parseDocument,
  boldLabels,
  extractRuleUnit,
  RULE_SHAPES,
};
