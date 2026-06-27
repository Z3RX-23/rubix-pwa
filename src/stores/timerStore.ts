import { create } from 'zustand'

interface TimerState {
  isRunning: boolean
  isInspecting: boolean
  currentTime: number
  inspectionTime: number
  scramble: string
  lastSolve: number | null
  previousSolves: number[]
  setRunning: (val: boolean) => void
  setInspecting: (val: boolean) => void
  setCurrentTime: (val: number) => void
  setInspectionTime: (val: number) => void
  setScramble: (val: string) => void
  addSolve: (time: number) => void
  reset: () => void
}

export const useTimerStore = create<TimerState>((set, get) => ({
  isRunning: false,
  isInspecting: false,
  currentTime: 0,
  inspectionTime: 15,
  scramble: '',
  lastSolve: null,
  previousSolves: [],

  setRunning: (val) => set({ isRunning: val }),
  setInspecting: (val) => set({ isInspecting: val }),
  setCurrentTime: (val) => set({ currentTime: val }),
  setInspectionTime: (val) => set({ inspectionTime: val }),
  setScramble: (val) => set({ scramble: val }),

  addSolve: (time) => {
    const { previousSolves } = get()
    set({ lastSolve: time, previousSolves: [time, ...previousSolves].slice(0, 100) })
  },

  reset: () => set({
    isRunning: false,
    isInspecting: false,
    currentTime: 0,
    inspectionTime: 15,
    lastSolve: null
  })
}))
