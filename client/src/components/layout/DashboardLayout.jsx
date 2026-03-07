import Sidebar from './Sidebar'

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <main style={{
        flex: 1, overflow: 'auto',
        background: 'var(--bg-primary)',
        padding: '32px',
      }}>
        {children}
      </main>
    </div>
  )
}