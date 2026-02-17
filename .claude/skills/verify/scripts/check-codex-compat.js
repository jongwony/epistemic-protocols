#!/usr/bin/env node
/**
 * Codex compatibility checks for AskUserQuestion -> request_user_input mapping.
 *
 * Usage: node check-codex-compat.js [project-root]
 * Output: JSON { pass: [], fail: [], warn: [] }
 */

const fs = require('fs');
const path = require('path');

const projectRoot = process.argv[2] || process.cwd();
const results = { pass: [], fail: [], warn: [] };

const PILOT_PROTOCOLS = {
  hermeneia: 'hermeneia/skills/clarify/SKILL.md',
  syneidesis: 'syneidesis/skills/gap/SKILL.md',
  telos: 'telos/skills/goal/SKILL.md',
  katalepsis: 'katalepsis/skills/grasp/SKILL.md',
};

const ALLOWED_INTENTS = new Set(['confirm', 'select_one', 'select_many', 'judge', 'terminate']);
const ALLOWED_ESCAPE = new Set(['terminate', 'return_previous', 'defer']);
const ALLOWED_TASK_STATUS = new Set(['pending', 'in_progress', 'completed']);
const REQUIRED_SKILL_SECTION = '## Codex Mapping';
const TASK_SYNC_PROTOCOLS = new Set(['syneidesis', 'katalepsis']);
const ALLOWED_TASK_EMIT_TRANSITIONS = new Set([
  'pending->in_progress',
  'in_progress->completed',
]);

function fail(file, message) {
  results.fail.push({ check: 'codex-compat', file, message });
}

function warn(file, message) {
  results.warn.push({ check: 'codex-compat', file, message });
}

function pass(file, message) {
  results.pass.push({ check: 'codex-compat', file, message });
}

function transitionKey(from, to) {
  return `${from}->${to}`;
}

function ensureSchemaExists() {
  const schemaPath = path.join(projectRoot, 'codex/schemas/canonical-prompt.schema.json');
  if (!fs.existsSync(schemaPath)) {
    fail('codex/schemas/canonical-prompt.schema.json', 'Canonical Prompt schema is missing');
    return null;
  }

  try {
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    const requiredRootFields = ['protocol', 'version', 'source', 'source_prompts', 'steps'];
    const missing = requiredRootFields.filter((field) => !schema.required || !schema.required.includes(field));
    if (missing.length > 0) {
      fail(
        'codex/schemas/canonical-prompt.schema.json',
        `Schema required fields missing: ${missing.join(', ')}`
      );
      return null;
    }
    pass('codex/schemas/canonical-prompt.schema.json', 'Canonical Prompt schema loaded');
    return schema;
  } catch (error) {
    fail('codex/schemas/canonical-prompt.schema.json', `Invalid JSON: ${error.message}`);
    return null;
  }
}

function validateSkillSection(protocol, skillPath) {
  const fullSkillPath = path.join(projectRoot, skillPath);
  if (!fs.existsSync(fullSkillPath)) {
    fail(skillPath, `Pilot protocol skill missing (${protocol})`);
    return;
  }

  const content = fs.readFileSync(fullSkillPath, 'utf8');
  if (!content.includes(REQUIRED_SKILL_SECTION)) {
    fail(skillPath, `Missing required section: "${REQUIRED_SKILL_SECTION}"`);
    return;
  }

  pass(skillPath, 'Codex mapping section present');
}

function validateSourcePrompt(examplePath, prompt, stepIds) {
  const file = path.relative(projectRoot, examplePath);

  if (!prompt || typeof prompt !== 'object') {
    fail(file, 'source_prompts contains non-object item');
    return;
  }

  if (!prompt.id || typeof prompt.id !== 'string') {
    fail(file, 'source_prompts item missing id');
  }

  if (!prompt.source_phase || typeof prompt.source_phase !== 'string') {
    fail(file, `source_prompt "${prompt.id || 'unknown'}" missing source_phase`);
  }

  if (!Number.isInteger(prompt.source_options_count) || prompt.source_options_count < 2) {
    fail(file, `source_prompt "${prompt.id || 'unknown'}" has invalid source_options_count`);
  }

  if (!Array.isArray(prompt.mapped_step_ids) || prompt.mapped_step_ids.length === 0) {
    fail(file, `source_prompt "${prompt.id || 'unknown'}" missing mapped_step_ids`);
  } else {
    for (const stepId of prompt.mapped_step_ids) {
      if (!stepIds.has(stepId)) {
        fail(file, `source_prompt "${prompt.id || 'unknown'}" maps to unknown step "${stepId}"`);
      }
    }
  }

  // Required failure condition:
  // source options > 3 must define explicit decomposition strategy.
  if (prompt.source_options_count > 3) {
    if (prompt.overflow_strategy !== 'two_stage_routing') {
      fail(
        file,
        `source_prompt "${prompt.id || 'unknown'}" has ${prompt.source_options_count} options but no two_stage_routing strategy`
      );
    }
    if (!Array.isArray(prompt.mapped_step_ids) || prompt.mapped_step_ids.length < 2) {
      fail(
        file,
        `source_prompt "${prompt.id || 'unknown'}" must map to at least two steps when source options exceed 3`
      );
    }
  }
}

