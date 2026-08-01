# Evidence

What the empirical record supports, at what strength, and where it stops. Organized by the claim each source is doing work for, because a source that grounds one routing rule frequently says nothing about the next one.

Read this when a route is challenged, or when an author wants to know on what basis a rule stands. The routing rules in `SKILL.md` are usable without it.

## The claim each rule rests on

### Tier 0 and Tier 1 are different surfaces

**Supported, architecturally.** A skill's frontmatter name and description are preloaded; the body is read when the skill is triggered. Two surfaces, two load schedules — which is why a size argument that holds for a project instruction file does not transfer to a skill body, and why the audit splits them.

- Anthropic, *Equipping agents for the real world with Agent Skills* — https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills

**What it does not establish:** that any particular clause belongs at one tier rather than another. The architecture makes the tiers real; it does not assign content to them. Every tier admission criterion in `SKILL.md` is a design judgment sitting on top of this fact.

### A load-bearing prohibition is not deleted by default

**Weakly supported, and pointed against the opposite rule.** A controlled study varied persistent project-instruction content across more than 5,000 agent runs and reported that every individually beneficial rule was a negative constraint while every individually harmful one was a positive directive.

- Zhang et al., *Guardrails Beat Guidance: A Large-Scale Study of Rules, Skills, and Persistent Configuration for Coding Agents* (2026) — https://arxiv.org/abs/2604.11088

Read the limits carefully, because they are severe. One model, one benchmark (Claude Code with Opus 4.6 on SWE-bench Verified). The only individually significant rule reached p = 0.016 and would not survive multiple-comparison correction across the 18 tests run; the authors accordingly present polarity as the finding and decline to claim per-rule significance. Randomly assembled rule sets performed about as well as curated ones, which is itself a warning about how much any rule-level result carries.

**What it establishes:** enough to stop deleting negative constraints on the theory that naming a behavior invites it. **What it does not establish:** that negative constraints generally outperform positive directives, or that a prohibition earns its place merely by being negative.

### Naming a non-target holds attention on it

**Supported for humans; partially and indirectly for language models.** The human result is the origin of the idea and is direct: instructing a person to suppress a thought produces the thought.

- Wegner, Schneider, Carter & White, *Paradoxical effects of thought suppression* (1987) — https://doi.org/10.1037/0022-3514.53.1.5

For language models the mechanism is different and the evidence is narrower. Negated instructions degrade accuracy, and a token inside a negation still activates as an answer candidate:

- Jang, Ye & Seo, *Can Large Language Models Truly Understand Prompts?* (ICML 2023 workshop) — https://proceedings.mlr.press/v203/jang23a.html — accuracy collapses on semantically negated instructions and does not recover with scale. Scoped to an artificial reversal task rather than negation in ordinary directive prose.
- Jiang et al. (NeurIPS 2024) — https://proceedings.neurips.cc/paper_files/paper/2024/hash/7d3626b603cac298c9f7573b1df00cac-Abstract-Conference.html — a negated statement still activates the negated entity as the model's answer.

**What this supports:** treating an unnecessary competing-target mention as a cost worth removing when the removal preserves the directive. **What it does not support:** the human ironic-process mechanism transferring to language models, or a general law that negative phrasing backfires. Note the tension with the previous section — it is real, and it is why the salience step is a rewrite preference rather than a deletion rule.

### One example can pin a contract; the same example can bias selection

**Both supported, and they are not in conflict — they measure different things.** This is the whole reason "example" is split five ways rather than judged as one object.

- Yuan et al., *EasyTool: Enhancing LLM-based Agents with Concise Tool Instruction* (NAACL 2025) — https://aclanthology.org/2025.naacl-long.44/ — adding a single example to an already-concise tool description cut parameter errors from 21 to 6 (ChatGPT) and from 14 to 1 (GPT-4). Three examples produced no further gain. The baseline is the processed concise description, not raw vendor documentation.
- Faghih et al., *Tool Preferences in Agentic LLMs are Unreliable* (EMNLP 2025) — https://arxiv.org/abs/2505.18135 — with two functionally identical tools competing, adding a usage example to one description raised its selection share by 1.13× (GPT-4.1) to 1.60× (Qwen2.5-7B).

The first measures parameter correctness *after* a tool has been selected. The second measures selection share *while* two tools compete. Different outcome variables at different points in the trajectory, so no single verdict on "examples" can be read off them together. The contract-specimen rule takes the first result; the demonstration-routing rule takes the caution from the second.

