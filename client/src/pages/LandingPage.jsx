import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, TrendingDown, Users, BarChart3, ArrowRight, Zap, Shield, LineChart } from 'lucide-react'
import Navbar from '../components/layout/Navbar'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
})

const features = [
  {
    icon: <Zap size={20} color="#4f8ef7" />,
    title: 'AI Churn Prediction',
    desc: 'XGBoost-powered model scores every customer with a precise churn probability in seconds.',
    tag: 'ML',
  },
  {
    icon: <Users size={20} color="#22c55e" />,
    title: 'Risk Segmentation',
    desc: 'Automatically groups customers into High, Medium, and Low risk tiers for targeted action.',
    tag: 'Analytics',
  },
  {
    icon: <BarChart3 size={20} color="#f59e0b" />,
    title: 'Retention Analytics',
    desc: 'Deep-dive dashboards reveal which contracts, payment methods, and behaviors drive churn.',
    tag: 'Insights',
  },
]

const stats = [
  { value: '26.5%', label: 'Avg Industry Churn' },
  { value: '~3x', label: 'Month-to-month risk' },
  { value: '93%', label: 'Model accuracy' },
]

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      {/* Grid background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
        opacity: 0.35,
        pointerEvents: 'none',
      }} />

      {/* Glow */}
      <div style={{
        position: 'fixed', top: '-200px', left: '50%', transform: 'translateX(-50%)',
        width: '800px', height: '500px',
        background: 'radial-gradient(ellipse, rgba(79,142,247,0.12) 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero */}
        <section style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '120px 24px 80px',
        }}>
          <div style={{ maxWidth: '760px', textAlign: 'center' }}>
            <motion.div {...fadeUp(0)} style={{ marginBottom: '24px' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '6px 16px', borderRadius: '100px',
                border: '1px solid var(--accent-dim)',
                background: 'rgba(79,142,247,0.08)',
                fontSize: '13px', color: 'var(--accent)',
                fontWeight: 500,
              }}>
                <Brain size={13} />Customer Retention Intelligence
              </span>
            </motion.div>

            <motion.h1 {...fadeUp(0.1)} style={{
              fontSize: 'clamp(38px, 6vw, 64px)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
              color: 'var(--text-primary)',
              marginBottom: '24px',
            }}>
              Know who will leave<br />
              <span style={{
                background: 'linear-gradient(135deg, #4f8ef7 0%, #7c6ff7 50%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
               before they do.
              </span>
            </motion.h1>

            <motion.p {...fadeUp(0.2)} style={{
              fontSize: '18px', color: 'var(--text-secondary)',
              lineHeight: 1.7, marginBottom: '40px',
              maxWidth: '560px', margin: '0 auto 40px',
            }}>
              Upload your customer dataset and instantly get AI-powered churn predictions,
              risk segmentation, and retention analytics.
            </motion.p>

            <motion.div {...fadeUp(0.3)} style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/upload" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '13px 28px', borderRadius: '10px',
                background: 'var(--accent)',
                color: 'white', textDecoration: 'none',
                fontSize: '15px', fontWeight: 600,
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Upload Dataset <ArrowRight size={16} />
              </Link>
              <Link to="/dashboard" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '13px 28px', borderRadius: '10px',
                border: '1px solid var(--border-bright)',
                color: 'var(--text-secondary)', textDecoration: 'none',
                fontSize: '15px', fontWeight: 500,
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                View Dashboard
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div {...fadeUp(0.45)} style={{
              display: 'flex', gap: '0', justifyContent: 'center', marginTop: '72px',
              border: '1px solid var(--border)', borderRadius: '12px',
              background: 'var(--bg-card)', overflow: 'hidden',
            }}>
              {stats.map((s, i) => (
                <div key={i} style={{
                  flex: 1, padding: '20px 24px', textAlign: 'center',
                  borderRight: i < stats.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: '56px' }}
          >
            <p style={{ fontSize: '12px', letterSpacing: '2px', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '12px' }}>
              Platform Capabilities
            </p>
            <h2 style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-0.8px' }}>
              Everything you need to reduce churn
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{
                  padding: '28px', borderRadius: '12px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-card)',
                  transition: 'border-color 0.2s, transform 0.2s',
                }}
                whileHover={{ y: -4, borderColor: 'var(--border-bright)' }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'var(--bg-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '16px',
                }}>
                  {f.icon}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{f.title}</h3>
                  <span style={{
                    fontSize: '11px', padding: '2px 8px', borderRadius: '100px',
                    background: 'var(--accent-dim)', color: 'var(--accent)',
                  }}>{f.tag}</span>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section style={{ padding: '80px 24px', maxWidth: '900px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '56px' }}
          >
            <p style={{ fontSize: '12px', letterSpacing: '2px', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '12px' }}>
              How it works
            </p>
            <h2 style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-0.8px' }}>Three steps to insight</h2>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[
              { n: '01', title: 'Upload your dataset', desc: 'Drop a CSV file with your customer data. Supports the standard telecom churn dataset format.' },
              { n: '02', title: 'AI analyzes every customer', desc: 'Our XGBoost model scores each customer with a precise churn probability and risk tier.' },
              { n: '03', title: 'Act on the insights', desc: 'Use the dashboard to find high-risk segments, understand churn drivers, and plan retention campaigns.' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  display: 'flex', gap: '24px', alignItems: 'flex-start',
                  padding: '28px', borderRadius: '12px',
                  border: '1px solid var(--border)', background: 'var(--bg-card)',
                  marginBottom: '8px',
                }}
              >
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '13px',
                  color: 'var(--accent)', fontWeight: 500, minWidth: '28px',
                }}>
                  {step.n}
                </span>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>{step.title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '80px 24px 120px', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              maxWidth: '560px', margin: '0 auto', padding: '56px 40px',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              background: 'linear-gradient(135deg, rgba(79,142,247,0.05) 0%, rgba(124,58,237,0.05) 100%)',
            }}
          >
            <TrendingDown size={36} color="var(--accent)" style={{ marginBottom: '20px' }} />
            <h2 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '12px' }}>
              Ready to reduce churn?
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', fontSize: '15px' }}>
              Upload your dataset and get AI-powered insights in under 60 seconds.
            </p>
            <Link to="/upload" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '13px 32px', borderRadius: '10px',
              background: 'var(--accent)', color: 'white',
              textDecoration: 'none', fontSize: '15px', fontWeight: 600,
            }}>
              Get Started <ArrowRight size={16} />
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid var(--border)', padding: '24px',
          textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px',
        }}>
          CRISP — Customer Retention Intelligence Platform
        </footer>
      </div>
    </div>
  )
}