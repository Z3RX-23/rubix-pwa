import type { ArrowDef } from '../types/cube'

const FACE_MAP: Record<string, string> = {
  'U': 'U', 'D': 'D', 'R': 'R', 'L': 'L', 'F': 'F', 'B': 'B'
}

function findArrowsForMove(move: string): ArrowDef[] {
  const arrows: ArrowDef[] = []
  const face = move[0].toUpperCase()
  const isPrime = move.includes("'")
  const isDouble = move.includes('2')

  if (!FACE_MAP[face]) return arrows

  if (face === 'U' || face === 'D') {
    const row = face === 'U' ? [0, 1, 2] : [6, 7, 8]
    if (isDouble) {
      arrows.push({ s1: `${face}${row[0]}`, s2: `${face}${row[2]}`, scale: 8 })
      arrows.push({ s1: `${face}${row[2]}`, s2: `${face}${row[0]}`, scale: 8 })
    } else if (isPrime) {
      arrows.push({ s1: `${face}${row[2]}`, s2: `${face}${row[0]}`, scale: 8, influence: 3 })
    } else {
      arrows.push({ s1: `${face}${row[0]}`, s2: `${face}${row[2]}`, scale: 8, influence: 3 })
    }
  }

  return arrows
}

export function generateArrows(alg: string): string {
  const moves = alg.split(/\s+/).filter(Boolean)
  const stickerArrows: ArrowDef[] = []

  for (const move of moves.slice(0, 3)) {
    const arrs = findArrowsForMove(move)
    stickerArrows.push(...arrs)
  }

  if (stickerArrows.length === 0) return ''
  return stickerArrows.map(a => {
    let str = `${a.s1}${a.s2}`
    if (a.s3) str += a.s3
    if (a.scale && a.scale !== 10) str += `-s${a.scale}`
    if (a.influence) str += `-i${a.influence}`
    if (a.color) str += `-${a.color}`
    return str
  }).join(',')
}
