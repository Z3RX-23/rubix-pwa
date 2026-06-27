import { type WCAEvent } from '../types/database'

const cache: Record<string, string> = {}

export function generateScramble(event: WCAEvent): string {
  const cacheKey = `${event}-${Date.now()}`
  if (cache[cacheKey]) return cache[cacheKey]

  const generators: Record<WCAEvent, () => string> = {
    '333': () => {
      const moves = ["U", "U'", "U2", "D", "D'", "D2", "R", "R'", "R2", "L", "L'", "L2", "F", "F'", "F2", "B", "B'", "B2"]
      const scramble: string[] = []
      let lastFace = ''
      let lastLastFace = ''

      for (let i = 0; i < 20; i++) {
        let face: string
        let move: string
        do {
          face = moves[Math.floor(Math.random() * 18)][0]
        } while (face === lastFace || (face === lastLastFace && face === lastFace[0]))

        const randomMove = moves.filter(m => m[0] === face)
        move = randomMove[Math.floor(Math.random() * randomMove.length)]
        scramble.push(move)
        lastLastFace = lastFace
        lastFace = face
      }
      return scramble.join(' ')
    },

    '222so': () => {
      const moves = ["U", "U'", "U2", "R", "R'", "R2", "F", "F'", "F2"]
      const scramble: string[] = []
      let lastFace = ''

      for (let i = 0; i < 11; i++) {
        let face: string
        do {
          face = moves[Math.floor(Math.random() * 8)][0]
        } while (face === lastFace)

        const randomMove = moves.filter(m => m[0] === face)
        scramble.push(randomMove[Math.floor(Math.random() * randomMove.length)])
        lastFace = face
      }
      return scramble.join(' ')
    },

    'pyrso': () => {
      const moves = ["U", "U'", "U2", "R", "R'", "R2", "L", "L'", "L2", "B", "B'", "B2"]
      const scramble: string[] = []
      let lastFace = ''

      for (let i = 0; i < 10; i++) {
        let face: string
        do {
          face = moves[Math.floor(Math.random() * 12)][0]
        } while (face === lastFace)

        const randomMove = moves.filter(m => m[0] === face)
        scramble.push(randomMove[Math.floor(Math.random() * randomMove.length)])
        lastFace = face
      }
      return scramble.join(' ')
    }
  }

  const scramble = generators[event]()
  cache[cacheKey] = scramble
  return scramble
}

export const eventLabels: Record<WCAEvent, string> = {
  '333': '3x3x3',
  '222so': '2x2x2',
  'pyrso': 'Pyraminx'
}
