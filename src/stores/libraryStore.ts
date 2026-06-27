import { create } from 'zustand'
import { db, checkIndexedDBAvailable } from '../services/db'
import { enqueueSync } from '../services/sync'
import type { Method, Step, Algorithm } from '../types/database'
import { cfopSeed } from '../data/cfop-seed'

interface LibraryState {
  methods: Method[]
  steps: Step[]
  algorithms: Algorithm[]
  selectedMethod: string | null
  selectedStep: string | null
  loading: boolean
  dbReady: boolean
  dbError: string | null
  initializeDB: () => Promise<void>
  loadSeed: (userId: string) => Promise<void>
  loadMethods: () => Promise<void>
  loadSteps: (methodId: string) => Promise<void>
  loadAlgorithms: (stepId: string) => Promise<void>
  selectMethod: (id: string | null) => void
  selectStep: (id: string | null) => void
  addAlgorithm: (alg: Algorithm) => Promise<void>
  updateAlgorithm: (alg: Algorithm) => Promise<void>
  deleteAlgorithm: (id: string) => Promise<void>
  reorderAlgorithms: (ids: string[]) => Promise<void>
}

const safeDB = async <T>(fn: () => Promise<T>, fallback: T, context: string): Promise<T> => {
  try {
    return await fn()
  } catch (err) {
    console.error(`[LibraryStore] ${context}:`, err)
    return fallback
  }
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  methods: [],
  steps: [],
  algorithms: [],
  selectedMethod: null,
  selectedStep: null,
  loading: false,
  dbReady: false,
  dbError: null,

  initializeDB: async () => {
    const available = await checkIndexedDBAvailable()
    if (!available) {
      set({ dbReady: true, dbError: 'IndexedDB não disponível (modo privado?). Funcionalidades offline desativadas.' })
      return
    }
    const ready = await db.waitUntilReady()
    if (!ready) {
      set({ dbReady: true, dbError: 'Falha ao abrir base de dados local.' })
      return
    }
    set({ dbReady: true, dbError: null })
  },

  loadSeed: async (userId) => {
    const { dbReady, dbError } = get()
    if (!dbReady || dbError) {
      console.warn('[LibraryStore] DB not ready, skipping seed')
      return
    }
    try {
      const count = await db.methods.count()

      // Update existing algorithms with arrows if missing
      if (count > 0) {
        let updated = false
        for (const alg of cfopSeed.algorithms) {
          if (!alg.arrows) continue
          const existing = await db.algorithms.where({ stepId: alg.stepId, name: alg.name }).first()
          if (existing && !existing.arrows) {
            existing.arrows = alg.arrows
            existing.updatedAt = Date.now()
            await db.algorithms.put(existing)
            updated = true
          }
        }
        if (updated) {
          console.log('[LibraryStore] Arrows updated for existing algorithms')
          const { selectedStep } = get()
          if (selectedStep) get().loadAlgorithms(selectedStep)
        }
        return
      }

      console.log('[LibraryStore] Seeding CFOP data...')
      for (const method of cfopSeed.methods) {
        await db.methods.put(method)
      }
      for (const step of cfopSeed.steps) {
        await db.steps.put(step)
      }
      let order = 0
      for (const alg of cfopSeed.algorithms) {
        await db.algorithms.put({
          ...alg,
          order: order++,
          id: crypto.randomUUID(),
          userId,
          isPublic: false,
          createdAt: Date.now(),
          updatedAt: Date.now()
        })
      }
      console.log('[LibraryStore] Seed complete')
      await get().loadMethods()
    } catch (err) {
      console.error('[LibraryStore] Seed failed:', err)
    }
  },

  loadMethods: async () => {
    const methods = await safeDB(() => db.methods.orderBy('order').toArray(), [], 'loadMethods')
    set({ methods })
  },

  loadSteps: async (methodId) => {
    const steps = await safeDB(() => db.steps.where('methodId').equals(methodId).sortBy('order'), [], 'loadSteps')
    set({ steps })
  },

  loadAlgorithms: async (stepId) => {
    const algorithms = await safeDB(async () => {
      const algs = await db.algorithms.where('stepId').equals(stepId).toArray()
      return algs.sort((a, b) => a.order - b.order)
    }, [], 'loadAlgorithms')
    set({ algorithms })
  },

  reorderAlgorithms: async (ids: string[]) => {
    const { selectedStep } = get()
    if (!selectedStep) return
    const algs = await safeDB(async () => {
      return await db.algorithms.where('stepId').equals(selectedStep).toArray()
    }, [], 'reorderAlgorithms')
    for (let i = 0; i < ids.length; i++) {
      const alg = algs.find(a => a.id === ids[i])
      if (alg) {
        alg.order = i
        await db.algorithms.put(alg)
      }
    }
    set({ algorithms: ids.map((id, i) => {
      const a = algs.find(alg => alg.id === id)!
      return { ...a, order: i }
    }) })
  },

  selectMethod: (id) => {
    set({ selectedMethod: id, selectedStep: null, algorithms: [] })
    if (id) get().loadSteps(id)
  },

  selectStep: (id) => {
    set({ selectedStep: id })
    if (id) get().loadAlgorithms(id)
  },

  addAlgorithm: async (alg) => {
    await safeDB(() => db.algorithms.put(alg), undefined, 'addAlgorithm')
    enqueueSync('algorithms', 'create', alg)
    const { selectedStep } = get()
    if (selectedStep) get().loadAlgorithms(selectedStep)
  },

  updateAlgorithm: async (alg) => {
    await safeDB(() => db.algorithms.put(alg), undefined, 'updateAlgorithm')
    enqueueSync('algorithms', 'update', alg)
    const { selectedStep } = get()
    if (selectedStep) get().loadAlgorithms(selectedStep)
  },

  deleteAlgorithm: async (id) => {
    await safeDB(() => db.algorithms.delete(id), undefined, 'deleteAlgorithm')
    enqueueSync('algorithms', 'delete', { id })
    const { selectedStep } = get()
    if (selectedStep) get().loadAlgorithms(selectedStep)
  }
}))