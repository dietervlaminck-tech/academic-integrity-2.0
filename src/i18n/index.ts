// i18n plumbing: language state, persistence, and a tiny {token} formatter.
// English is the default. The provider component lives in I18nProvider.tsx.

import { createContext, useContext } from "react";
import { en, type Dict } from "./en";
import { nl } from "./nl";

export type Lang = "en" | "nl";

export const DICTS: Record<Lang, Dict> = { en, nl };
export const DEFAULT_LANG: Lang = "en";
export const LANG_STORAGE_KEY = "ghostwriter.lang.v1";

export type I18n = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dict;
};

export const I18nContext = createContext<I18n | null>(null);

export function useI18n(): I18n {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
  return ctx;
}

/** Replace {token} placeholders with values. Missing values are left as-is. */
export function fmt(template: string, vars: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

export function isLang(value: unknown): value is Lang {
  return value === "en" || value === "nl";
}

export function loadLang(): Lang {
  try {
    const raw = localStorage.getItem(LANG_STORAGE_KEY);
    return isLang(raw) ? raw : DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}

export function saveLang(lang: Lang): void {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // ignore
  }
}

export type { Dict };
