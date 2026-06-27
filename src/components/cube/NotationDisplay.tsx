import { formatNotation, countMoves } from '../../utils/notation'
import { AlgorithmCube } from './AlgorithmCube'

interface NotationDisplayProps {
  notation: string
  name?: string
  compact?: boolean
  view?: 'plan' | '3d'
  mask?: string
}

export function NotationDisplay({ notation, name, compact, view, mask }: NotationDisplayProps) {
  return (
    <div className={`flex ${compact ? 'flex-col items-center gap-1' : 'flex-col items-center gap-1'}`}>
      <AlgorithmCube alg={notation} size={compact ? 100 : 150} view={view || 'plan'} mask={mask} />
      <div className="text-xs text-center w-full">
        {name && <div className="font-medium truncate max-w-full">{name}</div>}
        <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono block truncate">
          {formatNotation(notation)}
        </code>
        <div className="text-[10px] text-muted-foreground mt-0.5">{countMoves(notation)} moves</div>
      </div>
    </div>
  )
}
