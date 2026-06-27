import { create } from 'zustand'
import { db } from '../services/db'
import { enqueueSync } from '../services/sync'
import type { UserProgress, ProgressStatus } from '../types/database'

interface ProgressState {
  progressMap: Record<string, UserProgress>
  loading: boolean
  loadProgress: (userId: string, algorithmIds: string[]) => Promise<void>
  setStatus: (userId: string, algorithmId: string, status: ProgressStatus) => Promise<void>
  getStatus: (algorithmId: string) => ProgressStatus
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  progressMap: {},
  loading: false,

  loadProgress: async (userId, algorithmIds) => {
    set({ loading: true })
    try {
      const progress = await db.userProgress
        .where('[userId+algorithmId]')
        .anyOf(algorithmIds.map(id => [userId, id]))
        .toArray()

      const map: Record<string, UserProgress> = {}
      for (const p of progress) {
        map[p.algorithmId] = p
      }
      set({ progressMap: map })
    } catch (err) {
      console.error('[ProgressStore] loadProgress error:', err)
    } finally {
      set({ loading: false })
    }
  },

  setStatus: async (userId, algorithmId, status) => {
    const existing = get().progressMap[algorithmId]
    const now = Date.now()

    if (existing) {
      const updated = { ...existing, status, lastPracticed: now }
      await db.userProgress.put(updated)
      enqueueSync('user_progress', 'update', updated)
      set(state => ({ progressMap: { ...state.progressMap, [algorithmId]: updated } }))
    } else {
      const entry: UserProgress = {
        userId,
        algorithmId,
        status,
        bestTime: null,
        avgTime: null,
        attempts: 0,
        lastPracticed: now,
        mastered: status === 'learned'
      }
      await db.userProgress.put(entry)
      enqueueSync('user_progress', 'create', entry)
      set(state => ({ progressMap: { ...state.progressMap, [algorithmId]: entry } }))
    }
  },

  getStatus: (algorithmId) => {
    return get().progressMap[algorithmId]?.status || 'none'
  }
}))
