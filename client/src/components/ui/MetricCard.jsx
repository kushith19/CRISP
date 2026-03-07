import { motion } from 'framer-motion'

export default function MetricCard({ label, value, sub, icon, color = 'var(--accent)', index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -2 }}
      style={{
        padding: '20px 24px', borderRadius: '12px',
        border: '1px solid var(--border)',
        background: 'var(--bg-card)',
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-bright)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>
            {label}
          </p>
          <p style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
            {value}
          </p>
          {sub && (
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>{sub}</p>
          )}
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: '10px',
          background: `${color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </div>
      </div>
    </motion.div>
  )
}