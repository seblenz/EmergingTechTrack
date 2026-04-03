/**
 * App — Root component with layout and routing.
 *
 * Layout structure:
 *   Header (sticky top bar with logo + navigation)
 *   Main content area (pages swap here via React Router)
 *   Footer
 *
 * React Router handles three routes:
 *   /           → Watch List (landing page)
 *   /tech/:id   → Technology Detail
 *   /compare    → Comparison View
 */
import { Routes, Route, NavLink } from "react-router-dom";
import WatchList from "./pages/WatchList";
import TechDetail from "./pages/TechDetail";
import Compare from "./pages/Compare";

function App() {
  return (
    <div className="app-layout">
      {/* ── Header ──────────────────────────────────────── */}
      <header className="app-header">
        <NavLink to="/" className="app-logo" style={{ textDecoration: "none" }}>
          <div className="app-logo-icon" />
          <div>
            <div className="app-logo-text">TechRadar</div>
            <div className="app-logo-subtitle">Emerging Technology Monitor</div>
          </div>
        </NavLink>

        <nav className="app-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Watch List
          </NavLink>
          <NavLink
            to="/compare"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Compare
          </NavLink>
        </nav>
      </header>

      {/* ── Main Content ────────────────────────────────── */}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<WatchList />} />
          <Route path="/tech/:id" element={<TechDetail />} />
          <Route path="/compare" element={<Compare />} />
        </Routes>
      </main>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="app-footer">
        TechRadar Prototype &middot; Emerging Technology Early Warning System
        &middot; Data is simulated for demonstration purposes
      </footer>
    </div>
  );
}

export default App;
