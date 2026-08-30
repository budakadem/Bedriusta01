import { useEffect, useState } from "react";
import { useSiteLanguage } from "../siteLanguage";
import {
  currentConsent,
  DENIED_ALL,
  GRANTED_ALL,
  hasDecided,
  saveConsent,
  subscribeToConsent,
  type ConsentDecision
} from "../consent";
import { applyAnalyticsConsent } from "../services/analytics";
import "./cookie-notice.css";

const OPEN_PREFERENCES_EVENT = "bedriusta-cookie-preferences-open";

export function openCookiePreferences() {
  window.dispatchEvent(new CustomEvent(OPEN_PREFERENCES_EVENT));
}

const copy = {
  TR: {
    eyebrow: "GİZLİLİK TERCİHLERİ",
    title: "Çerez tercihlerinizi siz belirleyin.",
    text: "Sitenin çalışması için gereken teknik verileri her zaman saklarız. İstatistik ölçümü ise yalnızca siz onay verirseniz devreye girer; onayınızı istediğiniz zaman geri alabilirsiniz.",
    acceptAll: "Tümünü kabul et",
    rejectAll: "Yalnızca zorunlu",
    customise: "Ayarlar",
    save: "Seçimi kaydet",
    back: "Geri",
    details: "Ayrıntılı bilgi",
    settingsTitle: "Çerez ayarları",
    label: "Çerez ve gizlilik tercihleri",
    always: "Her zaman aktif",
    categories: {
      necessary: {
        name: "Zorunlu",
        text: "Dil tercihiniz ve sayfaların hızlı açılmasını sağlayan uygulama önbelleği. Bunlar olmadan site düzgün çalışmaz; kapatılamaz."
      },
      analytics: {
        name: "İstatistik",
        text: "Google Analytics ile hangi sayfaların ilgi gördüğünü anonim olarak ölçeriz. Onay vermezseniz Google'a hiçbir bağlantı kurulmaz."
      }
    }
  },
  DE: {
    eyebrow: "DATENSCHUTZEINSTELLUNGEN",
    title: "Sie entscheiden über Ihre Cookies.",
    text: "Technisch notwendige Daten speichern wir immer, damit die Seite funktioniert. Die Statistikmessung wird nur mit Ihrer Einwilligung aktiv; Sie können sie jederzeit widerrufen.",
    acceptAll: "Alle akzeptieren",
    rejectAll: "Nur notwendige",
    customise: "Einstellungen",
    save: "Auswahl speichern",
    back: "Zurück",
    details: "Weitere Informationen",
    settingsTitle: "Cookie-Einstellungen",
    label: "Cookie- und Datenschutzeinstellungen",
    always: "Immer aktiv",
    categories: {
      necessary: {
        name: "Notwendig",
        text: "Ihre Sprachwahl und der App-Cache für schnelleres Laden. Ohne diese funktioniert die Seite nicht; sie lassen sich nicht deaktivieren."
      },
      analytics: {
        name: "Statistik",
        text: "Mit Google Analytics messen wir anonym, welche Seiten genutzt werden. Ohne Ihre Einwilligung wird keine Verbindung zu Google aufgebaut."
      }
    }
  },
  ENG: {
    eyebrow: "PRIVACY PREFERENCES",
    title: "You decide about your cookies.",
    text: "We always store the technical data the site needs to work. Statistics measurement is only activated with your consent, and you can withdraw it at any time.",
    acceptAll: "Accept all",
    rejectAll: "Essential only",
    customise: "Settings",
    save: "Save choice",
    back: "Back",
    details: "More information",
    settingsTitle: "Cookie settings",
    label: "Cookie and privacy preferences",
    always: "Always active",
    categories: {
      necessary: {
        name: "Essential",
        text: "Your language choice and the app cache that makes pages load faster. The site does not work without these; they cannot be switched off."
      },
      analytics: {
        name: "Statistics",
        text: "Google Analytics lets us measure anonymously which pages are used. Without your consent no connection to Google is made."
      }
    }
  }
} as const;

