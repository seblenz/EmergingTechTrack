/**
 * WatchList — the landing page of TechRadar.
 *
 * Displays all tracked technologies as cards in a grid.
 * Users can:
 *  - Sort by velocity (default), strength, breadth, or phase
 *  - Filter by domain (AI, Quantum, Biotech, etc.)
 *
 * This is what policymakers see first — a ranked overview of
 * what's moving fastest in the technology landscape.
 */
import { useState, useMemo } from "react";
import technologies from "../data/technologies";
import TechCard from "../components/TechCard";
import { getStrength, getVelocity, getBreadth, getPhaseNumber } from "../utils/metrics";
import "./WatchList.css";

// Extract unique domains from the data for filter buttons
const domains = [...new Set(technologies.map((t) => t.domain))];

const sortOptions = [
  { key: "velocity", label: "Velocity" },
  { key: "strength", label: "Strength" },
  { key: "breadth", label: "Breadth" },
  { key: "phase", label: "Phase" },
];

export default function WatchList() {
  const [sortBy, setSortBy] = useState("velocity");
  const [filterDomain, setFilterDomain] = useState(null);

  // Compute, filter, and sort technologies
  const sorted = useMemo(() => {
    let list = technologies;

    // Apply domain filter
    if (filterDomain) {
      list = list.filter((t) => t.domain === filterDomain);
    }

    // Sort by selected metric (descending)
    const sorters = {
      velocity: (a, b) => getVelocity(b) - getVelocity(a),
      strength: (a, b) => getStrength(b) - getStrength(a),
      breadth: (a, b) => getBreadth(b) - getBreadth(a),
      phase: (a, b) => getPhaseNumber(b.phase) - getPhaseNumber(a.phase),
    };

    return [...list].sort(sorters[sortBy]);
  }, [sortBy, filterDomain]);

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">Watch List</h1>
        <p className="page-subtitle">
          Emerging technologies ranked by signal activity. Monitoring{" "}
          {technologies.length} technologies across {domains.length} domains.
        </p>
      </div>

      {/* Toolbar: sort + domain filter */}
      <div className="toolbar">
        {/* Sort controls */}
        <span className="sort-label">Sort by</span>
        <div className="filter-group">
          {sortOptions.map((opt) => (
            <button
              key={opt.key}
              className={`filter-btn ${sortBy === opt.key ? "active" : ""}`}
              onClick={() => setSortBy(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Separator */}
        <span className="sort-label" style={{ marginLeft: "auto" }}>
          Filter
        </span>

        {/* Domain filters */}
        <div className="filter-group">
          <button
            className={`filter-btn ${filterDomain === null ? "active" : ""}`}
            onClick={() => setFilterDomain(null)}
          >
            All
          </button>
          {domains.map((d) => (
            <button
              key={d}
              className={`filter-btn ${filterDomain === d ? "active" : ""}`}
              onClick={() => setFilterDomain(d)}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Technology grid */}
      <div className="watch-grid">
        {sorted.map((tech) => (
          <TechCard key={tech.id} tech={tech} />
        ))}
      </div>
    </div>
  );
}
