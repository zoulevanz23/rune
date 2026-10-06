import { useState, useCallback } from 'react'
import { Plan } from '@/types/plan'

interface UseSharePlanReturn {
  loading: boolean
  error: string | null
  shareUrl: string | null
  share: (plan: Plan) => Promise<string | null>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  setError: React.Dispatch<React.SetStateAction<string | null>>
}

export function useSharePlan(apiBaseUrl: string): UseSharePlanReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shareUrl, setShareUrl] = useState<string | null>(null)

  const share = useCallback(async (plan: Plan): Promise<string | null> => {
    setLoading(true)
    setError(null)
    setShareUrl(null)
    try {
      const res = await fetch(`${apiBaseUrl}/api/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.detail || 'Share failed')
      }
      const data = await res.json()
      const url = `${window.location.origin}/share/${data.share_id}`
      setShareUrl(url)
      return url
    } catch (e) {
      setError(typeof e === 'string' ? e : 'Share failed')
      return null
    } finally {
      setLoading(false)
    }
  }, [apiBaseUrl])

  return { loading, error, shareUrl, share, setLoading, setError }
}
