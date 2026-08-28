import { useEffect, useState } from "react";

export type SiteLanguage = "TR" | "DE" | "ENG";

const STORAGE_KEY = "bedriusta-language";
const LANGUAGE_EVENT = "bedriusta-language-change";

const documentLanguageCodes: Record<SiteLanguage, string> = {
  TR: "tr",
  DE: "de",
  ENG: "en"
};

function isSiteLanguage(value: string | null): value is SiteLanguage {
  return value === "TR" || value === "DE" || value === "ENG";
}

export function detectDeviceLanguage(): SiteLanguage {
  if (typeof navigator === "undefined") return "DE";

  const requestedLanguages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  for (const requestedLanguage of requestedLanguages) {
    const language = requestedLanguage.toLowerCase();
    if (language.startsWith("tr")) return "TR";
    if (language.startsWith("de")) return "DE";
    if (language.startsWith("en")) return "ENG";
  }

  return "DE";
}

export function getIntlLocale(language: SiteLanguage): string {
  return language === "TR" ? "tr-TR" : language === "DE" ? "de-DE" : "en-GB";
}

function applyDocumentLanguage(language: SiteLanguage) {
  if (typeof document !== "undefined") {
    document.documentElement.lang = documentLanguageCodes[language];
  }
}

export function getSiteLanguage(): SiteLanguage {
  if (typeof window === "undefined") return "DE";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  const language = isSiteLanguage(stored) ? stored : detectDeviceLanguage();
  applyDocumentLanguage(language);
  return language;
}

export function setSiteLanguage(language: SiteLanguage) {
  window.localStorage.setItem(STORAGE_KEY, language);
  applyDocumentLanguage(language);
  window.dispatchEvent(new CustomEvent<SiteLanguage>(LANGUAGE_EVENT, { detail: language }));
}

export function subscribeToSiteLanguage(listener: (language: SiteLanguage) => void) {
  const handleLanguageChange = (event: Event) => {
    listener((event as CustomEvent<SiteLanguage>).detail);
  };

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    const language = isSiteLanguage(event.newValue) ? event.newValue : detectDeviceLanguage();
    applyDocumentLanguage(language);
    listener(language);
  };

  window.addEventListener(LANGUAGE_EVENT, handleLanguageChange);
  window.addEventListener("storage", handleStorageChange);
  return () => {
    window.removeEventListener(LANGUAGE_EVENT, handleLanguageChange);
    window.removeEventListener("storage", handleStorageChange);
  };
}

export function useSiteLanguage(): SiteLanguage {
  const [language, setLanguage] = useState<SiteLanguage>(() => getSiteLanguage());

  useEffect(() => subscribeToSiteLanguage(setLanguage), []);

  return language;
}
