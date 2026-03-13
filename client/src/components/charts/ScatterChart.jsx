import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background:
          "linear-gradient(145deg, rgba(20,20,20, 0.95) 0%, rgba(30,30,30, 0.85) 100%)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "12px",
        padding: "12px 16px",
        fontSize: "13px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
        backdropFilter: "blur(10px)",
      }}
    >
      <p
        style={{
          color: "var(--text-muted)",
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        Monthly Charges
      </p>
      <p
        style={{
          fontWeight: 700,
          fontSize: "15px",
          color: "var(--text-primary)",
          marginBottom: "8px",
        }}
      >
        ${payload[0]?.value.toFixed(2)}
      </p>
      <p
        style={{
          color: "var(--text-muted)",
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        Churn Probability
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#ef4444",
            boxShadow: "0 0 8px #ef4444",
          }}
        />
        <p style={{ fontWeight: 700, fontSize: "15px", color: "#ef4444" }}>
          {(payload[1]?.value * 100).toFixed(1)}%
        </p>
      </div>
    </div>
  );
};

export default function MonthlyChargesScatter({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
        <XAxis
          dataKey="charges"
          name="Monthly Charges"
          unit="$"
          tick={{ fill: "var(--text-muted)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          dy={10}
        />
        <YAxis
          dataKey="probability"
          name="Churn Prob"
          tick={{ fill: "var(--text-muted)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          dx={-10}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ strokeDasharray: "3 3", stroke: "rgba(255,255,255,0.1)" }}
        />
        <Scatter
          data={data}
          fill="#ef4444"
          fillOpacity={0.4}
          stroke="#ef4444"
          strokeWidth={1}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
