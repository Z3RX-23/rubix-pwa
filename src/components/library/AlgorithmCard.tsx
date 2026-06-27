import { useState } from 'react'
import { Bookmark } from 'lucide-react'
import { AlgorithmCube } from '../cube/AlgorithmCube'
import { formatNotation, countMoves } from '../../utils/notation'
import type { Algorithm } from '../../types/database'
import { CollectionPicker } from './CollectionPicker'

const STATUS_BG: Record<string, string> = {
  none: 'bg-muted border-muted-foreground/20',
  learning: 'bg-blue-500/20 border-blue-500',
  learned: 'bg-green-500/20 border-green-500'
}

const STATUS_DOT: Record<string, string> = {
  none: 'bg-muted-foreground/40',
  learning: 'bg-blue-500',
  learned: 'bg-green-500'
}

const STATUS_LABEL: Record<string, string> = {
  none: 'None',
  learning: 'Learning',
  learned: 'Learned'
}

interface AlgorithmCardProps {
  algorithm: Algorithm
  viewMode?: 'plan' | '3d'
  mask?: string
  status?: 'none' | 'learning' | 'learned'
  dragHandle?: boolean
  onStatusChange?: (status: 'none' | 'learning' | 'learned') => void
  onClick?: () => void
}

export function AlgorithmCard({ algorithm, viewMode, mask, status = 'none', dragHandle, onStatusChange, onClick }: AlgorithmCardProps) {
  const [showPicker, setShowPicker] = useState(false)

  const cycleStatus = (e: React.MouseEvent) => {
    e.stopPropagation()
    const next = status === 'none' ? 'learning' : status === 'learning' ? 'learned' : 'none'
    onStatusChange?.(next)
  }

  const togglePicker = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowPicker(prev => !prev)
  }

  return (
    <div className="relative">
      <div
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.() } }}
        className="flex items-center gap-4 w-full p-3 rounded-xl border bg-card hover:bg-accent/50 hover:shadow-md active:scale-[0.99] transition-all text-left cursor-pointer"
      >
        {dragHandle && (
          <div className="shrink-0 text-muted-foreground/40 cursor-grab active:cursor-grabbing select-none text-lg">
            ⠿
          </div>
        )}
        <div className="shrink-0">
          <AlgorithmCube alg={algorithm.notation} size={80} view={viewMode || 'plan'} mask={mask} arrows={algorithm.arrows} />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="font-semibold text-base truncate">{algorithm.name}</div>
          <code className="block text-sm md:text-base font-mono text-muted-foreground break-all leading-relaxed">
            {formatNotation(algorithm.notation)}
          </code>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs text-muted-foreground">{countMoves(algorithm.notation)} moves</span>
            {algorithm.setup && (
              <span
                className="inline-flex items-center gap-0.5 text-[10px] px-1 py-0.5 bg-muted rounded text-muted-foreground cursor-help"
                title={`Setup: ${algorithm.setup}`}
              >
                ⚙ Setup
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-1.5 shrink-0">
          <span
            onClick={cycleStatus}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium cursor-pointer transition-colors select-none ${STATUS_BG[status]} hover:opacity-80`}
          >
            <span className={`w-2 h-2 rounded-full ${STATUS_DOT[status]}`} />
            {STATUS_LABEL[status]}
          </span>
          <div
            onClick={togglePicker}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowPicker(prev => !prev) } }}
            className="p-1.5 text-muted-foreground hover:text-primary rounded-lg hover:bg-accent transition-colors cursor-pointer"
            title="Add to collection"
          >
            <Bookmark className="w-4 h-4" />
          </div>
        </div>
      </div>
      {showPicker && <CollectionPicker algorithmId={algorithm.id} onClose={() => setShowPicker(false)} />}
    </div>
  )
}
