import { useState, useCallback } from 'react'
import { Plan } from '@/types/plan'

interface UseGeneratePlanReturn {
  loading: boolean
  error: string | null
  generate: (config: Record<string, any>) => Promise<Plan | null>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  setError: React.Dispatch<React.SetStateAction<string | null>>
}

export function useGeneratePlan(apiBaseUrl: string): UseGeneratePlanReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = useCallback(async (config: Record<string, any>): Promise<Plan | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${apiBaseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.detail || 'Generation failed')
      }
      const plan: Plan = await res.json()
      return plan
    } catch (e) {
      setError(typeof e === 'string' ? e : 'Generation failed')
      return null
    } finally {
      setLoading(false)
    }
  }, [apiBaseUrl])

  return { loading, error, generate, setLoading, setError }
}
