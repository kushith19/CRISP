import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: '8px', padding: '10px 14px', fontSize: '13px',
    }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Month {label}</p>
      <p style={{ fontWeight: 600, color: '#4f8ef7' }}>{payload[0].value}% churn rate</p>
    </div>
  )
}

export default function TenureLineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="tenure" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone" dataKey="churnRate"
          stroke="#4f8ef7" strokeWidth={2.5}
          dot={{ fill: '#4f8ef7', r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#4f8ef7' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}