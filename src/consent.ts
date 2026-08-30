/**
 * Cookie/storage consent state.
 *
 * Kept deliberately small and framework-free so it can be read from anywhere
 * (including before React mounts) and so nothing here is tied to a host —
 * the whole thing travels with the repo if the site moves off Vercel.
 *
 * "necessary" is not stored: it is always on and cannot be switched off, so
 * persisting it would only invite it being tampered into a false value.
 */

export type ConsentDecision = {
  analytics: boolean;
  functional: boolean;
};

export type StoredConsent = ConsentDecision & {
  version: string;
  decidedAt: string;
};

const STORAGE_KEY = "bedriusta-consent";

/**
 * Bump when the set of categories or the services inside them changes: a bump
 * invalidates every stored decision and re-asks, which is what GDPR expects
 * when the basis of the original consent no longer matches reality.
 *
 * v2 is the first real consent record. Before it the site only ever showed an
 * information notice (key "bedriusta-cookie-notice"), and acknowledging a
 * notice is not consent — so those visitors are intentionally asked again.
 */
export const CONSENT_VERSION = "2";

const CHANGE_EVENT = "bedriusta-consent-change";

export const DENIED_ALL: ConsentDecision = { analytics: false, functional: false };
export const GRANTED_ALL: ConsentDecision = { analytics: true, functional: true };

export function readConsent(): StoredConsent | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    if (parsed.version !== CONSENT_VERSION) return null;
    return {
      version: CONSENT_VERSION,
      decidedAt: typeof parsed.decidedAt === "string" ? parsed.decidedAt : "",
      analytics: parsed.analytics === true,
      functional: parsed.functional === true
    };
  } catch {
    // Private mode, blocked storage, corrupted value: treat as "not decided"
    // rather than silently assuming consent.
    return null;
  }
}

/** What is actually allowed right now. No stored decision means nothing extra. */
export function currentConsent(): ConsentDecision {
  return readConsent() ?? DENIED_ALL;
}

export function hasDecided(): boolean {
  return readConsent() !== null;
}

export function saveConsent(decision: ConsentDecision): void {
  const record: StoredConsent = {
    ...decision,
    version: CONSENT_VERSION,
    decidedAt: new Date().toISOString()
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // If we cannot persist it we still broadcast, so the current page respects
    // the choice even though it will be asked again next visit.
  }
  window.dispatchEvent(new CustomEvent<ConsentDecision>(CHANGE_EVENT, { detail: decision }));
}

export function subscribeToConsent(listener: (decision: ConsentDecision) => void): () => void {
  const handle = (event: Event) => listener((event as CustomEvent<ConsentDecision>).detail);
  window.addEventListener(CHANGE_EVENT, handle);
  return () => window.removeEventListener(CHANGE_EVENT, handle);
}