function ConsentToggle({
  name,
  text,
  checked,
  disabled,
  alwaysLabel,
  onChange
}: {
  name: string;
  text: string;
  checked: boolean;
  disabled?: boolean;
  alwaysLabel?: string;
  onChange?: (next: boolean) => void;
}) {
  return (
    <div className={`cookie-category${disabled ? " is-locked" : ""}`}>
      <div className="cookie-category__head">
        <strong>{name}</strong>
        {disabled ? (
          <span className="cookie-category__always">{alwaysLabel}</span>
        ) : (
          <label className="cookie-switch">
            <input
              type="checkbox"
              checked={checked}
              onChange={(event) => onChange?.(event.target.checked)}
            />
            <span className="cookie-switch__track" aria-hidden="true">
              <span className="cookie-switch__thumb" />
            </span>
            <span className="cookie-switch__label">{name}</span>
          </label>
        )}
      </div>
      <p>{text}</p>
    </div>
  );
}

export function CookieNotice() {
  const language = useSiteLanguage();
  const text = copy[language];
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [draft, setDraft] = useState<ConsentDecision>(() => currentConsent());

  // Re-apply the stored decision on every load: the consent record is the
  // single source of truth, so a returning visitor who granted statistics gets
  // GA back without being asked again, and one who declined never loads it.
  useEffect(() => {
    applyAnalyticsConsent(currentConsent().analytics);
    return subscribeToConsent((decision) => applyAnalyticsConsent(decision.analytics));
  }, []);

  useEffect(() => {
    if (hasDecided()) return;
    const timer = window.setTimeout(() => setVisible(true), 700);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleOpenRequest = () => {
      setDraft(currentConsent());
      setShowSettings(true);
      setVisible(true);
    };
    window.addEventListener(OPEN_PREFERENCES_EVENT, handleOpenRequest);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, handleOpenRequest);
  }, []);

  const commit = (decision: ConsentDecision) => {
    saveConsent(decision);
    setDraft(decision);
    setShowSettings(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      className={`cookie-notice${showSettings ? " cookie-notice--settings" : ""}`}
      aria-label={text.label}
      role="dialog"
      aria-modal="false"
    >
      <div className="cookie-notice__copy">
        <span>{text.eyebrow}</span>
        <strong>{showSettings ? text.settingsTitle : text.title}</strong>
        {!showSettings && <p>{text.text}</p>}
      </div>

      {showSettings && (
        <div className="cookie-notice__categories">
          <ConsentToggle
            name={text.categories.necessary.name}
            text={text.categories.necessary.text}
            checked
            disabled
            alwaysLabel={text.always}
          />
          <ConsentToggle
            name={text.categories.analytics.name}
            text={text.categories.analytics.text}
            checked={draft.analytics}
            onChange={(analytics) => setDraft((current) => ({ ...current, analytics }))}
          />
        </div>
      )}

      <div className="cookie-notice__actions">
        <a className="cookie-notice__link" href="/datenschutz#cookies">
          {text.details}
        </a>
        {showSettings ? (
          <>
            <button type="button" className="cookie-btn cookie-btn--ghost" onClick={() => setShowSettings(false)}>
              {text.back}
            </button>
            <button type="button" className="cookie-btn cookie-btn--primary" onClick={() => commit(draft)}>
              {text.save}
            </button>
          </>
        ) : (
          <>
            <button type="button" className="cookie-btn cookie-btn--ghost" onClick={() => setShowSettings(true)}>
              {text.customise}
            </button>
            {/* Reject carries the same weight as accept: a visibly weaker
                "decline" is the single most cited defect in German rulings. */}
            <button type="button" className="cookie-btn cookie-btn--primary" onClick={() => commit(DENIED_ALL)}>
              {text.rejectAll}
            </button>
            <button type="button" className="cookie-btn cookie-btn--primary" onClick={() => commit(GRANTED_ALL)}>
              {text.acceptAll}
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
