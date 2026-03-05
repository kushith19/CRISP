import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, UploadCloud, LayoutDashboard, Github } from 'lucide-react'

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
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #4f8ef7 0%, #7c3aed 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Brain size={18} color="white" />
          </div>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '15px', letterSpacing: '-0.3px' }}>
            ChurnIntel
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
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px', borderRadius: 8,
              textDecoration: 'none', fontSize: '14px',
              color: 'var(--text-secondary)', marginLeft: '4px',
            }}
          > 
            <Github size={15} />
          </a>
        </div>
      </div>
    </motion.nav>
  )
}