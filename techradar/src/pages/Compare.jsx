/**
 * Compare — side-by-side comparison of 2–3 technologies.
 *
 * Users select technologies from a dropdown, then see their
 * signal profiles overlaid on the same charts plus a comparative
 * radar chart and metrics table.
 */
import { useState, useMemo } from "react";
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
  getPhaseNumber,
  getPhaseLabel,
  latestValue,
} from "../utils/metrics";
import "./Compare.css";

const COMPARE_COLORS = ["#22d3ee", "#e879f9", "#fbbf24"];
const BANDS = ["academic", "builder", "capital", "discourse"];
const BAND_LABELS = {
  academic: "Academic",
  builder: "Builder",
  capital: "Capital",
  discourse: "Discourse",
};

export default function Compare() {
  const [selected, setSelected] = useState([
    technologies[0].id,
    technologies[1].id,
  ]);

  const selectedTechs = useMemo(
    () => selected.map((id) => technologies.find((t) => t.id === id)).filter(Boolean),
    [selected]
  );

  function updateSelection(index, newId) {
    setSelected((prev) => {
      const next = [...prev];
      next[index] = newId;
      return next;
    });
  }

  function addSlot() {
    if (selected.length < 3) {
      const unused = technologies.find((t) => !selected.includes(t.id));
      if (unused) setSelected((prev) => [...prev, unused.id]);
    }
  }

  function removeSlot(index) {
    if (selected.length > 2) {
      setSelected((prev) => prev.filter((_, i) => i !== index));
    }
  }

  // Prepare overlaid time-series data (strength average per month)
  const timeSeriesData = useMemo(() => {
    if (selectedTechs.length === 0) return [];
    return selectedTechs[0].signals.academic.map((_, i) => {
      const point = { date: selectedTechs[0].signals.academic[i].date };
      selectedTechs.forEach((tech) => {
        const avg =
          BANDS.reduce((sum, b) => sum + tech.signals[b][i].value, 0) / BANDS.length;
        point[tech.name] = Math.round(avg);
      });
      return point;
    });
  }, [selectedTechs]);

  // Prepare radar data
  const radarData = useMemo(() => {
    return BANDS.map((band) => {
      const point = { band: BAND_LABELS[band] };
      selectedTechs.forEach((tech) => {
        point[tech.name] = latestValue(tech.signals[band]);
      });
      return point;
    });
  }, [selectedTechs]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Compare Technologies</h1>
        <p className="page-subtitle">
          Select 2–3 technologies to compare their signal profiles side by side.
        </p>
      </div>

      {/* Selection controls */}
      <div className="compare-selectors">
        {selected.map((id, index) => (
          <div key={index} className="compare-selector">
            <span
              className="compare-color-dot"
              style={{ background: COMPARE_COLORS[index] }}
            />
            <select
              value={id}
              onChange={(e) => updateSelection(index, e.target.value)}
              className="compare-select"
            >
              {technologies.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            {selected.length > 2 && (
              <button
                className="compare-remove-btn"
                onClick={() => removeSlot(index)}
              >
                &times;
              </button>
            )}
          </div>
        ))}
        {selected.length < 3 && (
          <button className="filter-btn" onClick={addSlot}>
            + Add Technology
          </button>
        )}
      </div>

      {/* Metrics comparison table */}
      <div className="card-section mt-lg">
        <h2 className="card-section-title">Composite Metrics</h2>
        <div className="compare-metrics-table">
          <div className="compare-metrics-header">
            <span />
            {selectedTechs.map((tech, i) => (
              <span key={tech.id} style={{ color: COMPARE_COLORS[i] }}>
                {tech.name}
              </span>
            ))}
          </div>
          {[
            {
              label: "Strength",
              fn: getStrength,
              render: (v) => v,
            },
            {
              label: "Velocity",
              fn: getVelocity,
              render: (v) => <VelocityArrow velocity={v} />,
            },
            {
              label: "Breadth",
              fn: getBreadth,
              render: (v) => `${v}%`,
            },
            {
              label: "Phase",
              fn: (t) => getPhaseNumber(t.phase),
              render: (v, tech) =>
                `${v} — ${getPhaseLabel(tech.phase)}`,
            },
          ].map((metric) => (
            <div key={metric.label} className="compare-metrics-row">
              <span className="compare-metrics-label">{metric.label}</span>
              {selectedTechs.map((tech) => (
                <span key={tech.id} className="mono">
                  {metric.render(metric.fn(tech), tech)}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Overlaid Signal Strength Chart */}
      <div className="card-section mt-lg">
        <h2 className="card-section-title">
          Signal Strength Comparison — 24 Months
        </h2>
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
              wrapperStyle={{ fontFamily: "IBM Plex Mono", fontSize: 11 }}
            />
            {selectedTechs.map((tech, i) => (
              <Line
                key={tech.id}
                type="monotone"
                dataKey={tech.name}
                stroke={COMPARE_COLORS[i]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Comparative Radar Chart */}
      <div className="card-section mt-lg mb-lg">
        <h2 className="card-section-title">Signal Profile Shape Comparison</h2>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis
              dataKey="band"
              tick={{ fill: "#8892a8", fontSize: 12, fontFamily: "IBM Plex Mono" }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: "#5a6478", fontSize: 10 }}
              axisLine={false}
            />
            {selectedTechs.map((tech, i) => (
              <Radar
                key={tech.id}
                name={tech.name}
                dataKey={tech.name}
                stroke={COMPARE_COLORS[i]}
                fill={COMPARE_COLORS[i]}
                fillOpacity={0.12}
                strokeWidth={2}
              />
            ))}
            <Legend
              wrapperStyle={{ fontFamily: "IBM Plex Mono", fontSize: 11 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
