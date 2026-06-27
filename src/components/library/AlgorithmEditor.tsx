import { useState } from 'react'
import { AlgorithmCube } from '../cube/AlgorithmCube'
import type { Algorithm, Step } from '../../types/database'

interface AlgorithmEditorProps {
  algorithm?: Algorithm
  stepId?: string
  steps?: Step[]
  mask?: string
  onSave: (alg: Partial<Algorithm>) => void
  onDelete?: (id: string) => void
  onClose: () => void
}

export function AlgorithmEditor({ algorithm, stepId: initialStepId, steps, mask, onSave, onDelete, onClose }: AlgorithmEditorProps) {
  const [name, setName] = useState(algorithm?.name || '')
  const [notation, setNotation] = useState(algorithm?.notation || '')
  const [altNotations, setAltNotations] = useState(algorithm?.altNotations?.join('\n') || '')
  const [stepId, setStepId] = useState(algorithm?.stepId || initialStepId || '')
  const [view3d, setView3d] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentStep = steps?.find(s => s.id === stepId)
  const supports3d = currentStep?.viewMode === '3d'
  const effectiveView = view3d && supports3d ? '3d' as const : 'plan' as const

  const handleSave = () => {
    if (!name.trim()) { setError('Name is required'); return }
    if (!notation.trim()) { setError('Notation is required'); return }
    if (!stepId) { setError('Step is required'); return }

    onSave({
      ...algorithm,
      stepId,
      name: name.trim(),
      notation: notation.trim(),
      altNotations: altNotations ? altNotations.split('\n').map(s => s.trim()).filter(Boolean) : [],
      updatedAt: Date.now()
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black opacity-60" />
      <div className="relative bg-background border border-border shadow-2xl rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-4 space-y-4" onClick={e => e.stopPropagation()}>
        <h3 className="font-semibold">{algorithm ? 'Edit Algorithm' : 'New Algorithm'}</h3>

        <div className="flex flex-col items-center gap-2">
          <AlgorithmCube alg={notation || "R U R' U'"} size={120} view={effectiveView} mask={mask} />
          {supports3d && (
            <div className="flex gap-2">
              <button
                onClick={() => setView3d(false)}
                className={`text-xs px-2 py-1 rounded border ${!view3d ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
              >
                Plan
              </button>
              <button
                onClick={() => setView3d(true)}
                className={`text-xs px-2 py-1 rounded border ${view3d ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
              >
                3D
              </button>
            </div>
          )}
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}

        {!algorithm && steps && steps.length > 0 && (
          <div>
            <label className="text-xs text-muted-foreground">Step</label>
            <select
              value={stepId}
              onChange={e => setStepId(e.target.value)}
              className="w-full px-3 py-2 bg-background border rounded-lg text-sm"
            >
              <option value="">Select step...</option>
              {steps.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="text-xs text-muted-foreground">Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm"
            placeholder="T-Perm"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground">Notation</label>
          <input
            type="text"
            value={notation}
            onChange={e => { setNotation(e.target.value); setError(null) }}
            className="w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm font-mono"
            placeholder="R U R' U' R' F R2 U' R' U' R U R' F'"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground">Alternative notations (one per line)</label>
          <textarea
            value={altNotations}
            onChange={e => setAltNotations(e.target.value)}
            className="w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm font-mono"
            rows={3}
            placeholder="y R U R' U' R' F R ..."
          />
        </div>

        <div className="flex gap-2">
          {algorithm && onDelete && (
            <button
              onClick={() => onDelete(algorithm.id)}
              className="px-3 py-2 text-sm border border-destructive/50 text-destructive rounded-lg hover:bg-destructive/10"
            >
              Delete
            </button>
          )}
          <button onClick={onClose} className="flex-1 py-2 text-sm border rounded-lg hover:bg-accent">Cancel</button>
          <button onClick={handleSave} className="flex-1 py-2 text-sm bg-primary text-primary-foreground rounded-lg">Save</button>
        </div>
      </div>
    </div>
  )
}
