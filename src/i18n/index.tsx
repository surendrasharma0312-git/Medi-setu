/**
 * Lightweight i18n (English + Hindi) with no external library.
 *
 * - UI text lives in src/i18n/translations/en.ts and hi.ts (flat keys).
 * - hi.ts is typed as Record<TranslationKey, string>, so TypeScript fails the
 *   build if a Hindi string is missing.
 * - Data records use LocalizedText { en, hi } and are read with pick().
 * - The chosen language is the only thing stored in the browser (localStorage).
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { PLACE_NAMES_HI } from '../data/reference';
import type { Language, LocalizedText } from '../types';
import { en } from './translations/en';
import type { TranslationKey } from './translations/en';
import { hi } from './translations/hi';

export type { TranslationKey };

const STORAGE_KEY = 'medisetu.language';

const dictionaries: Record<Language, Record<TranslationKey, string>> = { en, hi };

type TranslateVars = Record<string, string | number>;

interface I18nValue {
  lang: Language;
  setLang: (lang: Language) => void;
  /** Translate a UI string. Use {name} placeholders with vars. */
  t: (key: TranslationKey, vars?: TranslateVars) => string;
  /** Pick the current language from a { en, hi } data value. */
  pick: (text: LocalizedText) => string;
  /** Hindi name for known districts/cities, otherwise the name as written. */
  place: (name: string) => string;
  /** "2026-10-27" or an ISO date-time -> "27 Oct 2026" / "27 अक्तू॰ 2026" */
  formatDate: (iso: string) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

function readStoredLanguage(): Language {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'hi' ? 'hi' : 'en';
  } catch (error) {
    console.warn('Failed to read language preference from localStorage:', error);
    return 'en';
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(readStoredLanguage);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch (error) {
      // Storage can be blocked (private mode). The choice then lasts for this visit only.
      console.warn('Failed to save language preference to localStorage:', error);
    }
  }, []);

  const value = useMemo<I18nValue>(() => {
    const dictionary = dictionaries[lang];
    return {
      lang,
      setLang,
      t: (key, vars) => {
        let text = dictionary[key] ?? en[key] ?? key;
        if (vars) {
          Object.entries(vars).forEach(([name, replacement]) => {
            text = text.split(`{${name}}`).join(String(replacement));
          });
        }
        return text;
      },
      pick: (text) => text[lang],
      place: (name) => (lang === 'hi' ? PLACE_NAMES_HI[name] ?? name : name),
      formatDate: (iso) => {
        const date = iso.length === 10 ? new Date(`${iso}T00:00:00`) : new Date(iso);
        if (Number.isNaN(date.getTime())) return iso;
        return new Intl.DateTimeFormat(lang === 'hi' ? 'hi-IN' : 'en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }).format(date);
      },
    };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside <I18nProvider>');
  return context;
}
