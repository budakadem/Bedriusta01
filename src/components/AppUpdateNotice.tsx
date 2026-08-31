import { useEffect, useState } from "react";
import { useSiteLanguage } from "../siteLanguage";
import { subscribeToAppUpdate } from "../appUpdate";
import "./app-update-notice.css";

const copy = {
  TR: { message: "Yeni sürüm hazır.", action: "Yenile", dismiss: "Kapat" },
  DE: { message: "Neue Version verfügbar.", action: "Aktualisieren", dismiss: "Schließen" },
  ENG: { message: "A new version is ready.", action: "Refresh", dismiss: "Dismiss" }
} as const;

export function AppUpdateNotice() {
  const language = useSiteLanguage();
  const text = copy[language];
  const [ready, setReady] = useState(false);

  useEffect(() => subscribeToAppUpdate(() => setReady(true)), []);

  if (!ready) return null;

  return (
    <div className="app-update" role="status">
      <span className="app-update__text">{text.message}</span>
      <button type="button" className="app-update__action" onClick={() => window.location.reload()}>
        {text.action}
      </button>
      <button
        type="button"
        className="app-update__dismiss"
        onClick={() => setReady(false)}
        aria-label={text.dismiss}
      >
        ×
      </button>
    </div>
  );
}
