export interface Method {
  id: string
  name: string
  description: string
  order: number
}

export interface Step {
  id: string
  methodId: string
  name: string
  abbr: string
  order: number
  description?: string
  parentId?: string
  viewMode?: 'plan' | '3d'
}

export interface ArrowData {
  s1: { face: number; n: number }
  s2: { face: number; n: number }
  color?: string
  scale?: number
}

export interface Algorithm {
  id: string
  stepId: string
  name: string
  notation: string
  setup?: string
  altNotations?: string[]
  triggers?: string[]
  arrows?: ArrowData[]
  difficulty: 1 | 2 | 3 | 4 | 5
  order: number
  userId: string
  isPublic: boolean
  createdAt: number
  updatedAt: number
}

export type ProgressStatus = 'none' | 'learning' | 'learned'

export interface UserProgress {
  userId: string
  algorithmId: string
  status: ProgressStatus
  bestTime: number | null
  avgTime: number | null
  attempts: number
  lastPracticed: number
  mastered: boolean
}

export interface TimerSession {
  id: string
  userId: string
  event: string
  stepId?: string
  scrambles: string[]
  solves: Solve[]
  startedAt: number
  completedAt?: number
}

export interface Solve {
  id: string
  sessionId: string
  scramble: string
  time: number
  penalty: 'none' | '+2' | 'DNF'
  timestamp: number
}

export interface Collection {
  id: string
  userId: string
  name: string
  algorithmIds: string[]
  createdAt: number
  updatedAt: number
}

export interface SyncQueue {
  id?: number
  table: string
  operation: 'create' | 'update' | 'delete'
  data: unknown
  timestamp: number
  retries: number
}

export type WCAEvent = '333' | '222so' | 'pyrso'
