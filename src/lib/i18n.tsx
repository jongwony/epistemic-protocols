import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Locale = "en" | "ko";

const translations = {
  en: {
    // Header nav
    "nav.demo": "Demo",
    "nav.protocols": "Protocols",
    "nav.utilities": "Utilities",
    "nav.install": "Install",

    // Hero
    "hero.badge": "10 decision-point checkpoints",
    "hero.title.line1": "Catch wrong directions",
    "hero.title.line2": "at the plan level",
    "hero.subtitle": "Correcting a wrong direction at the plan level costs one conversation turn. At the code level, it costs hours of rework.",
    "hero.cta.install": "Install for Claude Code",
    "hero.cta.github": "View on GitHub",

    // Demo
    "demo.title": "See it in action",
    "demo.badge": "Interactive demo",
    "demo.activated": "protocol activated",
    "demo.replay": "\u21bb Replay",
    "demo.phaseFlow": "Phase Flow",
    "demo.phases": "phases",

    // Protocols
    "protocols.title": "Protocols",
    "protocols.total": "total",
    "protocols.tryDemo": "Try demo",

    // Protocol descriptions
    "protocol.Hermeneia.desc": "Address misalignment in requirements before they compound into costly errors",
    "protocol.Telos.desc": "Define success criteria clearly so both human and AI share the same target",
    "protocol.Aitesis.desc": "Ensure AI asks the necessary clarifying questions rather than guessing",
    "protocol.Prothesis.desc": "Examine issues from multiple perspectives to avoid tunnel vision",
    "protocol.Analogia.desc": "Apply theoretical advice to your specific context instead of generic solutions",
    "protocol.Syneidesis.desc": "Identify potential oversights and blind spots before committing to a plan",
    "protocol.Prosoche.desc": "Gate risky actions for human judgment \u2014 pause before irreversible decisions",
    "protocol.Epharmoge.desc": "Adapt correct-in-theory solutions to your actual situation and constraints",
    "protocol.Horismos.desc": "Separate known information from unknowns to reason more precisely",
    "protocol.Katalepsis.desc": "Ensure comprehension of substantial changes before they take effect",

    // Protocol categories
    "protocol.Hermeneia.category": "Alignment",
    "protocol.Telos.category": "Direction",
    "protocol.Aitesis.category": "Inquiry",
    "protocol.Prothesis.category": "Perspective",
    "protocol.Analogia.category": "Application",
    "protocol.Syneidesis.category": "Awareness",
    "protocol.Prosoche.category": "Attention",
    "protocol.Epharmoge.category": "Adaptation",
    "protocol.Horismos.category": "Boundary",
    "protocol.Katalepsis.category": "Comprehension",

    // Utilities
    "utilities.title": "Epistemic Cooperative",
    "utilities.badge": "Utilities",
    "utility.onboard.label": "Onboard",
    "utility.onboard.desc": "Interactive tutorial to learn each protocol hands-on",
    "utility.report.label": "Report",
    "utility.report.desc": "Track which protocols you've used and how often",
    "utility.dashboard.label": "Dashboard",
    "utility.dashboard.desc": "Visualize your epistemic coverage across sessions",

    // Install
    "install.title": "Install",
    "install.claudeCode": "Claude Code",
    "install.codex": "Codex",

    // Footer
    "footer.license": "MIT License",

    // Demo scenarios
    "demo.hermeneia.prompt": "Build me a REST API for user management",
    "demo.telos.prompt": "Optimize the search performance",
    "demo.aitesis.prompt": "Add caching to the application",
    "demo.prothesis.prompt": "Migrate the monolith to microservices",
    "demo.analogia.prompt": "Follow best practices for error handling",
    "demo.syneidesis.prompt": "Deploy the new payment flow to production",
    "demo.prosoche.prompt": "Drop the users table and recreate it with the new schema",
    "demo.epharmoge.prompt": "Implement the OAuth2 flow from the tutorial",
    "demo.horismos.prompt": "The app is slow, fix the performance issues",
    "demo.katalepsis.prompt": "Refactor the auth module to use the new token format",
  },
  ko: {
    // Header nav
    "nav.demo": "\ub370\ubaa8",
    "nav.protocols": "\ud504\ub85c\ud1a0\ucf5c",
    "nav.utilities": "\uc720\ud2f8\ub9ac\ud2f0",
    "nav.install": "\uc124\uce58",

    // Hero
    "hero.badge": "10\uac1c\uc758 \uc758\uc0ac\uacb0\uc815 \uccb4\ud06c\ud3ec\uc778\ud2b8",
    "hero.title.line1": "\uc798\ubabb\ub41c \ubc29\ud5a5\uc744",
    "hero.title.line2": "\uacc4\ud68d \ub2e8\uacc4\uc5d0\uc11c \uc7a1\uc544\ub0b4\uc138\uc694",
    "hero.subtitle": "\uacc4\ud68d \ub2e8\uacc4\uc5d0\uc11c \uc798\ubabb\ub41c \ubc29\ud5a5\uc744 \ubc14\ub85c\uc7a1\ub294 \ub370\ub294 \ub300\ud654 \ud55c \ud134\uc774\uba74 \ub429\ub2c8\ub2e4. \ucf54\ub4dc \ub2e8\uacc4\uc5d0\uc11c\ub294 \uba87 \uc2dc\uac04\uc758 \uc7ac\uc791\uc5c5\uc774 \ud544\uc694\ud569\ub2c8\ub2e4.",
    "hero.cta.install": "Claude Code\uc5d0 \uc124\uce58",
    "hero.cta.github": "GitHub\uc5d0\uc11c \ubcf4\uae30",

    // Demo
    "demo.title": "\uc9c1\uc811 \uccb4\ud5d8\ud558\uae30",
    "demo.badge": "\uc778\ud130\ub799\ud2f0\ube0c \ub370\ubaa8",
    "demo.activated": "\ud504\ub85c\ud1a0\ucf5c \ud65c\uc131\ud654\ub428",
    "demo.replay": "\u21bb \ub2e4\uc2dc \uc7ac\uc0dd",
    "demo.phaseFlow": "\ub2e8\uacc4 \ud750\ub984",
    "demo.phases": "\ub2e8\uacc4",

    // Protocols
    "protocols.title": "\ud504\ub85c\ud1a0\ucf5c",
    "protocols.total": "\uac1c",
    "protocols.tryDemo": "\ub370\ubaa8 \ubcf4\uae30",

    // Protocol descriptions
    "protocol.Hermeneia.desc": "\uc694\uad6c\uc0ac\ud56d\uc758 \uc624\uc815\ub82c\uc774 \ube44\uc6a9\uc774 \ud070 \uc624\ub958\ub85c \ud655\ub300\ub418\uae30 \uc804\uc5d0 \ud574\uc18c\ud569\ub2c8\ub2e4",
    "protocol.Telos.desc": "\uc778\uac04\uacfc AI\uac00 \uac19\uc740 \ubaa9\ud45c\ub97c \uacf5\uc720\ud558\ub3c4\ub85d \uc131\uacf5 \uae30\uc900\uc744 \uba85\ud655\ud788 \uc815\uc758\ud569\ub2c8\ub2e4",
    "protocol.Aitesis.desc": "AI\uac00 \ucd94\uce21\ud558\uc9c0 \uc54a\uace0 \ud544\uc694\ud55c \uba85\ud655\ud654 \uc9c8\ubb38\uc744 \ud558\ub3c4\ub85d \ubcf4\uc7a5\ud569\ub2c8\ub2e4",
    "protocol.Prothesis.desc": "\ud130\ub110 \ube44\uc804\uc744 \ud53c\ud558\uae30 \uc704\ud574 \ub2e4\uc591\ud55c \uad00\uc810\uc5d0\uc11c \ubb38\uc81c\ub97c \uac80\ud1a0\ud569\ub2c8\ub2e4",
    "protocol.Analogia.desc": "\uc77c\ubc18\uc801\uc778 \ud574\uacb0\ucc45 \ub300\uc2e0 \uad6c\uccb4\uc801\uc778 \ub9e5\ub77d\uc5d0 \uc774\ub860\uc801 \uc870\uc5b8\uc744 \uc801\uc6a9\ud569\ub2c8\ub2e4",
    "protocol.Syneidesis.desc": "\uacc4\ud68d\uc5d0 \ucc29\uc218\ud558\uae30 \uc804\uc5d0 \uc7a0\uc7ac\uc801 \uac04\uacfc\uc810\uacfc \uc0ac\uac01\uc9c0\ub300\ub97c \uc2dd\ubcc4\ud569\ub2c8\ub2e4",
    "protocol.Prosoche.desc": "\uc704\ud5d8\ud55c \ud589\ub3d9\uc740 \uc778\uac04\uc758 \ud310\ub2e8\uc5d0 \ub9e1\uae41\ub2c8\ub2e4 \u2014 \ub418\ub3cc\ub9b4 \uc218 \uc5c6\ub294 \uacb0\uc815 \uc804\uc5d0 \uba48\ucda5\ub2c8\ub2e4",
    "protocol.Epharmoge.desc": "\uc774\ub860\uc801\uc73c\ub85c \uc62c\ubc14\ub978 \ud574\uacb0\ucc45\uc744 \uc2e4\uc81c \uc0c1\ud669\uacfc \uc81c\uc57d\uc5d0 \ub9de\uac8c \uc870\uc815\ud569\ub2c8\ub2e4",
    "protocol.Horismos.desc": "\uc54c\ub824\uc9c4 \uc815\ubcf4\uc640 \ubbf8\uc9c0\uc758 \uac83\uc744 \ubd84\ub9ac\ud558\uc5ec \ub354 \uc815\ud655\ud558\uac8c \ucd94\ub860\ud569\ub2c8\ub2e4",
    "protocol.Katalepsis.desc": "\uc2e4\uc9c8\uc801\uc778 \ubcc0\uacbd\uc0ac\ud56d\uc774 \uc801\uc6a9\ub418\uae30 \uc804\uc5d0 \uc774\ud574\ub97c \ud655\uc778\ud569\ub2c8\ub2e4",

    // Protocol categories
    "protocol.Hermeneia.category": "\uc815\ub82c",
    "protocol.Telos.category": "\ubc29\ud5a5",
    "protocol.Aitesis.category": "\ud0d0\uad6c",
    "protocol.Prothesis.category": "\uad00\uc810",
    "protocol.Analogia.category": "\uc801\uc6a9",
    "protocol.Syneidesis.category": "\uc778\uc2dd",
    "protocol.Prosoche.category": "\uc8fc\uc758",
    "protocol.Epharmoge.category": "\uc801\uc751",
    "protocol.Horismos.category": "\uacbd\uacc4",
    "protocol.Katalepsis.category": "\uc774\ud574",

    // Utilities
    "utilities.title": "\uc778\uc2dd\ub860\uc801 \ud611\ub825\uccb4",
    "utilities.badge": "\uc720\ud2f8\ub9ac\ud2f0",
    "utility.onboard.label": "\uc628\ubcf4\ub529",
    "utility.onboard.desc": "\uac01 \ud504\ub85c\ud1a0\ucf5c\uc744 \uc2e4\uc2b5\uc73c\ub85c \ubc30\uc6b0\ub294 \uc778\ud130\ub799\ud2f0\ube0c \ud29c\ud1a0\ub9ac\uc5bc",
    "utility.report.label": "\ub9ac\ud3ec\ud2b8",
    "utility.report.desc": "\uc5b4\ub5a4 \ud504\ub85c\ud1a0\ucf5c\uc744 \uc5bc\ub9c8\ub098 \uc790\uc8fc \uc0ac\uc6a9\ud588\ub294\uc9c0 \ucd94\uc801",
    "utility.dashboard.label": "\ub300\uc2dc\ubcf4\ub4dc",
    "utility.dashboard.desc": "\uc138\uc158 \uc804\ubc18\uc5d0 \uac78\uce5c \uc778\uc2dd\ub860\uc801 \ucee4\ubc84\ub9ac\uc9c0 \uc2dc\uac01\ud654",

    // Install
    "install.title": "\uc124\uce58",
    "install.claudeCode": "Claude Code",
    "install.codex": "Codex",

    // Footer
    "footer.license": "MIT \ub77c\uc774\uc120\uc2a4",

    // Demo scenarios
    "demo.hermeneia.prompt": "\uc0ac\uc6a9\uc790 \uad00\ub9ac\uc6a9 REST API\ub97c \ub9cc\ub4e4\uc5b4\uc918",
    "demo.telos.prompt": "\uac80\uc0c9 \uc131\ub2a5\uc744 \ucd5c\uc801\ud654\ud574\uc918",
    "demo.aitesis.prompt": "\uc560\ud50c\ub9ac\ucf00\uc774\uc158\uc5d0 \uce90\uc2f1\uc744 \ucd94\uac00\ud574\uc918",
    "demo.prothesis.prompt": "\ubaa8\ub180\ub9ac\uc2a4\ub97c \ub9c8\uc774\ud06c\ub85c\uc11c\ube44\uc2a4\ub85c \ub9c8\uc774\uadf8\ub808\uc774\uc158\ud574\uc918",
    "demo.analogia.prompt": "\uc5d0\ub7ec \ud578\ub4e4\ub9c1 \ubaa8\ubc94 \uc0ac\ub840\ub97c \ub530\ub77c\uc918",
    "demo.syneidesis.prompt": "\uc0c8 \uacb0\uc81c \ud50c\ub85c\uc6b0\ub97c \ud504\ub85c\ub355\uc158\uc5d0 \ubc30\ud3ec\ud574\uc918",
    "demo.prosoche.prompt": "users \ud14c\uc774\ube14\uc744 \uc0ad\uc81c\ud558\uace0 \uc0c8 \uc2a4\ud0a4\ub9c8\ub85c \ub2e4\uc2dc \ub9cc\ub4e4\uc5b4\uc918",
    "demo.epharmoge.prompt": "\ud29c\ud1a0\ub9ac\uc5bc\uc758 OAuth2 \ud50c\ub85c\uc6b0\ub97c \uad6c\ud604\ud574\uc918",
    "demo.horismos.prompt": "\uc571\uc774 \ub290\ub824, \uc131\ub2a5 \ubb38\uc81c\ub97c \uace0\uccd0\uc918",
    "demo.katalepsis.prompt": "auth \ubaa8\ub4c8\uc744 \uc0c8 \ud1a0\ud070 \ud615\uc2dd\uc73c\ub85c \ub9ac\ud329\ud130\ub9c1\ud574\uc918",
  },
} as const;

type TranslationKey = keyof typeof translations.en;

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    try {
      const saved = localStorage.getItem("locale");
      if (saved === "ko" || saved === "en") return saved;
      return navigator.language.startsWith("ko") ? "ko" : "en";
    } catch {
      return "en";
    }
  });

  const changeLocale = useCallback((newLocale: Locale) => {
    setLocale(newLocale);
    try {
      localStorage.setItem("locale", newLocale);
    } catch {
      // Private Browsing — locale changes in-memory only
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[locale][key] ?? translations.en[key] ?? key;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale: changeLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
