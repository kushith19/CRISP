import { motion } from 'framer-motion'
import DashboardLayout from '../components/layout/DashboardLayout'

const METRICS = [
  { label: 'ROC-AUC',  value: '0.845' },
  { label: 'Recall',   value: '80%'   },
  { label: 'F1-Score', value: '0.63'  },
  { label: 'Accuracy', value: '76%'   },
]

const CLASS_REPORT = [
  { label: 'No Churn',     precision: '0.91', recall: '0.74', f1: '0.82' },
  { label: 'Churn',        precision: '0.53', recall: '0.80', f1: '0.63' },
  { label: 'Weighted Avg', precision: '0.81', recall: '0.76', f1: '0.77' },
]

const COMPONENTS = [
  {
    tag: 'Core Model',
    title: 'XGBoost',
    desc: 'Gradient boosted trees via sklearn Pipeline. ColumnTransformer handles OHE for categoricals and standard scaling for numerics. scale_pos_weight corrects class imbalance.',
    accent: 'var(--accent)',
  },
  {
    tag: 'Explainability',
    title: 'SHAP',
    desc: 'TreeExplainer computes exact Shapley values per prediction. Top 5 per-customer feature contributions stored in MongoDB and shown in the customer explorer.',
    accent: '#8b8fa8',
  },
  {
    tag: 'Importance',
    title: 'Feature Importance',
    desc: 'XGBoost gain scores rank features globally. Contract type accounts for 41.6% of model decisions — the single strongest churn signal in the dataset.',
    accent: '#8b8fa8',
  },
]

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div style={{ maxWidth: 600 }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.3px', marginBottom: 4 }}>
            Model & System
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            XGBoost churn prediction 
          </p>
        </div>

        {/* ── Performance card ── */}
        <div style={{
          padding: '20px 22px', borderRadius: 10,
          border: '1px solid var(--border)',
          background: 'var(--bg-card)',
          marginBottom: 10,
        }}>
          <p style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.8px',
            textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4,
          }}>
            Model Performance
          </p>
         <br/>

          {/* Metrics row */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
            gap: 8, marginBottom: 20,
          }}>
            {METRICS.map((m, i) => (
              <motion.div key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.06 }}
                style={{
                  padding: '14px 10px', borderRadius: 8, textAlign: 'center',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                }}
              >
                <p style={{
                  fontSize: 22, fontWeight: 700,
                  color: i === 0 ? 'var(--accent)' : 'var(--text-primary)',
                  letterSpacing: '-0.5px', marginBottom: 5,
                  fontFamily: 'JetBrains Mono, monospace',
                }}>
                  {m.value}
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {m.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Classification table */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Class', 'Precision', 'Recall', 'F1'].map((h, i) => (
                  <th key={h} style={{
                    textAlign: i === 0 ? 'left' : 'right',
                    padding: '6px 8px',
                    color: 'var(--text-muted)', fontWeight: 500, fontSize: 11,
                    borderBottom: '1px solid var(--border)',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CLASS_REPORT.map((row, i) => (
                <tr key={i}>
                  <td style={{
                    padding: '9px 8px', fontSize: 12,
                    color: 'var(--text-secondary)',
                    fontWeight: i === CLASS_REPORT.length - 1 ? 600 : 400,
                    borderBottom: '1px solid var(--border)',
                  }}>
                    {row.label}
                  </td>
                  {[row.precision, row.recall, row.f1].map((v, j) => (
                    <td key={j} style={{
                      padding: '9px 8px', textAlign: 'right',
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                    
                      color: i === 1 && j === 1 ? '#4ade80' : 'var(--text-muted)',
                      fontWeight: i === 1 && j === 1 ? 600 : 400,
                      borderBottom: '1px solid var(--border)',
                    }}>
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Components card ── */}
        <div style={{
          padding: '20px 22px', borderRadius: 10,
          border: '1px solid var(--border)',
          background: 'var(--bg-card)',
        }}>
          <p style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.8px',
            textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16,
          }}>
            Components
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {COMPONENTS.map((c, i) => (
              <div key={i} style={{
                display: 'flex', gap: 14, alignItems: 'flex-start',
                padding: '14px 0',
                borderBottom: i < COMPONENTS.length - 1
                  ? '1px solid var(--border)' : 'none',
              }}>
                {/* left accent bar */}
                <div style={{
                  width: 2, minHeight: 36, borderRadius: 2,
                  background: c.accent, flexShrink: 0, alignSelf: 'stretch',
                }} />

                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5,
                  }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {c.title}
                    </p>
                    <span style={{
                      fontSize: 10, padding: '2px 7px', borderRadius: 4,
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-muted)',
                    }}>
                      {c.tag}
                    </span>
                  </div>
                  <p style={{
                    fontSize: 12, color: 'var(--text-muted)',
                    lineHeight: 1.7, margin: 0,
                  }}>
                    {c.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}