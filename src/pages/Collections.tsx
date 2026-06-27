import { useState, useEffect } from 'react'
import { Plus, Trash2, FolderHeart, ArrowLeft, X } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useCollectionStore } from '../stores/collectionStore'
import { db } from '../services/db'
import { AlgorithmCard } from '../components/library/AlgorithmCard'
import type { Algorithm } from '../types/database'

export function Collections() {
  const { user } = useAuthStore()
  const { collections, loadCollections, createCollection, deleteCollection, removeFromCollection } = useCollectionStore()
  const [newName, setNewName] = useState('')
  const [selectedCol, setSelectedCol] = useState<string | null>(null)
  const [colAlgs, setColAlgs] = useState<Algorithm[]>([])

  useEffect(() => {
    loadCollections(user?.id || 'local')
  }, [user])

  useEffect(() => {
    if (!selectedCol) { setColAlgs([]); return }
    const col = collections.find(c => c.id === selectedCol)
    if (!col || col.algorithmIds.length === 0) { setColAlgs([]); return }
    db.algorithms
      .where('id')
      .anyOf(col.algorithmIds)
      .toArray()
      .then(algs => setColAlgs(algs))
  }, [selectedCol, collections])

  const handleCreate = async () => {
    const uid = user?.id || 'local'
    if (!newName.trim()) return
    await createCollection(newName.trim(), uid)
    setNewName('')
  }

  const handleRemove = async (algId: string) => {
    if (!selectedCol) return
    await removeFromCollection(selectedCol, algId)
    setColAlgs(prev => prev.filter(a => a.id !== algId))
  }

  if (selectedCol) {
    const col = collections.find(c => c.id === selectedCol)
    return (
      <div className="p-4 max-w-lg mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedCol(null)} className="p-1.5 hover:bg-accent rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold flex-1">{col?.name || 'Collection'}</h2>
          <span className="text-xs text-muted-foreground">{colAlgs.length} algorithms</span>
        </div>

        {colAlgs.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
            <FolderHeart className="w-8 h-8" />
            <p className="text-sm">Empty collection. Add algorithms from the Library.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {colAlgs.map(alg => (
              <div key={alg.id} className="relative group">
                <AlgorithmCard algorithm={alg} />
                <button
                  onClick={() => handleRemove(alg.id)}
                  className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-destructive bg-background/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove from collection"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      <h2 className="text-lg font-semibold">Collections</h2>

      <div className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New collection name..."
          className="flex-1 px-3 py-2 text-sm bg-background border rounded-lg"
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        />
        <button
          onClick={handleCreate}
          className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {collections.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
          <FolderHeart className="w-8 h-8" />
          <p className="text-sm">No collections yet. Create one to organize your algorithms.</p>
        </div>
      )}

      <div className="space-y-2">
        {collections.map(col => (
          <div
            key={col.id}
            onClick={() => setSelectedCol(col.id)}
            className="flex items-center justify-between w-full bg-card rounded-lg p-3 hover:bg-accent/50 transition-colors cursor-pointer"
          >
            <div className="min-w-0">
              <div className="font-medium text-sm truncate">{col.name}</div>
              <div className="text-xs text-muted-foreground">{col.algorithmIds.length} algorithms</div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); deleteCollection(col.id) }}
              className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
