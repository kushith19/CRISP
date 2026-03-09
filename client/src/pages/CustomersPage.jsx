import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ChevronUp, ChevronDown, AlertTriangle, CheckCircle, Minus } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { getCustomers } from '../services/api'

// Demo customers
const DEMO_CUSTOMERS = Array.from({ length: 40 }, (_, i) => ({
  _id: String(i),
  customerIndex: i + 1,
  churnProbability: parseFloat((Math.random()).toFixed(3)),
  riskLevel: ['High', 'High', 'Medium', 'Medium', 'Low'][Math.floor(Math.random() * 5)],
  customerFeatures: {
    Contract: ['Month-to-month', 'One year', 'Two year'][Math.floor(Math.random() * 3)],
    tenure: Math.floor(Math.random() * 72) + 1,
    MonthlyCharges: parseFloat((20 + Math.random() * 100).toFixed(2)),
    InternetService: ['Fiber optic', 'DSL', 'No'][Math.floor(Math.random() * 3)],
    TotalCharges: parseFloat((100 + Math.random() * 5000).toFixed(2)),
    PaymentMethod: ['Electronic check', 'Credit card', 'Bank transfer', 'Mailed check'][Math.floor(Math.random() * 4)],
    SeniorCitizen: Math.random() > 0.8 ? 1 : 0,
    Partner: Math.random() > 0.5 ? 'Yes' : 'No',
    Dependents: Math.random() > 0.5 ? 'Yes' : 'No',
    PhoneService: 'Yes',
    MultipleLines: Math.random() > 0.5 ? 'Yes' : 'No',
    OnlineSecurity: Math.random() > 0.5 ? 'Yes' : 'No',
    TechSupport: Math.random() > 0.5 ? 'Yes' : 'No',
  }
}))

const RiskBadge = ({ level }) => {
  const styles = {
    High: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', icon: <AlertTriangle size={11} /> },
    Medium: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', icon: <Minus size={11} /> },
    Low: { bg: 'rgba(34,197,94,0.1)', color: '#22c55e', icon: <CheckCircle size={11} /> },
  }
  const s = styles[level] || styles.Low
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '100px',
      background: s.bg, color: s.color, fontSize: '12px', fontWeight: 500,
    }}>
      {s.icon} {level}
    </span>
  )
}

const ProbabilityBar = ({ value }) => {
  const color = value > 0.7 ? '#ef4444' : value > 0.4 ? '#f59e0b' : '#22c55e'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ width: 60, height: 4, borderRadius: 2, background: 'var(--border)', overflow: 'hidden' }}>
        <div style={{ width: `${value * 100}%`, height: '100%', background: color, borderRadius: 2 }} />
      </div>
      <span style={{ fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', color }}>
        {(value * 100).toFixed(1)}%
      </span>
    </div>
  )
}

