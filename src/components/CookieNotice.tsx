import { useEffect, useState } from "react";
import { useSiteLanguage } from "../siteLanguage";
import "./cookie-notice.css";

const STORAGE_KEY = "bedriusta-cookie-notice";
const CONSENT_VERSION = "1";
const OPEN_PREFERENCES_EVENT = "bedriusta-cookie-preferences-open";

export function openCookiePreferences() {
  window.dispatchEvent(new CustomEvent(OPEN_PREFERENCES_EVENT));
}

const copy = {
  TR: {
    eyebrow: "GİZLİLİK TERCİHLERİ",
    title: "Yalnızca gerekli teknolojileri kullanıyoruz.",
    text: "Sayfaların daha hızlı açılması için dil tercihini ve bazı teknik verileri cihazınızda saklayabiliriz. Bildirim servisi yalnızca siz açtığınızda devreye girer; reklam veya davranış analizi çerezi kullanmıyoruz.",
    accept: "Anladım",
    settings: "Ayrıntıları incele",
    label: "Çerez ve gizlilik bilgilendirmesi"
  },
  DE: {
    eyebrow: "DATENSCHUTZEINSTELLUNGEN",
    title: "Wir verwenden nur technisch notwendige Technologien.",
    text: "Für schnelleres Laden der Seiten können wir Ihre Sprachwahl und einige technische Daten auf Ihrem Gerät speichern. Der Benachrichtigungsdienst wird erst aktiv, wenn Sie ihn selbst öffnen; Werbe- oder Analyse-Cookies verwenden wir nicht.",
    accept: "Verstanden",
    settings: "Details ansehen",
    label: "Hinweis zu Cookies und Datenschutz"
  },
  ENG: {
    eyebrow: "PRIVACY PREFERENCES",
    title: "We only use essential technologies.",
    text: "To load pages faster, we may store your language preference and some technical data on your device. The notification service only activates when you open it yourself; we do not use advertising or behavioural analytics cookies.",
    accept: "Understood",
    settings: "View details",
    label: "Cookie and privacy notice"
  }
} as const;

function hasAcknowledgedNotice() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;
    return (JSON.parse(stored) as { version?: string }).version === CONSENT_VERSION;
  } catch {
    return false;
  }
}

export function CookieNotice() {
  const language = useSiteLanguage();
  const [visible, setVisible] = useState(false);
  const text = copy[language];

  useEffect(() => {
    if (hasAcknowledgedNotice()) return;
    const timer = window.setTimeout(() => setVisible(true), 700);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleOpenRequest = () => setVisible(true);
    window.addEventListener(OPEN_PREFERENCES_EVENT, handleOpenRequest);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, handleOpenRequest);
  }, []);

  const acknowledge = () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: CONSENT_VERSION, acknowledgedAt: new Date().toISOString() })
    );
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside className="cookie-notice" aria-label={text.label} aria-live="polite">
      <div className="cookie-notice__copy">
        <span>{text.eyebrow}</span>
        <strong>{text.title}</strong>
        <p>{text.text}</p>
      </div>
      <div className="cookie-notice__actions">
        <a href="/datenschutz#cookies">{text.settings}</a>
        <button type="button" onClick={acknowledge}>{text.accept}</button>
      </div>
    </aside>
  );
}
