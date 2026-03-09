import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UploadCloud, LayoutDashboard } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        borderBottom: '1px solid var(--border)',
        background: 'rgba(8, 13, 20, 0.85)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div style={{
        maxWidth: '1280px', margin: '0 auto',
        padding: '0 24px',
        height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img src="/churn_logo.png" alt="CRISP" style={{ height: 32, width: 32, borderRadius: '50%', objectFit: 'cover' }} />
          <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '15px', letterSpacing: '-0.3px' }}>
            CRISP
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {[
            { to: '/upload', icon: <UploadCloud size={15} />, label: 'Upload' },
            { to: '/dashboard', icon: <LayoutDashboard size={15} />, label: 'Dashboard' },
          ].map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '7px 14px', borderRadius: 8,
                textDecoration: 'none', fontSize: '14px',
                color: location.pathname === to ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: location.pathname === to ? 'var(--bg-card)' : 'transparent',
                transition: 'all 0.2s',
              }}
            >
              {icon}{label}
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}