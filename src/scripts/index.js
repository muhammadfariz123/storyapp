// CSS imports
import "../styles/styles.css";

import App from "./pages/app";
import { registerServiceWorker } from "./utils";

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });
  await app.renderPage();

  await registerServiceWorker();
  // for demonstration purpose-only
  console.log("Berhasil mendaftarkan service worker.");

  window.addEventListener("hashchange", async () => {
    await app.renderPage();
  });
});
