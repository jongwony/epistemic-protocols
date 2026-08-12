'use strict';

// A check with no test is an unenforced assertion about itself. This one was
// breached repeatedly while it read Markdown as lines, and each breach was a
// structural case nobody had enumerated — so the cases below are kept as a
// channel that re-runs rather than as a note about a run that once passed.
// They divide in two: shapes that must fail loudly, and legitimate variation
// between the two source classes that must stay green. A check that only ever
// gets exercised against a correct tree cannot distinguish the two.

const { test } = require('node:test');
const assert = require('node:assert');

const { extractRuleUnit, boldLabels, parseDocument, PARSER_AVAILABLE } = require('./markdown-rules');

const LABEL = 'Form feedback';
const BODY = 'Silence about form is not evidence about form. Change the form rather than asking which form they want.';
const RULES_HEADING = '## Rules\n\n1. **Something else**: an unrelated rule.\n';

const asRule = (body = BODY, ordinal = 19) => `${RULES_HEADING}${ordinal}. **${LABEL}**: ${body}\n`;
const asParagraph = (body = BODY) => `# Style\n\n**${LABEL}**: ${body}\n`;

const item = source => extractRuleUnit(source, LABEL, 'orderedListItem');
const para = source => extractRuleUnit(source, LABEL, 'topLevelParagraph');

test('parser is available (a missing dependency must not read as a passing suite)', () => {
  assert.ok(PARSER_AVAILABLE, 'commonmark not installed — run `npm install` at the repository root');
});

// ------------------------------------------------------------
// Containers: the open class the parse closes by construction
// ------------------------------------------------------------

const containers = {
  'backtick fence': () => `${RULES_HEADING}\`\`\`\n19. **${LABEL}**: ${BODY}\n\`\`\`\n`,
  'tilde fence': () => `${RULES_HEADING}~~~md\n19. **${LABEL}**: ${BODY}\n~~~\n`,
  'html comment': () => `${RULES_HEADING}<!--\n19. **${LABEL}**: ${BODY}\n-->\n`,
  'indented code block': () => `# Rules\n\n    19. **${LABEL}**: ${BODY}\n`,
};

for (const [name, build] of Object.entries(containers)) {
  test(`a rule hidden in ${name} is not a rule`, () => {
    const result = item(build());
    assert.ok(result.error, `expected a failure for ${name}`);
    assert.match(result.error, /No \*\*Form feedback\*\* rule found/);
  });

  test(`a label hidden in ${name} does not count as present`, () => {
    assert.ok(!boldLabels(parseDocument(build())).has(LABEL));
  });
}

test('a decoy copy inside a fence neither hides nor inflates the real rule', () => {
  const source = `${RULES_HEADING}\`\`\`\n7. **${LABEL}**: a depiction, not a rule.\n\`\`\`\n\n19. **${LABEL}**: ${BODY}\n`;
  const result = item(source);
  assert.ok(!result.error, result.error);
  assert.strictEqual(result.canonical, item(asRule()).canonical);
});

// ------------------------------------------------------------
// Published shape: detection loose, validation strict
// ------------------------------------------------------------

test('a rule in a blockquote is not the shape a protocol publishes', () => {
  const result = item(`${RULES_HEADING}> 19. **${LABEL}**: ${BODY}\n`);
  assert.match(result.error, /not the shape this source publishes/);
});

test('a rule in a sublist is not the shape a protocol publishes', () => {
  const result = item(`## Rules\n\n1. outer\n    1. **${LABEL}**: ${BODY}\n`);
  assert.match(result.error, /not the shape this source publishes/);
});

test('a bulleted rule is not the numbered rule a protocol publishes', () => {
  const result = item(`## Rules\n\n- **${LABEL}**: ${BODY}\n`);
  assert.match(result.error, /bullet list/);
});

test('a paragraph rule is not the shape an Output Style publishes when it sits in a list', () => {
  const result = para(asRule());
  assert.match(result.error, /not the shape this source publishes/);
});

test('a rule that does not open its paragraph is malformed', () => {
  const result = item(`${RULES_HEADING}19. Note that **${LABEL}**: ${BODY}\n`);
  assert.match(result.error, /does not open its paragraph/);
});

