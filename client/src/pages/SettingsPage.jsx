import DashboardLayout from '../components/layout/DashboardLayout'
import { Database, Server, RefreshCw } from 'lucide-react'

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div style={{ maxWidth: '600px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.4px', marginBottom: '4px' }}>Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px' }}>
          System configuration and connection status
        </p>

        {[
          { icon: <Server size={18} color="var(--accent)" />, title: 'ML Service', value: 'http://localhost:8000', status: 'connected' },
          { icon: <Database size={18} color="var(--success)" />, title: 'MongoDB', value: 'localhost:27017/churn_intel', status: 'connected' },
          { icon: <RefreshCw size={18} color="var(--warning)" />, title: 'Backend API', value: 'http://localhost:5000', status: 'running' },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '20px 24px', borderRadius: '12px',
            border: '1px solid var(--border)', background: 'var(--bg-card)',
            marginBottom: '8px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '8px',
                background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {item.icon}
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 500, marginBottom: '3px' }}>{item.title}</p>
                <p style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)' }}>{item.value}</p>
              </div>
            </div>
            <span style={{
              fontSize: '12px', padding: '4px 12px', borderRadius: '100px',
              background: 'rgba(34,197,94,0.1)', color: 'var(--success)',
            }}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}