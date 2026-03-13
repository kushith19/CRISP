import { motion } from "framer-motion";
import {
  Users,
  TrendingDown,
  AlertTriangle,
  Activity,
  MoreHorizontal,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import MetricCard from "../components/ui/MetricCard";
import ChurnPieChart from "../components/charts/ChurnPieChart";
import RiskBarChart from "../components/charts/RiskBarChart";
import ContractChart from "../components/charts/ContractChart";
import PaymentChart from "../components/charts/PaymentChart";
import TenureLineChart from "../components/charts/TenureLineChart";
import MonthlyChargesScatter from "../components/charts/ScatterChart";
import { useAnalytics } from "../hooks/useAnalytics";
import InsightPanel from "../components/ui/InsightPanel";


const DEMO = {
  totalCustomers: 7043,
  churnRate: 26.5,
  churnedCount: 1869,
  riskSegments: { high: 912, medium: 1247, low: 4884 },
  avgChurnProbability: 0.43,
};

const DEMO_PIE = [
  { name: "Churned", value: 1869 },
  { name: "Retained", value: 5174 },
];

const DEMO_RISK = [
  { name: "High", value: 912 },
  { name: "Medium", value: 1247 },
  { name: "Low", value: 4884 },
];

const DEMO_CONTRACT = [
  { contract: "Month-to-month", churned: 1655, retained: 2220 },
  { contract: "One year", churned: 166, retained: 1307 },
  { contract: "Two year", churned: 48, retained: 1647 },
];

const DEMO_PAYMENT = [
  { method: "Electronic check", churned: 1071 },
  { method: "Credit card", churned: 232 },
  { method: "Bank transfer", churned: 258 },
  { method: "Mailed check", churned: 308 },
];

const DEMO_TENURE = [
  { tenure: "0-12", churnRate: 47 },
  { tenure: "13-24", churnRate: 35 },
  { tenure: "25-36", churnRate: 28 },
  { tenure: "37-48", churnRate: 18 },
  { tenure: "49-60", churnRate: 12 },
  { tenure: "61-72", churnRate: 7 },
];

const DEMO_SCATTER = Array.from({ length: 80 }, () => ({
  charges: 20 + Math.random() * 100,
  probability: 0.1 + Math.random() * 0.85,
}));



function buildContractData(contractData = []) {
  const map = {};
  contractData.forEach(({ _id, count }) => {
    const key = _id.contract || "Unknown";
    if (!map[key]) map[key] = { contract: key, churned: 0, retained: 0 };
    if (_id.churned === 1) map[key].churned += count;
    else map[key].retained += count;
  });
  return Object.values(map);
}

function buildPaymentData(paymentData = []) {
  const map = {};
  paymentData.forEach(({ _id, count }) => {
    const key = _id.payment || "Unknown";
    if (!map[key]) map[key] = { method: key, churned: 0 };
    if (_id.churned === 1) map[key].churned += count;
  });
  return Object.values(map).filter((r) => r.churned > 0);
}

const TENURE_LABELS = ["0-12", "13-24", "25-36", "37-48", "49-60", "61-72", "72+"];

function buildTenureData(tenureData = []) {
  return tenureData.map((bucket, i) => ({
    tenure: TENURE_LABELS[i] || String(bucket._id),
    churnRate:
      bucket.totalCount > 0
        ? parseFloat(((bucket.churnCount / bucket.totalCount) * 100).toFixed(1))
        : 0,
  }));
}



function ChartCard({ title, subtitle, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        background:
          "linear-gradient(180deg, rgba(20,20,20, 0.8) 0%, rgba(20,20,20, 0.4) 100%)",
        overflow: "hidden",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          padding: "20px 24px 16px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          background: "rgba(255,255,255,0.01)",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: subtitle ? "4px" : "0",
            }}
          >
            {title}
          </p>
          {subtitle && (
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              {subtitle}
            </p>
          )}
        </div>
        <button
          style={{
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <MoreHorizontal size={16} />
        </button>
      </div>
      <div style={{ padding: "24px" }}>{children}</div>
    </motion.div>
  );
}



export default function DashboardPage() {
  const { data, loading, error } = useAnalytics();
  const d = data || DEMO;

 
  const hasRealData = !!data && data.totalCustomers > 0;
  const cd = data?.chartData || {};

  const pieData     = hasRealData ? (cd.pieData     || DEMO_PIE)                        : DEMO_PIE;
  const riskData    = hasRealData ? (cd.riskData    || DEMO_RISK)                       : DEMO_RISK;
  const contractData= hasRealData ? (buildContractData(cd.contractData) || DEMO_CONTRACT) : DEMO_CONTRACT;
  const paymentData = hasRealData ? (buildPaymentData(cd.paymentData)   || DEMO_PAYMENT)  : DEMO_PAYMENT;
  const tenureData  = hasRealData ? (buildTenureData(cd.tenureData)     || DEMO_TENURE)   : DEMO_TENURE;
  const scatterData = hasRealData ? (cd.scatterData?.length ? cd.scatterData : DEMO_SCATTER) : DEMO_SCATTER;

  return (
    <DashboardLayout>
      <div style={{ maxWidth: "1200px" }}>
        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "-0.4px",
              marginBottom: "4px",
            }}
          >
            Retention Dashboard
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            {hasRealData
              ? "Live dataset analysis"
              : "Demo data — upload a dataset to see real predictions"}
          </p>
        </div>

        {/* Metrics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <MetricCard
            index={0}
            label="Total Customers"
            value={d.totalCustomers?.toLocaleString()}
            icon={<Users size={18} color="var(--accent)" />}
            color="var(--accent)"
          />
          <MetricCard
            index={1}
            label="Churn Rate"
            value={`${d.churnRate}%`}
            sub={`${d.churnedCount?.toLocaleString()} customers lost`}
            icon={<TrendingDown size={18} color="var(--danger)" />}
            color="var(--danger)"
          />
          <MetricCard
            index={2}
            label="High Risk"
            value={d.riskSegments?.high?.toLocaleString()}
            sub="Immediate attention needed"
            icon={<AlertTriangle size={18} color="var(--warning)" />}
            color="var(--warning)"
          />
          <MetricCard
            index={3}
            label="Avg Risk Score"
            value={
              d.avgChurnProbability?.toFixed
                ? d.avgChurnProbability.toFixed(2)
                : d.avgChurnProbability
            }
            sub="0 = safe · 1 = certain churn"
            icon={<Activity size={18} color="var(--success)" />}
            color="var(--success)"
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <InsightPanel />
        </div>

        {/* Charts Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          <ChartCard
            title="Churn Distribution"
            subtitle="Overall churn vs retention"
          >
            <ChurnPieChart data={pieData} />
          </ChartCard>
          <ChartCard
            title="Risk Segmentation"
            subtitle="Customers by risk tier"
          >
            <RiskBarChart data={riskData} />
          </ChartCard>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          <ChartCard
            title="Churn by Contract Type"
            subtitle="Month-to-month customers churn 3× more"
          >
            <ContractChart data={contractData} />
          </ChartCard>
          <ChartCard
            title="Churn by Payment Method"
            subtitle="Electronic check shows highest churn"
          >
            <PaymentChart data={paymentData} />
          </ChartCard>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          <ChartCard
            title="Churn Rate vs Tenure"
            subtitle="New customers churn most frequently"
          >
            <TenureLineChart data={tenureData} />
          </ChartCard>
          <ChartCard
            title="Monthly Charges vs Churn"
            subtitle="Price sensitivity analysis"
          >
            <MonthlyChargesScatter data={scatterData} />
          </ChartCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
