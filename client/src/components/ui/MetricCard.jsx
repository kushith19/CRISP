import { motion } from "framer-motion";
import { TrendingUp, TrendingDown as DownIcon } from "lucide-react";

export default function MetricCard({
  label,
  value,
  sub,
  icon,
  color = "var(--accent)",
  index = 0,
  trend = null,
}) {
  // Demo trends to make it look realistic if one isn't passed
  const fallbackTrend = index === 1 ? -2.4 : index === 0 ? 1.2 : 4.5;
  const actualTrend = trend !== null ? trend : fallbackTrend;
  const isPositive = actualTrend > 0;
  const isChurn = index === 1; // churn rate is good when down
  const isGood = isChurn ? !isPositive : isPositive;

  const trendColor = isGood ? "var(--success)" : "var(--danger)";
  const TrendIcon = isPositive ? TrendingUp : DownIcon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -2, boxShadow: "0 8px 30px -4px rgba(0,0,0,0.2)" }}
      style={{
        padding: "24px",
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        background:
          "linear-gradient(145deg, rgba(20,20,20, 0.9) 0%, rgba(30,30,30, 0.7) 100%)",
        transition: "all 0.2s",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "120px",
          height: "120px",
          background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
          transform: "translate(30%, -30%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "16px",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-muted)",
            fontWeight: 500,
          }}
        >
          {label}
        </p>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "8px",
            background: `${color}15`,
            border: `1px solid ${color}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 12px ${color}10`,
          }}
        >
          {icon}
        </div>
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "12px" }}>
          <p
            style={{
              fontSize: "32px",
              fontWeight: 700,
              letterSpacing: "-1px",
              color: "var(--text-primary)",
              lineHeight: 1,
            }}
          >
            {value}
          </p>
        </div>
        {sub && (
          <p
            style={{
              fontSize: "13px",
              color: "var(--text-muted)",
              marginTop: "8px",
            }}
          >
            {sub}
          </p>
        )}
      </div>
    </motion.div>
  );
}