function validateStep(examplePath, step, seenIds) {
  const file = path.relative(projectRoot, examplePath);
  const stepRef = step && step.id ? step.id : 'unknown-step';

  if (!step || typeof step !== 'object') {
    fail(file, 'steps contains non-object item');
    return;
  }

  if (!step.id || typeof step.id !== 'string') {
    fail(file, 'step missing id');
  } else if (seenIds.has(step.id)) {
    fail(file, `duplicate step id "${step.id}"`);
  } else {
    seenIds.add(step.id);
  }

  // Required failure condition: intent is mandatory.
  if (!step.intent || typeof step.intent !== 'string') {
    fail(file, `step "${stepRef}" missing intent`);
  } else if (!ALLOWED_INTENTS.has(step.intent)) {
    fail(file, `step "${stepRef}" has unsupported intent "${step.intent}"`);
  }

  if (!step.question || typeof step.question !== 'string') {
    fail(file, `step "${stepRef}" missing question`);
  }

  if (!Array.isArray(step.options)) {
    fail(file, `step "${stepRef}" missing options array`);
    return;
  }

  if (step.options.length < 2 || step.options.length > 3) {
    fail(file, `step "${stepRef}" must have 2-3 options for request_user_input`);
  }

  // Required failure condition:
  // options > 3 require decomposition strategy.
  if (step.options.length > 3 && step.overflow_strategy !== 'two_stage_routing') {
    fail(file, `step "${stepRef}" exceeds 3 options without two_stage_routing`);
  }

  step.options.forEach((option, index) => {
    if (!option || typeof option !== 'object') {
      fail(file, `step "${stepRef}" option #${index + 1} is not an object`);
      return;
    }
    if (!option.label || typeof option.label !== 'string') {
      fail(file, `step "${stepRef}" option #${index + 1} missing label`);
    }
    if (!option.description || typeof option.description !== 'string') {
      fail(file, `step "${stepRef}" option #${index + 1} missing description`);
    }
  });

  if (step.max_choices !== undefined) {
    if (!Number.isInteger(step.max_choices) || step.max_choices < 1 || step.max_choices > 3) {
      fail(file, `step "${stepRef}" has invalid max_choices`);
    }
    if (step.intent !== 'select_many' && step.max_choices !== 1) {
      fail(file, `step "${stepRef}" must set max_choices=1 unless intent is select_many`);
    }
  }

  // Required failure condition: explicit terminate path per step.
  if (!step.on_escape || typeof step.on_escape !== 'string') {
    fail(file, `step "${stepRef}" missing on_escape`);
  } else if (!ALLOWED_ESCAPE.has(step.on_escape)) {
    fail(file, `step "${stepRef}" has unsupported on_escape "${step.on_escape}"`);
  }
}

