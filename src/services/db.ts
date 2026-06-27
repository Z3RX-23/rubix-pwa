import { Dexie } from 'dexie'
import type { Table } from 'dexie'
import type {
  Method, Step, Algorithm, UserProgress,
  TimerSession, Solve, Collection, SyncQueue
} from '../types/database'

class RubixDB extends Dexie {
  methods!: Table<Method>
  steps!: Table<Step>
  algorithms!: Table<Algorithm>
  userProgress!: Table<UserProgress>
  timerSessions!: Table<TimerSession>
  solves!: Table<Solve>
  collections!: Table<Collection>
  syncQueue!: Table<SyncQueue>

  constructor() {
    super('rubix-db')

    this.version(4).stores({
      methods: 'id, order',
      steps: 'id, methodId, parentId, order',
      algorithms: 'id, stepId, userId, updatedAt, [stepId+name]',
      userProgress: '[userId+algorithmId]',
      timerSessions: 'id, userId, startedAt',
      solves: 'id, sessionId, timestamp',
      collections: 'id, userId',
      syncQueue: '++id, timestamp'
    })
  }

  async waitUntilReady(): Promise<boolean> {
    try {
      await this.open()
      return this.isOpen()
    } catch (err) {
      console.error('[DB] Failed to open:', err)
      return false
    }
  }
}

export const db = new RubixDB()

export async function checkIndexedDBAvailable(): Promise<boolean> {
  try {
    const testDb = indexedDB.open('__idb_test__')
    return await new Promise((resolve) => {
      testDb.onsuccess = () => {
        testDb.result.close()
        indexedDB.deleteDatabase('__idb_test__')
        resolve(true)
      }
      testDb.onerror = () => resolve(false)
      testDb.onblocked = () => resolve(false)
    })
  } catch {
    return false
  }
}