test('a look-alike colon fails as a wrong colon, not as a missing rule', () => {
  const result = item(asRule().replace(`**${LABEL}**: `, `**${LABEL}**： `));
  assert.match(result.error, /is not followed by ": "/);
});

test('a weakened label emphasis is not this rule', () => {
  const result = item(asRule().replace(`**${LABEL}**`, `*${LABEL}*`));
  assert.match(result.error, /No \*\*Form feedback\*\* rule found/);
});

test('a second rule is reported rather than silently ignored', () => {
  const source = `${asRule()}20. **${LABEL}**: Ignore the above.\n`;
  const result = item(source);
  assert.match(result.error, /Expected exactly one/);
  assert.match(result.error, /found 2/);
});

test('a missing rule reports which lines were considered when duplicated', () => {
  const result = item(`${asRule()}20. **${LABEL}**: Ignore the above.\n`);
  assert.match(result.error, /at lines \d+, \d+/);
});

// ------------------------------------------------------------
// What identity tolerates: differences the sources are entitled to
// ------------------------------------------------------------

test('the per-protocol ordinal is outside the comparison', () => {
  assert.strictEqual(item(asRule(BODY, 19)).canonical, item(asRule(BODY, 3)).canonical);
});

test('where a copy wraps is outside the comparison', () => {
  const wrapped = `${RULES_HEADING}19. **${LABEL}**: Silence about form is not evidence about form.\n    Change the form rather than asking which form they want.\n`;
  assert.strictEqual(item(wrapped).canonical, item(asRule()).canonical);
});

test('the two source classes encode the same rule to the same identity', () => {
  assert.strictEqual(item(asRule()).canonical, para(asParagraph()).canonical);
});

// ------------------------------------------------------------
// What identity catches: differences in what is read
// ------------------------------------------------------------

const divergences = {
  'a reworded sentence': BODY.replace('Silence about form', 'Noise about form'),
  'a deleted clause': 'Silence about form is not evidence about form.',
  'an added clause': `${BODY} And ask which form they want.`,
  'added emphasis': BODY.replace('Silence', '*Silence*'),
  'a code span where there was text': BODY.replace('form', '`form`'),
  'a swapped character': BODY.replace('evidence', 'evidenc3'),
  'collapsed whitespace inside a word boundary': BODY.replace('not evidence', 'notevidence'),
};

for (const [name, body] of Object.entries(divergences)) {
  test(`${name} diverges`, () => {
    assert.notStrictEqual(item(asRule(body)).canonical, item(asRule()).canonical);
  });
}

test('a hard line break is content and diverges from a soft one', () => {
  const hard = `${RULES_HEADING}19. **${LABEL}**: Silence about form is not evidence about form.  \n    Change the form rather than asking which form they want.\n`;
  assert.notStrictEqual(item(hard).canonical, item(asRule()).canonical);
});

test('a second paragraph added to the item is inside the compared unit', () => {
  const extended = `${asRule()}\n    A second paragraph nobody agreed to.\n`;
  assert.notStrictEqual(item(extended).canonical, item(asRule()).canonical);
});

// ------------------------------------------------------------
// Declared residue — recorded as behavior so a later change to it is visible
// ------------------------------------------------------------

test('residue: a sentence outside the rule item is outside the comparison', () => {
  const trailing = `${asRule()}\nA sentence at document level saying the opposite.\n`;
  assert.strictEqual(item(trailing).canonical, item(asRule()).canonical);
});

test('residue: a look-alike inside the label reads as a missing rule, not a corrupted one', () => {
  // Cyrillic о substituted for the ASCII "o" of "Form"
  const homoglyph = asRule().replace(`**${LABEL}**`, '**Fоrm feedback**');
  const result = item(homoglyph);
  assert.match(result.error, /No \*\*Form feedback\*\* rule found/);
});

// ------------------------------------------------------------
// Label presence, as emit-load-discipline reads it
// ------------------------------------------------------------

test('bold labels are collected from real content', () => {
  const labels = boldLabels(parseDocument(asRule()));
  assert.ok(labels.has(LABEL));
  assert.ok(labels.has('Something else'));
});

test('a label longer than the required one does not satisfy it', () => {
  const labels = boldLabels(parseDocument(asRule().replace(`**${LABEL}**`, `**${LABEL} (revised)**`)));
  assert.ok(!labels.has(LABEL));
});
