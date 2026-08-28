import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { CookieNotice } from "./components/CookieNotice";
import { LocalizationBoundary } from "./components/LocalizationBoundary";
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
  </StrictMode>
);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/service-worker.js", { scope: "/" });
  });
}
