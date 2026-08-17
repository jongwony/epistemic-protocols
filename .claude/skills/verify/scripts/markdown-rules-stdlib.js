'use strict';

// ============================================================
// Rule extraction by rule *position*, on the standard library alone
// ============================================================
// Two checks in static-checks.js read `## Rules` entries out of Markdown: one
// asserts a required rule label is present, the other asserts one rule's body
// is the same in every copy. Both are defeated by a copy moved inside a
// container — a fence, an HTML comment — because a line inside a container
// depicts a rule rather than carrying one, while a substring test still reports
// it present and identical. That is the packaged contract losing a rule with
// nothing red anywhere, which is the failure this module exists to close.
//
// The hazard in closing it by hand is that "outside any container" is an open
// class, and enumerating its members re-derives block parsing badly. This module
// does not enumerate. It inverts the question: rather than asking which
// containers could hide a rule, it asks where a rule is allowed to *be*, and
// accepts only that position — column zero, an optional list ordinal, then the
// bold label and its colon. Every Markdown container that could hide a rule
// spends the left margin to do it: an indented code block takes four columns, a
// block quote takes its marker, a nested list item takes its indent. Those are
// rejected by the anchor itself rather than by a rule naming each of them, so
// the class stays closed as new members are invented.
//
// Two container families survive that argument because they cost nothing at the
// left margin, and both are masked explicitly below: fenced code, and raw HTML
// (comments included). Each opens at column zero and hides every line that
// follows it, so the anchor alone cannot tell a hidden copy from a live one.
//
// The raw-HTML mask deliberately does not enumerate tag names. Markdown's own
// definition distinguishes a known block tag from any other tag, and reproducing
// that list is the enumeration this module set out to avoid — so instead any
// line opening with a tag or a declaration is treated as opening raw HTML, and
// the region runs to its close tag or to the blank line that would end it. That
// is wider than the specification in the cases where the two differ, which is
// the direction below.
//
// Where the mask is uncertain it over-masks on purpose. A real rule wrongly
// masked reports as missing and stops a commit; a hidden copy wrongly left
// visible passes as if it were the contract. Only the first failure is
// recoverable by reading the message, so the bias goes there.
//
// What this module does not reach is stated rather than approximated. A
// look-alike character inside the label makes the line, to any mechanical
// reading, not this rule — it fails as missing rather than as corrupted. That is
// a boundary of the position argument, not a gap to be patched by naming more
// containers.

// ------------------------------------------------------------
// Container masking
// ------------------------------------------------------------

