/**
 * Repository-artifact sync layer: mechanical verdicts on repository artifacts
 * Lean does not see — plugin manifests and their versions, packaging, the
 * README / marketplace / routing-index / onboard surfaces that enumerate the
 * protocols, packaged-agent and Output Style copies that must stay in step
 * with their source, and the SKILL.md section schema (`structure`).
 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const { execFileSync } = require('child_process');
const { escapeRegex } = require('./check-context');
const { extractFormalSection } = require('./lean-bridge');
const { CANONICAL_CLUSTERS } = require(path.resolve(__dirname, '../../../../scripts/load-protocols.js'));

// ============================================================
// Check: JSON Schema Validation
// ============================================================
function checkJsonSchema(ctx) {
  const { projectRoot, results, walkFiles } = ctx;
  const pluginJsonPaths = walkFiles(projectRoot, e => e.name === 'plugin.json', 'json-schema');

  const requiredFields = ['name', 'version', 'description', 'author'];
  const versionPattern = /^\d+\.\d+\.\d+$/;

  for (const jsonPath of pluginJsonPaths) {
    try {
      const content = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      const relativePath = path.relative(projectRoot, jsonPath);

      // Check required fields
      for (const field of requiredFields) {
        if (!content[field]) {
          results.fail.push({
            check: 'json-schema',
            file: relativePath,
            message: `Missing required field: ${field}`
          });
        }
      }

      // Check version format
      if (content.version && !versionPattern.test(content.version)) {
        results.warn.push({
          check: 'json-schema',
          file: relativePath,
          message: `Version "${content.version}" not in semver format (x.y.z)`
        });
      }

      // Check name format (lowercase, hyphens only)
      if (content.name && !/^[a-z][a-z0-9-]*$/.test(content.name)) {
        results.warn.push({
          check: 'json-schema',
          file: relativePath,
          message: `Name "${content.name}" should be lowercase with hyphens only`
        });
      }

      results.pass.push({
        check: 'json-schema',
        file: relativePath,
        message: 'Valid plugin.json structure'
      });

    } catch (e) {
      results.fail.push({
        check: 'json-schema',
        file: path.relative(projectRoot, jsonPath),
        message: `Invalid JSON: ${e.message}`
      });
    }
  }
}

// ============================================================
// Check: Cross-Reference Integrity
// ============================================================
function checkCrossReference(ctx) {
  const { projectRoot, results, walkFiles } = ctx;
  const claudeMdPath = path.join(projectRoot, 'CLAUDE.md');

  if (!fs.existsSync(claudeMdPath)) {
    results.warn.push({
      check: 'xref',
      file: 'CLAUDE.md',
      message: 'CLAUDE.md not found, skipping cross-reference check'
    });
    return;
  }

  const claudeMd = fs.readFileSync(claudeMdPath, 'utf8');

  // Check referenced files exist
  const fileRefs = claudeMd.matchAll(/`(references\/[^`]+)`/g);
  for (const ref of fileRefs) {
    const refPath = ref[1];
    // Check in likely locations
    // Single canonical location after reflexion removal and write consolidation
    // into epistemic-cooperative. Array form retained to accommodate future
    // references-hosting plugins without restructuring the resolver.
    const locations = [
      path.join(projectRoot, 'epistemic-cooperative/skills/write', refPath),
    ];

    let exists = locations.some(loc => fs.existsSync(loc));

    // Fallback: search project tree for matching filename
    if (!exists) {
      const basename = path.basename(refPath);
      const fallbackFiles = walkFiles(projectRoot, e => e.name === basename, null);
      exists = fallbackFiles.some(f => f.endsWith(refPath));
    }

    if (!exists && !refPath.includes('example')) {
      results.warn.push({
        check: 'xref',
        file: 'CLAUDE.md',
        message: `Referenced file "${refPath}" may not exist`
      });
    }
  }

  results.pass.push({
    check: 'xref',
    file: 'CLAUDE.md',
    message: 'Cross-reference check completed'
  });
}

// ============================================================
// Check: Routing Index Contract
// ============================================================
// CLAUDE.md/AGENTS.md indexes the protocol catalog rather than mirroring it: it
// must keep a "## Protocol Index" section that routes to the authoritative sources
// (the route plugin's derived table, per-protocol SKILL.md, README) instead of
// re-inscribing the catalog inline. This is the lightweight successor to the removed
// CLAUDE.md-content mirror checks (checkCrossRefScan) — it enforces the routing
// *contract* (structure + pointers), not mirrored content, so catalog drift is
// caught without re-creating the co-change chain the mirror checks imposed.
function checkRoutingIndexContract(ctx) {
  const { projectRoot, results } = ctx;
  const check = 'routing-index-contract';
  const claudeMdPath = path.join(projectRoot, 'CLAUDE.md');

  if (!fs.existsSync(claudeMdPath)) {
    results.warn.push({
      check,
      file: 'CLAUDE.md',
      message: 'CLAUDE.md not found, skipping routing-index contract check'
    });
    return;
  }

  const claudeMd = fs.readFileSync(claudeMdPath, 'utf8');
  let failed = false;

  // Contract 1: an H2 "## Protocol Index" section must be present — matched
  // line-anchored and exactly at H2, so an inline mention in prose or an `###`
  // subheading cannot satisfy the contract. Its routing pointers are then checked
  // WITHIN that section (sliced to the next H2 or end of file), so an incidental
  // mention elsewhere in the file (e.g. `SKILL.md` in the Runtime Contract prose)
  // cannot satisfy the contract on its own.
  const headingMatch = claudeMd.match(/^##[ \t]+Protocol Index[ \t]*$/m);
  if (!headingMatch) {
    results.fail.push({
      check,
      file: 'CLAUDE.md',
      message: 'Missing "## Protocol Index" H2 section — the routing index is the successor to the removed inline protocol catalog'
    });
    failed = true;
  } else {
    const afterHeading = claudeMd.slice(headingMatch.index + headingMatch[0].length);
    const nextH2 = afterHeading.search(/\n##[ \t]/);
    const section = nextH2 === -1 ? afterHeading : afterHeading.slice(0, nextH2);
    const requiredPointers = [
      { label: 'route/README.md', pattern: /route\/README\.md/ },
      { label: 'per-protocol SKILL.md', pattern: /SKILL\.md/ },
      { label: 'README', pattern: /README/ },
    ];
    for (const { label, pattern } of requiredPointers) {
      if (!pattern.test(section)) {
        results.fail.push({
          check,
          file: 'CLAUDE.md',
          message: `Protocol Index missing routing pointer to authoritative source: ${label}`
        });
        failed = true;
      }
    }
  }

  // Contract 2 (warn): the removed inline catalog must not be reintroduced —
  // re-inscribing it would restore the mirror/co-change cost the index removed.
  const catalogRegressions = [
    { label: '"## Protocol Reference" heading', pattern: /^##[ \t]+Protocol Reference[ \t]*$/m },
    { label: '"Concern | Protocols" cluster table', pattern: /\|\s*Concern\s*\|\s*Protocols\s*\|/ },
  ];
  for (const { label, pattern } of catalogRegressions) {
    if (pattern.test(claudeMd)) {
      results.warn.push({
        check,
        file: 'CLAUDE.md',
        message: `Inline protocol catalog reintroduced (${label}) — route to route/README.md, SKILL.md, README instead of mirroring the catalog`
      });
    }
  }

  if (!failed) {
    results.pass.push({
      check,
      file: 'CLAUDE.md',
      message: 'Routing index contract satisfied'
    });
  }
}

// ============================================================
// Check: Required Sections in Protocols
// ============================================================
function checkRequiredSections(ctx) {
  const { projectRoot, results, PROTOCOL_FILES } = ctx;

  const requiredSections = [
    '## Definition',
    '## Mode Activation',
    '## Protocol',
    '## Rules',
    '── PHASE TRANSITIONS ──',
    '── MODE STATE ──',
  ];

  for (const relPath of PROTOCOL_FILES) {
    const fullPath = path.join(projectRoot, relPath);
    if (!fs.existsSync(fullPath)) {
      results.warn.push({
        check: 'structure',
        file: relPath,
        message: `Protocol file not found: ${relPath}`
      });
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf8');

    for (const section of requiredSections) {
      if (!content.includes(section)) {
        results.fail.push({
          check: 'structure',
          file: relPath,
          message: `Missing required section: "${section}"`
        });
      }
    }

    results.pass.push({
      check: 'structure',
      file: relPath,
      message: 'Required sections present'
    });
  }
}

// ============================================================
// Check: Version Staleness Detection
// ============================================================
function checkVersionStaleness(ctx) {
  const { projectRoot, results } = ctx;
  // Verify git repo
  try {
    execFileSync('git', ['rev-parse', '--is-inside-work-tree'], { cwd: projectRoot, stdio: 'pipe' });
  } catch {
    // Not a git repo — check not applicable
    results.pass.push({ check: 'version-staleness', file: 'working tree', message: 'Not a git repository — skipping' });
    return;
  }

  // Collect all uncommitted changes (staged + unstaged + untracked)
  // Union of diff HEAD (working tree vs HEAD) and diff --cached (index vs HEAD)
  // to cover staged-only changes (e.g., git add file then revert working tree)
  let changedFiles;
  try {
    const diffHeadOutput = execFileSync('git', ['diff', 'HEAD', '--name-only'], { cwd: projectRoot, encoding: 'utf8' }).trim();
    const diffCachedOutput = execFileSync('git', ['diff', '--cached', '--name-only'], { cwd: projectRoot, encoding: 'utf8' }).trim();
    const untrackedOutput = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { cwd: projectRoot, encoding: 'utf8' }).trim();
    const fileSet = new Set([
      ...(diffHeadOutput ? diffHeadOutput.split('\n') : []),
      ...(diffCachedOutput ? diffCachedOutput.split('\n') : []),
      ...(untrackedOutput ? untrackedOutput.split('\n') : []),
    ]);
    changedFiles = [...fileSet];
  } catch {
    // git diff HEAD fails on initial commit (no HEAD) — fall back to staged + untracked only
    try {
      const stagedOutput = execFileSync('git', ['diff', '--cached', '--name-only'], { cwd: projectRoot, encoding: 'utf8' }).trim();
      const untrackedOutput = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { cwd: projectRoot, encoding: 'utf8' }).trim();
      changedFiles = [
        ...(stagedOutput ? stagedOutput.split('\n') : []),
        ...(untrackedOutput ? untrackedOutput.split('\n') : []),
      ];
    } catch {
      results.warn.push({ check: 'version-staleness', file: 'working tree', message: 'Git commands failed — version staleness check skipped' });
      return;
    }
  }

  if (changedFiles.length === 0) {
    results.pass.push({
      check: 'version-staleness',
      file: 'working tree',
      message: 'No uncommitted changes'
    });
    return;
  }

  // Skip version staleness check during conflict states (diff output unreliable).
  // Resolve the git dir rather than assuming a layout: in a worktree `.git` is a file
  // holding a gitdir: pointer, so a `<root>/.git/<head>` path can never exist there.
  // `--git-dir` and not `--git-common-dir` — the conflict heads are per-worktree and
  // are absent from the shared dir the latter reports.
  let gitDir;
  try {
    // `--git-dir` may answer relative to the git process's cwd, which is projectRoot
    const gitDirOutput = execFileSync('git', ['rev-parse', '--git-dir'], { cwd: projectRoot, encoding: 'utf8' }).trim();
    gitDir = path.resolve(projectRoot, gitDirOutput);
  } catch (e) {
    // Conflict state is now unknown, which is precisely when diff output cannot be
    // trusted — skip visibly rather than let the guard fall silently open again.
    results.warn.push({
      check: 'version-staleness',
      file: 'working tree',
      message: `Git command failed (rev-parse --git-dir) — version staleness check skipped: ${e.message}`
    });
    return;
  }
  const conflictHeads = ['MERGE_HEAD', 'REBASE_HEAD', 'CHERRY_PICK_HEAD'];
  const activeConflict = conflictHeads.find(h => fs.existsSync(path.join(gitDir, h)));
  if (activeConflict) {
    results.pass.push({
      check: 'version-staleness',
      file: 'working tree',
      message: `${activeConflict} detected — skipping version staleness check`
    });
    return;
  }

  // Find all plugin directories (contain .claude-plugin/plugin.json)
  const pluginDirs = new Map(); // pluginDir → plugin.json relative path
  function findPluginDirs(dir, depth = 0) {
    if (depth > 3) return;
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory() || entry.name === 'node_modules') continue;
        const fullPath = path.join(dir, entry.name);
        if (entry.name === '.claude-plugin') {
          const pjPath = path.join(fullPath, 'plugin.json');
          if (fs.existsSync(pjPath)) {
            const parentRel = path.relative(projectRoot, dir);
            const pjRel = path.relative(projectRoot, pjPath);
            pluginDirs.set(parentRel || '.', pjRel);
          }
        } else if (!entry.name.startsWith('.')) {
          findPluginDirs(fullPath, depth + 1);
        }
      }
    } catch (e) {
      if (e.code !== 'EACCES' && e.code !== 'ENOENT') {
        results.warn.push({ check: 'version-staleness', file: path.relative(projectRoot, dir), message: `Directory walk error: ${e.code || e.message}` });
      }
    }
  }
  findPluginDirs(projectRoot);

  // Track warn count to avoid pass+warn co-emission
  let stalenessWarns = 0;

  // Non-semantic files that don't warrant a version bump
  const STALENESS_IGNORE = new Set([
    'README.md', 'README_ko.md', 'LICENSE', '.gitignore', '.gitattributes',
  ]);

  // Group changed files by plugin directory
  for (const [pluginDir, pluginJsonRel] of pluginDirs) {
    const prefix = pluginDir === '.' ? '' : pluginDir + '/';
    const pluginMetaPrefix = prefix + '.claude-plugin/';

    // Content changes = files in this plugin dir, excluding .claude-plugin/ and non-semantic files
    const contentChanges = changedFiles.filter(f => {
      if (prefix && !f.startsWith(prefix)) return false;
      if (f.startsWith(pluginMetaPrefix)) return false;
      if (STALENESS_IGNORE.has(path.basename(f))) return false;
      // For root plugin, exclude files belonging to sub-plugin directories
      if (prefix === '') {
        for (const [otherDir] of pluginDirs) {
          if (otherDir !== '.' && f.startsWith(otherDir + '/')) return false;
        }
      }
      return true;
    });

    if (contentChanges.length === 0) continue;

    // Check if plugin.json has a version bump
    let versionBumped = false;

    // New untracked plugin.json counts as version set
    if (changedFiles.includes(pluginJsonRel)) {
      try {
        const diffResult = execFileSync('git', ['diff', 'HEAD', '--', pluginJsonRel], { cwd: projectRoot, encoding: 'utf8' });
        if (/^\+\s*"version":/m.test(diffResult)) {
          versionBumped = true;
        }
      } catch {
        // If diff fails (e.g., initial commit with no HEAD), check untracked and staged files
        try {
          const untrackedOutput = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { cwd: projectRoot, encoding: 'utf8' }).trim();
          if (untrackedOutput.split('\n').includes(pluginJsonRel)) {
            versionBumped = true; // New plugin — initial version is set
          }
          // Also check staged changes (file may be git-added but no HEAD exists yet)
          if (!versionBumped) {
            const stagedDiff = execFileSync('git', ['diff', '--cached', '--', pluginJsonRel], { cwd: projectRoot, encoding: 'utf8' });
            if (/^\+\s*"version":/m.test(stagedDiff)) {
              versionBumped = true;
            }
          }
        } catch (e) {
          // Git commands failed (e.g., index.lock, permissions) — conservative: assume no bump
          results.warn.push({ check: 'version-staleness', file: pluginJsonRel, message: `Git command failed: ${e.message}` });
          versionBumped = false;
        }
      }
    }

    if (!versionBumped) {
      const pluginName = pluginDir === '.' ? 'root' : pluginDir;
      results.warn.push({
        check: 'version-staleness',
        file: pluginJsonRel,
        message: `Plugin "${pluginName}" has content changes but no version bump in plugin.json (${contentChanges.length} file(s) changed)`
      });
      stalenessWarns++;
    }
  }

  if (stalenessWarns === 0) {
    results.pass.push({
      check: 'version-staleness',
      file: 'all plugins',
      message: 'Version staleness check completed'
    });
  }
}

// ============================================================
// Check: Cross-Reference Scan (Protocol Name & Deficit Consistency)
// ============================================================
function checkCrossRefScan(ctx) {
  const { projectRoot, results, PROTOCOL_FILES, CANONICAL_PROTOCOLS } = ctx;
  let subCheckFailed = false;

  // CLAUDE.md is a routing index, not a content mirror: its deficit → resolution
  // pairs, cluster table, and initiator taxonomy were replaced by pointers to the
  // authoritative sources (per-protocol SKILL.md, the route table, README), so
  // the scan enforces those sources directly and no longer reads CLAUDE.md content.

  // Sub-check 1: Verify each protocol SKILL.md contains its own correct deficit → resolution pair
  for (const relPath of PROTOCOL_FILES) {
    const fullPath = path.join(projectRoot, relPath);
    if (!fs.existsSync(fullPath)) continue;

    const content = fs.readFileSync(fullPath, 'utf8');

    // Determine which protocol this SKILL.md belongs to
    const dirName = relPath.split('/')[0];
    const protocolEntry = Object.entries(CANONICAL_PROTOCOLS).find(([name]) =>
      name.toLowerCase() === dirName
    );

    if (!protocolEntry) continue;

    const [protocolName, { deficit, resolution }] = protocolEntry;

    // Check that the deficit type appears in the SKILL.md
    if (!content.includes(deficit)) {
      results.fail.push({
        check: 'cross-ref-scan',
        file: relPath,
        message: `Missing deficit type "${deficit}" in ${protocolName} SKILL.md`
      });
      subCheckFailed = true;
    }

    // Check that the resolution type appears in the SKILL.md
    if (!content.includes(resolution)) {
      results.fail.push({
        check: 'cross-ref-scan',
        file: relPath,
        message: `Missing resolution type "${resolution}" in ${protocolName} SKILL.md`
      });
      subCheckFailed = true;
    }
  }

  // Sub-check 2: Verify README workflow canonical-clusters invariant
  for (const relPath of ['README.md', 'README_ko.md']) {
    const fullPath = path.join(projectRoot, relPath);
    if (!fs.existsSync(fullPath)) continue;

    const content = fs.readFileSync(fullPath, 'utf8');
    if (!content.includes(CANONICAL_CLUSTERS)) {
      results.fail.push({
        check: 'cross-ref-scan',
        file: relPath,
        message: `Missing canonical workflow "${CANONICAL_CLUSTERS}"`
      });
      subCheckFailed = true;
    }
  }

  // Sub-check 3: Array completeness — cross-check PROTOCOL_FILES, CANONICAL_PROTOCOLS,
  // package.js PLUGINS, and marketplace.json plugins against filesystem ground truth
  {
    // Ground truth: directories containing .claude-plugin/plugin.json
    // Deprecated plugins (plugin.json carries "deprecated": true) are tracked
    // separately so cross-ref checks can exclude them from active-set diffs
    // without a hardcoded allowlist (Plugin Encapsulation: deprecation lives
    // in per-plugin self-description, not in the verifier).
    const allPluginDirs = new Set();
    const deprecatedPluginDirs = new Set();
    try {
      const entries = fs.readdirSync(projectRoot, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
        const pluginJsonPath = path.join(projectRoot, entry.name, '.claude-plugin', 'plugin.json');
        if (fs.existsSync(pluginJsonPath)) {
          allPluginDirs.add(entry.name);
          try {
            const pj = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));
            if (pj.deprecated === true) deprecatedPluginDirs.add(entry.name);
          } catch (e) {
            // Surface parse errors as warnings so the real cause (bad JSON)
            // shows up in this check's output instead of cascading into a
            // misleading "missing from PROTOCOL_FILES" downstream warning
            // (PR #351 review M1). The json-schema check independently
            // reports the same error; co-reporting is intentional.
            results.warn.push({
              check: 'cross-ref-scan',
              file: path.relative(projectRoot, pluginJsonPath),
              message: `Could not parse plugin.json for deprecated lookup: ${e.message}`
            });
          }
        }
      }
    } catch (e) {
      // Stage 2 loud mode (upstream scope): this readdir is the ground-truth
      // source for cross-ref-scan Sources 1, 2, 3, and 4. If it fails,
      // allPluginDirs is empty, every downstream source sees an empty
      // filesystem view, every bidirectional diff collapses to zero findings,
      // and the entire cross-ref-scan check would silently pass with no
      // detection. This is the exact silent-failure CLASS Stage 2 closes in
      // Source 3, at an upstream scope that covers all four sources.
      // Escalate to fail + subCheckFailed per fail-closed policy —
      // review-ensemble cross-model agreement (Codex gpt-5.4 high +
      // silent-failure-hunter) flagged this during PR development.
      results.fail.push({
        check: 'cross-ref-scan',
        file: '.',
        message: `Could not scan plugin directories (upstream ground truth): ${e.message}`
      });
      subCheckFailed = true;
    }

    // Protocol-only subset (dirs listed in PROTOCOL_FILES)
    const protocolDirs = new Set(PROTOCOL_FILES.map(f => f.split('/')[0]));

    // Non-protocol plugin dirs (utility plugins not expected in protocol-only arrays)
    const utilityDirs = new Set([...allPluginDirs].filter(d => !protocolDirs.has(d)));

    // Source 1: PROTOCOL_FILES dirs
    for (const dir of allPluginDirs) {
      if (utilityDirs.has(dir)) continue; // utility plugins not expected in PROTOCOL_FILES
      if (deprecatedPluginDirs.has(dir)) continue; // deprecated plugins exit active enumeration
      if (!protocolDirs.has(dir)) {
        results.warn.push({
          check: 'cross-ref-scan',
          file: 'static-checks.js',
          message: `Protocol directory "${dir}" exists on filesystem but missing from PROTOCOL_FILES array`
        });
      }
    }

    // Source 2: CANONICAL_PROTOCOLS keys (title-cased protocol names)
    const canonicalDirs = new Set(
      Object.keys(CANONICAL_PROTOCOLS).map(name => name.toLowerCase())
    );
    for (const dir of allPluginDirs) {
      if (utilityDirs.has(dir)) continue;
      if (deprecatedPluginDirs.has(dir)) continue;
      if (!canonicalDirs.has(dir)) {
        results.warn.push({
          check: 'cross-ref-scan',
          file: 'static-checks.js',
          message: `Protocol directory "${dir}" exists on filesystem but missing from CANONICAL_PROTOCOLS`
        });
      }
    }

    // Source 3: package.js PLUGINS at (dir, skill) tuple granularity.
    // Publication-surface invariant: the set of (dir, skill) SKILL.md files on disk
    // must match PLUGINS exactly. This sub-check deliberately does NOT apply the
    // utilityDirs skip — utility plugin SKILL.md files must also be published.
    // Sources 1 and 2 remain protocol-only (utility-skip preserved) — Source 3
    // (package.js PLUGINS) and Source 4 (marketplace.json) publish across the
    // full plugin set, protocol and utility alike.
    //
    // IMPORTANT: path.resolve (not path.join) is load-bearing here. When invoked
    // as `node .claude/skills/verify/scripts/static-checks.js .`, projectRoot is
    // the relative string ".". path.join(".", "scripts", "package.js") yields
    // "scripts/package.js", which require() treats as a MODULE IDENTIFIER (not a
    // file path) and resolves against node_modules → Cannot find module. The
    // catch then silently swallows and the entire sub-check no-ops. path.resolve
    // forces cwd-absolute, which require() accepts as a file path. Surrounding
    // path.join calls (graphPath2, skillMdPath) feed fs.existsSync/fs.readdirSync
    // which DO accept cwd-relative paths; require() has stricter semantics. Do
    // NOT "normalize" to path.join for stylistic consistency.
    //
    // Meta-dependency note: this require() creates a structural coupling
    // static-checks.js → scripts/package.js. package.js's top-level code runs
    // inside the verifier process on require. The existing `require.main ===
    // module` guard in package.js keeps main() from firing, but any new
    // top-level side effect (console.log, fs write, network call) would leak
    // into verify output. package.js contributors must keep all effects behind
    // function boundaries or the main-module guard.
    const packageJsPath = path.resolve(projectRoot, 'scripts', 'package.js');
    if (!fs.existsSync(packageJsPath)) {
      // Loud failure: package.js is a required input for the publication-surface
      // check. Missing file is a detector-infrastructure problem, not a migration
      // signal — escalate to subCheckFailed per Stage 2 loud-mode policy.
      results.fail.push({
        check: 'cross-ref-scan',
        file: 'scripts/package.js',
        message: 'Required file not found — cross-ref-scan Source 3 cannot verify publication surface'
      });
      subCheckFailed = true;
    } else {
      let PLUGINS = null;
      let loadFailed = false;
      try {
        // Invalidate require cache so repeated static-check runs pick up edits.
        delete require.cache[require.resolve(packageJsPath)];
        ({ PLUGINS } = require(packageJsPath));
      } catch (e) {
        // Stage 2 loud mode: require() failure is a detector-infrastructure
        // failure (the detector itself cannot run), not a migration signal.
        // Escalate to subCheckFailed so the bug class that caused the PR #242
        // critical path.resolve incident cannot recur as a silent no-op.
        results.fail.push({
          check: 'cross-ref-scan',
          file: 'scripts/package.js',
          message: `Could not load package.js PLUGINS: ${e.message}`
        });
        subCheckFailed = true;
        loadFailed = true;
      }

      if (!loadFailed && !Array.isArray(PLUGINS)) {
        // Stage 2 loud mode: require() succeeded but the PLUGINS export is
        // absent or has a non-Array shape (e.g., hand-edit breakage, typo in
        // module.exports). Treat as detector-infrastructure failure — without a
        // valid PLUGINS array we cannot diff against the filesystem.
        // Shape description handles null specially — `typeof null === 'object'`
        // would produce the misleading "got object" for a null export.
        const shapeDesc =
          PLUGINS === undefined ? 'undefined'
            : PLUGINS === null ? 'null'
            : typeof PLUGINS;
        results.fail.push({
          check: 'cross-ref-scan',
          file: 'scripts/package.js',
          message: `PLUGINS export shape invalid — expected Array, got ${shapeDesc}`
        });
        subCheckFailed = true;
      } else if (!loadFailed && Array.isArray(PLUGINS)) {
        // Structural guard: every tuple must have { dir: string, skill: string }.
        // Loud-mode escalation per Stage 2 — bad shape blocks CI rather than
        // producing phantom downstream warnings.
        //
        // Note: PLUGINS is now derived from scripts/load-protocols.js
        // discoverPlugins() (filesystem walk). The prior bidirectional diff
        // (publication-gap, stale-plugins-entry) compared PLUGINS against a
        // separate filesystem walk — under the helper-derived model both
        // sides share the same walk, making the diff tautological. Drift
        // detection moves to marketplace.json plugins (Source 4), which
        // remains hand-curated relative to filesystem.
        for (const p of PLUGINS) {
          if (!p || typeof p.dir !== 'string' || typeof p.skill !== 'string') {
            const serialized = util.inspect(p, { depth: 2, breakLength: 80 });
            results.fail.push({
              check: 'cross-ref-scan',
              file: 'scripts/package.js',
              message: `malformed-plugins-entry: expected { dir: string, skill: string } tuple, got ${serialized}`
            });
            subCheckFailed = true;
          }
        }
      }
    }

    // Source 4: marketplace.json plugins
    const marketplacePath = path.join(projectRoot, '.claude-plugin', 'marketplace.json');
    if (fs.existsSync(marketplacePath)) {
      try {
        const marketplace = JSON.parse(fs.readFileSync(marketplacePath, 'utf8'));
        if (Array.isArray(marketplace.plugins)) {
          const marketplaceDirs = new Set(
            marketplace.plugins.map(p => {
              // source is like "./aitesis" — extract dir name
              const src = p.source || '';
              return src.replace(/^\.\//, '');
            }).filter(Boolean)
          );
          // Every filesystem plugin dir should appear in marketplace.json
          for (const dir of allPluginDirs) {
            if (deprecatedPluginDirs.has(dir)) continue;
            if (!marketplaceDirs.has(dir)) {
              results.warn.push({
                check: 'cross-ref-scan',
                file: '.claude-plugin/marketplace.json',
                message: `Plugin directory "${dir}" exists on filesystem but missing from marketplace.json plugins`
              });
            }
          }
          // Every marketplace.json plugin should have a corresponding directory
          for (const dir of marketplaceDirs) {
            if (!allPluginDirs.has(dir)) {
              results.warn.push({
                check: 'cross-ref-scan',
                file: '.claude-plugin/marketplace.json',
                message: `marketplace.json plugin "${dir}" has no corresponding plugin directory on filesystem`
              });
            }
          }
        }
      } catch (e) {
        results.warn.push({
          check: 'cross-ref-scan',
          file: '.claude-plugin/marketplace.json',
          message: `Could not parse marketplace.json: ${e.message}`
        });
      }
    }
  }

  if (!subCheckFailed) {
    results.pass.push({
      check: 'cross-ref-scan',
      file: 'all protocols',
      message: 'Cross-reference scan completed — protocol names and deficit pairs consistent'
    });
  }
}

// ============================================================
// Check: Onboard Sync (Protocol coverage in onboard materials)
// ============================================================
function checkOnboardSync(ctx) {
  const { projectRoot, results, PROTOCOL_FILES } = ctx;
  const onboardSkillPath = path.join(projectRoot, 'epistemic-cooperative/skills/onboard/SKILL.md');
  if (!fs.existsSync(onboardSkillPath)) {
    results.warn.push({
      check: 'onboard-sync',
      file: 'epistemic-cooperative/skills/onboard/SKILL.md',
      message: 'Onboard SKILL.md not found, skipping onboard sync check'
    });
    return;
  }

  const onboardContent = fs.readFileSync(onboardSkillPath, 'utf8');
  let subCheckFailed = false;

  // Build protocol metadata from PROTOCOL_FILES
  // e.g., 'aitesis/skills/inquire/SKILL.md' → { name: 'Aitesis', command: 'inquire' }
  const protocols = PROTOCOL_FILES.map(relPath => {
    const parts = relPath.split('/');
    return {
      name: parts[0].charAt(0).toUpperCase() + parts[0].slice(1),
      command: parts[2]
    };
  });

  // Sub-check 1: Data Sources table — every protocol must have a row
  for (const { name, command } of protocols) {
    const pattern = `${name} \`/${command}\``;
    if (!onboardContent.includes(pattern)) {
      results.fail.push({
        check: 'onboard-sync',
        file: 'epistemic-cooperative/skills/onboard/SKILL.md',
        message: `Data Sources table missing protocol row: ${pattern}`
      });
      subCheckFailed = true;
    }
  }

  // Sub-check 2: Phase 0 category groupings cover all slash commands
  // (assumes Pre-execution/Analysis/Execution on consecutive lines)
  const categoryLines = onboardContent.match(/Pre-execution[^\n]*\n[^\n]*Analysis[^\n]*\n[^\n]*Execution[^\n]*/);
  if (categoryLines) {
    const categoryText = categoryLines[0];
    for (const { command } of protocols) {
      if (!categoryText.includes(`/${command}`)) {
        results.warn.push({
          check: 'onboard-sync',
          file: 'epistemic-cooperative/skills/onboard/SKILL.md',
          message: `Phase 0 category groupings missing "/${command}"`
        });
      }
    }
  } else {
    results.warn.push({
      check: 'onboard-sync',
      file: 'epistemic-cooperative/skills/onboard/SKILL.md',
      message: 'Phase 0 category groupings pattern not found — structure may have changed'
    });
  }

  // Sub-check 3: scenarios.md — every protocol must have a scenario block
  const scenariosPath = path.join(projectRoot, 'epistemic-cooperative/skills/onboard/references/scenarios.md');
  if (fs.existsSync(scenariosPath)) {
    const scenariosContent = fs.readFileSync(scenariosPath, 'utf8');
    for (const { name, command } of protocols) {
      const heading = `## ${name} \`/${command}\``;
      if (!scenariosContent.includes(heading)) {
        results.fail.push({
          check: 'onboard-sync',
          file: 'epistemic-cooperative/skills/onboard/references/scenarios.md',
          message: `Missing scenario block: ${heading}`
        });
        subCheckFailed = true;
      }
    }
  } else {
    results.warn.push({
      check: 'onboard-sync',
      file: 'epistemic-cooperative/skills/onboard/references/scenarios.md',
      message: 'scenarios.md not found'
    });
  }

  // Sub-check 4: workflow.md — all slash commands present
  const workflowPath = path.join(projectRoot, 'epistemic-cooperative/skills/onboard/references/workflow.md');
  if (fs.existsSync(workflowPath)) {
    const workflowContent = fs.readFileSync(workflowPath, 'utf8');
    for (const { command } of protocols) {
      if (!workflowContent.includes(`/${command}`)) {
        results.fail.push({
          check: 'onboard-sync',
          file: 'epistemic-cooperative/skills/onboard/references/workflow.md',
          message: `Missing "/${command}" in workflow reference (references/workflow.md)`
        });
        subCheckFailed = true;
      }
    }
  } else {
    results.warn.push({
      check: 'onboard-sync',
      file: 'epistemic-cooperative/skills/onboard/references/workflow.md',
      message: 'workflow.md not found'
    });
  }

  if (!subCheckFailed) {
    results.pass.push({
      check: 'onboard-sync',
      file: 'epistemic-cooperative/',
      message: `Onboard sync — Data Sources, scenarios, and workflow verified for ${protocols.length} protocols`
    });
  }
}

