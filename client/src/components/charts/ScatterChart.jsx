import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: '8px', padding: '10px 14px', fontSize: '13px',
    }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Monthly Charges</p>
      <p style={{ fontWeight: 600, marginBottom: '4px' }}>${payload[0]?.value}</p>
      <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Churn Probability</p>
      <p style={{ fontWeight: 600, color: '#ef4444' }}>{(payload[1]?.value * 100).toFixed(1)}%</p>
    </div>
  )
}

export default function MonthlyChargesScatter({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <ScatterChart>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
        <XAxis dataKey="charges" name="Monthly Charges" unit="$" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis dataKey="probability" name="Churn Prob" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
        <Scatter data={data} fill="#ef4444" fillOpacity={0.6} />
      </ScatterChart>
    </ResponsiveContainer>
  )
}