import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { CookieNotice } from "./components/CookieNotice";
import { AppUpdateNotice } from "./components/AppUpdateNotice";
import { registerServiceWorker } from "./appUpdate";
import { LocalizationBoundary } from "./components/LocalizationBoundary";
import "./fonts.css";
import "./styles.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <StrictMode>
    <LocalizationBoundary>
      <App />
    </LocalizationBoundary>
    <CookieNotice />
    <AppUpdateNotice />
  </StrictMode>
);

if (import.meta.env.PROD) {
  window.addEventListener("load", registerServiceWorker);
}
