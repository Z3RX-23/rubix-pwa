import { useEffect, useRef } from 'react'
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useCollectionStore } from '../../stores/collectionStore'

interface CollectionPickerProps {
  algorithmId: string
  onClose: () => void
}

export function CollectionPicker({ algorithmId, onClose }: CollectionPickerProps) {
  const userId = useAuthStore(s => s.user?.id || 'local')
  const { collections, loading, loadCollections, addToCollection, removeFromCollection } = useCollectionStore()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadCollections(userId)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  const toggle = async (colId: string) => {
    const col = collections.find(c => c.id === colId)
    if (!col) return
    if (col.algorithmIds.includes(algorithmId)) {
      await removeFromCollection(colId, algorithmId)
    } else {
      await addToCollection(colId, algorithmId)
    }
  }

  if (loading) {
    return (
      <div ref={ref} className="absolute right-0 top-full mt-1 z-50 min-w-[200px] bg-popover border rounded-xl shadow-lg p-2">
        <div className="flex justify-center py-3"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-1 z-50 min-w-[200px] bg-popover border rounded-xl shadow-lg p-2 space-y-1"
    >
      <div className="text-xs font-medium text-muted-foreground px-2 py-1">Add to collection</div>
      {loading ? (
        <div className="flex justify-center py-3"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>
      ) : collections.length === 0 ? (
        <div className="text-xs text-muted-foreground px-2 py-2">No collections yet. Create one in the Collections tab.</div>
      ) : (
        collections.map(col => {
          const isIn = col.algorithmIds.includes(algorithmId)
          return (
            <button
              key={col.id}
              onClick={() => toggle(col.id)}
              className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-lg hover:bg-accent text-left transition-colors"
            >
              {isIn ? <BookmarkCheck className="w-3.5 h-3.5 text-primary shrink-0" /> : <Bookmark className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
              <span className="flex-1 truncate">{col.name}</span>
              {isIn && <span className="text-xs text-primary">Added</span>}
            </button>
          )
        })
      )}
    </div>
  )
}
