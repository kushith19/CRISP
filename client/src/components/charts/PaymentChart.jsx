import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const GRADIENT_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#4f8ef7']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: '8px', padding: '10px 14px', fontSize: '13px',
    }}>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '4px', fontSize: '12px' }}>{label}</p>
      <p style={{ fontWeight: 600, color: payload[0].fill }}>{payload[0].value} churned</p>
    </div>
  )
}

export default function PaymentChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" barSize={20}>
        <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis dataKey="method" type="category" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={110} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey="churned" radius={[0, 6, 6, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={GRADIENT_COLORS[i % GRADIENT_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}