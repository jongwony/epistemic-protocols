import { useState, useEffect, useCallback } from "react";
import { useI18n } from "@/lib/i18n";

interface DemoLine {
  type: "heading" | "question" | "insight" | "gate" | "label";
  text: string;
}

interface DemoPhase {
  name: string;
  description: string;
}

interface DemoScenario {
  protocol: string;
  command: string;
  promptKey: string;
  userPrompt: string;
  phases: DemoPhase[];
  response: DemoLine[];
}

export const demoScenarios: DemoScenario[] = [
  {
    protocol: "Hermeneia",
    command: "/clarify",
    promptKey: "demo.hermeneia.prompt",
    userPrompt: "Build me a REST API for user management",
    phases: [
      { name: "Phase 0", description: "Trigger Recognition" },
      { name: "Phase 1a", description: "Expression Binding" },
      { name: "Phase 1b", description: "Gap Detection" },
      { name: "Phase 2", description: "Clarification Gate" },
      { name: "Phase 3", description: "Intent Integration" },
    ],
    response: [
      { type: "label", text: "Phase 1b \u2014 Gap Detection (full taxonomy)" },
      { type: "heading", text: "Scanning for expression\u2013intent gaps:" },
      { type: "question", text: "Expression gap \u2014 \"REST API\" could mean RESTful HTTP, GraphQL with REST conventions, or gRPC with REST facade" },
      { type: "question", text: "Precision gap \u2014 \"user management\" unspecified: CRUD only, or also roles, permissions, invitations?" },
      { type: "question", text: "Background gap \u2014 no auth strategy stated: session-based, JWT, or OAuth2?" },
      { type: "gate", text: "Select gaps to clarify, or proceed with defaults \u2192" },
      { type: "insight", text: "3 gaps detected across Expression, Precision, Background dimensions. Phase 2 will resolve each via structured dialogue." },
    ],
  },
  {
    protocol: "Telos",
    command: "/goal",
    promptKey: "demo.telos.prompt",
    userPrompt: "Optimize the search performance",
    phases: [
      { name: "Phase 0", description: "Trigger + Confirmation" },
      { name: "Phase 1", description: "Dimension Detection" },
      { name: "Phase 2", description: "Co-Construction Gate" },
      { name: "Phase 3", description: "Integration" },
      { name: "Phase 4", description: "Sufficiency Check" },
    ],
    response: [
      { type: "label", text: "Phase 1 \u2014 Dimension Detection against taxonomy" },
      { type: "heading", text: "Assessing goal dimensions {Outcome, Metric, Boundary, Priority}:" },
      { type: "question", text: "Outcome \u2014 undefined: speed improvement? relevance ranking? reduced infrastructure cost?" },
      { type: "question", text: "Metric \u2014 undefined: no p95 latency target, no baseline measurement stated" },
      { type: "question", text: "Boundary \u2014 undefined: which indices, endpoints, or query types are in scope?" },
      { type: "question", text: "Priority \u2014 implicit: speed assumed primary, but relevance may matter more" },
      { type: "gate", text: "Define goal together / Proceed as-is \u2192" },
      { type: "insight", text: "4/4 dimensions undefined. Phase 2 will co-construct a concrete, falsifiable GoalContract." },
    ],
  },
  {
    protocol: "Aitesis",
    command: "/inquire",
    promptKey: "demo.aitesis.prompt",
    userPrompt: "Add caching to the application",
    phases: [
      { name: "Phase 0", description: "Context Sufficiency Gate" },
      { name: "Phase 1", description: "Collection + Classification" },
      { name: "Phase 2", description: "Uncertainty Surfacing" },
      { name: "Phase 3", description: "Prospect Update" },
    ],
    response: [
      { type: "label", text: "Phase 1 \u2014 Context Collection + Epistemic Classification" },
      { type: "heading", text: "Collected: Read config/, grep for existing cache patterns. Classifying:" },
      { type: "question", text: "Factual/UserDependent \u2014 which endpoints are slow? Read-heavy or write-heavy bottleneck?" },
      { type: "question", text: "Factual/UserDependent \u2014 acceptable staleness? Seconds, minutes, or hours?" },
      { type: "question", text: "Factual/ReadOnlyVerifiable \u2014 existing infrastructure? \u2713 Resolved: no Redis/Memcached found in deps" },
      { type: "gate", text: "[1 resolved / 2 actionable] \u2014 Provide / Point me to... / Dismiss \u2192" },
      { type: "insight", text: "1 uncertainty auto-resolved via codebase scan. 2 remain UserDependent \u2014 require human judgment." },
    ],
  },
  {
    protocol: "Prothesis",
    command: "/frame",
    promptKey: "demo.prothesis.prompt",
    userPrompt: "Migrate the monolith to microservices",
    phases: [
      { name: "Phase 0", description: "Mission Brief Gate" },
      { name: "Phase 1", description: "Context Gathering" },
      { name: "Phase 2", description: "Perspective Placement" },
      { name: "Phase 3", description: "Isolated Inquiry" },
      { name: "Phase 4", description: "Cross-Dialogue Synthesis" },
    ],
    response: [
      { type: "label", text: "Phase 0 \u2014 Mission Brief + Mode Selection Gate" },
      { type: "heading", text: "Constructed Mission Brief from request:" },
      { type: "question", text: "Inquiry intent \u2014 evaluate feasibility and approach for monolith decomposition" },
      { type: "question", text: "Expected deliverable \u2014 recommended architecture with migration strategy" },
      { type: "question", text: "Scope constraints \u2014 existing codebase, team capacity, timeline" },
      { type: "gate", text: "Confirm brief? Mode: [Recommend] / [Inquire \u2014 spawn perspective team] \u2192" },
      { type: "insight", text: "Inquire mode spawns independent analysts per perspective (ops, business, risk). Each investigates without shared context contamination." },
    ],
  },
  {
    protocol: "Analogia",
    command: "/ground",
    promptKey: "demo.analogia.prompt",
    userPrompt: "Follow best practices for error handling",
    phases: [
      { name: "Phase 0", description: "Mapping Uncertainty Gate" },
      { name: "Phase 1", description: "Domain Decomposition" },
      { name: "Phase 2", description: "Instantiation + Validation" },
      { name: "Phase 3", description: "Integration" },
    ],
    response: [
      { type: "label", text: "Phase 1 \u2014 Domain Decomposition + Mapping Construction" },
      { type: "heading", text: "Abstract(S\u2090): \"best practices\" \u2192 Concrete(S\u209c): your CLI tool. Mapping:" },
      { type: "question", text: "\"Catch and log\" \u2192 your tool pipes stdout; swallowed errors break downstream consumers" },
      { type: "question", text: "\"User-friendly messages\" \u2192 users are developers invoking via scripts, not end-users" },
      { type: "question", text: "\"Graceful degradation\" \u2192 CLI should exit(1) on failure, not silently degrade" },
      { type: "gate", text: "[0 validated / 3 total] \u2014 Confirm / Adjust / Dismiss \u2192" },
      { type: "insight", text: "3 abstract\u2194concrete correspondences need validation. Generic advice applied without grounding creates generic problems." },
    ],
  },
  {
    protocol: "Syneidesis",
    command: "/gap",
    promptKey: "demo.syneidesis.prompt",
    userPrompt: "Deploy the new payment flow to production",
    phases: [
      { name: "Phase 0", description: "Committed Action Check" },
      { name: "Phase 1", description: "Gap Scan + Surface" },
      { name: "Phase 2", description: "User Judgment" },
    ],
    response: [
      { type: "label", text: "Phase 1 \u2014 Gap Scan (Procedural, Consideration, Assumption, Alternative)" },
      { type: "heading", text: "Committed action detected: production deploy. Scanning for unnoticed gaps:" },
      { type: "question", text: "Procedural \u2014 was rollback strategy tested? Expected step absent from plan" },
      { type: "question", text: "Assumption \u2014 assuming webhook endpoints match sandbox behavior in production" },
      { type: "question", text: "Alternative \u2014 was feature-flag gradual rollout considered vs. all-at-once switch?" },
      { type: "gate", text: "Stakes: Irreversible + High impact = HIGH \u2014 Address / Dismiss / Probe \u2192" },
      { type: "insight", text: "3 gaps surfaced. Surfacing over Deciding \u2014 these are questions for your judgment, not assertions." },
    ],
  },
  {
    protocol: "Prosoche",
    command: "/attend",
    promptKey: "demo.prosoche.prompt",
    userPrompt: "Drop the users table and recreate it with the new schema",
    phases: [
      { name: "Phase -1", description: "Upstream Routing + Tasks" },
      { name: "Phase 0", description: "Risk Classification" },
      { name: "Phase 1", description: "Risk Evaluation" },
      { name: "Phase 2", description: "Checkpoint Gate" },
      { name: "Phase 3", description: "Judgment Integration" },
    ],
    response: [
      { type: "label", text: "Phase 0\u21921 \u2014 Risk Classification + Evaluation" },
      { type: "heading", text: "Task materialized. Risk signals detected:" },
      { type: "question", text: "GATE: Irreversibility \u2014 DROP TABLE destroys production data; not recoverable" },
      { type: "question", text: "GATE: SecurityBoundary \u2014 direct database mutation bypasses migration tooling" },
      { type: "question", text: "Advisory: ScopeEscalation \u2014 dependent tables (orders, sessions) have foreign key constraints" },
      { type: "gate", text: "Approve / Dismiss / Modify / Halt / Withdraw \u2192" },
      { type: "insight", text: "2 Gate-level signals block execution. ALTER TABLE may achieve the same result without data loss." },
    ],
  },
  {
    protocol: "Epharmoge",
    command: "/contextualize",
    promptKey: "demo.epharmoge.prompt",
    userPrompt: "Implement the OAuth2 flow from the tutorial",
    phases: [
      { name: "Phase 0", description: "Applicability Gate" },
      { name: "Phase 1", description: "Mismatch Surfacing" },
      { name: "Phase 2", description: "Result Adaptation" },
    ],
    response: [
      { type: "label", text: "Phase 0\u21921 \u2014 Applicability Gate + Mismatch Surfacing" },
      { type: "heading", text: "Result correct(R) but checking fits(R, X) \u2014 scanning mismatch dimensions:" },
      { type: "question", text: "Environment \u2014 tutorial uses Express; your app is Hono on Cloudflare Workers (session storage differs)" },
      { type: "question", text: "Convention \u2014 tutorial stores tokens in localStorage; your project uses httpOnly cookies" },
      { type: "question", text: "Dependency \u2014 tutorial assumes single-domain; your frontend/API are cross-origin (CORS)" },
      { type: "gate", text: "[0 addressed / 3 total] \u2014 Confirm / Adapt / Dismiss \u2192" },
      { type: "insight", text: "Correct solutions in wrong contexts create subtle vulnerabilities. Applicability over Correctness." },
    ],
  },
  {
    protocol: "Horismos",
    command: "/bound",
    promptKey: "demo.horismos.prompt",
    userPrompt: "The app is slow, fix the performance issues",
    phases: [
      { name: "Phase 0", description: "Boundary Probe" },
      { name: "Phase 1", description: "Evidence Collection" },
      { name: "Phase 2", description: "Classification Gate" },
      { name: "Phase 3", description: "Map Integration" },
    ],
    response: [
      { type: "label", text: "Phase 0\u21922 \u2014 Boundary-undefined domains detected. Classification gate:" },
      { type: "heading", text: "Task scope has undefined ownership boundaries. Probing domains:" },
      { type: "question", text: "\"Performance target\" \u2014 who defines acceptable latency? UserSupplies / AIPropose / AIAutonomous?" },
      { type: "question", text: "\"Profiling scope\" \u2014 server, client, or network? Evidence: no profiling data found in codebase" },
      { type: "question", text: "\"Fix strategy\" \u2014 optimize hot paths vs. architectural change? Requires domain knowledge" },
      { type: "gate", text: "[0 bounded / 3 total] \u2014 UserSupplies / AIPropose / AIAutonomous / Dismiss \u2192" },
      { type: "insight", text: "BoundaryMap will define who-knows-what and who-decides-what before execution begins." },
    ],
  },
  {
    protocol: "Katalepsis",
    command: "/grasp",
    promptKey: "demo.katalepsis.prompt",
    userPrompt: "Refactor the auth module to use the new token format",
    phases: [
      { name: "Phase 0", description: "Categorization" },
      { name: "Phase 1", description: "Entry Point Selection" },
      { name: "Phase 2", description: "Task Registration" },
      { name: "Phase 3", description: "Comprehension Loop" },
    ],
    response: [
      { type: "label", text: "Phase 0\u21921 \u2014 Categorization + Entry Point Selection Gate" },
      { type: "heading", text: "Parsed changes. Categories detected:" },
      { type: "question", text: "Modification \u2014 token payload structure changed in auth/token.ts:42-67" },
      { type: "question", text: "Scope \u2014 23 files import from auth module; cross-cutting dependency change" },
      { type: "question", text: "Architecture \u2014 migration strategy for existing sessions using old token format" },
      { type: "gate", text: "Select categories to verify understanding (multi-select) \u2192" },
      { type: "insight", text: "Comprehension over Explanation \u2014 Phase 3 will probe your understanding with Socratic questions, not lecture." },
    ],
  },
];

