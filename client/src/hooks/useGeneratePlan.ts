import { useState, useCallback } from 'react'
import { Plan } from '@/types/plan'

export interface GenerateConfig {
  description: string
  methodology?: string
  sprint_count?: number
  sprint_length?: string
  scope_mode?: string
  team_velocity?: number
  num_columns?: number
  team_size?: number
  deadline?: string
  tech_stack?: string
  project_type?: string
  risk_tolerance?: string
}

interface UseGeneratePlanReturn {
  loading: boolean
  error: string | null
  generate: (config: GenerateConfig) => Promise<Plan | null>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  setError: React.Dispatch<React.SetStateAction<string | null>>
}

// 2-minute client timeout to match the backend GENERATION_TIMEOUT_SECONDS.
export const GENERATE_TIMEOUT_MS = 120_000

export function useGeneratePlan(apiBaseUrl: string): UseGeneratePlanReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = useCallback(
    async (config: GenerateConfig): Promise<Plan | null> => {
      setLoading(true)
      setError(null)
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), GENERATE_TIMEOUT_MS)
      try {
        const res = await fetch(`${apiBaseUrl}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config),
          signal: controller.signal,
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          const detail = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail ?? data)
          throw new Error(detail || `Generation failed (${res.status})`)
        }
        return (await res.json()) as Plan
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') {
          setError('Generation timed out after 2 minutes. Please try again with a shorter description or fewer sprints.')
        } else {
          setError(e instanceof Error ? e.message : 'Generation failed')
        }
        return null
      } finally {
        clearTimeout(timer)
        setLoading(false)
      }
    },
    [apiBaseUrl]
  )

  return { loading, error, generate, setLoading, setError }
}
