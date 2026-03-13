import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

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
        Month {label}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#4f8ef7",
          }}
        />
        <p
          style={{
            fontWeight: 700,
            color: "var(--text-primary)",
            fontSize: "15px",
          }}
        >
          {payload[0].value}%{" "}
          <span
            style={{
              color: "var(--text-muted)",
              fontSize: "12px",
              fontWeight: 500,
              marginLeft: "4px",
            }}
          >
            churn rate
          </span>
        </p>
      </div>
    </div>
  );
};

export default function TenureLineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorChurn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4f8ef7" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#4f8ef7" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          stroke="rgba(255,255,255,0.05)"
          strokeDasharray="3 3"
          vertical={false}
        />
        <XAxis
          dataKey="tenure"
          tick={{ fill: "var(--text-muted)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          dy={10}
        />
        <YAxis
          tick={{ fill: "var(--text-muted)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          unit="%"
          dx={-10}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{
            stroke: "rgba(255,255,255,0.1)",
            strokeWidth: 1,
            strokeDasharray: "4 4",
          }}
        />
        <Area
          type="monotone"
          dataKey="churnRate"
          stroke="#4f8ef7"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorChurn)"
          activeDot={{
            r: 6,
            fill: "#4f8ef7",
            stroke: "#fff",
            strokeWidth: 2,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
