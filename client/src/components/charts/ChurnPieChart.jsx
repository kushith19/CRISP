import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#ef4444", "#22c55e"];

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
          marginBottom: "4px",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          fontSize: "11px",
          fontWeight: 500,
        }}
      >
        {payload[0].name}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: payload[0].color,
            boxShadow: `0 0 8px ${payload[0].color}`,
          }}
        />
        <p
          style={{
            fontWeight: 700,
            color: "var(--text-primary)",
            fontSize: "15px",
          }}
        >
          {payload[0].value.toLocaleString()}
          <span
            style={{
              color: "var(--text-muted)",
              fontSize: "12px",
              fontWeight: 500,
              marginLeft: "6px",
            }}
          >
            ({((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}
            %)
          </span>
        </p>
      </div>
    </div>
  );
};

export default function ChurnPieChart({ data }) {
  const total = data.reduce((a, b) => a + b.value, 0);
  const enriched = data.map((d) => ({ ...d, total }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={enriched}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
        >
          {enriched.map((_, i) => (
            <Cell
              key={i}
              fill={COLORS[i % COLORS.length]}
              stroke="rgba(20,20,20,0.8)"
              strokeWidth={3}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
        <Legend
          iconType="circle"
          wrapperStyle={{ paddingTop: "20px" }}
          formatter={(value) => (
            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
