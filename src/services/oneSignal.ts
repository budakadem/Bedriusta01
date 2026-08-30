const ONESIGNAL_APP_ID = "f28beacc-e1c1-4152-867f-2511122e686c";
const ONESIGNAL_SDK_URL = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
const ONESIGNAL_WORKER_PATH = "push/onesignal/OneSignalSDKWorker.js";
const ONESIGNAL_WORKER_SCOPE = "/push/onesignal/";

type PushSubscriptionState = {
  id: string | null;
  token: string | null;
  optedIn: boolean;
};

type PushSubscriptionChangeEvent = {
  current: PushSubscriptionState;
  previous: PushSubscriptionState;
};

type OneSignalSdk = {
  init(options: {
    appId: string;
    allowLocalhostAsSecureOrigin?: boolean;
    autoResubscribe?: boolean;
    notifyButton?: { enable: boolean };
    serviceWorkerPath: string;
    serviceWorkerParam: { scope: string };
  }): Promise<void>;
  Notifications: {
    permission: boolean;
    isPushSupported(): boolean;
    requestPermission(): Promise<boolean>;
    setDefaultTitle(title: string): void;
    setDefaultUrl(url: string): void;
    addEventListener(event: "permissionChange", listener: (permission: boolean) => void): void;
  };
  User: {
    PushSubscription: {
      id: string | null;
      token: string | null;
      optedIn: boolean;
      optIn(): Promise<void>;
      addEventListener(
        event: "change",
        listener: (event: PushSubscriptionChangeEvent) => void
      ): void;
    };
  };
};

declare global {
  interface Window {
    OneSignalDeferred?: Array<(oneSignal: OneSignalSdk) => void | Promise<void>>;
  }

  interface Navigator {
    standalone?: boolean;
  }
}

export type NotificationPermissionState = NotificationPermission | "unsupported";

export type OneSignalSnapshot = {
  initialized: boolean;
  isIos: boolean;
  isStandalone: boolean;
  isSupported: boolean;
  optedIn: boolean;
  permission: NotificationPermissionState;
  subscriptionId: string | null;
  error: string | null;
};

const listeners = new Set<(snapshot: OneSignalSnapshot) => void>();
let sdk: OneSignalSdk | null = null;
let initPromise: Promise<OneSignalSdk> | null = null;
let observersRegistered = false;

function isIosDevice(): boolean {
  const platform = navigator.platform ?? "";
  const userAgent = navigator.userAgent ?? "";
  return /iPad|iPhone|iPod/.test(userAgent) || (platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function isStandaloneDisplay(): boolean {
  return window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
}

function getBrowserPermission(): NotificationPermissionState {
  return "Notification" in window ? Notification.permission : "unsupported";
}

let snapshot: OneSignalSnapshot = {
  initialized: false,
  isIos: isIosDevice(),
  isStandalone: isStandaloneDisplay(),
  isSupported: "Notification" in window && "serviceWorker" in navigator,
  optedIn: false,
  permission: getBrowserPermission(),
  subscriptionId: null,
  error: null
};

function emit(update: Partial<OneSignalSnapshot> = {}): void {
  snapshot = {
    ...snapshot,
    ...update,
    isStandalone: isStandaloneDisplay(),
    permission: getBrowserPermission()
  };
  listeners.forEach((listener) => listener(snapshot));
}

function syncFromSdk(oneSignal: OneSignalSdk): void {
  emit({
    initialized: true,
    isSupported: oneSignal.Notifications.isPushSupported(),
    optedIn: oneSignal.User.PushSubscription.optedIn,
    subscriptionId: oneSignal.User.PushSubscription.id,
    error: null
  });
}

function registerObservers(oneSignal: OneSignalSdk): void {
  if (observersRegistered) return;
  observersRegistered = true;

  oneSignal.Notifications.addEventListener("permissionChange", () => syncFromSdk(oneSignal));
  oneSignal.User.PushSubscription.addEventListener("change", ({ current }) => {
    emit({
      initialized: true,
      optedIn: current.optedIn,
      subscriptionId: current.id,
      error: null
    });
  });
}

function loadSdkScript(): Promise<void> {
  const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${ONESIGNAL_SDK_URL}"]`);
  if (existingScript?.dataset.loaded === "true") return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = existingScript ?? document.createElement("script");

    const handleLoad = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    const handleError = () => reject(new Error("OneSignal bağlantısı yüklenemedi."));

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });

    if (!existingScript) {
      script.src = ONESIGNAL_SDK_URL;
      script.defer = true;
      document.head.appendChild(script);
    }
  });
}

export function getOneSignalSnapshot(): OneSignalSnapshot {
  return snapshot;
}

export function subscribeToOneSignal(
  listener: (nextSnapshot: OneSignalSnapshot) => void
): () => void {
  listeners.add(listener);
  listener(snapshot);
  return () => listeners.delete(listener);
}

export async function initializeOneSignal(): Promise<OneSignalSdk> {
  if (sdk) return sdk;
  if (initPromise) return initPromise;

  if (!window.isSecureContext || !("serviceWorker" in navigator) || !("Notification" in window)) {
    emit({ isSupported: false, error: "Bu tarayıcı web bildirimlerini desteklemiyor." });
    throw new Error("Web push is not supported in this browser.");
  }

  initPromise = (async () => {
    window.OneSignalDeferred = window.OneSignalDeferred ?? [];
    const ready = new Promise<OneSignalSdk>((resolve, reject) => {
      window.OneSignalDeferred?.push(async (oneSignal) => {
        try {
          await oneSignal.init({
            appId: ONESIGNAL_APP_ID,
            allowLocalhostAsSecureOrigin: import.meta.env.DEV,
            autoResubscribe: true,
            notifyButton: { enable: false },
            serviceWorkerPath: ONESIGNAL_WORKER_PATH,
            serviceWorkerParam: { scope: ONESIGNAL_WORKER_SCOPE }
          });
          oneSignal.Notifications.setDefaultTitle("Bedri Usta Mannheim");
          oneSignal.Notifications.setDefaultUrl(window.location.origin);
          resolve(oneSignal);
        } catch (error) {
          reject(error);
        }
      });
    });

    await loadSdkScript();
    const oneSignal = await ready;
    sdk = oneSignal;
    registerObservers(oneSignal);
    syncFromSdk(oneSignal);
    return oneSignal;
  })().catch((error: unknown) => {
    initPromise = null;
    const message = error instanceof Error ? error.message : "OneSignal başlatılamadı.";
    emit({ error: message });
    throw error;
  });

  return initPromise;
}

export async function requestPushPermission(): Promise<OneSignalSnapshot> {
  const current = getOneSignalSnapshot();
  if (current.isIos && !isStandaloneDisplay()) {
    throw new Error("IOS_HOME_SCREEN_REQUIRED");
  }
  if (getBrowserPermission() === "denied") {
    throw new Error("PERMISSION_BLOCKED");
  }

  const oneSignal = await initializeOneSignal();
  if (!oneSignal.Notifications.isPushSupported()) {
    emit({ isSupported: false });
    throw new Error("PUSH_UNSUPPORTED");
  }

  await oneSignal.Notifications.requestPermission();
  if (getBrowserPermission() === "granted" && !oneSignal.User.PushSubscription.optedIn) {
    await oneSignal.User.PushSubscription.optIn();
  }

  syncFromSdk(oneSignal);
  return getOneSignalSnapshot();
}
