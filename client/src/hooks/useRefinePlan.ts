import { useState, useCallback } from 'react'
import { Plan } from '@/types/plan'

interface UseRefinePlanReturn {
  loading: boolean
  error: string | null
  refine: (plan: Plan, instruction: string) => Promise<Plan | null>
  refineAction: (plan: Plan, action: string) => Promise<Plan | null>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  setError: React.Dispatch<React.SetStateAction<string | null>>
}

// Match the backend generation timeout.
export const REFINE_TIMEOUT_MS = 120_000

async function postPlan(url: string, body: unknown, timeoutMs: number): Promise<Plan | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      const detail = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail ?? data)
      throw new Error(detail || `Request failed (${res.status})`)
    }
    return (await res.json()) as Plan
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw new Error('Request timed out after 2 minutes. Please try again.')
    }
    throw e
  } finally {
    clearTimeout(timer)
  }
}

export function useRefinePlan(apiBaseUrl: string): UseRefinePlanReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(async (fn: () => Promise<Plan | null>): Promise<Plan | null> => {
    setLoading(true)
    setError(null)
    try {
      return await fn()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Refinement failed')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const refine = useCallback(
    (plan: Plan, instruction: string) =>
      run(() => postPlan(`${apiBaseUrl}/api/refine`, { plan, instruction }, REFINE_TIMEOUT_MS)),
    [apiBaseUrl, run]
  )

  const refineAction = useCallback(
    (plan: Plan, action: string) =>
      run(() => postPlan(`${apiBaseUrl}/api/refine-action`, { plan, action }, REFINE_TIMEOUT_MS)),
    [apiBaseUrl, run]
  )

  return { loading, error, refine, refineAction, setLoading, setError }
}
