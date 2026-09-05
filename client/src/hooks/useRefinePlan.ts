import { useState, useCallback } from 'react'
import { Plan } from '@/types/plan'

interface UseRefinePlanReturn {
  loading: boolean
  error: string | null
  refine: (plan: Plan, instruction: string) => Promise<Plan | null>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  setError: React.Dispatch<React.SetStateAction<string | null>>
}

export function useRefinePlan(apiBaseUrl: string): UseRefinePlanReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refine = useCallback(async (plan: Plan, instruction: string): Promise<Plan | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${apiBaseUrl}/api/refine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, instruction }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.detail || 'Refinement failed')
      }
      const updatedPlan: Plan = await res.json()
      return updatedPlan
    } catch (e) {
      setError(typeof e === 'string' ? e : 'Refinement failed')
      return null
    } finally {
      setLoading(false)
    }
  }, [apiBaseUrl])

  return { loading, error, refine, setLoading, setError }
}
