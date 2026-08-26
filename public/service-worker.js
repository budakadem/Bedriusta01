const CACHE_VERSION = "bedri-usta-pwa-v4";
const PAGE_CACHE = `${CACHE_VERSION}-pages`;
const ASSET_CACHE = `${CACHE_VERSION}-assets`;
const OFFLINE_URL = "/offline.html";
const CORE_ASSETS = [
  "/",
  OFFLINE_URL,
  "/manifest.webmanifest",
  "/icons/favicon-32.png",
  "/icons/apple-touch-icon.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-512.png",
  "/images/brand/bedri-usta-logo-white-cropped.png"
];

async function cacheCoreAssets() {
  const cache = await caches.open(ASSET_CACHE);

  await Promise.all(
    CORE_ASSETS.map(async (url) => {
      try {
        await cache.add(url);
      } catch {
        // Tek bir dosya hatası PWA kurulumunu engellememeli.
      }
    })
  );

  try {
    const response = await fetch("/", { cache: "no-cache" });
    if (!response.ok) return;

    const html = await response.clone().text();
    const pageCache = await caches.open(PAGE_CACHE);
    await pageCache.put("/", response);

    const buildAssets = [
      ...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)
    ].map((match) => match[1]);

    await Promise.all(
      buildAssets.map(async (url) => {
        try {
          await cache.add(url);
        } catch {
          // Sonraki çevrimiçi ziyarette runtime cache tamamlanır.
        }
      })
    );
  } catch {
    // İlk kurulum çevrimdışıysa mevcut cache korunur.
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(cacheCoreAssets().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !key.startsWith(CACHE_VERSION))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

async function handleNavigation(request) {
  const pageCache = await caches.open(PAGE_CACHE);

  try {
    const response = await fetch(request);
    if (response.ok) {
      await pageCache.put(request, response.clone());
      await pageCache.put("/", response.clone());
    }
    return response;
  } catch {
    return (
      (await pageCache.match(request)) ||
      (await pageCache.match("/")) ||
      (await caches.match(OFFLINE_URL))
    );
  }
}

async function handleStaticAsset(request) {
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(request);

  const networkRequest = fetch(request)
    .then((response) => {
      if (response.ok) {
        void cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);

  return cached || networkRequest;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request));
    return;
  }

  if (
    url.pathname.startsWith("/videos/") ||
    url.pathname.startsWith("/menu/") ||
    request.headers.has("range")
  ) {
    return;
  }

  if (
    ["style", "script", "image", "font"].includes(request.destination) ||
    url.pathname.startsWith("/assets/") ||
    url.pathname.startsWith("/icons/")
  ) {
    event.respondWith(handleStaticAsset(request));
  }
});
