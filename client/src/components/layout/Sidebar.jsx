import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, UploadCloud, Settings } from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: <LayoutDashboard size={17} />, label: "Dashboard" },
  { to: "/customers", icon: <Users size={17} />, label: "Customers" },
  { to: "/upload", icon: <UploadCloud size={17} />, label: "Upload" },
  { to: "/settings", icon: <Settings size={17} />, label: "Settings" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside
      style={{
        width: 220,
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
        borderRight: "1px solid rgba(255, 255, 255, 0.05)",
        background:
          "linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)",
        display: "flex",
        flexDirection: "column",
        padding: "0 12px",
        boxShadow: "1px 0 20px rgba(0,0,0,0.1)",
        zIndex: 10,
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          height: 72,
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "0 12px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4f8ef7 0%, #3174f1 100%)",
            padding: "2px", // space for border
          }}
        >
          <img
            src="/churn_logo.png"
            alt="CRISP"
            style={{
              height: "100%",
              width: "100%",
              borderRadius: "50%",
              objectFit: "cover",
              background: "#fff",
            }}
          />
        </div>
        <span
          style={{
            fontSize: "15px",
            fontWeight: 700,
            letterSpacing: "-0.3px",
            color: "var(--text-primary)",
          }}
        >
          CRISP
        </span>
      </Link>

      {/* Nav */}
      <nav
        style={{
          paddingTop: "24px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        {navItems.map(({ to, icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 14px",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: active ? 500 : 400,
                color: active ? "var(--text-primary)" : "var(--text-muted)",
                background: active ? "rgba(79,142,247,0.08)" : "transparent",
                borderLeft: active
                  ? "3px solid #4f8ef7"
                  : "3px solid transparent",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--text-muted)";
                }
              }}
            >
              <span
                style={{
                  color: active ? "#4f8ef7" : "inherit",
                }}
              >
                {icon}
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      <div
        style={{
          padding: "24px 12px",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          fontSize: "12px",
          color: "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>CRISP v1.1.0</span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 8px #22c55e",
            }}
          />
          <span style={{ fontSize: "10px" }}>Online</span>
        </span>
      </div>
    </aside>
  );
}