const FENCE_OPEN = /^ {0,3}(`{3,}|~{3,})/;

// A tag opening raw HTML. The lookahead is what separates a tag from an
// angle-bracket autolink, whose scheme punctuation cannot appear in a tag name —
// without it a wrapped rule body beginning with a bare URL reads as a container
// and the rule under it disappears.
const HTML_TAG_OPEN = /^ {0,3}<(\/?)([a-zA-Z][a-zA-Z0-9-]*)(?=[ \t/>]|$)/;
// A declaration or processing instruction. Comments are absent here on purpose:
// they are resolved by span below, because one can also open part-way through a
// line and hide everything after it.
const HTML_DECL_OPEN = /^ {0,3}<(!\[CDATA\[|![a-zA-Z]|\?)/;

// Regions that close on an explicit string rather than on a blank line. These
// are Markdown's verbatim elements and declarations: their content is not
// Markdown at all, so a blank line inside one hides nothing and closes nothing.
const VERBATIM_TAG = /^(pre|script|style|textarea)$/i;

function htmlRegionEnd(line) {
  const decl = line.match(HTML_DECL_OPEN);
  if (decl) {
    if (decl[1] === '?') return /\?>/;
    if (decl[1] === '![CDATA[') return /\]\]>/;
    return />/;
  }
  // Only an opening verbatim tag runs to its close tag. A stray closing one is
  // an ordinary tag on a line, and reading it as an unterminated region would
  // mask every rule below it to end of file.
  const tag = line.match(HTML_TAG_OPEN);
  if (tag && !tag[1] && VERBATIM_TAG.test(tag[2])) return new RegExp(`</${tag[2]}>`, 'i');
  return null; // closes at the next blank line
}

function escapeForRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Replace hidden content with spaces, keeping every newline in place so a
// reported line number still addresses the file the reader will open.
function blankOut(line, from, to) {
  return line.slice(0, from) + ' '.repeat(to - from) + line.slice(to);
}

// Returns the source with fenced-code and raw-HTML content blanked.
// An unterminated container masks to end of file, which is what the container
// itself does to the document.
function maskHiddenContainers(source) {
  const lines = source.split('\n');
  const out = [];
  let fence = null; // { marker: '`' | '~', length: number }
  let html = null; // { end: RegExp | null }  — null end closes at a blank line
  let comment = false; // an unterminated `<!--` opened part-way through a line

  for (let raw of lines) {
    if (fence) {
      const close = raw.match(/^ {0,3}(`{3,}|~{3,})\s*$/);
      if (close && close[1][0] === fence.marker && close[1].length >= fence.length) fence = null;
      out.push(' '.repeat(raw.length));
      continue;
    }

    if (html) {
      if (html.end ? html.end.test(raw) : raw.trim() === '') html = null;
      out.push(' '.repeat(raw.length));
      continue;
    }

    if (comment) {
      const end = raw.indexOf('-->');
      if (end === -1) {
        out.push(' '.repeat(raw.length));
        continue;
      }
      comment = false;
      raw = blankOut(raw, 0, end + 3);
    }

    // Comments are resolved before the openers below: a fence or a tag written
    // inside a comment opens nothing. Doing it by span rather than by line also
    // catches a comment opened part-way through a paragraph, which hides every
    // line after it just as well as one opened at the margin.
    let cursor = 0;
    for (;;) {
      const start = raw.indexOf('<!--', cursor);
      if (start === -1) break;
      const end = raw.indexOf('-->', start + 4);
      if (end === -1) {
        raw = blankOut(raw, start, raw.length);
        comment = true;
        break;
      }
      raw = blankOut(raw, start, end + 3);
      cursor = end + 3;
    }
    if (comment) {
      out.push(raw);
      continue;
    }

    const fenceOpen = raw.match(FENCE_OPEN);
    if (fenceOpen) {
      fence = { marker: fenceOpen[1][0], length: fenceOpen[1].length };
      out.push(' '.repeat(raw.length));
      continue;
    }

    const htmlOpen = raw.match(HTML_TAG_OPEN) || raw.match(HTML_DECL_OPEN);
    if (htmlOpen) {
      const end = htmlRegionEnd(raw);
      // A region whose close string is already on its opening line never opens.
      if (!(end && end.test(raw.slice(htmlOpen[0].length)))) html = { end };
      out.push(' '.repeat(raw.length));
      continue;
    }

    out.push(raw);
  }

  return out.join('\n');
}

// ------------------------------------------------------------
// Rule position
// ------------------------------------------------------------

// A line that begins a rule: column zero, an optional ordinal for the sources
// that publish the rule as a numbered item, then the bold label and its colon.
// The colon is required here rather than deferred, because a label without one
// is a mention of the rule and not the rule.
function ruleAnchor(label) {
  return new RegExp(`^(\\d+\\.[ \\t]+)?\\*\\*${escapeForRegExp(label)}\\*\\*: `);
}

// A line that ends the current rule's body by starting something else.
const BODY_TERMINATOR = /^(\s*$|\d+\.[ \t]|#{1,6} |[-*_]{3,}\s*$|>)/;

// A rule has to begin its own block. A line placed directly above it with no
// blank line between folds the rule into that line's paragraph, and Markdown
// then reads the label as emphasis part-way through a sentence rather than as
// the rule — a copy demoted that way is gone while every character of it is
// still on disk. What may sit directly above a rule is a blank line, a heading,
// or the list the rule belongs to.
const OPENS_BLOCK_ABOVE = /^(\s*$|#{1,6} |\d+\.[ \t]|[ \t])/;

function findRulePositions(masked, label) {
  const anchor = ruleAnchor(label);
  const lines = masked.split('\n');
  const hits = [];
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(anchor);
    if (!match) continue;
    const opensBlock = i === 0 || OPENS_BLOCK_ABOVE.test(lines[i - 1]);
    hits.push({ line: i + 1, index: i, ordinal: match[1] || null, opensBlock });
  }
  return hits;
}

// The rule's body is its anchor line plus the lines that continue it. Where a
// copy wraps is a fact about the file rather than about the rule, so the body is
// gathered across the wrap and whitespace is collapsed — a copy rewrapped at a
// different column is the same rule to every reader of it. A hard break is the
// exception and is kept, because that one does change what is read; it is marked
// before the collapse would erase the trailing spaces that encode it.
const HARD_BREAK = /([ \t]{2,}|\\)$/;
// A marker that survives the whitespace collapse and cannot occur in the prose.
const HARD_BREAK_MARK = '\u0000';

function ruleBody(masked, hit) {
  const lines = masked.split('\n');
  const parts = [lines[hit.index].slice(hit.ordinal ? hit.ordinal.length : 0)];
  for (let i = hit.index + 1; i < lines.length; i++) {
    if (BODY_TERMINATOR.test(lines[i])) break;
    parts.push(lines[i]);
  }
  return parts
    .map((part, i) => (i < parts.length - 1 && HARD_BREAK.test(part) ? part + HARD_BREAK_MARK : part))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ------------------------------------------------------------
// Public surface
// ------------------------------------------------------------

// Shapes the two source classes publish. A source is held to its own shape
// rather than to the union of both, because the union is a shape no file
// publishes and would accept a copy that is malformed everywhere it appears.
const RULE_SHAPES = Object.freeze({
  orderedListItem: { describe: 'a numbered `## Rules` item', requireOrdinal: true },
  topLevelParagraph: { describe: 'a top-level paragraph', requireOrdinal: false },
});

// Extract the single well-formed rule unit for `label` from `source`.
// Returns `{ body, line }` or `{ error }`.
function extractRuleUnit(source, label, shapeName) {
  const shape = RULE_SHAPES[shapeName];
  const masked = maskHiddenContainers(source);
  const hits = findRulePositions(masked, label);

  if (hits.length === 0) {
    return {
      error: `No **${label}** rule found at rule position. A copy inside a code fence, an HTML ` +
        'comment, an indented block, a block quote, or a nested item is not a rule here, and is not counted',
    };
  }
  if (hits.length > 1) {
    return {
      error: `Expected exactly one **${label}** rule, found ${hits.length} at lines ` +
        `${hits.map(hit => hit.line).join(', ')} — a second one can contradict the first while the ` +
        'one being compared stays identical',
    };
  }

  const hit = hits[0];
  if (shape.requireOrdinal && !hit.ordinal) {
    return { error: `**${label}** at line ${hit.line} is not ${shape.describe}; this source publishes it as a numbered rule` };
  }
  if (!shape.requireOrdinal && hit.ordinal) {
    return { error: `**${label}** at line ${hit.line} is numbered; this source publishes it as ${shape.describe}` };
  }
  if (!hit.opensBlock) {
    return {
      error: `**${label}** at line ${hit.line} does not begin its own block — the line above runs into it, ` +
        'so the label reads as emphasis inside that paragraph rather than as the rule',
    };
  }

  return { body: ruleBody(masked, hit), line: hit.line };
}

// Whether `label` occupies a rule position in `source` at all — the
// container-proof replacement for a raw `**Label**` substring test.
function hasRuleAtPosition(source, label) {
  return findRulePositions(maskHiddenContainers(source), label).length > 0;
}

module.exports = {
  maskHiddenContainers,
  findRulePositions,
  extractRuleUnit,
  hasRuleAtPosition,
};
