import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, FileText, CheckCircle, AlertCircle, X, Brain } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import { uploadDataset } from '../services/api'

// Processing stages shown to the user during upload
const STAGE_TEXT = {
  uploading:   { title: 'Uploading dataset...',         sub: 'Sending data to the server' },
  ml:          { title: 'Running ML analysis...',       sub: 'XGBoost is scoring your customers' },
  insights:    { title: 'Generating AI insights...',    sub: 'Llama 3.3 is analyzing patterns · ~10 seconds' },
  finishing:   { title: 'Almost done...',               sub: 'Preparing your dashboard' },
}

export default function UploadPage() {
  const [stage,     setStage]     = useState('idle')   // idle | selected | uploading | ml | insights | finishing | done | error
  const [file,      setFile]      = useState(null)
  const [progress,  setProgress]  = useState(0)
  const [errorMsg,  setErrorMsg]  = useState('')
  const [isDragging,setIsDragging]= useState(false)
  const fileRef  = useRef()
  const navigate = useNavigate()

  const handleFile = (f) => {
    if (!f || !f.name.endsWith('.csv')) {
      setErrorMsg('Please upload a CSV file.')
      setStage('error')
      return
    }
    setFile(f)
    setStage('selected')
    setErrorMsg('')
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    handleFile(e.dataTransfer.files[0])
  }, [])

  const handleUpload = async () => {
    if (!file) return

    try {
      // ── Stage 1: Upload + ML predictions ─────────────────────────────
      setStage('uploading')
      setProgress(0)

      const formData = new FormData()
      formData.append('dataset', file)

      await uploadDataset(formData, (pct) => {
        setProgress(pct)
        // Switch label once file is uploaded and ML is running
        if (pct === 100) setStage('ml')
      })

      // ── Stage 2: Generate LLM insight via SSE ─────────────────────────
      // This is the ONLY place /stream is called automatically
      setStage('insights')

      await new Promise((resolve) => {
        const es = new EventSource('/api/insight/stream')

        es.onmessage = (e) => {
          const msg = JSON.parse(e.data)
          // Wait for done or error — we don't need to show tokens here
          if (msg.type === 'done' || msg.type === 'error') {
            es.close()
            resolve()
          }
        }

        es.onerror = () => {
          // Fail silently — insight generation failing should not block redirect
          es.close()
          resolve()
        }

        // Hard timeout — redirect after 45s regardless
        setTimeout(() => { es.close(); resolve() }, 45000)
      })

      // ── Stage 3: Done ─────────────────────────────────────────────────
      setStage('done')
      setTimeout(() => navigate('/dashboard'), 1000)

    } catch (err) {
      setErrorMsg(err.message)
      setStage('error')
    }
  }

  const reset = () => {
    setStage('idle')
    setFile(null)
    setProgress(0)
    setErrorMsg('')
  }

  const isProcessing = ['uploading', 'ml', 'insights', 'finishing'].includes(stage)
  const stageInfo    = STAGE_TEXT[stage] || {}

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      {/* Background grid */}
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px),
                          linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
        backgroundSize: '48px 48px', opacity: 0.3,
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', padding: '100px 24px 60px',
      }}>
        <div style={{ width: '100%', maxWidth: '560px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 style={{
              fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px',
              marginBottom: '8px', textAlign: 'center',
            }}>
              Upload Customer Dataset
            </h1>
            <p style={{
              color: 'var(--text-secondary)', textAlign: 'center',
              marginBottom: '40px', fontSize: '15px',
            }}>
              CSV format · Standard telecom churn dataset
            </p>

            <AnimatePresence mode="wait">

              {/* ── Done ── */}
              {stage === 'done' && (
                <motion.div key="done"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    padding: '56px', borderRadius: '16px',
                    border: '1px solid #166534',
                    background: 'rgba(34,197,94,0.06)',
                    textAlign: 'center',
                  }}
                >
                  <CheckCircle size={48} color="var(--success)" style={{ margin: '0 auto 16px' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--success)' }}>
                    Analysis complete!
                  </h3>
                  <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '14px' }}>
                    Redirecting to dashboard...
                  </p>
                </motion.div>
              )}

              {/* ── Error ── */}
              {stage === 'error' && (
                <motion.div key="error"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    padding: '40px', borderRadius: '16px',
                    border: '1px solid #7f1d1d',
                    background: 'rgba(239,68,68,0.06)',
                    textAlign: 'center',
                  }}
                >
                  <AlertCircle size={40} color="var(--danger)" style={{ margin: '0 auto 16px' }} />
                  <p style={{ color: 'var(--danger)', fontSize: '15px', marginBottom: '20px' }}>
                    {errorMsg}
                  </p>
                  <button onClick={reset} style={{
                    padding: '9px 20px', borderRadius: '8px',
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '14px',
                  }}>
                    Try again
                  </button>
                </motion.div>
              )}

              {/* ── Processing ── */}
              {isProcessing && (
                <motion.div key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    padding: '56px 40px', borderRadius: '16px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-card)', textAlign: 'center',
                  }}
                >
                  {/* Spinner — purple during insights stage */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                    style={{
                      width: 48, height: 48, margin: '0 auto 24px',
                      borderRadius: '50%',
                      border: '3px solid var(--border)',
                      borderTopColor: stage === 'insights' ? '#a855f7' : 'var(--accent)',
                    }}
                  />

                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
                    {stageInfo.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>
                    {stageInfo.sub}
                  </p>

                  {/* Progress bar — only during file upload */}
                  {stage === 'uploading' && (
                    <div>
                      <div style={{
                        height: 4, borderRadius: 2,
                        background: 'var(--border)', overflow: 'hidden', marginBottom: '8px',
                      }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          style={{ height: '100%', background: 'var(--accent)', borderRadius: 2 }}
                        />
                      </div>
                      <span style={{
                        fontSize: '12px', color: 'var(--text-muted)',
                        fontFamily: 'JetBrains Mono, monospace',
                      }}>
                        {progress}%
                      </span>
                    </div>
                  )}

                  {/* Step indicators */}
                  <div style={{
                    display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '28px',
                  }}>
                    {[
                      { key: 'uploading', label: 'Upload' },
                      { key: 'ml',        label: 'ML' },
                      { key: 'insights',  label: 'AI Insights' },
                    ].map((step, i) => {
                      const stages  = ['uploading', 'ml', 'insights']
                      const current = stages.indexOf(stage)
                      const thisIdx = stages.indexOf(step.key)
                      const done    = thisIdx < current
                      const active  = thisIdx === current

                      return (
                        <div key={step.key} style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                        }}>
                          <div style={{
                            width: 7, height: 7, borderRadius: '50%',
                            background: done
                              ? 'var(--success)'
                              : active
                                ? (stage === 'insights' ? '#a855f7' : 'var(--accent)')
                                : 'var(--border)',
                            transition: 'background 0.3s',
                          }} />
                          <span style={{
                            fontSize: '11px',
                            color: active ? 'var(--text-secondary)' : 'var(--text-muted)',
                          }}>
                            {step.label}
                          </span>
                          {i < 2 && (
                            <div style={{
                              width: 20, height: 1,
                              background: done ? 'var(--success)' : 'var(--border)',
                              marginLeft: '2px',
                            }} />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* ── Upload box ── */}
              {(stage === 'idle' || stage === 'selected') && (
                <motion.div key="upload-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => stage === 'idle' && fileRef.current.click()}
                    style={{
                      padding: '56px 40px', borderRadius: '16px',
                      border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border-bright)'}`,
                      background: isDragging ? 'rgba(79,142,247,0.05)' : 'var(--bg-card)',
                      textAlign: 'center',
                      cursor: stage === 'idle' ? 'pointer' : 'default',
                      transition: 'all 0.2s',
                    }}
                  >
                    <input
                      ref={fileRef} type="file" accept=".csv"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFile(e.target.files[0])}
                    />

                    {file ? (
                      <div>
                        <FileText size={40} color="var(--accent)" style={{ margin: '0 auto 16px' }} />
                        <p style={{ fontWeight: 600, marginBottom: '6px' }}>{file.name}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                        <button
                          onClick={(e) => { e.stopPropagation(); reset() }}
                          style={{
                            marginTop: '12px', background: 'none', border: 'none',
                            color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px',
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                          }}
                        >
                          <X size={13} /> Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <UploadCloud size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
                        <p style={{ fontWeight: 500, marginBottom: '8px' }}>Drop your CSV here</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>
                          or click to browse files
                        </p>
                        <span style={{
                          display: 'inline-block', padding: '8px 18px', borderRadius: '8px',
                          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                          fontSize: '13px', color: 'var(--text-secondary)',
                        }}>
                          Select File
                        </span>
                      </div>
                    )}
                  </div>

                  {stage === 'selected' && (
                    <motion.button
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={handleUpload}
                      style={{
                        width: '100%', marginTop: '16px', padding: '14px',
                        borderRadius: '10px', border: 'none',
                        background: 'var(--accent)', color: 'white',
                        fontSize: '15px', fontWeight: 600, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      }}
                    >
                      <UploadCloud size={18} /> Analyze Dataset
                    </motion.button>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}