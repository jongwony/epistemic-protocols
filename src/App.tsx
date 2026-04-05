import { useState } from "react";
import { ProtocolDemo, demoScenarios } from "@/components/ProtocolDemo";
import { useI18n } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

function Icon({ name, className = "h-4 w-4" }: { name: string; className?: string }) {
  const paths: Record<string, React.ReactNode> = {
    menu: <><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></>,
    x: <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
    "external-link": <><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>,
    terminal: <><polyline points="4 17 10 11 4 5" /><line x1="12" x2="20" y1="19" y2="19" /></>,
    "arrow-right": <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>,
    globe: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>,
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {paths[name]}
    </svg>
  );
}

const localeLabels: Record<Locale, string> = {
  en: "EN",
  ko: "\ud55c",
};

const protocols = [
  { name: "Hermeneia", command: "/clarify" },
  { name: "Telos", command: "/goal" },
  { name: "Aitesis", command: "/inquire" },
  { name: "Prothesis", command: "/frame" },
  { name: "Analogia", command: "/ground" },
  { name: "Syneidesis", command: "/gap" },
  { name: "Prosoche", command: "/attend" },
  { name: "Epharmoge", command: "/contextualize" },
  { name: "Horismos", command: "/bound" },
  { name: "Katalepsis", command: "/grasp" },
];

