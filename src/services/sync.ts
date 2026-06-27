import { db } from './db'
import { supabase } from './supabase'
import type { SyncQueue } from '../types/database'
import { useSyncStore } from '../stores/syncStore'

const SYNC_INTERVAL = 30000
let syncLoopActive = false

const TABLES = ['algorithms', 'user_progress', 'collections'] as const
type SyncTable = typeof TABLES[number]

function tableToDexie(table: SyncTable): 'algorithms' | 'userProgress' | 'collections' {
  if (table === 'algorithms') return 'algorithms'
  if (table === 'user_progress') return 'userProgress'
  return 'collections'
}

function tableToSupabase(table: SyncTable): string {
  return table
}

function now(): number {
  return Date.now()
}

export async function enqueueSync(
  table: string,
  operation: SyncQueue['operation'],
  data: unknown
) {
  try {
    if (!db.isOpen()) return
    await db.syncQueue.put({
      table,
      operation,
      data,
      timestamp: now(),
      retries: 0
    })
  } catch (err) {
    console.error('[Sync] enqueueSync failed:', err)
  }
}

async function pushItem(item: SyncQueue): Promise<boolean> {
  const supabaseTable = tableToSupabase(item.table as SyncTable)
  const data = item.data as Record<string, unknown>

  try {
    if (item.operation === 'delete') {
      let query = supabase.from(supabaseTable).delete()
      if (item.table === 'user_progress') {
        query = query
          .eq('user_id', data.userId as string)
          .eq('algorithm_id', data.algorithmId as string)
      } else {
        query = query.eq('id', data.id as string)
      }
      const { error } = await query
      if (error) throw error
    } else {
      const mapped = (() => {
        if (item.table === 'user_progress') {
          const d = data as any
          return {
            user_id: d.userId,
            algorithm_id: d.algorithmId,
            status: d.status,
            best_time: d.bestTime,
            avg_time: d.avgTime,
            attempts: d.attempts,
            last_practiced: d.lastPracticed
              ? new Date(d.lastPracticed).toISOString()
              : null,
            mastered: d.mastered || false,
            updated_at: new Date(now()).toISOString(),
            synced_at: new Date(now()).toISOString()
          }
        }
        if (item.table === 'algorithms') {
          const d = data as any
          return {
            id: d.id,
            step_id: d.stepId,
            name: d.name,
            notation: d.notation,
            alt_notations: d.altNotations || [],
            triggers: d.triggers || [],
            arrows: d.arrows || [],
            difficulty: d.difficulty || 1,
            order: d.order || 0,
            user_id: d.userId,
            is_public: d.isPublic || false,
            created_at: d.createdAt ? new Date(d.createdAt).toISOString() : new Date(now()).toISOString(),
            updated_at: new Date(now()).toISOString(),
            synced_at: new Date(now()).toISOString()
          }
        }
        if (item.table === 'collections') {
          const d = data as any
          return {
            id: d.id,
            user_id: d.userId,
            name: d.name,
            algorithm_ids: d.algorithmIds || [],
            created_at: d.createdAt ? new Date(d.createdAt).toISOString() : new Date(now()).toISOString(),
            updated_at: new Date(now()).toISOString(),
            synced_at: new Date(now()).toISOString()
          }
        }
        return data
      })()

      const conflict = item.table === 'user_progress' ? 'user_id,algorithm_id' : 'id'
      const { error } = await supabase
        .from(supabaseTable)
        .upsert(mapped, { onConflict: conflict })
      if (error) throw error
    }

    await db.syncQueue.delete(item.id!)
    return true
  } catch (err) {
    console.error(`[Sync] pushItem failed (${item.table}/${item.operation}):`, err)
    const retries = item.retries + 1
    if (retries >= 5) {
      console.warn(`[Sync] Discarding ${item.table}/${item.operation} after ${retries} retries`)
      await db.syncQueue.delete(item.id!)
    } else {
      await db.syncQueue.update(item.id!, { retries })
    }
    return false
  }
}

async function pushLocalChanges(): Promise<void> {
  const pending = await db.syncQueue.orderBy('timestamp').toArray()
  for (const item of pending) {
    await pushItem(item)
  }
}

async function pullRemoteChanges(userId: string): Promise<void> {
  for (const table of TABLES) {
    try {
      const dexieTable = tableToDexie(table)
      const supabaseTable = tableToSupabase(table)

      const { data: remoteRows, error } = await supabase
        .from(supabaseTable)
        .select('*')
        .eq('user_id', userId)

      if (error) {
        console.error(`[Sync] pull ${table} failed:`, error)
        continue
      }

      if (!remoteRows || remoteRows.length === 0) continue

      const table_ = db[dexieTable] as any

      for (const row of remoteRows) {
        const local = table === 'user_progress'
          ? await table_.get([row.user_id, row.algorithm_id])
          : await table_.get(row.id)
        const remoteUpdated = new Date(row.updated_at || 0).getTime()
        const localUpdated = local?.updatedAt || local?.lastPracticed || 0

        if (!local || remoteUpdated > localUpdated) {
          await table_.put(mapRemoteToLocal(table, row))
        }
      }
    } catch (err) {
      console.error(`[Sync] pull ${table} error:`, err)
    }
  }
}

function mapRemoteToLocal(table: SyncTable, row: any): any {
  const base = { ...row }

  switch (table) {
    case 'algorithms':
      return {
        id: base.id,
        stepId: base.step_id,
        name: base.name,
        notation: base.notation,
        altNotations: base.alt_notations || [],
        triggers: base.triggers || [],
        arrows: base.arrows || [],
        difficulty: base.difficulty || 1,
        order: base.order || 0,
        userId: base.user_id,
        isPublic: base.is_public || false,
        createdAt: new Date(base.created_at || now()).getTime(),
        updatedAt: new Date(base.updated_at || now()).getTime()
      }
    case 'user_progress':
      return {
        userId: base.user_id,
        algorithmId: base.algorithm_id,
        status: base.status || 'none',
        bestTime: base.best_time || null,
        avgTime: base.avg_time || null,
        attempts: base.attempts || 0,
        lastPracticed: new Date(base.last_practiced || now()).getTime(),
        mastered: base.mastered || false
      }
    case 'collections':
      return {
        id: base.id,
        userId: base.user_id,
        name: base.name,
        algorithmIds: base.algorithm_ids || [],
        createdAt: new Date(base.created_at || now()).getTime(),
        updatedAt: new Date(base.updated_at || now()).getTime()
      }
  }
}

export async function processSyncQueue() {
  const store = useSyncStore.getState()
  const userId = (await supabase.auth.getSession()).data.session?.user?.id

  if (!userId) {
    store.setStatus('idle')
    return
  }

  if (!db.isOpen()) {
    console.warn('[Sync] DB not open, skipping sync')
    return
  }

  store.setStatus('syncing')

  try {
    await pushLocalChanges()
    await pullRemoteChanges(userId)
    store.setLastSync(now())
    store.setStatus('idle')
    store.setError(null)
  } catch (err) {
    store.setStatus('error')
    store.setError(err instanceof Error ? err.message : 'Sync failed')
  }
}

export function startSyncLoop() {
  if (syncLoopActive) return
  syncLoopActive = true

  processSyncQueue()
  setInterval(processSyncQueue, SYNC_INTERVAL)
}

export function stopSyncLoop() {
  syncLoopActive = false
}