interface ProtocolDemoProps {
  activeIndex: number;
  onChangeIndex: (index: number) => void;
}

export function ProtocolDemo({ activeIndex, onChangeIndex }: ProtocolDemoProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const { t } = useI18n();
  const scenario = demoScenarios[activeIndex];

  const runDemo = useCallback(() => {
    setVisibleLines(0);
    setIsTyping(true);
  }, []);

  useEffect(() => {
    runDemo();
  }, [activeIndex, runDemo]);

  useEffect(() => {
    if (!isTyping) return;
    const totalLines = scenario.response.length;
    if (visibleLines >= totalLines) {
      setIsTyping(false);
      return;
    }
    const delay = visibleLines === 0 ? 600 : 400 + Math.random() * 300;
    const timer = setTimeout(() => setVisibleLines((v) => v + 1), delay);
    return () => clearTimeout(timer);
  }, [isTyping, visibleLines, scenario.response.length]);

  return (
    <section id="demo" className="mx-auto max-w-[820px] px-6 pb-16">
      <div className="mb-6 flex items-baseline justify-between border-b border-border pb-3">
        <h2 className="font-serif text-2xl text-foreground">{t("demo.title")}</h2>
        <span className="font-mono text-xs text-muted-foreground">{t("demo.badge")}</span>
      </div>

      {/* Protocol tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {demoScenarios.map((s, i) => (
          <button
            key={s.command}
            onClick={() => onChangeIndex(i)}
            className={`rounded-md px-3 py-1.5 font-mono text-xs transition-all ${
              i === activeIndex
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
            }`}
          >
            {s.command}
          </button>
        ))}
      </div>

      {/* Terminal */}
      <div className="overflow-hidden rounded-lg border border-border bg-[#1a1a1f]">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
          </div>
          <span className="ml-2 font-mono text-[11px] text-white/40">
            claude-code &mdash; {scenario.protocol}
          </span>
        </div>

        {/* Content */}
        <div className="p-5 font-mono text-[13px] leading-relaxed">
          {/* User prompt */}
          <div className="mb-4">
            <span className="text-white/40">$ </span>
            <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[11px] text-amber-400">{scenario.command}</span>
            <span className="text-white/90"> {t(scenario.promptKey as Parameters<typeof t>[0])}</span>
          </div>

          {/* Protocol activation */}
          <div className="mb-4 text-[12px] text-white/50">
            {scenario.protocol} {t("demo.activated")}
          </div>

          {/* Response lines */}
          <div className="space-y-2.5">
            {scenario.response.map((line, i) => {
              if (i >= visibleLines) return null;
              return (
                <div
                  key={i}
                  className="animate-in fade-in slide-in-from-bottom-1 duration-300"
                >
                  {line.type === "label" && (
                    <p className="mb-1 text-[11px] uppercase tracking-wider text-amber-400/50">{line.text}</p>
                  )}
                  {line.type === "heading" && (
                    <p className="text-white/70">{line.text}</p>
                  )}
                  {line.type === "question" && (
                    <div className="flex gap-2">
                      <span className="mt-0.5 text-amber-400/80">&#9656;</span>
                      <p className="text-white/80">{line.text}</p>
                    </div>
                  )}
                  {line.type === "gate" && (
                    <div className="mt-2 rounded border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-[12px] text-amber-300/80">
                      &#9166; {line.text}
                    </div>
                  )}
                  {line.type === "insight" && (
                    <p className="mt-1 border-l-2 border-amber-500/30 pl-3 text-[12px] text-white/50 italic">
                      {line.text}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Typing indicator */}
          {isTyping && (
            <div className="mt-3 flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400/60" />
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400/60 [animation-delay:150ms]" />
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400/60 [animation-delay:300ms]" />
            </div>
          )}

          {/* Replay button */}
          {!isTyping && visibleLines >= scenario.response.length && (
            <button
              onClick={runDemo}
              className="mt-4 text-[12px] text-white/30 transition-colors hover:text-white/60"
            >
              {t("demo.replay")}
            </button>
          )}
        </div>
      </div>

      {/* Phase Flow */}
      <div className="mt-4 rounded-lg border border-border bg-card p-5">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-xs font-medium text-card-foreground">
            {scenario.protocol} {t("demo.phaseFlow")}
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">
            {scenario.phases.length} {t("demo.phases")}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {scenario.phases.map((phase, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div
                className={`rounded-md border px-2.5 py-1 text-[11px] leading-tight ${
                  i === 0
                    ? "border-foreground/20 bg-primary/5 text-card-foreground"
                    : "border-border text-muted-foreground"
                }`}
              >
                <span className="font-mono font-medium">{phase.name}</span>
                <span className="ml-1.5 hidden sm:inline">{phase.description}</span>
                <span className="ml-1.5 sm:hidden">{phase.description.split(" ")[0]}</span>
              </div>
              {i < scenario.phases.length - 1 && (
                <span className="text-[10px] text-muted-foreground/50">&rarr;</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
