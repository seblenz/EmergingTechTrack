/**
 * main.jsx — Entry point for the React app.
 *
 * We wrap the App in a HashRouter (instead of BrowserRouter) because
 * GitHub Pages doesn't support server-side routing. HashRouter uses
 * the URL hash (#) to manage routes, which works perfectly for
 * static hosting like GitHub Pages.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);
