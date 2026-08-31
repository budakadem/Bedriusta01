/**
 * Service worker registration plus "a new version is ready" detection.
 *
 * The worker itself already calls skipWaiting() and clients.claim(), so a new
 * build takes over as soon as it is installed. What was missing is that the
 * page already open keeps running the JavaScript it loaded at start — which is
 * why an installed PWA only showed an update after being closed and reopened.
 *
 * This does not reload on its own: someone could be halfway through a
 * reservation or an application form. It raises an event, and the notice
 * component lets the visitor choose when to refresh.
 */

const UPDATE_READY_EVENT = "bedriusta-app-update-ready";

export function registerServiceWorker(): void {
  if (!("serviceWorker" in navigator)) return;

  navigator.serviceWorker
    .register("/service-worker.js", { scope: "/" })
    .then((registration) => {
      // A standalone PWA can stay open for days, and the browser only checks
      // for a new worker on its own schedule. Re-check whenever the app comes
      // back to the foreground.
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") void registration.update();
      });

      registration.addEventListener("updatefound", () => {
        const installing = registration.installing;
        if (!installing) return;

        installing.addEventListener("statechange", () => {
          // An existing controller means this is an update rather than the
          // very first install, so there is something to refresh into.
          if (installing.state === "installed" && navigator.serviceWorker.controller) {
            window.dispatchEvent(new CustomEvent(UPDATE_READY_EVENT));
          }
        });
      });
    })
    .catch(() => {
      // A failed registration must never break the page; the site works
      // without the worker, just without offline caching.
    });
}

export function subscribeToAppUpdate(listener: () => void): () => void {
  window.addEventListener(UPDATE_READY_EVENT, listener);
  return () => window.removeEventListener(UPDATE_READY_EVENT, listener);
}
