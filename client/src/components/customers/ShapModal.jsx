import { motion } from "framer-motion";
import { X } from "lucide-react";
import ShapChart from "../charts/ShapChart";

export default function ShapModal({ customer, onClose }) {
  if (!customer) return null;
  const color =
    customer.churnProbability > 0.7
      ? "#ef4444"
      : customer.churnProbability > 0.4
        ? "#f59e0b"
        : "#22c55e";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 30 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 600,
          maxHeight: "85vh",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-bright)",
          borderRadius: "20px",
          boxShadow:
            "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 28px 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 700,
                letterSpacing: "-0.3px",
                marginBottom: "4px",
              }}
            >
              Why this score?
            </h2>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              Customer #{customer.customerIndex} ·{" "}
              <span style={{ color, fontWeight: 600 }}>
                {(customer.churnProbability * 100).toFixed(1)}% churn risk
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "8px",
              cursor: "pointer",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-card-hover)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--bg-card)";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Chart body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px 28px" }}>
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-muted)",
              marginBottom: "20px",
              lineHeight: 1.6,
              padding: "12px 16px",
              borderRadius: "10px",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            Each bar shows how much a feature pushes the prediction.
            <span style={{ color: "#ef4444", fontWeight: 600 }}> Red</span> =
            increases churn risk ·
            <span style={{ color: "#22c55e", fontWeight: 600 }}> Green</span> =
            reduces churn risk. Longer bars = stronger influence.
          </p>
          <ShapChart data={customer.shapExplanation} />
        </div>
      </motion.div>
    </motion.div>
  );
}