// ============================================================
// Check: Codex Manifest Version Sync
// ============================================================
// Every plugin carries a canonical .claude-plugin/plugin.json (the one
// package.js builds from) and may carry a .codex-plugin/plugin.json variant.
// version-staleness only inspects the claude manifest, so a bump that touches
// the claude manifest leaves the codex manifest silently drifted — the
// recurring "version bump missed codex-plugin" pattern. walkFiles skips
// dot-directories, so the codex manifest is also outside json-schema's reach;
// this check is its only parse/version guard. Fail-level on purpose: the
// forcing function must block at the same /verify gate the claude bump passes
// through, not surface after the fact in a separate remediation PR.
function checkCodexManifestSync(ctx) {
  const { projectRoot, results, records } = ctx;
  const seen = new Set();
  let inSync = 0;
  for (const record of records) {
    if (seen.has(record.dir)) continue;
    seen.add(record.dir);

    const codexPath = path.join(projectRoot, record.dir, '.codex-plugin', 'plugin.json');
    if (!fs.existsSync(codexPath)) continue; // codex variant optional; equality enforced only when present

    const codexRel = path.relative(projectRoot, codexPath);
    let codexJson;
    try {
      codexJson = JSON.parse(fs.readFileSync(codexPath, 'utf8'));
    } catch (e) {
      results.fail.push({
        check: 'codex-manifest-sync',
        file: codexRel,
        message: `Unparseable codex manifest: ${e.message}`,
      });
      continue;
    }

    const claudeVer = record.pluginJson.version;
    const codexVer = codexJson.version;
    if (!codexVer) {
      results.fail.push({
        check: 'codex-manifest-sync',
        file: codexRel,
        message: `Missing "version" — set it to "${claudeVer}" to match .claude-plugin/plugin.json`,
      });
      continue;
    }
    if (codexVer !== claudeVer) {
      results.fail.push({
        check: 'codex-manifest-sync',
        file: codexRel,
        message: `Version drift — codex "${codexVer}" != claude "${claudeVer}"; bump this file to "${claudeVer}" in the same commit as the claude version bump`,
      });
      continue;
    }
    inSync++;
  }

  // Always leave a terminal result so a registered-but-clean check is
  // distinguishable from one that never ran. Pass is suppressed only when
  // this check itself pushed a fail (preserves pass/fail non-co-emission).
  const sawFail = results.fail.some(f => f.check === 'codex-manifest-sync');
  if (!sawFail) {
    results.pass.push({
      check: 'codex-manifest-sync',
      file: 'working tree',
      message: inSync > 0
        ? `All ${inSync} codex manifests match their .claude-plugin/plugin.json version`
        : 'No .codex-plugin manifests present — nothing to sync',
    });
  }
}

