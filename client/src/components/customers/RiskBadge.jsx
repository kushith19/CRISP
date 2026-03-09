import { AlertTriangle, CheckCircle, Minus } from "lucide-react";

const RiskBadge = ({ level }) => {
  const styles = {
    High: {
      bg: "rgba(239,68,68,0.1)",
      color: "#ef4444",
      icon: <AlertTriangle size={11} />,
    },
    Medium: {
      bg: "rgba(245,158,11,0.1)",
      color: "#f59e0b",
      icon: <Minus size={11} />,
    },
    Low: {
      bg: "rgba(34,197,94,0.1)",
      color: "#22c55e",
      icon: <CheckCircle size={11} />,
    },
  };
  const s = styles[level] || styles.Low;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 10px",
        borderRadius: "100px",
        background: s.bg,
        color: s.color,
        fontSize: "12px",
        fontWeight: 500,
      }}
    >
      {s.icon} {level}
    </span>
  );
};

export default RiskBadge;
