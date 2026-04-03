/**
 * VelocityArrow — displays a velocity value with an up/down/flat arrow.
 * Positive velocity = green up arrow, negative = red down, near-zero = neutral.
 */
export default function VelocityArrow({ velocity }) {
  const isPositive = velocity > 3;
  const isNegative = velocity < -3;
  const arrow = isPositive ? "\u2191" : isNegative ? "\u2193" : "\u2192";
  const className = isPositive ? "positive" : isNegative ? "negative" : "neutral";

  return (
    <span className={`velocity-indicator ${className}`}>
      {arrow} {velocity > 0 ? "+" : ""}
      {velocity}%
    </span>
  );
}
