export type SiteLanguage = "TR" | "DE" | "ENG";

const STORAGE_KEY = "bedriusta-language";
const LANGUAGE_EVENT = "bedriusta-language-change";

export function getSiteLanguage(): SiteLanguage {
  if (typeof window === "undefined") return "TR";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "DE" || stored === "ENG" ? stored : "TR";
}

export function setSiteLanguage(language: SiteLanguage) {
  window.localStorage.setItem(STORAGE_KEY, language);
  window.dispatchEvent(new CustomEvent<SiteLanguage>(LANGUAGE_EVENT, { detail: language }));
}

export function subscribeToSiteLanguage(listener: (language: SiteLanguage) => void) {
  const handleLanguageChange = (event: Event) => {
    listener((event as CustomEvent<SiteLanguage>).detail);
  };

  window.addEventListener(LANGUAGE_EVENT, handleLanguageChange);
  return () => window.removeEventListener(LANGUAGE_EVENT, handleLanguageChange);
}
