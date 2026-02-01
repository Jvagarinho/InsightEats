"use client";

import { createContext, useContext, useEffect, useReducer } from "react";
import type { ReactNode } from "react";
import { en, pt } from "@/lib/translations";

type Locale = "en" | "pt";

type NestedMessages = {
  [key: string]: string | NestedMessages;
};

const translations: Record<Locale, NestedMessages> = {
  en,
  pt,
};

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

type LocaleAction = { type: "set"; locale: Locale };

function localeReducer(state: Locale, action: LocaleAction): Locale {
  if (action.type === "set") {
    return action.locale;
  }
  return state;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, dispatch] = useReducer(localeReducer, "en");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("locale");
    if (stored === "en" || stored === "pt") {
      dispatch({ type: "set", locale: stored });
    }
  }, []);

  function setLocale(next: Locale) {
    dispatch({ type: "set", locale: next });
    if (typeof window !== "undefined") {
      window.localStorage.setItem("locale", next);
    }
  }

  function t(path: string) {
    const segments = path.split(".");
    let current: string | NestedMessages | undefined =
      translations[locale] as unknown as NestedMessages;
    for (const segment of segments) {
      if (current == null) break;
      if (typeof current !== "object") break;
      current = current[segment];
    }
    if (typeof current === "string") {
      return current;
    }
    return path;
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
