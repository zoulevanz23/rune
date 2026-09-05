import { useState, useCallback } from 'react'
import { Plan } from '@/types/plan'
import { getDB } from '@/lib/db'

export function usePlansRepository() {
  const [error, setError] = useState<string | null>(null)

  const save = useCallback(async (plan: Plan, planId?: string) => {
    try {
      const db = await getDB()
      const id = planId || crypto.randomUUID()
      const entry = {
        id,
        plan,
        projectName: plan.project_name,
        methodology: plan.methodology,
        savedAt: new Date().toISOString(),
      }
      await db.put('plans', entry)
      return id
    } catch (e) {
      setError(typeof e === 'string' ? e : 'Save failed')
      throw e
    }
  }, [])

  const load = useCallback(async (id: string): Promise<Plan | null> => {
    try {
      const db = await getDB()
      const entry = await db.get('plans', id)
      return entry?.plan ?? null
    } catch (e) {
      setError(typeof e === 'string' ? e : 'Load failed')
      return null
    }
  }, [])

  const list = useCallback(async () => {
    try {
      const db = await getDB()
      const all = await db.getAll('plans')
      return all
        .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())
        .map(({ id, projectName, methodology, savedAt }) => ({
          id, projectName, methodology, savedAt,
        }))
    } catch (e) {
      setError(typeof e === 'string' ? e : 'List failed')
      return []
    }
  }, [])

  const remove = useCallback(async (id: string) => {
    try {
      const db = await getDB()
      await db.delete('plans', id)
    } catch (e) {
      setError(typeof e === 'string' ? e : 'Delete failed')
      throw e
    }
  }, [])

  return { save, load, list, remove, error }
}
