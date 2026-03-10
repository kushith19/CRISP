import { motion } from 'framer-motion'
import { Users, TrendingDown, AlertTriangle, Activity } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import MetricCard from '../components/ui/MetricCard'
import ChurnPieChart from '../components/charts/ChurnPieChart'
import RiskBarChart from '../components/charts/RiskBarChart'
import ContractChart from '../components/charts/ContractChart'
import PaymentChart from '../components/charts/PaymentChart'
import TenureLineChart from '../components/charts/TenureLineChart'
import MonthlyChargesScatter from '../components/charts/ScatterChart'
import { useAnalytics } from '../hooks/useAnalytics'
import InsightPanel from '../components/ui/InsightPanel'

// Demo data for when no dataset is uploaded yet
const DEMO = {
  totalCustomers: 7043,
  churnRate: 26.5,
  churnedCount: 1869,
  riskSegments: { high: 912, medium: 1247, low: 4884 },
  avgChurnProbability: 0.43,
}

const DEMO_PIE = [
  { name: 'Churned', value: 1869 },
  { name: 'Retained', value: 5174 },
]

const DEMO_RISK = [
  { name: 'High', value: 912 },
  { name: 'Medium', value: 1247 },
  { name: 'Low', value: 4884 },
]

const DEMO_CONTRACT = [
  { contract: 'Month-to-month', churned: 1655, retained: 2220 },
  { contract: 'One year', churned: 166, retained: 1307 },
  { contract: 'Two year', churned: 48, retained: 1647 },
]

const DEMO_PAYMENT = [
  { method: 'Electronic check', churned: 1071 },
  { method: 'Credit card', churned: 232 },
  { method: 'Bank transfer', churned: 258 },
  { method: 'Mailed check', churned: 308 },
]

const DEMO_TENURE = [
  { tenure: '0-12', churnRate: 47 },
  { tenure: '13-24', churnRate: 35 },
  { tenure: '25-36', churnRate: 28 },
  { tenure: '37-48', churnRate: 18 },
  { tenure: '49-60', churnRate: 12 },
  { tenure: '61-72', churnRate: 7 },
]

const DEMO_SCATTER = Array.from({ length: 80 }, (_, i) => ({
  charges: 20 + Math.random() * 100,
  probability: 0.1 + (Math.random() * 0.85),
}))

function ChartCard({ title, subtitle, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '24px', borderRadius: '12px',
        border: '1px solid var(--border)',
        background: 'var(--bg-card)',
      }}
    >
      <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: subtitle ? '4px' : '20px' }}>{title}</p>
      {subtitle && (
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>{subtitle}</p>
      )}
      {children}
    </motion.div>
  )
}

export default function DashboardPage() {
  const { data, loading, error } = useAnalytics()
  const d = data || DEMO

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1200px' }}>
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.4px', marginBottom: '4px' }}>
            Retention Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            {data ? 'Live dataset analysis' : 'Demo data — upload a dataset to see real predictions'}
          </p>
        </div>

        {/* Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px', marginBottom: '24px',
        }}>
          <MetricCard
            index={0} label="Total Customers"
            value={d.totalCustomers?.toLocaleString()}
            icon={<Users size={18} color="var(--accent)" />}
            color="var(--accent)"
          />
          <MetricCard
            index={1} label="Churn Rate"
            value={`${d.churnRate}%`}
            sub={`${d.churnedCount?.toLocaleString()} customers lost`}
            icon={<TrendingDown size={18} color="var(--danger)" />}
            color="var(--danger)"
          />
          <MetricCard
            index={2} label="High Risk"
            value={d.riskSegments?.high?.toLocaleString()}
            sub="Immediate attention needed"
            icon={<AlertTriangle size={18} color="var(--warning)" />}
            color="var(--warning)"
          />
          <MetricCard
            index={3} label="Avg Risk Score"
            value={d.avgChurnProbability?.toFixed ? d.avgChurnProbability.toFixed(2) : d.avgChurnProbability}
            sub="0 = safe · 1 = certain churn"
            icon={<Activity size={18} color="var(--success)" />}
            color="var(--success)"
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <InsightPanel />
        </div>  

        {/* Charts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <ChartCard title="Churn Distribution" subtitle="Overall churn vs retention">
            <ChurnPieChart data={DEMO_PIE} />
          </ChartCard>
          <ChartCard title="Risk Segmentation" subtitle="Customers by risk tier">
            <RiskBarChart data={DEMO_RISK} />
          </ChartCard>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <ChartCard title="Churn by Contract Type" subtitle="Month-to-month customers churn 3× more">
            <ContractChart data={DEMO_CONTRACT} />
          </ChartCard>
          <ChartCard title="Churn by Payment Method" subtitle="Electronic check shows highest churn">
            <PaymentChart data={DEMO_PAYMENT} />
          </ChartCard>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <ChartCard title="Churn Rate vs Tenure" subtitle="New customers churn most frequently">
            <TenureLineChart data={DEMO_TENURE} />
          </ChartCard>
          <ChartCard title="Monthly Charges vs Churn" subtitle="Price sensitivity analysis">
            <MonthlyChargesScatter data={DEMO_SCATTER} />
          </ChartCard>
        </div>
      </div>
    </DashboardLayout>
  )
}