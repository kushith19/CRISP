import { useState, useEffect } from 'react'
import { getAnalytics } from '../services/api'

export function useAnalytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await getAnalytics()
      setData(res.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  return { data, loading, error, refetch: fetchAnalytics }
}