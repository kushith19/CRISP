import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronUp, ChevronDown } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getCustomers } from "../services/api";
import RiskBadge from "../components/customers/RiskBadge";
import ProbabilityBar from "../components/customers/ProbabilityBar";
import CustomerDetailPanel from "../components/customers/CustomerDetailPanel";
import ShapModal from "../components/customers/ShapModal";

// Demo customers
const DEMO_CUSTOMERS = Array.from({ length: 40 }, (_, i) => ({
  _id: String(i),
  customerIndex: i + 1,
  churnProbability: parseFloat(Math.random().toFixed(3)),
  riskLevel: ["High", "High", "Medium", "Medium", "Low"][
    Math.floor(Math.random() * 5)
  ],
  customerFeatures: {
    Contract: ["Month-to-month", "One year", "Two year"][
      Math.floor(Math.random() * 3)
    ],
    tenure: Math.floor(Math.random() * 72) + 1,
    MonthlyCharges: parseFloat((20 + Math.random() * 100).toFixed(2)),
    InternetService: ["Fiber optic", "DSL", "No"][
      Math.floor(Math.random() * 3)
    ],
    TotalCharges: parseFloat((100 + Math.random() * 5000).toFixed(2)),
    PaymentMethod: [
      "Electronic check",
      "Credit card",
      "Bank transfer",
      "Mailed check",
    ][Math.floor(Math.random() * 4)],
    SeniorCitizen: Math.random() > 0.8 ? 1 : 0,
    Partner: Math.random() > 0.5 ? "Yes" : "No",
    Dependents: Math.random() > 0.5 ? "Yes" : "No",
    PhoneService: "Yes",
    MultipleLines: Math.random() > 0.5 ? "Yes" : "No",
    OnlineSecurity: Math.random() > 0.5 ? "Yes" : "No",
    TechSupport: Math.random() > 0.5 ? "Yes" : "No",
  },
}));

export default function CustomersPage() {
  const [customers, setCustomers] = useState(DEMO_CUSTOMERS);
  const [selected, setSelected] = useState(null);
  const [shapCustomer, setShapCustomer] = useState(null);
  const [riskFilter, setRiskFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortDir, setSortDir] = useState("desc");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const res = await getCustomers({ riskLevel: riskFilter, limit: 200 });
        if (res.data.customers?.length > 0) {
          setCustomers(res.data.customers);
        }
      } catch {
        // Use demo data
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [riskFilter]);

  const filtered = customers
    .filter((c) => {
      if (
        riskFilter !== "all" &&
        c.riskLevel !== riskFilter.charAt(0).toUpperCase() + riskFilter.slice(1)
      )
        return false;
      if (search && !String(c.customerIndex).includes(search)) return false;
      return true;
    })
    .sort((a, b) =>
      sortDir === "desc"
        ? b.churnProbability - a.churnProbability
        : a.churnProbability - b.churnProbability,
    );

  const toggleSort = () => setSortDir((d) => (d === "desc" ? "asc" : "desc"));

  return (
    <DashboardLayout>
      <div
        style={{
          display: "flex",
          position: "relative",
          height: "calc(100vh)",
          overflow: "hidden",
          margin: "-32px",
        }}
      >
        {/* Main table */}
        <div style={{ flex: 1, overflow: "auto", padding: "32px" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "24px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  letterSpacing: "-0.4px",
                  marginBottom: "4px",
                }}
              >
                Customer Explorer
              </h1>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                click a row to inspect
              </p>
            </div>

            {/* Actions & Filters */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  background: "rgba(255,255,255,0.03)",
                  padding: "4px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {/* Search */}
                <div style={{ position: "relative" }}>
                  <Search
                    size={14}
                    style={{
                      position: "absolute",
                      left: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--text-muted)",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Search by index..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                      paddingLeft: 32,
                      paddingRight: 12,
                      paddingTop: 8,
                      paddingBottom: 8,
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      background: "var(--bg-card)",
                      color: "var(--text-primary)",
                      fontSize: "13px",
                      outline: "none",
                      width: 180,
                    }}
                  />
                </div>

                {["all", "high", "medium", "low"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setRiskFilter(f)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      border: "none",
                      fontSize: "13px",
                      background:
                        riskFilter === f
                          ? "rgba(255,255,255,0.1)"
                          : "transparent",
                      color:
                        riskFilter === f
                          ? "var(--text-primary)"
                          : "var(--text-muted)",
                      fontWeight: riskFilter === f ? 500 : 400,
                      transition: "all 0.15s",
                    }}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: "12px",
              overflow: "hidden",
              background: "var(--bg-card)",
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr 120px 140px 80px 120px 130px",
                padding: "16px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                background: "rgba(0,0,0,0.2)",
              }}
            >
              {[
                "#",
                "Risk Level",
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    cursor: "pointer",
                  }}
                  onClick={toggleSort}
                >
                  Churn Prob{" "}
                  {sortDir === "desc" ? (
                    <ChevronDown size={13} />
                  ) : (
                    <ChevronUp size={13} />
                  )}
                </span>,
                "Contract",
                "Tenure",
                "Monthly $",
                "Internet",
              ].map((h, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.6px",
                    fontWeight: 500,
                  }}
                >
                  {h}
                </span>
              ))}
            </div>

            {/* Table rows */}
            <div
              style={{ maxHeight: "calc(100vh - 260px)", overflowY: "auto" }}
            >
              {filtered.map((c, i) => (
                <motion.div
                  key={c._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.01 }}
                  onClick={() =>
                    setSelected(selected?._id === c._id ? null : c)
                  }
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "80px 1fr 120px 140px 80px 120px 130px",
                    padding: "14px 16px",
                    borderBottom: "1px solid var(--border)",
                    cursor: "pointer",
                    background:
                      selected?._id === c._id
                        ? "var(--bg-card-hover)"
                        : "transparent",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (selected?._id !== c._id)
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.02)";
                  }}
                  onMouseLeave={(e) => {
                    if (selected?._id !== c._id)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontFamily: "JetBrains Mono, monospace",
                      color: "var(--text-muted)",
                    }}
                  >
                    {c.customerIndex}
                  </span>
                  <span>
                    <RiskBadge level={c.riskLevel} />
                  </span>
                  <span>
                    <ProbabilityBar value={c.churnProbability} />
                  </span>
                  <span
                    style={{ fontSize: "13px", color: "var(--text-secondary)" }}
                  >
                    {c.customerFeatures?.Contract}
                  </span>
                  <span
                    style={{ fontSize: "13px", color: "var(--text-secondary)" }}
                  >
                    {c.customerFeatures?.tenure}mo
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    ${c.customerFeatures?.MonthlyCharges}
                  </span>
                  <span
                    style={{ fontSize: "13px", color: "var(--text-secondary)" }}
                  >
                    {c.customerFeatures?.InternetService}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {selected && (
            <CustomerDetailPanel
              customer={selected}
              onClose={() => setSelected(null)}
              onShowShap={setShapCustomer}
            />
          )}
        </AnimatePresence>
      </div>

      {/* SHAP Modal */}
      <AnimatePresence>
        {shapCustomer && (
          <ShapModal
            customer={shapCustomer}
            onClose={() => setShapCustomer(null)}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
