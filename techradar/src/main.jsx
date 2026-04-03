/**
 * main.jsx — Entry point for the React app.
 *
 * We use BrowserRouter with a basename matching our GitHub Pages path.
 * Combined with a 404.html redirect trick (see public/404.html),
 * this gives us clean URLs on GitHub Pages.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename="/EmergingTechTrack">
      <App />
    </BrowserRouter>
  </StrictMode>
);