// ============================================================
// Check: Packaged Agent ↔ SKILL.md Contract Sync
// ============================================================
// A plugin may ship a packaged subagent (`<plugin>/agents/*.md`) that a SKILL.md
// phase dispatches and whose verdict the SKILL.md parses back into typed state.
// When both surfaces inscribe the same review contract — the verdict's
// realization value set, the advisory disposition vocabulary, and the reviewer's
// checklist categories — an edit to one surface silently drifts from the other
// (a packaged agent paired with the skill contract it enforces, Issue #532). The
// agent file's own Maintenance Note states the sync obligation; this check makes
// it a forcing function at the /verify gate.
//
// Design (generic, not pinned to any one plugin):
//  - Opt-in by STRUCTURAL ANCHOR: an agent is contract-bearing iff its body
//    carries a verdict `### Realization:` enumeration line. Utility scanner
//    agents (epistemic-cooperative) lack it and are skipped — no false sync.
//  - Pairing: the contract-bearing agent pairs with a SKILL.md in its OWN
//    plugin whose TYPES block carries the matching enumerations.
//  - Comparison is SYMMETRIC (drift = mismatch between the two surfaces), not
//    against hardcoded token constants:
//      (b) Realization values — agent `### Realization: a | b | c` must equal
//          some TYPES `… ∈ {a, b, c}` enumeration (set-equality).
//      (c) Advisory vocabulary — agent Advisory Disposition bold tags must
//          equal some TYPES `… ∈ {…}` enumeration (set-equality; parenthesized
//          constructor args stripped so `Resolve(ref)` normalizes to `Resolve`).
//      (a) Checklist categories — each agent `## Checklist` category key must
//          appear in the SKILL.md prose (CONTAINMENT — the SKILL side carries
//          the categories as prose, not a delimited list).
function checkPackagedAgentContractSync(ctx) {
  const { projectRoot, results, records } = ctx;
  const CHECK = 'packaged-agent-contract-sync';

  // Parse every `LHS ∈ { … }` enumeration from a formal block into normalized
  // token sets. Constructor args are stripped: `Resolve(canonical_ref)` → `Resolve`
  // so `A` and `A_tag` lines both normalize to the same advisory vocabulary.
  function parseEnumerations(typesBlock) {
    const enums = [];
    const re = /([A-Za-z_][\w]*)\s*∈\s*\{([^}]*)\}/g;
    let m;
    while ((m = re.exec(typesBlock)) !== null) {
      const tokens = m[2]
        .split(',')
        .map(t => t.replace(/\(.*$/, '').trim())  // strip constructor args
        // keep only atomic tag tokens; drops parse artifacts from nested
        // type annotations (e.g. ZeroMemoryVerdict's `sweep: SweepTrace`) that
        // are never a tag-set comparison target
        .filter(t => /^[\w.-]+$/.test(t));
      if (tokens.length) enums.push({ lhs: m[1], set: new Set(tokens) });
    }
    return enums;
  }

  function setEqual(a, b) {
    if (a.size !== b.size) return false;
    for (const x of a) if (!b.has(x)) return false;
    return true;
  }

  // Extract the body of a `## Heading` markdown section up to the next `## `.
  function extractMdSection(content, headingRe) {
    const lines = content.split('\n');
    let collecting = false;
    const out = [];
    for (const line of lines) {
      if (!collecting) {
        if (headingRe.test(line)) collecting = true;
        continue;
      }
      if (/^##\s+/.test(line)) break;
      out.push(line);
    }
    return out.join('\n');
  }

  // Return the header column names of the first markdown table under a heading
  // matched by `headingRe`. Null when the heading or its table is absent. Used
  // to read the agent's verdict-table column schema (the columns the F5 caller
  // parses into typed state).
  function tableColumns(content, headingRe) {
    const lines = content.split('\n');
    let inSection = false;
    for (const line of lines) {
      if (!inSection) {
        if (headingRe.test(line)) inSection = true;
        continue;
      }
      if (/^#{1,3}\s+/.test(line)) break; // left the section before a table
      if (/^\s*\|.*\|\s*$/.test(line)) {
        return line.split('|').slice(1, -1).map(c => c.trim()).filter(Boolean);
      }
    }
    return null;
  }

  // Parse the field-name set of a record type `Name = { f1: T; f2: T }` (or a
  // wrapped form such as `Name = List({ f1: T, f2: T })`) from a formal block.
  // Null when the type is absent.
  function parseRecordFields(block, typeName) {
    const re = new RegExp(typeName + '\\s*=\\s*[^{]*\\{([^}]*)\\}');
    const m = block.match(re);
    if (!m) return null;
    return new Set(
      m[1].split(/[;,]/).map(s => s.split(':')[0].trim()).filter(Boolean)
    );
  }

  // The F5 checklist-category contract is not a `##` heading — it lives in the
  // F5 prose paragraph, Rule 9, and the EvidencedFinding TYPES line. Anchor the
  // category-presence search to that corpus so a category cannot pass by
  // matching unrelated prose elsewhere in the skill.
  function f5Corpus(content) {
    return content.split('\n')
      .filter(l =>
        /\*\*F5\b/.test(l) ||
        /zero-memory comprehension gate/i.test(l) ||
        /EvidencedFinding\s*=/.test(l)
      )
      .join('\n')
      .toLowerCase();
  }

  // Discover plugins carrying packaged agents. Dedup by plugin dir (a plugin
  // may surface multiple skill records).
  const pluginDirs = [...new Set(records.map(r => r.dir))];
  let checkedPairs = 0;

  for (const dir of pluginDirs) {
    const agentsDir = path.join(projectRoot, dir, 'agents');
    if (!fs.existsSync(agentsDir)) continue;

    const agentFiles = fs.readdirSync(agentsDir, { withFileTypes: true })
      .filter(e => e.isFile() && e.name.endsWith('.md'))
      .map(e => path.join(agentsDir, e.name));

    for (const agentPath of agentFiles) {
      const agentRel = path.relative(projectRoot, agentPath);
      const agentContent = fs.readFileSync(agentPath, 'utf8');

      // Opt-in anchor: a verdict `### Realization:` enumeration line. The
      // heading itself is the opt-in — capture the whole value and split on
      // `|`, so a single-value realization (no pipe) still paints into a
      // one-element set instead of being silently excluded.
      const realizationLine = agentContent
        .split('\n')
        .map(l => l.match(/^###\s+Realization:\s*(.+)$/))
        .find(Boolean);
      if (!realizationLine) continue; // not a contract-bearing agent → skip

      const agentRealization = new Set(
        realizationLine[1].split('|').map(t => t.trim()).filter(Boolean)
      );

      // Advisory vocabulary from the agent's Advisory Disposition bold tags.
      // Allow hyphenated tags (e.g. `Re-Route`) so a future compound tag is
      // not silently dropped from the parsed set.
      const advisorySection = extractMdSection(agentContent, /^##\s+Advisory Disposition/i);
      const agentAdvisory = new Set(
        [...advisorySection.matchAll(/^\s*-\s*\*\*([A-Za-z-]+)\*\*/gm)].map(x => x[1].trim())
      );

      // Checklist category keys from the agent's numbered checklist.
      const checklistSection = extractMdSection(agentContent, /^##\s+Checklist/i);
      const agentCategories = [...checklistSection.matchAll(/^\s*\d+\.\s*\*\*([^*]+)\*\*/gm)]
        .map(x => x[1].trim());

      // Pair with a SKILL.md in the SAME plugin whose TYPES enumerations cover
      // the agent's realization values. records carries every skill in the dir.
      const skillRecords = records.filter(r => r.dir === dir);
      let paired = null;
      let pairedEnums = null;
      for (const rec of skillRecords) {
        const skillContent = fs.readFileSync(rec.skillMdPath, 'utf8');
        const typesBlock = extractFormalSection(skillContent, 'TYPES');
        const enums = parseEnumerations(typesBlock);
        if (enums.some(e => setEqual(e.set, agentRealization))) {
          paired = { rec, skillContent, typesBlock };
          pairedEnums = enums;
          break;
        }
      }

      if (!paired) {
        results.fail.push({
          check: CHECK,
          file: agentRel,
          message: `Contract-bearing agent (carries "### Realization: ${[...agentRealization].join(' | ')}") but no SKILL.md in ${dir}/ has a TYPES enumeration matching that realization value set — the verdict contract drifted from its paired skill, or the pairing broke. Sync the SKILL.md realization enumeration with the agent's Realization line.`,
        });
        continue;
      }

      const skillRel = path.relative(projectRoot, paired.rec.skillMdPath);
      const localFails = [];

      // F5 verdict-contract detection — the verdict-table schema (d) and the
      // F5-anchored checklist corpus (a) are specific to the F5 zero-memory
      // contract, so both are gated on this. A marker on either side opts the
      // pairing in: the agent's Findings/Category-sweep verdict tables, or the
      // SKILL.md EvidencedFinding/SweepTrace parse records. A future contract-
      // bearing agent with a different verdict shape (no F5 marker either side)
      // keeps the generic checks (realization/advisory/checklist) but is not held
      // to the F5-specific schema or corpus.
      const agentFindingsCols = tableColumns(agentContent, /^###\s+Findings/);
      const agentSweepCols = tableColumns(agentContent, /^###\s+Category sweep/i);
      const efFields = parseRecordFields(paired.typesBlock, 'EvidencedFinding');
      const stFields = parseRecordFields(paired.typesBlock, 'SweepTrace');
      const isF5VerdictContract = agentFindingsCols || agentSweepCols || efFields || stFields;

      // (c) Advisory vocabulary — set-equality against some TYPES enumeration.
      if (agentAdvisory.size === 0) {
        localFails.push('agent Advisory Disposition section has no bold tag list — cannot verify advisory vocabulary');
      } else if (!pairedEnums.some(e => setEqual(e.set, agentAdvisory))) {
        localFails.push(
          `advisory vocabulary drift — agent advisory tags {${[...agentAdvisory].sort().join(', ')}} match no TYPES enumeration in ${skillRel} ` +
          `(present sets: ${pairedEnums.map(e => `${e.lhs}{${[...e.set].sort().join(',')}}`).join(' ')}). Sync the advisory coproduct.`
        );
      }

      // (a) Checklist categories — containment in the paired SKILL.md, matched
      // on the full stripped key (no first-two-words fallback) so a removed or
      // renamed category cannot pass by coinciding with unrelated prose. For an
      // F5 contract the search is anchored to the F5 contract corpus (not the
      // whole document); a non-F5 pairing falls back to whole-document search so
      // a future non-F5 agent's categories are not all reported missing.
      if (agentCategories.length === 0) {
        localFails.push('agent ## Checklist section has no numbered bold categories — cannot verify category coverage');
      } else {
        const corpus = isF5VerdictContract
          ? f5Corpus(paired.skillContent)
          : paired.skillContent.toLowerCase();
        const missing = [];
        for (const phrase of agentCategories) {
          // Match the FULL category phrase (only a trailing parenthetical is
          // stripped) — splitting on "without" would drop the qualifier, letting
          // an agent-side rename of the qualifier pass against an unchanged corpus.
          const key = phrase.toLowerCase().replace(/\s*\(.*$/, '').trim();
          if (!corpus.includes(key)) {
            missing.push(phrase);
          }
        }
        if (missing.length) {
          localFails.push(
            `checklist category drift — ${missing.length} agent checklist categor${missing.length === 1 ? 'y' : 'ies'} ` +
            `absent from ${skillRel}: ${missing.map(c => `"${c}"`).join(', ')}. ` +
            `Reflect the category in the SKILL.md F5 contract (or remove it from the agent).`
          );
        }
      }

      // (d) Verdict-table column schema — the F5 zero-memory-verdict contract.
      // Gated on isF5VerdictContract (computed above): the columns are locked
      // bidirectionally against the SKILL.md records, so a rename/drop on either
      // surface — including one side dropping its half of the contract — fails.
      const FINDINGS_COLS = new Set(['Quoted token', 'Location', 'Category', 'Why unresolvable', 'Advisory disposition', 'Repair note']);
      const SWEEP_COLS = new Set(['Category', 'Status', 'What was checked']);
      const EF_EXPECTED = new Set(['item', 'quoted_token', 'location', 'category', 'why_unresolvable', 'advisory', 'repair_note']);
      const ST_EXPECTED = new Set(['category', 'status', 'checked']);

      if (isF5VerdictContract) {
        if (!agentFindingsCols) {
          localFails.push('agent declares an F5 verdict contract but has no `### Findings` table header — cannot verify the Findings column schema the caller parses');
        } else if (!setEqual(new Set(agentFindingsCols), FINDINGS_COLS)) {
          localFails.push(
            `Findings table column drift — agent columns {${agentFindingsCols.join(', ')}} ` +
            `do not match the locked F5 schema {${[...FINDINGS_COLS].join(', ')}}. ` +
            `The caller parses these columns into EvidencedFinding fields; sync the table header.`
          );
        }

        if (!agentSweepCols) {
          localFails.push('agent declares an F5 verdict contract but has no `### Category sweep` table header — cannot verify the sweep column schema');
        } else if (!setEqual(new Set(agentSweepCols), SWEEP_COLS)) {
          localFails.push(
            `Category sweep table column drift — agent columns {${agentSweepCols.join(', ')}} ` +
            `do not match the locked F5 schema {${[...SWEEP_COLS].join(', ')}}. Sync the table header.`
          );
        }

        // Lock the SKILL.md side too: the record types that define the parse
        // contract must still declare the fields these columns map onto. Catches
        // reverse drift (a TYPES field renamed/dropped while the agent table stays).
        if (!efFields) {
          localFails.push(`${skillRel} declares an F5 verdict contract but TYPES has no EvidencedFinding record — the Findings parse contract is undefined`);
        } else if (!setEqual(efFields, EF_EXPECTED)) {
          localFails.push(
            `EvidencedFinding field drift in ${skillRel} — fields {${[...efFields].sort().join(', ')}} ` +
            `do not match the locked set {${[...EF_EXPECTED].sort().join(', ')}}. The Findings columns parse into these fields; sync TYPES.`
          );
        }
        if (!stFields) {
          localFails.push(`${skillRel} declares an F5 verdict contract but TYPES has no SweepTrace record — the sweep parse contract is undefined`);
        } else if (!setEqual(stFields, ST_EXPECTED)) {
          localFails.push(
            `SweepTrace field drift in ${skillRel} — fields {${[...stFields].sort().join(', ')}} ` +
            `do not match the locked set {${[...ST_EXPECTED].sort().join(', ')}}. Sync TYPES.`
          );
        }
      }

      checkedPairs++;
      if (localFails.length) {
        for (const msg of localFails) {
          results.fail.push({ check: CHECK, file: `${agentRel} ↔ ${skillRel}`, message: msg });
        }
      } else {
        results.pass.push({
          check: CHECK,
          file: `${agentRel} ↔ ${skillRel}`,
          message: `Contract in sync — realization ${agentRealization.size}, advisory ${agentAdvisory.size}, checklist ${agentCategories.length} categories all reconciled`,
        });
      }
    }
  }

  if (checkedPairs === 0 && !results.fail.some(f => f.check === CHECK)) {
    results.pass.push({
      check: CHECK,
      file: 'working tree',
      message: 'No contract-bearing packaged agents found (no agent carries a "### Realization:" verdict anchor) — nothing to sync',
    });
  }
}

// ============================================================
// Check: Ink Body Byte-Identity (copied-sibling drift guard)
// ============================================================
// proactive-epistemic-ink.md reproduces the canonical Epistemic Ink body
// verbatim rather than referencing it — a per-turn injected Output Style
// cannot dereference a sibling file at runtime, so the only safe carrier is
// a literal copy. This check pins that reproduction: the region of
// proactive-epistemic-ink.md from its own "# Epistemic Protocol Formatting"
// heading up to (not including) its "# Per-Turn Reminder" heading must be
// byte-identical (module trailing-newline padding at the cut point) to
// epistemic-ink.md's "# Epistemic Protocol Formatting" heading through EOF.
// Any future sibling Ink-derived style should extend SIBLING_STYLES below.
function checkInkBodyIdentity(ctx) {
  const { projectRoot, results } = ctx;
  const CHECK = 'ink-body-identity';
  const CANONICAL = 'epistemic-cooperative/styles/epistemic-ink.md';
  const HEADING = '# Epistemic Protocol Formatting';
  const HEADING_LINE_PATTERN = new RegExp('^' + escapeRegex(HEADING) + '$', 'm');
  const SIBLING_STYLES = [
    { file: 'epistemic-cooperative/styles/proactive-epistemic-ink.md', endHeading: '# Per-Turn Reminder' },
  ];

  const canonicalFull = path.join(projectRoot, CANONICAL);
  if (!fs.existsSync(canonicalFull)) {
    results.fail.push({ check: CHECK, file: CANONICAL, message: `Canonical Output Style source not found: ${CANONICAL}` });
    return;
  }
  const canonicalContent = fs.readFileSync(canonicalFull, 'utf8');
  const canonicalMatch = HEADING_LINE_PATTERN.exec(canonicalContent);
  if (!canonicalMatch) {
    results.fail.push({ check: CHECK, file: CANONICAL, message: `Missing canonical body heading: "${HEADING}"` });
    return;
  }
  const canonicalBody = canonicalContent.slice(canonicalMatch.index).replace(/\n+$/, '');

  for (const { file: siblingPath, endHeading } of SIBLING_STYLES) {
    const siblingFull = path.join(projectRoot, siblingPath);
    if (!fs.existsSync(siblingFull)) {
      results.fail.push({ check: CHECK, file: siblingPath, message: `Sibling Output Style source not found: ${siblingPath}` });
      continue;
    }
    const siblingContent = fs.readFileSync(siblingFull, 'utf8');
    const siblingMatch = HEADING_LINE_PATTERN.exec(siblingContent);
    if (!siblingMatch) {
      results.fail.push({ check: CHECK, file: siblingPath, message: `Missing reproduced body heading: "${HEADING}"` });
      continue;
    }
    const siblingIdx = siblingMatch.index;
    const endHeadingPattern = new RegExp('^' + escapeRegex(endHeading) + '$', 'm');
    const endMatch = endHeadingPattern.exec(siblingContent.slice(siblingIdx));
    if (!endMatch) {
      results.fail.push({ check: CHECK, file: siblingPath, message: `Missing closing heading: "${endHeading}"` });
      continue;
    }
    const siblingEndIdx = siblingIdx + endMatch.index;
    const siblingBody = siblingContent.slice(siblingIdx, siblingEndIdx).replace(/\n+$/, '');

    if (siblingBody !== canonicalBody) {
      results.fail.push({
        check: CHECK,
        file: siblingPath,
        message: `Reproduced Epistemic Ink body diverges from ${CANONICAL} — the copy must stay byte-identical to the canonical source between "${HEADING}" and EOF (only the surrounding overlay sections may differ)`,
      });
      continue;
    }

    results.pass.push({
      check: CHECK,
      file: siblingPath,
      message: `Reproduced Epistemic Ink body verified byte-identical to ${CANONICAL}`,
    });
  }
}

module.exports = {
  CHECKS: [checkJsonSchema, checkCrossReference, checkRoutingIndexContract, checkRequiredSections, checkVersionStaleness, checkCodexManifestSync, checkPackagedAgentContractSync, checkCrossRefScan, checkOnboardSync, checkInkBodyIdentity],
  checkCodexManifestSync,
  checkCrossRefScan,
  checkCrossReference,
  checkInkBodyIdentity,
  checkJsonSchema,
  checkOnboardSync,
  checkPackagedAgentContractSync,
  checkRequiredSections,
  checkRoutingIndexContract,
  checkVersionStaleness,
};
