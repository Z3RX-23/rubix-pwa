import { useState, useEffect } from 'react'
import { Database } from 'lucide-react'
import { Sidebar } from './components/layout/Sidebar'
import { BottomNav } from './components/layout/BottomNav'
import { Header } from './components/layout/Header'
import { Library } from './pages/Library'
import { Trainer } from './pages/Trainer'
import { Collections } from './pages/Collections'
import { Profile } from './pages/Profile'
import { db } from './services/db'
import { useAuthStore } from './stores/authStore'
import { useLibraryStore } from './stores/libraryStore'
import { startSyncLoop, stopSyncLoop } from './services/sync'

const pageTitles: Record<string, string> = {
  library: 'Library',
  trainer: 'Trainer',
  collections: 'Collections',
  profile: 'Profile'
}

function DBStatusBanner({ error }: { error: string }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-destructive/10 border-b border-destructive/20 px-4 py-2">
      <div className="max-w-4xl mx-auto flex items-center gap-3 text-sm">
        <Database className="w-4 h-4 text-destructive" />
        <span className="flex-1 text-destructive">{error}</span>
        <span className="text-xs text-muted-foreground">Modo online apenas</span>
      </div>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Database className="w-12 h-12 mx-auto text-primary animate-pulse" />
        <p className="text-muted-foreground">A inicializar base de dados local...</p>
      </div>
    </div>
  )
}

function App() {
  const [currentPage, setCurrentPage] = useState('library')
  const { user, loadSession } = useAuthStore()
  const { dbReady, dbError, initializeDB, loadMethods, loadSeed } = useLibraryStore()

  useEffect(() => {
    initializeDB()
    loadSession()
  }, [])

  useEffect(() => {
    if (!dbReady) return

    const userId = user?.id || 'local'
    ;(async () => {
      await loadSeed(userId)
      await loadMethods()

      // Migrate local data to real userId on sign-in
      if (user) {
        const realId = user.id
        for (const table of ['algorithms', 'userProgress', 'collections'] as const) {
          const localRows = await (db[table] as any).where('userId').equals('local').toArray()
          for (const row of localRows) {
            row.userId = realId
            await (db[table] as any).put(row)
          }
        }

        // Update pending sync queue items that reference 'local' to use real userId
        const pendingItems = await db.syncQueue.toArray()
        for (const item of pendingItems) {
          const d = item.data as any
          if (d.userId === 'local') {
            d.userId = realId
            await db.syncQueue.put(item)
          }
        }

        startSyncLoop()
      } else {
        // Reverse migration on logout: move all data back to 'local'
        for (const table of ['algorithms', 'userProgress', 'collections'] as const) {
          const allRows = await (db[table] as any).toArray()
          for (const row of allRows) {
            if (row.userId !== 'local') {
              row.userId = 'local'
              await (db[table] as any).put(row)
            }
          }
        }
        // Also fix sync queue items back to 'local' so they're correct for next login
        const pendingItems = await db.syncQueue.toArray()
        for (const item of pendingItems) {
          const d = item.data as any
          if (d.userId && d.userId !== 'local') {
            d.userId = 'local'
            await db.syncQueue.put(item)
          }
        }
        stopSyncLoop()
      }
    })()
  }, [user, dbReady])

  if (!dbReady) return <LoadingScreen />

  const renderPage = () => {
    switch (currentPage) {
      case 'library': return <Library />
      case 'trainer': return <Trainer />
      case 'collections': return <Collections />
      case 'profile': return <Profile />
      default: return <Library />
    }
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {dbError && <DBStatusBanner error={dbError} />}
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
        <Header title={pageTitles[currentPage] || 'Rubix'} />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
      <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  )
}

export default App