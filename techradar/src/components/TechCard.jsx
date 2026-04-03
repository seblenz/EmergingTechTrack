/**
 * TechCard — a single technology on the Watch List.
 * Shows: name, domain tag, phase, sparkline, velocity, breadth, and strength.
 * Clicking navigates to the detail view via React Router.
 */
import { Link } from "react-router-dom";
import Sparkline from "./Sparkline";
import VelocityArrow from "./VelocityArrow";
import {
  getStrength,
  getVelocity,
  getBreadth,
  getSparklineData,
  getPhaseNumber,
} from "../utils/metrics";
import "./TechCard.css";

export default function TechCard({ tech }) {
  const strength = getStrength(tech);
  const velocity = getVelocity(tech);
  const breadth = getBreadth(tech);
  const sparkData = getSparklineData(tech);
  const phase = getPhaseNumber(tech.phase);

  return (
    <Link to={`/tech/${tech.id}`} className="tech-card card">
      {/* Top row: domain + phase */}
      <div className="tech-card-tags">
        <span className="domain-tag" data-domain={tech.domain}>
          {tech.domain}
        </span>
        <span className="phase-badge" data-phase={phase}>
          Phase {phase}
        </span>
      </div>

      {/* Technology name */}
      <h3 className="tech-card-name">{tech.name}</h3>

      {/* Sparkline: 12-month signal strength trend */}
      <div className="tech-card-sparkline">
        <Sparkline data={sparkData} />
      </div>

      {/* Metrics row */}
      <div className="tech-card-metrics">
        <div className="tech-card-metric">
          <span className="tech-card-metric-label">Velocity</span>
          <VelocityArrow velocity={velocity} />
        </div>
        <div className="tech-card-metric">
          <span className="tech-card-metric-label">Strength</span>
          <span className="mono" style={{ color: "var(--text-primary)" }}>
            {strength}
          </span>
        </div>
        <div className="tech-card-metric">
          <span className="tech-card-metric-label">Breadth</span>
          <span className="mono" style={{ color: "var(--text-primary)" }}>
            {breadth}%
          </span>
        </div>
      </div>

      {/* Pulse overlay for high-velocity technologies */}
      {velocity > 20 && <div className="tech-card-pulse" />}
    </Link>
  );
}