const utilities = [
  { command: "/onboard", key: "onboard" },
  { command: "/report", key: "report" },
  { command: "/dashboard", key: "dashboard" },
];

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDemoIndex, setActiveDemoIndex] = useState(0);
  const { locale, setLocale, t } = useI18n();

  const navItems = [
    { label: t("nav.demo"), href: "#demo" },
    { label: t("nav.protocols"), href: "#protocols" },
    { label: t("nav.utilities"), href: "#utilities" },
    { label: t("nav.install"), href: "#install" },
  ];

  const handleProtocolClick = (protocolName: string) => {
    const demoIndex = demoScenarios.findIndex(
      (s) => s.protocol === protocolName
    );
    if (demoIndex !== -1) {
      setActiveDemoIndex(demoIndex);
      document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleLocale = () => {
    setLocale(locale === "en" ? "ko" : "en");
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-[820px] items-center justify-between px-6 py-4">
          <div className="font-serif text-xl tracking-tight text-foreground">
            Epistemic Protocols
          </div>
          <nav className="hidden items-center gap-6 sm:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-xs uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
            <a
              href="https://github.com/jongwony/epistemic-protocols"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
              <Icon name="external-link" className="h-3 w-3" />
            </a>
            <button
              onClick={toggleLocale}
              className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
              title={locale === "en" ? "\ud55c\uad6d\uc5b4\ub85c \uc804\ud658" : "Switch to English"}
            >
              <Icon name="globe" className="h-3 w-3" />
              {localeLabels[locale]}
            </button>
          </nav>
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={toggleLocale}
              className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground"
            >
              <Icon name="globe" className="h-3 w-3" />
              {localeLabels[locale]}
            </button>
            <button
              className="text-muted-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <Icon name="x" className="h-5 w-5" /> : <Icon name="menu" className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="border-t border-border px-6 py-4 sm:hidden">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <a
                href="https://github.com/jongwony/epistemic-protocols"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"
              >
                GitHub <Icon name="external-link" className="h-3 w-3" />
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-[820px] px-6 pb-12 pt-16 sm:pt-20">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {t("hero.badge")}
        </p>
        <h1 className="mb-4 font-serif text-4xl leading-[1.12] tracking-tight text-foreground sm:text-5xl">
          {t("hero.title.line1")}
          <br />
          {t("hero.title.line2")}
        </h1>
        <p className="max-w-[520px] text-base leading-relaxed text-muted-foreground sm:text-lg">
          {t("hero.subtitle")}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#install"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Icon name="terminal" className="h-4 w-4" />
            {t("hero.cta.install")}
          </a>
          <a
            href="https://github.com/jongwony/epistemic-protocols"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            {t("hero.cta.github")}
            <Icon name="external-link" className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>

      {/* Interactive Demo */}
      <ProtocolDemo activeIndex={activeDemoIndex} onChangeIndex={setActiveDemoIndex} />

      {/* Protocols Grid */}
      <section id="protocols" className="mx-auto max-w-[820px] px-6 pb-16">
        <div className="mb-6 flex items-baseline justify-between border-b border-border pb-3">
          <h2 className="font-serif text-2xl text-foreground">{t("protocols.title")}</h2>
          <span className="font-mono text-xs text-muted-foreground">
            {protocols.length} {t("protocols.total")}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {protocols.map((protocol) => {
            const isActiveDemo = demoScenarios[activeDemoIndex]?.protocol === protocol.name;
            const descKey = `protocol.${protocol.name}.desc` as Parameters<typeof t>[0];
            return (
              <div
                key={protocol.command}
                className={`group rounded-lg border bg-card p-5 transition-all ${
                  isActiveDemo
                    ? "border-foreground/25 shadow-sm"
                    : "border-border hover:border-foreground/20 hover:shadow-sm"
                }`}
              >
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="font-serif text-lg text-card-foreground">
                    {protocol.name}
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {protocol.command}
                  </span>
                </div>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  {t(descKey)}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={() => handleProtocolClick(protocol.name)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-foreground/70 transition-colors hover:text-foreground"
                  >
                    <Icon name="terminal" className="h-3 w-3" />
                    {t("protocols.tryDemo")}
                  </button>
                  <a
                    href={`https://github.com/jongwony/epistemic-protocols/tree/main/${protocol.name.toLowerCase()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                    onClick={(e) => e.stopPropagation()}
                  >
                    README
                    <Icon name="external-link" className="h-3 w-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Utilities */}
      <section id="utilities" className="mx-auto max-w-[820px] px-6 pb-16">
        <div className="mb-6 flex items-baseline justify-between border-b border-border pb-3">
          <h2 className="font-serif text-2xl text-foreground">
            {t("utilities.title")}
          </h2>
          <span className="font-mono text-xs text-muted-foreground">
            {t("utilities.badge")}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {utilities.map((util) => {
            const labelKey = `utility.${util.key}.label` as Parameters<typeof t>[0];
            const descKey = `utility.${util.key}.desc` as Parameters<typeof t>[0];
            return (
              <div
                key={util.command}
                className="rounded-lg border border-border bg-card p-5"
              >
                <div className="mb-2 font-mono text-[11px] text-muted-foreground">
                  {util.command}
                </div>
                <div className="mb-1 text-sm font-medium text-card-foreground">
                  {t(labelKey)}
                </div>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  {t(descKey)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Install */}
      <section id="install" className="mx-auto max-w-[820px] px-6 pb-20">
        <div className="mb-6 border-b border-border pb-3">
          <h2 className="font-serif text-2xl text-foreground">{t("install.title")}</h2>
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">
              {t("install.claudeCode")}
            </h3>
            <div className="rounded-lg border border-border bg-primary/[0.03] p-4">
              <code className="block whitespace-pre-wrap font-mono text-sm text-foreground">
                bash -c "$(curl -fsSL https://raw.githubusercontent.com/jongwony/epistemic-protocols/main/scripts/install.sh)"
              </code>
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">
              {t("install.codex")}
            </h3>
            <div className="rounded-lg border border-border bg-primary/[0.03] p-4">
              <code className="block whitespace-pre-wrap font-mono text-sm text-foreground">
                npx @anthropic-ai/codex skill-installer jongwony/epistemic-protocols
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[820px] items-center justify-between px-6 py-6">
          <div className="font-serif text-sm text-muted-foreground">
            Epistemic Protocols
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/jongwony/epistemic-protocols"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
            </a>
            <span className="text-xs text-muted-foreground">{t("footer.license")}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