**What neither establishes:** the specific admission threshold in `SKILL.md` ("universally active, and prose has demonstrably failed"). That threshold is a design choice calibrated to the first result's diminishing returns, not a measured boundary. Nor does the second result show that a behavioral demonstration hardens into default procedural policy — it shows selection bias in a narrower single-turn setting, and the policy-hardening concern extends it by argument.

### Examples anchor to their surface form

**Supported, with an important complication.** Example order, format, and label distribution move performance substantially, which is what makes an example a stronger commitment than the principle beside it.

- Zhao et al., *Calibrate Before Use* (ICML 2021) — https://proceedings.mlr.press/v139/zhao21c.html
- Lu et al., *Fantastically Ordered Prompts* (ACL 2022) — https://aclanthology.org/2022.acl-long.556/

The complication: demonstrations appear to work largely by signaling format, input distribution, and label space rather than by teaching a correct mapping, and a definition plus one example beats the definition alone on unseen tasks.

- Min et al., *Rethinking the Role of Demonstrations* (EMNLP 2022) — https://aclanthology.org/2022.emnlp-main.759/
- Wang et al., *Super-NaturalInstructions* (EMNLP 2022) — https://aclanthology.org/2022.emnlp-main.340/ — definition + one positive example outperforms definition alone; returns diminish past one or two.

**What this supports:** routing demonstrations off the standing surface. **What it refutes:** the stronger claim that a principle stated well needs no example at all. It does not hold as a general rule, and an audit built on it would cut contract specimens that are doing measurable work.

### Long or crowded surfaces cost something

**Supported in specific forms; not as a single law.** Relevant content placed mid-context is retrieved worse than at either end; irrelevant sentences degrade reasoning; compliance falls as the number of simultaneous constraints rises.

- Liu et al., *Lost in the Middle* — https://cs.stanford.edu/~nfliu/papers/lost-in-the-middle.arxiv2023.pdf
- Shi et al., *Large Language Models Can Be Easily Distracted by Irrelevant Context* (ICML 2023) — https://arxiv.org/abs/2302.00093
- Harada et al., *ManyIFEval* (EMNLP Findings 2025) — https://aclanthology.org/2025.findings-emnlp.896/ — the all-constraints-satisfied rate falls from 0.94 to 0.21 as constraints go from 1 to 10 for one frontier model.

**What it does not establish:** that attention dilutes per added token. The constraint result has a straightforward confound — cumulative per-constraint failure produces the same curve without any dilution mechanism. Treat "shorter is better" as unproven and route on belonging instead of on length.

## What the record does not support

Stated plainly, because these are the claims most likely to be smuggled in:

- **That examples should be removed and principles kept.** Contradicted for contract specimens; unestablished in general.
- **That negative phrasing is always counterproductive.** The largest directly relevant study points the other way in its tested setting.
- **That shorter instructions are better instructions.** No source supports length as the operative variable.
- **That deleting a clause is safe because no evidence shows it is load-bearing.** Absence of evidence is not the negative result. The audit never infers a "no" on the held-out question from a missing evaluation.
- **That relocating content improves outcomes.** The one study measuring whether standing instruction files help at all found no measurable difference — see below.

## The standing limitation

There is no held-out evaluation channel. Nothing measures whether contract violations rise or fall after a surface is routed, so every judgment the audit emits rests on argument rather than measurement.

This is sharpened by the one study that looked directly:

- *Do Context Files Help Coding Agents?* (2026) — https://arxiv.org/abs/2607.27250 — 288 runs across 3 repositories and 15–17 tasks found no measurable correctness difference between no context file, an always-on project instruction file, and selective retrieval.

The study is small, which is why it weakens the premise rather than refuting it. But it cuts underneath the whole instrument: if standing surfaces show no measurable benefit, then routing clauses among them optimizes something not yet demonstrated to matter. Anyone relying on this audit should hold that open.

The evaluation that would close it: a held-out task set plus a contract-violation metric, run against one real surface before and after routing.

## Human cognitive-load literature

Split-attention, seductive detail, and working-memory limits are well established for human readers and are the intuition behind much of this audit's shape.

- Sweller (1988) — https://doi.org/10.1207/s15516709cog1202_4
- Chandler & Sweller (1992) — https://doi.org/10.1111/j.2044-8279.1992.tb01017.x
- Harp & Mayer (1998) — https://doi.org/10.1037/0022-0663.90.3.414

A language model does not have human working memory, and no source establishes that these results transfer. They are recorded here as the origin of an intuition, not as support for any rule.
