import { create } from 'zustand'
import { db } from '../services/db'
import { enqueueSync } from '../services/sync'
import type { Collection } from '../types/database'

interface CollectionState {
  collections: Collection[]
  loading: boolean
  error: string | null
  loadCollections: (userId: string) => Promise<void>
  createCollection: (name: string, userId: string) => Promise<void>
  deleteCollection: (id: string) => Promise<void>
  addToCollection: (collectionId: string, algorithmId: string) => Promise<void>
  removeFromCollection: (collectionId: string, algorithmId: string) => Promise<void>
}

const safeDB = async <T>(fn: () => Promise<T>, fallback: T, context: string): Promise<T> => {
  try {
    return await fn()
  } catch (err) {
    console.error(`[CollectionStore] ${context}:`, err)
    return fallback
  }
}

export const useCollectionStore = create<CollectionState>((set, get) => ({
  collections: [],
  loading: false,
  error: null,

  loadCollections: async (userId) => {
    set({ loading: true, error: null })
    const collections = await safeDB(() => db.collections.where('userId').equals(userId).toArray(), [], 'loadCollections')
    set({ collections, loading: false })
  },

  createCollection: async (name, userId) => {
    try {
      const id = crypto.randomUUID()
      const now = Date.now()
      const col: Collection = { id, userId, name, algorithmIds: [], createdAt: now, updatedAt: now }
      await db.collections.put(col)
      enqueueSync('collections', 'create', col)
      get().loadCollections(userId)
    } catch (err) {
      console.error('[CollectionStore] createCollection:', err)
      set({ error: 'Falha ao criar coleção' })
    }
  },

  deleteCollection: async (id) => {
    try {
      await db.collections.delete(id)
      enqueueSync('collections', 'delete', { id })
      const { collections } = get()
      set({ collections: collections.filter(c => c.id !== id) })
    } catch (err) {
      console.error('[CollectionStore] deleteCollection:', err)
      set({ error: 'Falha ao eliminar coleção' })
    }
  },

  addToCollection: async (collectionId, algorithmId) => {
    try {
      const col = await db.collections.get(collectionId)
      if (col && !col.algorithmIds.includes(algorithmId)) {
        col.algorithmIds.push(algorithmId)
        col.updatedAt = Date.now()
        await db.collections.put(col)
        enqueueSync('collections', 'update', col)
        get().loadCollections(col.userId)
      }
    } catch (err) {
      console.error('[CollectionStore] addToCollection:', err)
      set({ error: 'Falha ao adicionar à coleção' })
    }
  },

  removeFromCollection: async (collectionId, algorithmId) => {
    try {
      const col = await db.collections.get(collectionId)
      if (col) {
        col.algorithmIds = col.algorithmIds.filter(id => id !== algorithmId)
        col.updatedAt = Date.now()
        await db.collections.put(col)
        enqueueSync('collections', 'update', col)
        get().loadCollections(col.userId)
      }
    } catch (err) {
      console.error('[CollectionStore] removeFromCollection:', err)
      set({ error: 'Falha ao remover da coleção' })
    }
  }
}))