function CustomerDetailPanel({ customer, onClose }) {
  if (!customer) return null
  const f = customer.customerFeatures || {}
  const color = customer.churnProbability > 0.7 ? 'var(--danger)' : customer.churnProbability > 0.4 ? 'var(--warning)' : 'var(--success)'

  return (
    <motion.div
      initial={{ opacity: 0, x: 340 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 340 }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      style={{
        width: 340, flexShrink: 0,
        borderLeft: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        padding: '24px', overflowY: 'auto',
        position: 'absolute', top: 16, right: 16, bottom: 16,
        zIndex: 10,
        borderRadius: '16px',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.3)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Customer #{customer.customerIndex}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={18} />
        </button>
      </div>

      {/* Risk score */}
      <div style={{
        padding: '20px', borderRadius: '10px',
        border: `1px solid ${color}30`, background: `${color}08`,
        textAlign: 'center', marginBottom: '20px',
      }}>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          Churn Probability
        </p>
        <p style={{ fontSize: '36px', fontWeight: 700, color, letterSpacing: '-1px' }}>
          {(customer.churnProbability * 100).toFixed(1)}%
        </p>
        <RiskBadge level={customer.riskLevel} />
      </div>

      {/* Attributes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {[
          ['Contract', f.Contract],
          ['Tenure', `${f.tenure} months`],
          ['Monthly Charges', `${f.MonthlyCharges}`],
          ['Total Charges', `${f.TotalCharges}`],
          ['Internet Service', f.InternetService],
          ['Payment Method', f.PaymentMethod],
          ['Senior Citizen', f.SeniorCitizen ? 'Yes' : 'No'],
          ['Partner', f.Partner],
          ['Dependents', f.Dependents],
          ['Online Security', f.OnlineSecurity],
          ['Tech Support', f.TechSupport],
          ['Multiple Lines', f.MultipleLines],
        ].map(([k, v]) => v !== undefined && (
          <div key={k} style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '10px 12px', borderRadius: '6px',
            fontSize: '13px',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ color: 'var(--text-muted)' }}>{k}</span>
            <span style={{ fontWeight: 500 }}>{v}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState(DEMO_CUSTOMERS)
  const [selected, setSelected] = useState(null)
  const [riskFilter, setRiskFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sortDir, setSortDir] = useState('desc')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true)
        const res = await getCustomers({ riskLevel: riskFilter, limit: 200 })
        if (res.data.customers?.length > 0) {
          setCustomers(res.data.customers)
        }
      } catch {
        // Use demo data
      } finally {
        setLoading(false)
      }
    }
    fetchCustomers()
  }, [riskFilter])

  const filtered = customers
    .filter(c => {
      if (riskFilter !== 'all' && c.riskLevel !== (riskFilter.charAt(0).toUpperCase() + riskFilter.slice(1))) return false
      if (search && !String(c.customerIndex).includes(search)) return false
      return true
    })
    .sort((a, b) => sortDir === 'desc'
      ? b.churnProbability - a.churnProbability
      : a.churnProbability - b.churnProbability
    )

  const toggleSort = () => setSortDir(d => d === 'desc' ? 'asc' : 'desc')

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', position: 'relative', height: 'calc(100vh)', overflow: 'hidden', margin: '-32px' }}>
        {/* Main table */}
        <div style={{ flex: 1, overflow: 'auto', padding: '32px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.4px', marginBottom: '4px' }}>
                Customer Explorer
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
               click a row to inspect
              </p>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {/* Search */}
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text" placeholder="Search by index..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  style={{
                    paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
                    borderRadius: '8px', border: '1px solid var(--border)',
                    background: 'var(--bg-card)', color: 'var(--text-primary)',
                    fontSize: '13px', outline: 'none', width: 180,
                  }}
                />
              </div>

              {/* Risk filter buttons */}
              {['all', 'high', 'medium', 'low'].map(f => (
                <button key={f} onClick={() => setRiskFilter(f)} style={{
                  padding: '8px 14px', borderRadius: '8px', cursor: 'pointer',
                  border: '1px solid var(--border)', fontSize: '13px',
                  background: riskFilter === f ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                  color: riskFilter === f ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontWeight: riskFilter === f ? 500 : 400,
                  transition: 'all 0.15s',
                }}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div style={{
            border: '1px solid var(--border)', borderRadius: '12px',
            overflow: 'hidden', background: 'var(--bg-card)',
          }}>
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr 120px 140px 80px 120px 130px',
              padding: '12px 16px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg-secondary)',
            }}>
              {['#', 'Risk Level', <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={toggleSort}>
                Churn Prob {sortDir === 'desc' ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
              </span>, 'Contract', 'Tenure', 'Monthly $', 'Internet'].map((h, i) => (
                <span key={i} style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 500 }}>
                  {h}
                </span>
              ))}
            </div>

            {/* Table rows */}
            <div style={{ maxHeight: 'calc(100vh - 260px)', overflowY: 'auto' }}>
              {filtered.map((c, i) => (
                <motion.div
                  key={c._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.01 }}
                  onClick={() => setSelected(selected?._id === c._id ? null : c)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr 120px 140px 80px 120px 130px',
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                    background: selected?._id === c._id ? 'var(--bg-card-hover)' : 'transparent',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { if (selected?._id !== c._id) e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                  onMouseLeave={e => { if (selected?._id !== c._id) e.currentTarget.style.background = 'transparent' }}
                >
                  <span style={{ fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)' }}>
                    {c.customerIndex}
                  </span>
                  <span><RiskBadge level={c.riskLevel} /></span>
                  <span><ProbabilityBar value={c.churnProbability} /></span>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{c.customerFeatures?.Contract}</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{c.customerFeatures?.tenure}mo</span>
                  <span style={{ fontSize: '13px', fontFamily: 'JetBrains Mono, monospace' }}>${c.customerFeatures?.MonthlyCharges}</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{c.customerFeatures?.InternetService}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {selected && (
            <CustomerDetailPanel customer={selected} onClose={() => setSelected(null)} />
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}