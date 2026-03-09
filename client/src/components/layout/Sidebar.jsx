import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, UploadCloud, Settings } from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: <LayoutDashboard size={17} />, label: 'Dashboard' },
  { to: '/customers', icon: <Users size={17} />, label: 'Customers' },
  { to: '/upload', icon: <UploadCloud size={17} />, label: 'Upload' },
  { to: '/settings', icon: <Settings size={17} />, label: 'Settings' },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside style={{
      width: 220, flexShrink: 0, height: '100vh',
      position: 'sticky', top: 0,
      borderRight: '1px solid var(--border)',
      background: 'var(--bg-secondary)',
      display: 'flex', flexDirection: 'column',
      padding: '0 12px',
    }}>
      {/* Logo */}
      <Link to="/" style={{
        height: 60, display: 'flex', alignItems: 'center',
        gap: '10px', padding: '0 8px',
        borderBottom: '1px solid var(--border)',
        textDecoration: 'none', color: 'inherit',
      }}>
        <img src="/churn_logo.png" alt="CRISP" style={{ height: 28, width: 28, borderRadius: '50%', objectFit: 'cover' }} />
        <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '-0.3px' }}>CRISP</span>
      </Link>

      {/* Nav */}
      <nav style={{ paddingTop: '16px', flex: 1 }}>
        {navItems.map(({ to, icon, label }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px', borderRadius: '8px',
                textDecoration: 'none', marginBottom: '2px',
                fontSize: '14px', fontWeight: active ? 500 : 400,
                color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                background: active ? 'var(--bg-card)' : 'transparent',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ color: active ? 'var(--accent)' : 'inherit' }}>{icon}</span>
              {label}
            </Link>
          )
        })}
      </nav>

      <div style={{
        padding: '16px 8px', borderTop: '1px solid var(--border)',
        fontSize: '11px', color: 'var(--text-muted)',
      }}>
        CRISP
        <span style={{
          display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
          background: 'var(--success)', marginLeft: '6px',
          boxShadow: '0 0 4px var(--success)',
        }} />
      </div>
    </aside>
  )
}