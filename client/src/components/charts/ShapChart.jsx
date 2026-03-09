import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const isRisk = d.shap_value > 0;
  return (
    <div style={{
      background: "var(--bg-card)",
      border: `1px solid ${isRisk ? "#ef444440" : "#22c55e40"}`,
      borderRadius: "8px", padding: "10px 14px",
      fontSize: "13px", maxWidth: 220,
    }}>
      <p style={{ fontWeight: 600, marginBottom: "6px", color: "var(--text-primary)", lineHeight: 1.4 }}>
        {d.feature}
      </p>
      <p style={{ color: isRisk ? "#ef4444" : "#22c55e", fontFamily: "JetBrains Mono, monospace", fontSize: "12px" }}>
        {isRisk ? "+" : ""}{d.shap_value.toFixed(4)}
      </p>
      <p style={{ color: "var(--text-muted)", fontSize: "11px", marginTop: "4px" }}>
        {isRisk ? "↑ Pushes toward churn" : "↓ Reduces churn risk"}
      </p>
    </div>
  );
};

const cleanFeatureName = (name) => {
  let cleaned = name.replace(/^(num|cat|bin|ord|pass|remainder)__/, "");
  cleaned = cleaned.replace(/_/g, " ");
  return cleaned;
};

export default function ShapChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <p style={{ color: "var(--text-muted)", fontSize: "13px", textAlign: "center", padding: "20px 0" }}>
        No explanation available
      </p>
    );
  }

  const normalised = data.map((d) => ({
    feature: cleanFeatureName(d.feature || ""),
    shap_value: d.shap_value ?? d.shapValue ?? 0,
  }));

  const sorted = [...normalised].sort(
    (a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value)
  );

  const chartHeight = sorted.length * 36 + 20;

  return (
    <div>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart data={sorted} layout="vertical" barSize={12}
          margin={{ left: 0, right: 32, top: 4, bottom: 4 }}>
          <XAxis type="number"
            tick={{ fill: "var(--text-muted)", fontSize: 10 }}
            axisLine={false} tickLine={false}
            tickFormatter={(v) => v.toFixed(2)} />
          <YAxis dataKey="feature" type="category"
            tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
            axisLine={false} tickLine={false} width={150}
            tickFormatter={(v) => v.length > 22 ? v.slice(0, 20) + "…" : v} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
          <ReferenceLine x={0} stroke="var(--border-bright)" strokeWidth={1} />
          <Bar dataKey="shap_value" radius={[0, 4, 4, 0]}>
            {sorted.map((entry, i) => (
              <Cell key={i}
                fill={entry.shap_value > 0 ? "#ef4444" : "#22c55e"}
                fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <p style={{
        textAlign: "center", fontSize: "10px", color: "var(--text-muted)",
        marginTop: "4px", letterSpacing: "0.3px",
      }}>
        ← reduces churn &nbsp;|&nbsp; increases churn →
      </p>
    </div>
  );
}