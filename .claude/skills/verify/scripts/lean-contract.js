#!/usr/bin/env node
/**
 * Lean contract build: turns each protocol SKILL.md Lean block into the Lake
 * package's `Contract.<NS>` module and writes the audit file lean-definition
 * elaborates against the proved theorems. Both land under `lean/.contract/`,
 * which is gitignored: the SKILL.md block stays the single source, and a
 * generated file is never edited by hand.
 *
 *   Contract.<NS>  = module header + the block, with its GROUND section replaced
 *                    by `open Ground` (the canonical `EpistemicProtocols.Ground`).
 *   Audit/<NS>     = the block's stated theorems re-derived from the proved ones,
 *                    plus an environment readout (declared theorems, project
 *                    axioms, transitive axioms) printed as one `AUDIT {json}` line.
 *
 * Run: node .claude/skills/verify/scripts/lean-contract.js generate [root]
 */

const fs = require('fs');
const path = require('path');

const GENERATED_DIR = path.join('lean', '.contract');
const CANONICAL_GROUND = path.join('lean', 'EpistemicProtocols', 'Ground.lean');
const GROUND_PROOFS = path.join('lean', 'EpistemicProtocols', 'Ground', 'Proofs.lean');
const ALLOWED_AXIOMS = Object.freeze(['propext', 'Classical.choice', 'Quot.sound']);

// The Lean Definition block's source, without its fence.
function extractLeanBlock(content) {
  const m = /^```lean\n([\s\S]*?)^```$/m.exec(content);
  return m ? m[1] : null;
}

function blockNamespace(block) {
  const m = /^namespace ([\w.]+)\s*$/m.exec(block);
  return m ? m[1] : null;
}

// The GROUND section of a block: from its `/-! ── GROUND ──` line up to the
// `/-! ── TYPES ──` line. Offsets are character indices into the block.
function groundSpan(block) {
  const start = block.search(/^\/-! ── GROUND ──/m);
  const end = block.search(/^\/-! ── TYPES ──/m);
  if (start === -1 || end === -1 || end < start) return null;
  return { start, end, text: block.slice(start, end) };
}

// The canonical GROUND text: between `namespace Ground` and `end Ground`.
function canonicalGroundText(source) {
  const m = /^namespace Ground\n\n([\s\S]*?)^end Ground\s*$/m.exec(source);
  return m ? m[1] : null;
}

// Theorem signatures stated inside `/-! … -/` doc comments, in order, each with
// the `variable` commands that precede it in the same text.
function statedTheorems(text) {
  const events = [];
  for (const m of text.matchAll(/^variable\b.*$/gm)) events.push({ at: m.index, variable: m[0] });
  for (const doc of text.matchAll(/\/-!([\s\S]*?)-\//g)) {
    const lines = doc[1].split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (!/^theorem\s/.test(lines[i])) continue;
      const sig = [lines[i]];
      while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1])) sig.push(lines[++i]);
      const signature = sig.join('\n').trimEnd();
      events.push({ at: doc.index, name: /^theorem\s+([^\s:({[]+)/.exec(signature)[1], signature });
    }
  }
  events.sort((a, b) => a.at - b.at);
  return events;
}

function contractModule(block, ns) {
  const ground = groundSpan(block);
  return [
    'module',
    '',
    'public import EpistemicProtocols.Ground',
    '',
    '@[expose] public section',
    '',
    `${block.slice(0, ground.start)}open Ground`,
    '',
    block.slice(ground.end),
  ].join('\n');
}

// A stated theorem holds when it follows from the proved theorem of the same
// name alone: a proof that carries a premise the statement lacks leaves a goal
// neither `exact` nor `assumption` closes.
function statedCheck(event) {
  const rest = event.signature.slice(`theorem ${event.name}`.length);
  return [
    `theorem ${event.name}.stated${rest} := by`,
    `  first`,
    `  | exact ${event.name} ..`,
    `  | (apply ${event.name} <;> assumption)`,
  ].join('\n');
}

function leanStringList(names) {
  return `[${names.map((n) => `\`${n}`).join(', ')}]`;
}

function auditModule({ importModule, ns, events, proofsModule, contractModules }) {
  const body = [];
  const stated = [];
  for (const event of events) {
    if (event.variable) body.push(event.variable);
    else {
      body.push(statedCheck(event));
      stated.push(`${ns}.${event.name}.stated`);
    }
  }
  return `import Lean
import ${importModule}

namespace ${ns}
open Ground
${body.join('\n\n')}
end ${ns}

