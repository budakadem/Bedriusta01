/**
 * Google Analytics 4, loaded only after explicit consent.
 *
 * The gtag.js script is never injected until the visitor grants the analytics
 * category, so a visitor who declines (or never answers) makes no request to
 * Google at all — which is what TTDSG §25 requires, not merely "GA runs but
 * without cookies".
 *
 * The Measurement ID is deliberately not hardcoded. Set VITE_GA_MEASUREMENT_ID
 * at build time (Vercel: Project Settings > Environment Variables; nginx: in
 * the shell before `npm run build`). While it is empty every function here is
 * a no-op, so the consent panel can ship before the GA property exists.
 *
 * Create the GA4 data stream against the FINAL domain (bedriusta.de). The
 * Measurement ID is not bound to the URL entered there, so the same ID keeps
 * collecting — and keeps its history — when the site moves off vercel.app.
 */

const MEASUREMENT_ID = ((import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined) ?? "").trim();

type GtagArgs = unknown[];

declare global {
  interface Window {
    dataLayer?: GtagArgs[];
    gtag?: (...args: GtagArgs) => void;
  }
}

let scriptInjected = false;

export function isAnalyticsConfigured(): boolean {
  return MEASUREMENT_ID.length > 0;
}

function ensureGtag(): (...args: GtagArgs) => void {
  window.dataLayer = window.dataLayer ?? [];
  if (!window.gtag) {
    window.gtag = function gtag(...args: GtagArgs) {
      // Must push `arguments`-shaped entries, not a normalised array.
      window.dataLayer?.push(args);
    };
  }
  return window.gtag;
}

function injectScript(): void {
  if (scriptInjected) return;
  scriptInjected = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
  document.head.appendChild(script);
}

/**
 * Apply a consent decision. Safe to call repeatedly and on every page load.
 *
 * Consent Mode v2 signals are sent as well as gating the script itself: the
 * gating is what keeps Google out entirely, the signals are what keep the
 * setup correct if Google Ads or remarketing is added later.
 */
export function applyAnalyticsConsent(granted: boolean): void {
  if (!isAnalyticsConfigured()) return;

  if (!granted) {
    // Only meaningful if GA was granted earlier in this same page view; on a
    // fresh load with no consent nothing was ever injected.
    if (scriptInjected) {
      ensureGtag()("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied"
      });
    }
    return;
  }

  const gtag = ensureGtag();

  if (!scriptInjected) {
    gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
  }

  gtag("consent", "update", {
    analytics_storage: "granted",
    // This site runs no advertising or remarketing tags; keep the ad signals
    // denied so granting "statistics" never quietly enables ad profiling.
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied"
  });

  if (!scriptInjected) {
    injectScript();
    gtag("js", new Date());
    gtag("config", MEASUREMENT_ID);
  }
}
