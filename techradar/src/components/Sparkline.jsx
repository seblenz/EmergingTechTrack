/**
 * Sparkline — a tiny line chart showing 12 months of signal strength.
 * Used on the Watch List cards to give an at-a-glance trend view.
 * Built with Recharts' LineChart in a minimal configuration.
 */
import { LineChart, Line, ResponsiveContainer } from "recharts";

export default function Sparkline({ data, color = "#22d3ee", height = 40 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
