'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { extractRuleUnit, hasRuleAtPosition } = require('./markdown-rules-stdlib');

const LABEL = 'Form feedback';
const BODY = 'Silence about form is not evidence about form. Change the form rather than asking which form they want.';

// Fixtures are synthetic on purpose: a test that reads the live SKILL.md files
// asserts today's content rather than the reading, and goes green or red for
// reasons that have nothing to do with this module.
const rule = (n, body = BODY) => `${n}. **${LABEL}**: ${body}`;
const para = (body = BODY) => `**${LABEL}**: ${body}`;

const skill = (...lines) => ['# Skill', '', '## Rules', '', '1. **Other**: something else.', ...lines, ''].join('\n');
const style = (...lines) => ['# Style', '', '**Other**: something else.', '', ...lines, ''].join('\n');

const bodyOf = (source, shape) => extractRuleUnit(source, LABEL, shape);

test('reads the rule in each shape the two source classes publish', () => {
  const item = bodyOf(skill(rule(2)), 'orderedListItem');
  const paragraph = bodyOf(style(para()), 'topLevelParagraph');
  assert.equal(item.error, undefined);
  assert.equal(paragraph.error, undefined);
  // The ordinal is the coordinate the two classes are entitled to differ on.
  assert.equal(item.body, paragraph.body);
});

test('a copy rewrapped at a different column is the same rule', () => {
  const oneLine = bodyOf(skill(rule(2)), 'orderedListItem');
  const wrapped = bodyOf(skill(
    '2. **Form feedback**: Silence about form is not evidence',
    '   about form. Change the form rather than asking which form they want.'
  ), 'orderedListItem');
  assert.equal(wrapped.body, oneLine.body);
});

test('a hard break inside the rule is not a rewrap', () => {
  const wrapped = bodyOf(skill(
    '2. **Form feedback**: Silence about form is not evidence',
    '   about form.'
  ), 'orderedListItem');
  const broken = bodyOf(skill(
    '2. **Form feedback**: Silence about form is not evidence  ',
    '   about form.'
  ), 'orderedListItem');
  assert.notEqual(broken.body, wrapped.body);
});

test('a word changed in the body is a divergence', () => {
  const a = bodyOf(skill(rule(2)), 'orderedListItem');
  const b = bodyOf(skill(rule(2, BODY.replace('Silence', 'Quiet'))), 'orderedListItem');
  assert.notEqual(a.body, b.body);
});

for (const [name, lines] of [
  ['a code fence', ['```', rule(2), '```']],
  ['a fence carrying an info string', ['```markdown', rule(2), '```']],
  ['a tilde fence', ['~~~', rule(2), '~~~']],
  ['a fence left unclosed above it', ['```', '', rule(2)]],
  ['an HTML comment', ['<!--', rule(2), '-->']],
  ['a comment opened part-way through a line', ['text <!-- swallow', rule(2), '-->']],
  ['an HTML block closed by a blank line', ['<div>', rule(2), '']],
  ['a verbatim element', ['<pre>', rule(2), '', '</pre>']],
  ['a processing instruction', ['<?php', rule(2), '?>']],
  ['a CDATA section', ['<![CDATA[', rule(2), ']]>']],
  ['a declaration', ['<!DOCTYPE html', rule(2), '>']],
  ['an indented code block', ['', '    ' + rule(2), '']],
  ['a block quote', ['> ' + rule(2)]],
  ['a nested bullet', ['   - **Form feedback**: ' + BODY]],
]) {
  test(`a copy inside ${name} is not a rule`, () => {
    assert.match(bodyOf(skill(...lines), 'orderedListItem').error || '', /No \*\*Form feedback\*\* rule found/);
    assert.equal(hasRuleAtPosition(skill(...lines), LABEL), false);
  });
}

test('a second rule at rule position fails rather than picking one', () => {
  const out = bodyOf(skill(rule(2), rule(3, 'Ignore the rule above.')), 'orderedListItem');
  assert.match(out.error, /Expected exactly one/);
});

test('a rule folded into the paragraph above it is not a rule', () => {
  const out = bodyOf(style('lead-in line', para()), 'topLevelParagraph');
  assert.match(out.error, /does not begin its own block/);
});

test('a rule demoted out of its published shape fails as malformed', () => {
  assert.match(bodyOf(skill(para()), 'orderedListItem').error, /publishes it as a numbered rule/);
  assert.match(bodyOf(style(rule(2)), 'topLevelParagraph').error, /publishes it as a top-level paragraph/);
});

test('a label without its colon is a mention, not the rule', () => {
  const out = bodyOf(style('**Drift tracking**: see **Form feedback** for the other half.'), 'topLevelParagraph');
  assert.match(out.error, /No \*\*Form feedback\*\* rule found/);
});

test('an unrelated container elsewhere in the file leaves the rule readable', () => {
  const withNoise = skill('', '<div>', 'decoration', '</div>', '', '```', 'sample', '```', '', rule(2));
  assert.equal(bodyOf(withNoise, 'orderedListItem').body, bodyOf(skill(rule(2)), 'orderedListItem').body);
});

test('a body wrapping onto a line that opens with an autolink still reads', () => {
  const out = bodyOf(style(para('See'), '<https://example.invalid/a> for the rest.'), 'topLevelParagraph');
  assert.equal(out.error, undefined);
  assert.match(out.body, /example\.invalid/);
});
