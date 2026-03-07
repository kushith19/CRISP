import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#ef4444', '#22c55e']

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: '8px', padding: '10px 14px', fontSize: '13px',
    }}>
      <p style={{ color: 'var(--text-secondary)' }}>{payload[0].name}</p>
      <p style={{ fontWeight: 600, color: payload[0].color }}>
        {payload[0].value} ({((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}%)
      </p>
    </div>
  )
}

export default function ChurnPieChart({ data }) {
  const total = data.reduce((a, b) => a + b.value, 0)
  const enriched = data.map(d => ({ ...d, total }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={enriched}
          cx="50%" cy="50%"
          innerRadius={60} outerRadius={90}
          paddingAngle={3}
          dataKey="value"
        >
          {enriched.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => (
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}