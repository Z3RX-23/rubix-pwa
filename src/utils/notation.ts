const VALID_MOVES = new Set([
  'U', "U'", 'U2', 'D', "D'", 'D2',
  'R', "R'", 'R2', 'L', "L'", 'L2',
  'F', "F'", 'F2', 'B', "B'", 'B2',
  'M', "M'", 'M2', 'E', "E'", 'E2',
  'S', "S'", 'S2',
  'x', "x'", 'x2', 'y', "y'", 'y2', 'z', "z'", 'z2',
  'u', "u'", 'u2', 'd', "d'", 'd2',
  'r', "r'", 'r2', 'l', "l'", 'l2',
  'f', "f'", 'f2', 'b', "b'", 'b2'
])

export function validateNotation(alg: string): { valid: boolean; error?: string } {
  const moves = alg.trim().split(/\s+/).filter(Boolean)
  if (moves.length === 0) return { valid: false, error: 'Empty algorithm' }

  for (const move of moves) {
    if (!VALID_MOVES.has(move)) {
      return { valid: false, error: `Invalid move: "${move}"` }
    }
  }

  return { valid: true }
}

export function formatNotation(alg: string): string {
  return alg
    .replace(/\s+/g, ' ')
    .replace(/\b(\w)2\b/g, '$1²')
    .trim()
}

export function countMoves(alg: string): number {
  return alg.trim().split(/\s+/).filter(Boolean).length
}
