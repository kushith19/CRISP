import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
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
          marginBottom: "8px",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          fontSize: "11px",
          fontWeight: 500,
        }}
      >
        {label}
      </p>
      {payload.map((p, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "4px",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: p.color,
              boxShadow: `0 0 8px ${p.color}`,
            }}
          />
          <p
            style={{
              fontWeight: 700,
              color: "var(--text-primary)",
              fontSize: "14px",
              display: "flex",
              gap: "6px",
              alignItems: "baseline",
            }}
          >
            {p.value}{" "}
            <span
              style={{
                color: "var(--text-muted)",
                fontSize: "12px",
                fontWeight: 500,
              }}
            >
              {p.name.toLowerCase()}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default function ContractChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barSize={24}>
        <XAxis
          dataKey="contract"
          tick={{ fill: "var(--text-muted)", fontSize: 11 }}
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
        <Legend
          iconType="circle"
          formatter={(v) => (
            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              {v}
            </span>
          )}
          wrapperStyle={{ paddingTop: "10px" }}
        />
        <Bar
          dataKey="churned"
          name="Churned"
          fill="#ef4444"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="retained"
          name="Retained"
          fill="#4f8ef7"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
