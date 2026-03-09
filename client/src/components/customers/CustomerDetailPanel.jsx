import { motion } from "framer-motion";
import { X, HelpCircle } from "lucide-react";
import RiskBadge from "./RiskBadge";

export default function CustomerDetailPanel({ customer, onClose, onShowShap }) {
  if (!customer) return null;
  const f = customer.customerFeatures || {};
  const color =
    customer.churnProbability > 0.7
      ? "var(--danger)"
      : customer.churnProbability > 0.4
        ? "var(--warning)"
        : "var(--success)";

  return (
    <motion.div
      initial={{ opacity: 0, x: 340 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 340 }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
      style={{
        width: 340,
        flexShrink: 0,
        borderLeft: "1px solid var(--border)",
        background: "var(--bg-secondary)",
        padding: "24px",
        overflowY: "auto",
        position: "absolute",
        top: 16,
        right: 16,
        bottom: 16,
        zIndex: 10,
        borderRadius: "16px",
        boxShadow: "-4px 0 24px rgba(0,0,0,0.3)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h3 style={{ fontSize: "15px", fontWeight: 600 }}>
          Customer #{customer.customerIndex}
        </h3>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Risk score */}
      <div
        style={{
          padding: "20px",
          borderRadius: "10px",
          border: `1px solid ${color}30`,
          background: `${color}08`,
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            color: "var(--text-muted)",
            marginBottom: "8px",
            textTransform: "uppercase",
            letterSpacing: "0.8px",
          }}
        >
          Churn Probability
        </p>
        <p
          style={{
            fontSize: "36px",
            fontWeight: 700,
            color,
            letterSpacing: "-1px",
          }}
        >
          {(customer.churnProbability * 100).toFixed(1)}%
        </p>
        <RiskBadge level={customer.riskLevel} />
      </div>

      {/* Attributes */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {[
          ["Contract", f.Contract],
          ["Tenure", `${f.tenure} months`],
          ["Monthly Charges", `${f.MonthlyCharges}`],
          ["Total Charges", `${f.TotalCharges}`],
          ["Internet Service", f.InternetService],
          ["Payment Method", f.PaymentMethod],
          ["Senior Citizen", f.SeniorCitizen ? "Yes" : "No"],
          ["Partner", f.Partner],
          ["Dependents", f.Dependents],
          ["Online Security", f.OnlineSecurity],
          ["Tech Support", f.TechSupport],
          ["Multiple Lines", f.MultipleLines],
        ].map(
          ([k, v]) =>
            v !== undefined && (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  fontSize: "13px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--bg-card)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <span style={{ color: "var(--text-muted)" }}>{k}</span>
                <span style={{ fontWeight: 500 }}>{v}</span>
              </div>
            ),
        )}

        {customer.shapExplanation?.length > 0 && (
          <div
            style={{
              marginTop: "20px",
              paddingTop: "16px",
              borderTop: "1px solid var(--border)",
            }}
          >
            <button
              onClick={() => onShowShap(customer)}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "12px",
                cursor: "pointer",
                border: "1px solid rgba(139,92,246,0.3)",
                background:
                  "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.1))",
                color: "#a78bfa",
                fontSize: "13px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.2s",
                letterSpacing: "0.2px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.2))";
                e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 16px rgba(139,92,246,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.1))";
                e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <HelpCircle size={15} />
              Check Why
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
