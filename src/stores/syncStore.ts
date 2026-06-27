import { create } from 'zustand'

interface SyncState {
  status: 'idle' | 'syncing' | 'error'
  lastSync: number | null
  error: string | null
  setStatus: (val: 'idle' | 'syncing' | 'error') => void
  setLastSync: (val: number) => void
  setError: (val: string | null) => void
}

export const useSyncStore = create<SyncState>((set) => ({
  status: 'idle',
  lastSync: null,
  error: null,
  setStatus: (val) => set({ status: val }),
  setLastSync: (val) => set({ lastSync: val }),
  setError: (val) => set({ error: val })
}))
