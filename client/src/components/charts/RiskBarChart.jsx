import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = { High: "#ef4444", Medium: "#f59e0b", Low: "#22c55e" };

const CustomTooltip = ({ active, payload, label }) => {
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
        {label} Risk
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: payload[0].fill,
            boxShadow: `0 0 8px ${payload[0].fill}`,
          }}
        />
        <p
          style={{
            fontWeight: 700,
            color: "var(--text-primary)",
            fontSize: "15px",
          }}
        >
          {payload[0].value}{" "}
          <span
            style={{
              color: "var(--text-muted)",
              fontSize: "12px",
              fontWeight: 500,
              marginLeft: "4px",
            }}
          >
            customers
          </span>
        </p>
      </div>
    </div>
  );
};

export default function RiskBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barSize={40}>
        <XAxis
          dataKey="name"
          tick={{ fill: "var(--text-muted)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          dy={10}
        />
        <YAxis
          tick={{ fill: "var(--text-muted)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          dx={-10}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "rgba(255,255,255,0.03)" }}
        />
        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={COLORS[entry.name] || "var(--accent)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
