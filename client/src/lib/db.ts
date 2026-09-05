import { openDB, DBSchema, IDBPDatabase } from 'idb'
import { Plan } from '@/types/plan'

interface SprintDraftDB extends DBSchema {
  plans: {
    key: string
    value: {
      id: string
      plan: Plan
      projectName: string
      methodology: string
      savedAt: string
    }
    indexes: {
      'by-methodology': string
    }
  }
}

let dbPromise: Promise<IDBPDatabase<SprintDraftDB>> | null = null

export function getDB(): Promise<IDBPDatabase<SprintDraftDB>> {
  if (!dbPromise) {
    dbPromise = openDB<SprintDraftDB>('sprint-draft', 1, {
      upgrade(db) {
        const store = db.createObjectStore('plans', { keyPath: 'id' })
        store.createIndex('by-methodology', 'methodology')
      },
    })
  }
  return dbPromise
}
