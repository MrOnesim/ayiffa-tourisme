"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { getDictionary, type Dictionary } from "@/lib/get-dictionary";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const STORAGE_KEY = "ayiffa.locale";

export function LocaleProvider({ children, initialLocale = defaultLocale }: { children: ReactNode; initialLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const applyLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    document.cookie = `${STORAGE_KEY}=${next};path=/;max-age=31536000;SameSite=Lax`;
    document.documentElement.lang = next;
    // The server reads the locale cookie. A soft router.refresh() only refreshes the
    // current route and leaves previously visited pages cached in the old language.
    // A full reload guarantees that every route and every server component is re-rendered.
    window.location.reload();
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored || !isLocale(stored) || stored === locale) return;
    applyLocale(stored);
  }, [locale, applyLocale]);

  const value: LocaleContextValue = {
    locale,
    setLocale: applyLocale,
    t: getDictionary(locale),
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
