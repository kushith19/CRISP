const ProbabilityBar = ({ value }) => {
  const color = value > 0.7 ? "#ef4444" : value > 0.4 ? "#f59e0b" : "#22c55e";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div
        style={{
          width: 60,
          height: 4,
          borderRadius: 2,
          background: "var(--border)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${value * 100}%`,
            height: "100%",
            background: color,
            borderRadius: 2,
          }}
        />
      </div>
      <span
        style={{
          fontSize: "13px",
          fontFamily: "JetBrains Mono, monospace",
          color,
        }}
      >
        {(value * 100).toFixed(1)}%
      </span>
    </div>
  );
};

export default ProbabilityBar;