function validateTaskSync(protocol, examplePath, taskSync) {
  const file = path.relative(projectRoot, examplePath);
  const failStart = results.fail.length;
  const required = TASK_SYNC_PROTOCOLS.has(protocol);

  if (taskSync === undefined) {
    if (required) {
      fail(file, `Protocol "${protocol}" must define task_sync for TaskCreate/update_plan mapping`);
    }
    return;
  }

  if (!taskSync || typeof taskSync !== 'object' || Array.isArray(taskSync)) {
    fail(file, 'task_sync must be an object');
    return;
  }

  if (taskSync.source_tool !== 'TaskCreate') {
    fail(file, 'task_sync.source_tool must be "TaskCreate"');
  }

  if (taskSync.target_tool !== 'update_plan') {
    fail(file, 'task_sync.target_tool must be "update_plan"');
  }

  if (!taskSync.create || typeof taskSync.create !== 'object') {
    fail(file, 'task_sync.create must be an object');
  } else {
    if (taskSync.create.emit !== true) {
      fail(file, 'task_sync.create.emit must be true');
    }
    if (taskSync.create.default_status !== 'pending') {
      fail(file, 'task_sync.create.default_status must be "pending"');
    }
  }

  if (taskSync.single_in_progress !== true) {
    fail(file, 'task_sync.single_in_progress must be true');
  }

  if (taskSync.fallback_mode !== 'internal_state_only') {
    fail(file, 'task_sync.fallback_mode must be "internal_state_only"');
  }

  if (!Array.isArray(taskSync.transitions) || taskSync.transitions.length === 0) {
    fail(file, 'task_sync.transitions must be a non-empty array');
  } else {
    const emittedTransitions = new Set();

    taskSync.transitions.forEach((transition, index) => {
      const ref = `task_sync.transitions[${index}]`;

      if (!transition || typeof transition !== 'object' || Array.isArray(transition)) {
        fail(file, `${ref} must be an object`);
        return;
      }

      if (!ALLOWED_TASK_STATUS.has(transition.from)) {
        fail(file, `${ref}.from must be one of pending|in_progress|completed`);
      }

      if (!ALLOWED_TASK_STATUS.has(transition.to)) {
        fail(file, `${ref}.to must be one of pending|in_progress|completed`);
      }

      if (typeof transition.emit_update_plan !== 'boolean') {
        fail(file, `${ref}.emit_update_plan must be boolean`);
        return;
      }

      if (transition.emit_update_plan === true) {
        const key = transitionKey(transition.from, transition.to);
        if (!ALLOWED_TASK_EMIT_TRANSITIONS.has(key)) {
          fail(
            file,
            `${ref} emits update_plan for unsupported transition "${key}" (only pending->in_progress, in_progress->completed allowed)`
          );
        } else {
          emittedTransitions.add(key);
        }
      }
    });

    for (const requiredTransition of ALLOWED_TASK_EMIT_TRANSITIONS) {
      if (!emittedTransitions.has(requiredTransition)) {
        fail(
          file,
          `task_sync.transitions must include emit_update_plan=true for "${requiredTransition}"`
        );
      }
    }
  }

  if (results.fail.length === failStart) {
    pass(file, 'Task synchronization mapping validated');
  }
}

function validateExample(protocol, skillPath) {
  const exampleRelPath = `codex/examples/${protocol}.json`;
  const examplePath = path.join(projectRoot, exampleRelPath);

  if (!fs.existsSync(examplePath)) {
    fail(exampleRelPath, `Missing codex example for protocol "${protocol}"`);
    return;
  }

  let doc;
  try {
    doc = JSON.parse(fs.readFileSync(examplePath, 'utf8'));
  } catch (error) {
    fail(exampleRelPath, `Invalid JSON: ${error.message}`);
    return;
  }

  if (doc.protocol !== protocol) {
    fail(exampleRelPath, `Protocol mismatch: expected "${protocol}", got "${doc.protocol}"`);
  }

  if (doc.source !== skillPath) {
    warn(exampleRelPath, `Source path is "${doc.source}" but expected "${skillPath}"`);
  }

  if (!Array.isArray(doc.source_prompts) || doc.source_prompts.length === 0) {
    fail(exampleRelPath, 'source_prompts must be a non-empty array');
  }

  if (!Array.isArray(doc.steps) || doc.steps.length === 0) {
    fail(exampleRelPath, 'steps must be a non-empty array');
    return;
  }

  const stepIds = new Set();
  const stepSeen = new Set();
  for (const step of doc.steps) {
    if (step && typeof step.id === 'string') {
      stepIds.add(step.id);
    }
  }

  doc.steps.forEach((step) => validateStep(examplePath, step, stepSeen));
  doc.source_prompts.forEach((prompt) => validateSourcePrompt(examplePath, prompt, stepIds));
  validateTaskSync(protocol, examplePath, doc.task_sync);

  if (!doc.version || typeof doc.version !== 'string' || !/^\d+\.\d+\.\d+$/.test(doc.version)) {
    fail(exampleRelPath, 'version must use semver format (x.y.z)');
  }

  pass(exampleRelPath, 'Codex mapping example validated');
}

function run() {
  ensureSchemaExists();

  for (const [protocol, skillPath] of Object.entries(PILOT_PROTOCOLS)) {
    validateSkillSection(protocol, skillPath);
    validateExample(protocol, skillPath);
  }

  console.log(JSON.stringify(results, null, 2));
  process.exit(results.fail.length > 0 ? 1 : 0);
}

try {
  run();
} catch (error) {
  console.error(
    JSON.stringify({
      error: error.message,
      stack: error.stack,
    })
  );
  process.exit(2);
}
