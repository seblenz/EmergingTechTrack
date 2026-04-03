/**
 * Composite Metrics — computed from the four signal bands.
 *
 * These functions take a technology object and return derived values.
 * In a production system, these might be computed server-side;
 * here we compute them on-the-fly from the mock data.
 */

const BANDS = ["academic", "builder", "capital", "discourse"];

/**
 * Get the most recent value for a signal band.
 */
export function latestValue(series) {
  return series[series.length - 1].value;
}

/**
 * Signal Strength — aggregate activity level across all four bands.
 * We average the latest values from each band, normalized to 0–100.
 */
export function getStrength(tech) {
  const values = BANDS.map((b) => latestValue(tech.signals[b]));
  return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);
}

/**
 * Signal Velocity — rate of change over the last 6 months.
 * Positive = accelerating, negative = decelerating.
 * Returns a percentage change value.
 */
export function getVelocity(tech) {
  const recent = BANDS.map((b) => {
    const series = tech.signals[b];
    const now = series[series.length - 1].value;
    const sixMonthsAgo = series[series.length - 7].value;
    return sixMonthsAgo > 0 ? ((now - sixMonthsAgo) / sixMonthsAgo) * 100 : 0;
  });
  return Math.round(recent.reduce((sum, v) => sum + v, 0) / recent.length);
}

/**
 * Signal Breadth — how evenly distributed activity is across bands.
 * Uses normalized entropy. 1.0 = perfectly even, 0.0 = all in one band.
 * Returns a value from 0 to 100.
 */
export function getBreadth(tech) {
  const values = BANDS.map((b) => latestValue(tech.signals[b]));
  const total = values.reduce((sum, v) => sum + v, 0);
  if (total === 0) return 0;

  const probs = values.map((v) => v / total);
  const entropy = -probs.reduce((sum, p) => (p > 0 ? sum + p * Math.log2(p) : sum), 0);
  const maxEntropy = Math.log2(BANDS.length); // log2(4) = 2
  return Math.round((entropy / maxEntropy) * 100);
}

/**
 * Get the last 12 months of average strength for sparkline display.
 */
export function getSparklineData(tech) {
  const length = tech.signals.academic.length;
  const start = Math.max(0, length - 12);
  return Array.from({ length: length - start }, (_, i) => {
    const idx = start + i;
    const avg =
      BANDS.reduce((sum, b) => sum + tech.signals[b][idx].value, 0) / BANDS.length;
    return { month: tech.signals.academic[idx].date, value: Math.round(avg) };
  });
}

/**
 * Get the phase label text.
 */
export function getPhaseLabel(phase) {
  if (phase <= 1.5) return "Research / Discovery";
  if (phase <= 2.5) return "Builder Adoption";
  return "Mainstream Diffusion";
}

/**
 * Get phase number for display (1, 2, or 3).
 */
export function getPhaseNumber(phase) {
  if (phase <= 1.5) return 1;
  if (phase <= 2.5) return 2;
  return 3;
}