open Lean Elab Command in
#eval show CommandElabM Unit from do
  let env ← getEnv
  let mods := env.header.moduleNames
  let modOf : Name → Option Name := fun n =>
    (env.getModuleIdxFor? n).bind fun i => mods[i.toNat]?
  let inPackage : Name → Bool := fun m =>
    (\`EpistemicProtocols).isPrefixOf m || (\`Contract).isPrefixOf m
  let contractModules : List Name := ${leanStringList(contractModules)}
  let mut proved : Array Name := #[]
  let mut provedUser : Array Name := #[]
  let mut contract : Array Name := #[]
  let mut axiomDecls : Array Name := #[]
  for (n, ci) in env.constants.toList do
    let some m := modOf n | continue
    unless inPackage m do continue
    match ci with
    | .axiomInfo _ => axiomDecls := axiomDecls.push n
    | .thmInfo _ =>
      -- A Prop-valued structure field is a projection, not a stated theorem.
      if (← findDeclarationRanges? n).isSome && !env.isProjectionFn n then
        if m == \`${proofsModule} then
          proved := proved.push n
          provedUser := provedUser.push ((privateToUserName? n).getD n)
        else if contractModules.contains m then
          contract := contract.push n
    | _ => pure ()
  let mut axioms : Array Json := #[]
  for n in proved ++ ${`#${leanStringList(stated)}`} do
    let axs ← liftCoreM <| collectAxioms n
    axioms := axioms.push <| Json.mkObj [("name", toJson n.toString), ("axioms", toJson (axs.map (·.toString)))]
  let out := Json.mkObj [
    ("proved", toJson (provedUser.map (·.toString))),
    ("contract", toJson (contract.map (·.toString))),
    ("axiomDecls", toJson (axiomDecls.map (·.toString))),
    ("axioms", Json.arr axioms)]
  logInfo m!"AUDIT {out.compress}"
`;
}

// Everything the Lake build and the audit need, derived from the blocks and the
// canonical Ground. `blocks` is [{ relPath, block }].
function planContracts(root, blocks) {
  const files = [];
  const audits = [];
  for (const { relPath, block } of blocks) {
    const ns = blockNamespace(block);
    const ground = groundSpan(block);
    if (!ns || !ground || block.indexOf(`namespace ${ns}`) > ground.start) continue;
    files.push({ path: path.join(GENERATED_DIR, 'Contract', `${ns}.lean`), text: contractModule(block, ns) });
    const events = statedTheorems(block.slice(ground.end));
    const auditPath = path.join(GENERATED_DIR, 'Audit', `${ns}.lean`);
    files.push({
      path: auditPath,
      text: auditModule({
        importModule: `EpistemicProtocols.${ns}.Proofs`,
        ns,
        events,
        proofsModule: `EpistemicProtocols.${ns}.Proofs`,
        contractModules: [`Contract.${ns}`, 'EpistemicProtocols.Ground'],
      }),
    });
    audits.push({ relPath, ns, auditPath, stated: events.filter((e) => e.name).map((e) => `${ns}.${e.name}`) });
  }
  const groundFile = path.join(root, CANONICAL_GROUND);
  if (fs.existsSync(groundFile)) {
    const text = canonicalGroundText(fs.readFileSync(groundFile, 'utf8')) || '';
    const events = statedTheorems(text);
    const auditPath = path.join(GENERATED_DIR, 'Audit', 'Ground.lean');
    files.push({
      path: auditPath,
      text: auditModule({
        importModule: 'EpistemicProtocols.Ground.Proofs',
        ns: 'Ground',
        events,
        proofsModule: 'EpistemicProtocols.Ground.Proofs',
        contractModules: ['EpistemicProtocols.Ground'],
      }).replace('open Ground\n', ''),
    });
    audits.push({ relPath: CANONICAL_GROUND, ns: 'Ground', auditPath, stated: events.filter((e) => e.name).map((e) => `Ground.${e.name}`) });
  }
  return { files, audits };
}

function writeContracts(root, plan) {
  fs.rmSync(path.join(root, GENERATED_DIR), { recursive: true, force: true });
  for (const file of plan.files) {
    const full = path.join(root, file.path);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, file.text);
  }
}

function leanBlocksFrom(root, relPaths) {
  const blocks = [];
  for (const relPath of relPaths) {
    const full = path.join(root, relPath);
    if (!fs.existsSync(full)) continue;
    const block = extractLeanBlock(fs.readFileSync(full, 'utf8'));
    if (block !== null) blocks.push({ relPath, block });
  }
  return blocks;
}

module.exports = {
  ALLOWED_AXIOMS,
  CANONICAL_GROUND,
  GENERATED_DIR,
  GROUND_PROOFS,
  blockNamespace,
  canonicalGroundText,
  extractLeanBlock,
  groundSpan,
  leanBlocksFrom,
  planContracts,
  statedTheorems,
  writeContracts,
};

if (require.main === module) {
  const [command, rootArg] = process.argv.slice(2);
  if (command !== 'generate') {
    console.error('usage: lean-contract.js generate [root]');
    process.exit(2);
  }
  const root = path.resolve(rootArg || '.');
  const { protocolFiles } = require(path.join(root, 'scripts/load-protocols.js'));
  const plan = planContracts(root, leanBlocksFrom(root, protocolFiles({ projectRoot: root })));
  writeContracts(root, plan);
  for (const file of plan.files) console.log(file.path);
}
