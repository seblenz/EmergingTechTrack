/**
 * TechDetail — the full detail view for a single technology.
 *
 * Sections:
 *  1. Header with name, domain, phase, and composite metrics
 *  2. Signal Profile: Four time-series charts (one per band) over 24 months
 *  3. Radar/Spider Chart: Four-axis view of current signal shape
 *  4. Phase Indicator: Visual progress bar showing emergence stage
 *  5. Governance Narrative: AI-generated assessment placeholder
 *  6. Cross-Border Characteristics
 */
import { useParams, Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import technologies from "../data/technologies";
import VelocityArrow from "../components/VelocityArrow";
import {
  getStrength,
  getVelocity,
  getBreadth,
  getPhaseLabel,
  getPhaseNumber,
  latestValue,
} from "../utils/metrics";
import "./TechDetail.css";

const BAND_CONFIG = [
  { key: "academic", label: "Academic / Technical", color: "#22d3ee" },
  { key: "builder", label: "Builder / Developer", color: "#4ade80" },
  { key: "capital", label: "Capital Investment", color: "#fbbf24" },
  { key: "discourse", label: "Public Discourse", color: "#e879f9" },
];

export default function TechDetail() {
  const { id } = useParams();
  const tech = technologies.find((t) => t.id === id);

  if (!tech) {
    return (
      <div className="detail-not-found">
        <h2>Technology not found</h2>
        <Link to="/">Back to Watch List</Link>
      </div>
    );
  }

  const strength = getStrength(tech);
  const velocity = getVelocity(tech);
  const breadth = getBreadth(tech);
  const phase = getPhaseNumber(tech.phase);
  const phaseLabel = getPhaseLabel(tech.phase);

  // Prepare radar chart data
  const radarData = BAND_CONFIG.map((band) => ({
    band: band.label.split(" / ")[0], // Short label
    value: latestValue(tech.signals[band.key]),
    fullMark: 100,
  }));

  // Prepare time-series data: merge all bands into one array for combined chart
  const timeSeriesData = tech.signals.academic.map((_, i) => ({
    date: tech.signals.academic[i].date,
    Academic: tech.signals.academic[i].value,
    Builder: tech.signals.builder[i].value,
    Capital: tech.signals.capital[i].value,
    Discourse: tech.signals.discourse[i].value,
  }));

  return (
    <div className="detail-page">
      {/* Back navigation */}
      <Link to="/" className="detail-back">
        &larr; Watch List
      </Link>

      {/* ── Header ──────────────────────────────────────── */}
      <div className="detail-header">
        <div className="detail-header-top">
          <span className="domain-tag" data-domain={tech.domain}>
            {tech.domain}
          </span>
          <span className="phase-badge" data-phase={phase}>
            Phase {phase} &middot; {phaseLabel}
          </span>
        </div>
        <h1 className="detail-title">{tech.name}</h1>
        <p className="detail-description">{tech.description}</p>

        {/* Composite Metrics Bar */}
        <div className="detail-metrics-bar">
          <div className="detail-metric-box">
            <span className="detail-metric-label">Signal Strength</span>
            <span className="detail-metric-value">{strength}</span>
            <div className="detail-metric-bar-track">
              <div
                className="detail-metric-bar-fill strength"
                style={{ width: `${strength}%` }}
              />
            </div>
          </div>
          <div className="detail-metric-box">
            <span className="detail-metric-label">Signal Velocity</span>
            <VelocityArrow velocity={velocity} />
          </div>
          <div className="detail-metric-box">
            <span className="detail-metric-label">Signal Breadth</span>
            <span className="detail-metric-value">{breadth}%</span>
            <div className="detail-metric-bar-track">
              <div
                className="detail-metric-bar-fill breadth"
                style={{ width: `${breadth}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Signal Profile: Combined Time-Series ────────── */}
      <div className="card-section mt-lg">
        <h2 className="card-section-title">Signal Profile — 24 Month Trend</h2>
        <div className="detail-chart-container">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#5a6478", fontSize: 11, fontFamily: "IBM Plex Mono" }}
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                interval={3}
              />
              <YAxis
                tick={{ fill: "#5a6478", fontSize: 11, fontFamily: "IBM Plex Mono" }}
                tickLine={false}
                axisLine={false}
                domain={[0, "auto"]}
              />
              <Tooltip
                contentStyle={{
                  background: "#1a2035",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  color: "#e8ecf4",
                  fontFamily: "IBM Plex Mono",
                  fontSize: 12,
                }}
              />
              <Legend
                wrapperStyle={{
                  fontFamily: "IBM Plex Mono",
                  fontSize: 11,
                }}
              />
              {BAND_CONFIG.map((band) => (
                <Line
                  key={band.key}
                  type="monotone"
                  dataKey={band.label.split(" / ")[0]}
                  stroke={band.color}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Individual Band Charts ──────────────────────── */}
      <div className="detail-band-grid mt-lg">
        {BAND_CONFIG.map((band) => (
          <div key={band.key} className="card-section">
            <h2 className="card-section-title" style={{ color: band.color }}>
              {band.label}
            </h2>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={tech.signals[band.key]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={false} axisLine={false} />
                <YAxis
                  tick={{ fill: "#5a6478", fontSize: 10, fontFamily: "IBM Plex Mono" }}
                  tickLine={false}
                  axisLine={false}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1a2035",
                    border: `1px solid ${band.color}33`,
                    borderRadius: 8,
                    color: "#e8ecf4",
                    fontFamily: "IBM Plex Mono",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={band.color}
                  strokeWidth={2}
                  dot={false}
                  fill={`${band.color}15`}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="band-current-value mono" style={{ color: band.color }}>
              Current: {latestValue(tech.signals[band.key])}
            </div>
          </div>
        ))}
      </div>

      {/* ── Radar/Spider Chart + Phase Indicator Row ────── */}
      <div className="detail-radar-phase-row mt-lg">
        {/* Radar Chart */}
        <div className="card-section detail-radar-card">
          <h2 className="card-section-title">Signal Profile Shape</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis
                dataKey="band"
                tick={{ fill: "#8892a8", fontSize: 11, fontFamily: "IBM Plex Mono" }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: "#5a6478", fontSize: 10 }}
                axisLine={false}
              />
              <Radar
                dataKey="value"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.25}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Phase Indicator */}
        <div className="card-section detail-phase-card">
          <h2 className="card-section-title">Emergence Phase</h2>
          <div className="phase-stages">
            {[
              { num: 1, label: "Research / Discovery", desc: "Labs, papers, patents" },
              { num: 2, label: "Builder Adoption", desc: "Developers building, capital flowing" },
              { num: 3, label: "Mainstream Diffusion", desc: "Broad public awareness" },
            ].map((stage) => (
              <div
                key={stage.num}
                className={`phase-stage ${phase >= stage.num ? "active" : ""} ${
                  phase === stage.num ? "current" : ""
                }`}
              >
                <div className="phase-stage-number">{stage.num}</div>
                <div className="phase-stage-info">
                  <div className="phase-stage-label">{stage.label}</div>
                  <div className="phase-stage-desc">{stage.desc}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Progress bar */}
          <div className="phase-progress-track mt-md">
            <div
              className="phase-progress-fill"
              style={{ width: `${((tech.phase - 1) / 2) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Governance Narrative ────────────────────────── */}
      <div className="card-section mt-lg">
        <h2 className="card-section-title">
          Potential Intergovernmental Governance Needs
        </h2>
        <div className="detail-ai-disclaimer">
          This assessment of governance relevance was generated by AI and is
          intended as a starting point for expert interpretation.
        </div>
        <div className="detail-narrative">
          {tech.governanceNarrative.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>

      {/* ── Cross-Border Characteristics ───────────────── */}
      <div className="card-section mt-lg mb-lg">
        <h2 className="card-section-title">Cross-Border Characteristics</h2>
        <div className="detail-narrative">
          <p>{tech.crossBorder}</p>
        </div>
      </div>
    </div>
  );
}
