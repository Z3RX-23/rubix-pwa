export function ao5(arr: number[]): number | null {
  if (arr.length < 5) return null
  const recent = arr.slice(0, 5)
  const sorted = [...recent].sort((a, b) => a - b)
  return sorted.slice(1, 4).reduce((a, b) => a + b, 0) / 3
}

export function ao12(arr: number[]): number | null {
  if (arr.length < 12) return null
  const recent = arr.slice(0, 12)
  const sorted = [...recent].sort((a, b) => a - b)
  return sorted.slice(1, 11).reduce((a, b) => a + b, 0) / 10
}

export function bestTime(arr: number[]): number | null {
  if (arr.length === 0) return null
  return Math.min(...arr)
}

export function stdDev(arr: number[]): number | null {
  if (arr.length < 2) return null
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length
  const variance = arr.reduce((sum, val) => sum + (val - mean) ** 2, 0) / arr.length
  return Math.sqrt(variance)
}

export function countPenalties(solves: { penalty: string }[]): { plus2: number; dnf: number; clean: number } {
  return {
    plus2: solves.filter(s => s.penalty === '+2').length,
    dnf: solves.filter(s => s.penalty === 'DNF').length,
    clean: solves.filter(s => s.penalty === 'none').length
  }
}
