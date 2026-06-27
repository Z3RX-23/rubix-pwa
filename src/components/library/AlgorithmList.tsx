import { useState, useEffect, useRef } from 'react'
import { useLibraryStore } from '../../stores/libraryStore'
import { useProgressStore } from '../../stores/progressStore'
import { useAuthStore } from '../../stores/authStore'
import { AlgorithmCard } from './AlgorithmCard'
import { AlgorithmEditor } from './AlgorithmEditor'
import type { Algorithm } from '../../types/database'

function getStepMask(stepId: string): string | undefined {
  if (stepId.startsWith('oll_')) return 'oll'
  return undefined
}

export function AlgorithmList() {
  const { algorithms, selectedStep, steps, updateAlgorithm, addAlgorithm, deleteAlgorithm, reorderAlgorithms } = useLibraryStore()
  const { loadProgress, setStatus, getStatus } = useProgressStore()
  const user = useAuthStore(s => s.user)
  const [editingAlg, setEditingAlg] = useState<Algorithm | null>(null)
  const [adding, setAdding] = useState(false)
  const [reordering, setReordering] = useState(false)
  const [localAlgs, setLocalAlgs] = useState<Algorithm[]>([])
  const dragIdx = useRef<number | null>(null)

  const step = steps.find(s => s.id === selectedStep)
  const mask = selectedStep ? getStepMask(selectedStep) : undefined
  const userId = user?.id || 'local'

  useEffect(() => {
    setLocalAlgs(algorithms)
  }, [algorithms])

  useEffect(() => {
    if (algorithms.length > 0) {
      loadProgress(userId, algorithms.map(a => a.id))
    }
  }, [algorithms.length, userId])

  const handleSaveEdit = (updated: Partial<Algorithm>) => {
    if (!editingAlg) return
    updateAlgorithm({ ...editingAlg, ...updated } as Algorithm)
    setEditingAlg(null)
  }

  const handleSaveNew = async (alg: Partial<Algorithm>) => {
    if (!selectedStep) return
    await addAlgorithm({
      id: crypto.randomUUID(),
      stepId: selectedStep,
      name: alg.name || '',
      notation: alg.notation || '',
      altNotations: alg.altNotations,
      difficulty: 1,
      order: algorithms.length,
      userId,
      isPublic: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    } as Algorithm)
    setAdding(false)
  }

  const handleDelete = async (id: string) => {
    await deleteAlgorithm(id)
    setEditingAlg(null)
  }

  const handleStatusChange = (algorithmId: string, status: 'none' | 'learning' | 'learned') => {
    setStatus(userId, algorithmId, status)
  }

  const startReorder = () => {
    setLocalAlgs([...algorithms])
    setReordering(true)
  }

  const saveReorder = async () => {
    const ids = localAlgs.map(a => a.id)
    await reorderAlgorithms(ids)
    setReordering(false)
  }

  const cancelReorder = () => {
    setLocalAlgs([...algorithms])
    setReordering(false)
  }

  const handleDragStart = (idx: number) => {
    dragIdx.current = idx
  }

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    if (dragIdx.current === null || dragIdx.current === idx) return
    const updated = [...localAlgs]
    const [moved] = updated.splice(dragIdx.current, 1)
    updated.splice(idx, 0, moved)
    dragIdx.current = idx
    setLocalAlgs(updated)
  }

  const handleDrop = () => {
    dragIdx.current = null
  }

  const displayAlgs = reordering ? localAlgs : algorithms

  if (!selectedStep) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>Select a step to view algorithms</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{step?.name || 'Algorithms'}</h2>
        <div className="flex gap-2">
          {!reordering && (
            <button onClick={() => setAdding(true)} className="text-xs px-2 py-1 rounded-lg border hover:bg-accent transition-colors">
              + Add
            </button>
          )}
          {!reordering ? (
            <button onClick={startReorder} className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-lg border hover:bg-accent transition-colors">
              Reorder
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={cancelReorder} className="text-xs px-2 py-1 rounded-lg border hover:bg-accent transition-colors">
                Cancel
              </button>
              <button onClick={saveReorder} className="text-xs px-2 py-1 rounded-lg bg-primary text-primary-foreground transition-colors">
                Done
              </button>
            </div>
          )}
        </div>
      </div>

      {reordering && (
        <p className="text-xs text-muted-foreground mb-3">Drag algorithms to reorder them</p>
      )}

      <div className="flex flex-col gap-1.5">
        {displayAlgs.map((alg, idx) => (
          <div
            key={alg.id}
            draggable={reordering}
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDrop={handleDrop}
            className={reordering ? 'opacity-90' : ''}
          >
            <AlgorithmCard
              algorithm={alg}
              viewMode={step?.viewMode}
              mask={mask}
              dragHandle={reordering}
              status={!reordering ? getStatus(alg.id) : undefined}
              onStatusChange={!reordering ? (status) => handleStatusChange(alg.id, status) : undefined}
              onClick={!reordering ? () => setEditingAlg(alg) : undefined}
            />
          </div>
        ))}
      </div>

      {displayAlgs.length === 0 && (
        <p className="text-muted-foreground text-sm mt-4">No algorithms yet for this step.</p>
      )}

      {editingAlg && (
        <AlgorithmEditor
          algorithm={editingAlg}
          steps={steps}
          mask={mask}
          onSave={handleSaveEdit}
          onDelete={handleDelete}
          onClose={() => setEditingAlg(null)}
        />
      )}

      {adding && selectedStep && (
        <AlgorithmEditor
          stepId={selectedStep}
          steps={steps}
          mask={mask}
          onSave={handleSaveNew}
          onClose={() => setAdding(false)}
        />
      )}
    </div>
  )
}
