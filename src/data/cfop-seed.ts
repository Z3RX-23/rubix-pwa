import type { Step, Algorithm } from '../types/database'

function invertAlgorithm(alg: string): string {
  return alg
    .split(/\s+/)
    .reverse()
    .map(m => {
      if (m.endsWith("'")) return m.slice(0, -1)
      if (m.endsWith('2')) return m
      if (m.startsWith('(') || m.endsWith(')')) return m
      return m + "'"
    })
    .join(' ')
}

export const cfopSeed: {
  methods: { id: string; name: string; description: string; order: number }[]
  steps: Step[]
  algorithms: Omit<Algorithm, 'id' | 'userId' | 'isPublic' | 'createdAt' | 'updatedAt' | 'order'>[]
} = {
  methods: [
    { id: 'cfop', name: 'CFOP', description: 'Cross → F2L → OLL → PLL', order: 1 }
  ],
  steps: [
    { id: 'cross', methodId: 'cfop', name: 'Cross', abbr: 'Cross', order: 1, description: 'Solve the white cross', viewMode: 'plan' },
    { id: 'f2l', methodId: 'cfop', name: 'F2L', abbr: 'F2L', order: 2, description: 'First two layers', viewMode: '3d' },
    { id: 'oll_2look', methodId: 'cfop', name: '2-Look OLL', abbr: '2L-OLL', order: 3, description: 'Two-look OLL (10 algs)', viewMode: 'plan' },
    { id: 'oll_full', methodId: 'cfop', name: 'Full OLL', abbr: 'OLL', order: 4, description: 'All 57 OLL cases', parentId: 'oll_2look', viewMode: 'plan' },
    { id: 'pll_2look', methodId: 'cfop', name: '2-Look PLL', abbr: '2L-PLL', order: 5, description: 'Two-look PLL (6 algs)', viewMode: 'plan' },
    { id: 'pll_full', methodId: 'cfop', name: 'Full PLL', abbr: 'PLL', order: 6, description: 'All 21 PLL cases', parentId: 'pll_2look', viewMode: 'plan' },
  ],
  algorithms: [
    // === CROSS (intuitive) ===
    { stepId: 'cross', name: 'Cross', notation: 'Intuitive', difficulty: 1 },

    // === F2L (41 standard cases) from JPerm ===
    { stepId: 'f2l', name: 'F2L 1', setup: "R U2 R'", notation: "U R U' R'", difficulty: 1, arrows: [] },
    { stepId: 'f2l', name: 'F2L 2', setup: "R U R'", notation: "U' R U R'", difficulty: 1, arrows: [] },
    { stepId: 'f2l', name: 'F2L 3', setup: "U R U' R'", notation: "R U' R'", difficulty: 1, arrows: [] },
    { stepId: 'f2l', name: 'F2L 4', setup: "U' R U R'", notation: "R U R'", difficulty: 1, arrows: [] },
    { stepId: 'f2l', name: 'F2L 5', setup: "R U' R' U' R U R'", notation: "U R U' R'", difficulty: 2, arrows: [] },
    { stepId: 'f2l', name: 'F2L 6', setup: "U R U R'", notation: "U' R U' R'", difficulty: 2, arrows: [] },
    { stepId: 'f2l', name: 'F2L 7', setup: "U R U2 R'", notation: "U' R U R'", difficulty: 2, arrows: [] },
    { stepId: 'f2l', name: 'F2L 8', setup: "U' R U2 R'", notation: "R U' R'", difficulty: 2, arrows: [] },
    { stepId: 'f2l', name: 'F2L 9', setup: "R U R' U R U R'", notation: "U R U' R'", difficulty: 2, arrows: [] },
    { stepId: 'f2l', name: 'F2L 10', setup: "U R U' R' U R U R'", notation: "U' R U R'", difficulty: 2, arrows: [] },
    { stepId: 'f2l', name: 'F2L 11', setup: "U' R U R' U R U' R'", notation: "R U' R'", difficulty: 2, arrows: [] },
    { stepId: 'f2l', name: 'F2L 12', setup: "R U R' U' R U R'", notation: "U' R U R'", difficulty: 2, arrows: [] },
    { stepId: 'f2l', name: 'F2L 13', setup: "R U' R' U R U' R'", notation: "U R U' R'", difficulty: 2, arrows: [] },
    { stepId: 'f2l', name: 'F2L 14', setup: "U R U' R' U' R U R'", notation: "R U R'", difficulty: 2, arrows: [] },
    { stepId: 'f2l', name: 'F2L 15', setup: "U' R U R' U' R U R'", notation: "R U' R'", difficulty: 2, arrows: [] },
    { stepId: 'f2l', name: 'F2L 16', setup: "R U R' U2 R U R'", notation: "U' R U R'", difficulty: 2, arrows: [] },
    { stepId: 'f2l', name: 'F2L 17', setup: "U R U' R' U2 R U R'", notation: "R U' R'", difficulty: 2, arrows: [] },
    { stepId: 'f2l', name: 'F2L 18', setup: "U' R U R' U2 R U' R'", notation: "R U R'", difficulty: 2, arrows: [] },
    { stepId: 'f2l', name: 'F2L 19', setup: "R U' R2 U R", notation: "U R U' R'", difficulty: 2, arrows: [] },
    { stepId: 'f2l', name: 'F2L 20', setup: "R U R2 U' R'", notation: "U' R U R'", difficulty: 2, arrows: [] },
    { stepId: 'f2l', name: 'F2L 21', setup: "R U' R' U R U2 R'", notation: "U R U' R' U R U' R'", difficulty: 2, arrows: [] },
    { stepId: 'f2l', name: 'F2L 22', setup: "U R U' R' U' R U2 R'", notation: "R U R' U R U' R'", difficulty: 2, arrows: [] },
    { stepId: 'f2l', name: 'F2L 23', setup: "U' R U R' U R U2 R'", notation: "R U' R' U' R U R'", difficulty: 2, arrows: [] },
    { stepId: 'f2l', name: 'F2L 24', setup: "R U2 R'", notation: "U2 R U' R'", difficulty: 1, arrows: [] },
    { stepId: 'f2l', name: 'F2L 25', setup: "U R U' R'", notation: "U2 R U R'", difficulty: 1, arrows: [] },
    { stepId: 'f2l', name: 'F2L 26', setup: "U' R U R'", notation: "R U2 R'", difficulty: 1, arrows: [] },
    { stepId: 'f2l', name: 'F2L 27', setup: "R U' R' U R U' R'", notation: "U2 R U' R'", difficulty: 2, arrows: [] },
    { stepId: 'f2l', name: 'F2L 28', setup: "R U R' U' R U R'", notation: "U' R U2 R'", difficulty: 2, arrows: [] },
    { stepId: 'f2l', name: 'F2L 29', setup: "U R U' R' U' R U R'", notation: "R U2 R'", difficulty: 2, arrows: [] },
    { stepId: 'f2l', name: 'F2L 30', setup: "U' R U R' U R U' R'", notation: "U2 R U R'", difficulty: 2, arrows: [] },
    { stepId: 'f2l', name: 'F2L 31', setup: "R U R' U R U' R'", notation: "U R U' R'", difficulty: 2, arrows: [] },
    { stepId: 'f2l', name: 'F2L 32', setup: "U R U' R' U2 R U R'", notation: "U' R U R' U R U' R'", difficulty: 2, arrows: [] },
    { stepId: 'f2l', name: 'F2L 33', setup: "R U R' U' R U R'", notation: "U R U2 R'", difficulty: 2, arrows: [] },
    { stepId: 'f2l', name: 'F2L 34', setup: "U' R U R' U' R U2 R'", notation: "R U R' U R U2 R'", difficulty: 2, arrows: [] },
    { stepId: 'f2l', name: 'F2L 35', setup: "R U' R' U R U' R' U R U' R'", notation: "U' R U R'", difficulty: 3, arrows: [] },
    { stepId: 'f2l', name: 'F2L 36', setup: "R U R' U2 R U' R'", notation: "U R U' R'", difficulty: 2, arrows: [] },
    { stepId: 'f2l', name: 'F2L 37', setup: "U R U' R' U R U' R'", notation: "U' R U R'", difficulty: 2, arrows: [] },
    { stepId: 'f2l', name: 'F2L 38', setup: "R U R' U R U2 R'", notation: "U R U' R' U R U' R'", difficulty: 2, arrows: [] },
    { stepId: 'f2l', name: 'F2L 39', setup: "R U' R' U' R U R'", notation: "U' R U R' U' R U R'", difficulty: 2, arrows: [] },
    { stepId: 'f2l', name: 'F2L 40', setup: "R U R' U' R U2 R'", notation: "R U' R' U R U' R'", difficulty: 2, arrows: [] },
    { stepId: 'f2l', name: 'F2L 41', setup: "R U' R' U2 R U R'", notation: "U R U' R' U R U' R'", difficulty: 2, arrows: [] },

    // === 2-LOOK OLL (10) from JPerm ===
    { stepId: 'oll_2look', name: 'I-Shape', notation: "F R U R' U' F'", setup: invertAlgorithm("F R U R' U' F'"), difficulty: 1 },
    { stepId: 'oll_2look', name: 'L-Shape', notation: "f R U R' U' f'", setup: invertAlgorithm("f R U R' U' f'"), difficulty: 1 },
    { stepId: 'oll_2look', name: 'Dot Shape', notation: "F R U R' U' F' f R U R' U' f'", setup: invertAlgorithm("F R U R' U' F' f R U R' U' f'"), difficulty: 3 },
    { stepId: 'oll_2look', name: 'H', notation: "R U R' U R U' R' U R U2 R'", setup: invertAlgorithm("R U R' U R U' R' U R U2 R'"), difficulty: 2 },
    { stepId: 'oll_2look', name: 'Pi', notation: "R U2 (R2 U' R2 U' R2) U2 R", setup: invertAlgorithm("R U2 (R2 U' R2 U' R2) U2 R"), difficulty: 2 },
    { stepId: 'oll_2look', name: 'U', notation: "R2 D R' U2 R D' R' U2 R'", setup: invertAlgorithm("R2 D R' U2 R D' R' U2 R'"), difficulty: 2 },
    { stepId: 'oll_2look', name: 'T', notation: "r U R' U' r' F R F'", setup: invertAlgorithm("r U R' U' r' F R F'"), difficulty: 2 },
    { stepId: 'oll_2look', name: 'L', notation: "F R' F' r U R U' r'", setup: invertAlgorithm("F R' F' r U R U' r'"), difficulty: 2 },
    { stepId: 'oll_2look', name: 'Antisune', notation: "R U2 R' U' R U' R'", setup: invertAlgorithm("R U2 R' U' R U' R'"), difficulty: 1 },
    { stepId: 'oll_2look', name: 'Sune', notation: "R U R' U R U2 R'", setup: invertAlgorithm("R U R' U R U2 R'"), difficulty: 1 },

    // === FULL OLL (57) from JPerm ===
    { stepId: 'oll_full', name: 'OLL 1', notation: "R U2 R' R' F R F' U2 R' F R F'", setup: invertAlgorithm("R U2 R' R' F R F' U2 R' F R F'"), difficulty: 1 },
    { stepId: 'oll_full', name: 'OLL 2', notation: "r U r' U2 r U2 R' U2 R U' r'", setup: invertAlgorithm("r U r' U2 r U2 R' U2 R U' r'"), difficulty: 1 },
    { stepId: 'oll_full', name: 'OLL 3', notation: "r' R2 U R' U r U2 r' U M'", setup: invertAlgorithm("r' R2 U R' U r U2 r' U M'"), difficulty: 1 },
    { stepId: 'oll_full', name: 'OLL 4', notation: "M U' r U2 r' U' R U' R' M'", setup: invertAlgorithm("M U' r U2 r' U' R U' R' M'"), difficulty: 1 },
    { stepId: 'oll_full', name: 'OLL 5', notation: "l' U2 L U L' U l", setup: invertAlgorithm("l' U2 L U L' U l"), difficulty: 1 },
    { stepId: 'oll_full', name: 'OLL 6', notation: "r U2 R' U' R U' r'", setup: invertAlgorithm("r U2 R' U' R U' r'"), difficulty: 1 },
    { stepId: 'oll_full', name: 'OLL 7', notation: "r U R' U R U2 r'", setup: invertAlgorithm("r U R' U R U2 r'"), difficulty: 1 },
    { stepId: 'oll_full', name: 'OLL 8', notation: "l' U' L U' L' U2 l", setup: invertAlgorithm("l' U' L U' L' U2 l"), difficulty: 1 },
    { stepId: 'oll_full', name: 'OLL 9', notation: "R U R' U' R' F R2 U R' U' F'", setup: invertAlgorithm("R U R' U' R' F R2 U R' U' F'"), difficulty: 2 },
    { stepId: 'oll_full', name: 'OLL 10', notation: "R U R' U R' F R F' R U2 R'", setup: invertAlgorithm("R U R' U R' F R F' R U2 R'"), difficulty: 2 },
    { stepId: 'oll_full', name: 'OLL 11', notation: "r U R' U R' F R F' R U2 r'", setup: invertAlgorithm("r U R' U R' F R F' R U2 r'"), difficulty: 2 },
    { stepId: 'oll_full', name: 'OLL 12', notation: "M' R' U' R U' R' U2 R U' R r'", setup: invertAlgorithm("M' R' U' R U' R' U2 R U' R r'"), difficulty: 2 },
    { stepId: 'oll_full', name: 'OLL 13', notation: "F U R U' R2 F' R U R U' R'", setup: invertAlgorithm("F U R U' R2 F' R U R U' R'"), difficulty: 2 },
    { stepId: 'oll_full', name: 'OLL 14', notation: "R' F R U R' F' R F U' F'", setup: invertAlgorithm("R' F R U R' F' R F U' F'"), difficulty: 2 },
    { stepId: 'oll_full', name: 'OLL 15', notation: "l' U' l L' U' L U l' U l", setup: invertAlgorithm("l' U' l L' U' L U l' U l"), difficulty: 2 },
    { stepId: 'oll_full', name: 'OLL 16', notation: "r U r' R U R' U' r U' r'", setup: invertAlgorithm("r U r' R U R' U' r U' r'"), difficulty: 2 },
    { stepId: 'oll_full', name: 'OLL 17', notation: "F R' F' R2 r' U R U' R' U' M'", setup: invertAlgorithm("F R' F' R2 r' U R U' R' U' M'"), difficulty: 2 },
    { stepId: 'oll_full', name: 'OLL 18', notation: "r U R' U R U2 r' r' U' R U' R' U2 r", setup: invertAlgorithm("r U R' U R U2 r' r' U' R U' R' U2 r"), difficulty: 2 },
    { stepId: 'oll_full', name: 'OLL 19', notation: "r' R U R U R' U' M' R' F R F'", setup: invertAlgorithm("r' R U R U R' U' M' R' F R F'"), difficulty: 2 },
    { stepId: 'oll_full', name: 'OLL 20', notation: "r U R' U' M2 U R U' R' U' M'", setup: invertAlgorithm("r U R' U' M2 U R U' R' U' M'"), difficulty: 2 },
    { stepId: 'oll_full', name: 'OLL 21', notation: "R U2 R' U' R U R' U' R U' R'", setup: invertAlgorithm("R U2 R' U' R U R' U' R U' R'"), difficulty: 2 },
    { stepId: 'oll_full', name: 'OLL 22', notation: "R U2 (R2 U' R2 U' R2) U2 R", setup: invertAlgorithm("R U2 (R2 U' R2 U' R2) U2 R"), difficulty: 2 },
    { stepId: 'oll_full', name: 'OLL 23', notation: "R2 D' R U2 R' D R U2 R", setup: invertAlgorithm("R2 D' R U2 R' D R U2 R"), difficulty: 2 },
    { stepId: 'oll_full', name: 'OLL 24', notation: "r U R' U' r' F R F'", setup: invertAlgorithm("r U R' U' r' F R F'"), difficulty: 2 },
    { stepId: 'oll_full', name: 'OLL 25', notation: "F' r U R' U' r' F R", setup: invertAlgorithm("F' r U R' U' r' F R"), difficulty: 2 },
    { stepId: 'oll_full', name: 'OLL 26', notation: "(R U2 R') U' R U' R'", setup: invertAlgorithm("(R U2 R') U' R U' R'"), difficulty: 2 },
    { stepId: 'oll_full', name: 'OLL 27', notation: "R U R' U R U2 R'", setup: invertAlgorithm("R U R' U R U2 R'"), difficulty: 2 },
    { stepId: 'oll_full', name: 'OLL 28', notation: "r U R' U' r' R U R U' R'", setup: invertAlgorithm("r U R' U' r' R U R U' R'"), difficulty: 3 },
    { stepId: 'oll_full', name: 'OLL 29', notation: "R U R' U' R U' R' F' U' F R U R'", setup: invertAlgorithm("R U R' U' R U' R' F' U' F R U R'"), difficulty: 3 },
    { stepId: 'oll_full', name: 'OLL 30', notation: "F R' F R2 U' R' U' R U R' F2", setup: invertAlgorithm("F R' F R2 U' R' U' R U R' F2"), difficulty: 3 },
    { stepId: 'oll_full', name: 'OLL 31', notation: "R' U' F U R U' R' F' R", setup: invertAlgorithm("R' U' F U R U' R' F' R"), difficulty: 3 },
    { stepId: 'oll_full', name: 'OLL 32', notation: "L U F' U' L' U L F L'", setup: invertAlgorithm("L U F' U' L' U L F L'"), difficulty: 3 },
    { stepId: 'oll_full', name: 'OLL 33', notation: "R U R' U' R' F R F'", setup: invertAlgorithm("R U R' U' R' F R F'"), difficulty: 3 },
    { stepId: 'oll_full', name: 'OLL 34', notation: "R U R2 U' R' F R U R U' F'", setup: invertAlgorithm("R U R2 U' R' F R U R U' F'"), difficulty: 3 },
    { stepId: 'oll_full', name: 'OLL 35', notation: "R U2 R' R' F R F' R U2 R'", setup: invertAlgorithm("R U2 R' R' F R F' R U2 R'"), difficulty: 3 },
    { stepId: 'oll_full', name: 'OLL 36', notation: "L' U' L U' L' U L U L F' L' F", setup: invertAlgorithm("L' U' L U' L' U L U L F' L' F"), difficulty: 3 },
    { stepId: 'oll_full', name: 'OLL 37', notation: "F R' F' R U R U' R'", setup: invertAlgorithm("F R' F' R U R U' R'"), difficulty: 3 },
    { stepId: 'oll_full', name: 'OLL 38', notation: "R U R' U R U' R' U' R' F R F'", setup: invertAlgorithm("R U R' U R U' R' U' R' F R F'"), difficulty: 3 },
    { stepId: 'oll_full', name: 'OLL 39', notation: "L F' L' U' L U F U' L'", setup: invertAlgorithm("L F' L' U' L U F U' L'"), difficulty: 3 },
    { stepId: 'oll_full', name: 'OLL 40', notation: "R' F R U R' U' F' U R", setup: invertAlgorithm("R' F R U R' U' F' U R"), difficulty: 3 },
    { stepId: 'oll_full', name: 'OLL 41', notation: "R U R' U R U2 R' F R U R' U' F'", setup: invertAlgorithm("R U R' U R U2 R' F R U R' U' F'"), difficulty: 3 },
    { stepId: 'oll_full', name: 'OLL 42', notation: "R' U' R U' R' U2 R F R U R' U' F'", setup: invertAlgorithm("R' U' R U' R' U2 R F R U R' U' F'"), difficulty: 3 },
    { stepId: 'oll_full', name: 'OLL 43', notation: "F' U' L' U L F", setup: invertAlgorithm("F' U' L' U L F"), difficulty: 3 },
    { stepId: 'oll_full', name: 'OLL 44', notation: "F U R U' R' F'", setup: invertAlgorithm("F U R U' R' F'"), difficulty: 3 },
    { stepId: 'oll_full', name: 'OLL 45', notation: "F R U R' U' F'", setup: invertAlgorithm("F R U R' U' F'"), difficulty: 3 },
    { stepId: 'oll_full', name: 'OLL 46', notation: "R' U' R' F R F' U R", setup: invertAlgorithm("R' U' R' F R F' U R"), difficulty: 4 },
    { stepId: 'oll_full', name: 'OLL 47', notation: "R' U' R' F R F' R' F R F' U R", setup: invertAlgorithm("R' U' R' F R F' R' F R F' U R"), difficulty: 4 },
    { stepId: 'oll_full', name: 'OLL 48', notation: "F R U R' U' R U R' U' F'", setup: invertAlgorithm("F R U R' U' R U R' U' F'"), difficulty: 4 },
    { stepId: 'oll_full', name: 'OLL 49', notation: "r U' r2 U r2 U r2 U' r", setup: invertAlgorithm("r U' r2 U r2 U r2 U' r"), difficulty: 4 },
    { stepId: 'oll_full', name: 'OLL 50', notation: "r' U r2 U' r2 U' r2 U r'", setup: invertAlgorithm("r' U r2 U' r2 U' r2 U r'"), difficulty: 4 },
    { stepId: 'oll_full', name: 'OLL 51', notation: "F U R U' R' U R U' R' F'", setup: invertAlgorithm("F U R U' R' U R U' R' F'"), difficulty: 4 },
    { stepId: 'oll_full', name: 'OLL 52', notation: "R U R' U R U' B U' B' R'", setup: invertAlgorithm("R U R' U R U' B U' B' R'"), difficulty: 4 },
    { stepId: 'oll_full', name: 'OLL 53', notation: "l' U2 L U L' U' L U L' U l", setup: invertAlgorithm("l' U2 L U L' U' L U L' U l"), difficulty: 4 },
    { stepId: 'oll_full', name: 'OLL 54', notation: "(r U2 R' U') R U R' U' R U' r'", setup: invertAlgorithm("(r U2 R' U') R U R' U' R U' r'"), difficulty: 4 },
    { stepId: 'oll_full', name: 'OLL 55', notation: "R' F R U R U' R2 F' R2 U' R' U R U R'", setup: invertAlgorithm("R' F R U R U' R2 F' R2 U' R' U R U R'"), difficulty: 4 },
    { stepId: 'oll_full', name: 'OLL 56', notation: "(r' U' r) U' R' U R U' R' U R r' U r", setup: invertAlgorithm("(r' U' r) U' R' U R U' R' U R r' U r"), difficulty: 4 },
    { stepId: 'oll_full', name: 'OLL 57', notation: "R U R' U' M' U R U' r'", setup: invertAlgorithm("R U R' U' M' U R U' r'"), difficulty: 4 },

    // === 2-LOOK PLL (6) from JPerm ===
    { stepId: 'pll_2look', name: 'Headlights', notation: "R U R' U' R' F R2 U' R' U' R U R' F'", setup: invertAlgorithm("R U R' U' R' F R2 U' R' U' R U R' F'"), difficulty: 2, arrows: [{s1:{face:0,n:3},s2:{face:0,n:5},scale:8,color:'000'},{s1:{face:0,n:5},s2:{face:0,n:3},scale:8,color:'000'},{s1:{face:0,n:2},s2:{face:0,n:8},scale:8,color:'000'},{s1:{face:0,n:8},s2:{face:0,n:2},scale:8,color:'000'}] },
    { stepId: 'pll_2look', name: 'Diagonal', notation: "F R U' R' U' R U R' F' R U R' U' R' F R F'", setup: invertAlgorithm("F R U' R' U' R U R' F' R U R' U' R' F R F'"), difficulty: 3, arrows: [{s1:{face:0,n:1},s2:{face:0,n:3},scale:8,color:'000'},{s1:{face:0,n:3},s2:{face:0,n:1},scale:8,color:'000'},{s1:{face:0,n:0},s2:{face:0,n:8},scale:8,color:'000'},{s1:{face:0,n:8},s2:{face:0,n:0},scale:8,color:'000'}] },
    { stepId: 'pll_2look', name: 'PLL (H)', notation: "M2 U M2 U2 M2 U M2", setup: invertAlgorithm("M2 U M2 U2 M2 U M2"), difficulty: 1, arrows: [{s1:{face:0,n:1},s2:{face:0,n:7},scale:8,color:'000'},{s1:{face:0,n:7},s2:{face:0,n:1},scale:8,color:'000'},{s1:{face:0,n:3},s2:{face:0,n:5},scale:8,color:'000'},{s1:{face:0,n:5},s2:{face:0,n:3},scale:8,color:'000'}] },
    { stepId: 'pll_2look', name: 'PLL (Z)', notation: "M' U (M2 U M2 U) M' U2 M2", setup: invertAlgorithm("M' U (M2 U M2 U) M' U2 M2"), difficulty: 3, arrows: [{s1:{face:0,n:3},s2:{face:0,n:7},scale:8,color:'000'},{s1:{face:0,n:7},s2:{face:0,n:3},scale:8,color:'000'},{s1:{face:0,n:1},s2:{face:0,n:5},scale:8,color:'000'},{s1:{face:0,n:5},s2:{face:0,n:1},scale:8,color:'000'}] },
    { stepId: 'pll_2look', name: 'PLL (Ua)', notation: "R U' (R U R U) R U' R' U' R2", setup: invertAlgorithm("R U' (R U R U) R U' R' U' R2"), difficulty: 2, arrows: [{s1:{face:0,n:5},s2:{face:0,n:3},scale:8,color:'000'},{s1:{face:0,n:7},s2:{face:0,n:5},scale:8,color:'000'},{s1:{face:0,n:3},s2:{face:0,n:7},scale:8,color:'000'}] },
    { stepId: 'pll_2look', name: 'PLL (Ub)', notation: "R2 U (R U R' U') R' U' R' U R'", setup: invertAlgorithm("R2 U (R U R' U') R' U' R' U R'"), difficulty: 2, arrows: [{s1:{face:0,n:3},s2:{face:0,n:5},scale:8,color:'000'},{s1:{face:0,n:5},s2:{face:0,n:7},scale:8,color:'000'},{s1:{face:0,n:7},s2:{face:0,n:3},scale:8,color:'000'}] },

    // === FULL PLL (21) from JPerm ===
    { stepId: 'pll_full', name: 'H-Perm', notation: "M2 U M2 U2 M2 U M2", setup: invertAlgorithm("M2 U M2 U2 M2 U M2"), difficulty: 1, arrows: [{s1:{face:0,n:1},s2:{face:0,n:7},scale:8,color:'000'},{s1:{face:0,n:7},s2:{face:0,n:1},scale:8,color:'000'},{s1:{face:0,n:3},s2:{face:0,n:5},scale:8,color:'000'},{s1:{face:0,n:5},s2:{face:0,n:3},scale:8,color:'000'}] },
    { stepId: 'pll_full', name: 'Z-Perm', notation: "M' U M2 U M2 U M' U2 M2", setup: invertAlgorithm("M' U M2 U M2 U M' U2 M2"), difficulty: 1, arrows: [{s1:{face:0,n:3},s2:{face:0,n:7},scale:8,color:'000'},{s1:{face:0,n:7},s2:{face:0,n:3},scale:8,color:'000'},{s1:{face:0,n:1},s2:{face:0,n:5},scale:8,color:'000'},{s1:{face:0,n:5},s2:{face:0,n:1},scale:8,color:'000'}] },
    { stepId: 'pll_full', name: 'Ua-Perm', notation: "M2 U M U2 M' U M2", setup: invertAlgorithm("M2 U M U2 M' U M2"), difficulty: 1, arrows: [{s1:{face:0,n:5},s2:{face:0,n:3},scale:8,color:'000'},{s1:{face:0,n:7},s2:{face:0,n:5},scale:8,color:'000'},{s1:{face:0,n:3},s2:{face:0,n:7},scale:8,color:'000'}] },
    { stepId: 'pll_full', name: 'Ub-Perm', notation: "M2 U' M U2 M' U' M2", setup: invertAlgorithm("M2 U' M U2 M' U' M2"), difficulty: 1, arrows: [{s1:{face:0,n:3},s2:{face:0,n:5},scale:8,color:'000'},{s1:{face:0,n:5},s2:{face:0,n:7},scale:8,color:'000'},{s1:{face:0,n:7},s2:{face:0,n:3},scale:8,color:'000'}] },
    { stepId: 'pll_full', name: 'Aa-Perm', notation: "x L2 D2 L' U' L D2 L' U L'", setup: invertAlgorithm("x L2 D2 L' U' L D2 L' U L'"), difficulty: 2, arrows: [{s1:{face:0,n:2},s2:{face:0,n:6},scale:8,color:'000'},{s1:{face:0,n:6},s2:{face:0,n:0},scale:8,color:'000'},{s1:{face:0,n:0},s2:{face:0,n:2},scale:8,color:'000'}] },
    { stepId: 'pll_full', name: 'Ab-Perm', notation: "x' L2 D2 L U L' D2 L U' L", setup: invertAlgorithm("x' L2 D2 L U L' D2 L U' L"), difficulty: 2, arrows: [{s1:{face:0,n:8},s2:{face:0,n:0},scale:8,color:'000'},{s1:{face:0,n:0},s2:{face:0,n:6},scale:8,color:'000'},{s1:{face:0,n:6},s2:{face:0,n:8},scale:8,color:'000'}] },
    { stepId: 'pll_full', name: 'E-Perm', notation: "x' L' U L D' L' U' L D L' U' L D' L' U L D", setup: invertAlgorithm("x' L' U L D' L' U' L D L' U' L D' L' U L D"), difficulty: 4, arrows: [{s1:{face:0,n:0},s2:{face:0,n:6},scale:8,color:'000'},{s1:{face:0,n:6},s2:{face:0,n:0},scale:8,color:'000'},{s1:{face:0,n:2},s2:{face:0,n:8},scale:8,color:'000'},{s1:{face:0,n:8},s2:{face:0,n:2},scale:8,color:'000'}] },
    { stepId: 'pll_full', name: 'F-Perm', notation: "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R", setup: invertAlgorithm("R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R"), difficulty: 3, arrows: [{s1:{face:0,n:1},s2:{face:0,n:7},scale:8,color:'000'},{s1:{face:0,n:7},s2:{face:0,n:1},scale:8,color:'000'},{s1:{face:0,n:2},s2:{face:0,n:8},scale:8,color:'000'},{s1:{face:0,n:8},s2:{face:0,n:2},scale:8,color:'000'}] },
    { stepId: 'pll_full', name: 'Ja-Perm', notation: "x R2 F R F' R U2 r' U r U2", setup: invertAlgorithm("x R2 F R F' R U2 r' U r U2"), difficulty: 2, arrows: [{s1:{face:0,n:1},s2:{face:0,n:5},scale:8,color:'000'},{s1:{face:0,n:5},s2:{face:0,n:1},scale:8,color:'000'},{s1:{face:0,n:2},s2:{face:0,n:8},scale:8,color:'000'},{s1:{face:0,n:8},s2:{face:0,n:2},scale:8,color:'000'}] },
    { stepId: 'pll_full', name: 'Jb-Perm', notation: "R U R' F' R U R' U' R' F R2 U' R'", setup: invertAlgorithm("R U R' F' R U R' U' R' F R2 U' R'"), difficulty: 2, arrows: [{s1:{face:0,n:5},s2:{face:0,n:7},scale:8,color:'000'},{s1:{face:0,n:7},s2:{face:0,n:5},scale:8,color:'000'},{s1:{face:0,n:2},s2:{face:0,n:8},scale:8,color:'000'},{s1:{face:0,n:8},s2:{face:0,n:2},scale:8,color:'000'}] },
    { stepId: 'pll_full', name: 'Ra-Perm', notation: "R U' R' U' R U R D R' U' R D' R' U2 R'", setup: invertAlgorithm("R U' R' U' R U R D R' U' R D' R' U2 R'"), difficulty: 3, arrows: [{s1:{face:0,n:1},s2:{face:0,n:3},scale:8,color:'000'},{s1:{face:0,n:3},s2:{face:0,n:1},scale:8,color:'000'},{s1:{face:0,n:2},s2:{face:0,n:8},scale:8,color:'000'},{s1:{face:0,n:8},s2:{face:0,n:2},scale:8,color:'000'}] },
    { stepId: 'pll_full', name: 'Rb-Perm', notation: "R2 F R U R U' R' F' R U2 R' U2 R", setup: invertAlgorithm("R2 F R U R U' R' F' R U2 R' U2 R"), difficulty: 3, arrows: [{s1:{face:0,n:3},s2:{face:0,n:7},scale:8,color:'000'},{s1:{face:0,n:7},s2:{face:0,n:3},scale:8,color:'000'},{s1:{face:0,n:2},s2:{face:0,n:8},scale:8,color:'000'},{s1:{face:0,n:8},s2:{face:0,n:2},scale:8,color:'000'}] },
    { stepId: 'pll_full', name: 'T-Perm', notation: "R U R' U' R' F R2 U' R' U' (R U R') F'", setup: invertAlgorithm("R U R' U' R' F R2 U' R' U' (R U R') F'"), difficulty: 2, arrows: [{s1:{face:0,n:3},s2:{face:0,n:5},scale:8,color:'000'},{s1:{face:0,n:5},s2:{face:0,n:3},scale:8,color:'000'},{s1:{face:0,n:2},s2:{face:0,n:8},scale:8,color:'000'},{s1:{face:0,n:8},s2:{face:0,n:2},scale:8,color:'000'}] },
    { stepId: 'pll_full', name: 'Y-Perm', notation: "F R U' R' U' R U R' F' R U R' U' R' F R F'", setup: invertAlgorithm("F R U' R' U' R U R' F' R U R' U' R' F R F'"), difficulty: 2, arrows: [{s1:{face:0,n:1},s2:{face:0,n:3},scale:8,color:'000'},{s1:{face:0,n:3},s2:{face:0,n:1},scale:8,color:'000'},{s1:{face:0,n:0},s2:{face:0,n:8},scale:8,color:'000'},{s1:{face:0,n:8},s2:{face:0,n:0},scale:8,color:'000'}] },
    { stepId: 'pll_full', name: 'V-Perm', notation: "R' U R' U' y R' F' R2 U' R' U R' F R F", setup: invertAlgorithm("R' U R' U' y R' F' R2 U' R' U R' F R F"), difficulty: 3, arrows: [{s1:{face:0,n:1},s2:{face:0,n:5},scale:8,color:'000'},{s1:{face:0,n:5},s2:{face:0,n:1},scale:8,color:'000'},{s1:{face:0,n:0},s2:{face:0,n:8},scale:8,color:'000'},{s1:{face:0,n:8},s2:{face:0,n:0},scale:8,color:'000'}] },
    { stepId: 'pll_full', name: 'Na-Perm', notation: "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'", setup: invertAlgorithm("R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'"), difficulty: 4, arrows: [{s1:{face:0,n:3},s2:{face:0,n:5},scale:8,color:'000'},{s1:{face:0,n:5},s2:{face:0,n:3},scale:8,color:'000'},{s1:{face:0,n:2},s2:{face:0,n:6},scale:8,color:'000'},{s1:{face:0,n:6},s2:{face:0,n:2},scale:8,color:'000'}] },
    { stepId: 'pll_full', name: 'Nb-Perm', notation: "R' (U R U' R') F' U' F R U R' F R' F' R U' R", setup: invertAlgorithm("R' (U R U' R') F' U' F R U R' F R' F' R U' R"), difficulty: 4, arrows: [{s1:{face:0,n:3},s2:{face:0,n:5},scale:8,color:'000'},{s1:{face:0,n:5},s2:{face:0,n:3},scale:8,color:'000'},{s1:{face:0,n:0},s2:{face:0,n:8},scale:8,color:'000'},{s1:{face:0,n:8},s2:{face:0,n:0},scale:8,color:'000'}] },
    { stepId: 'pll_full', name: 'Ga-Perm', notation: "R2 U R' U R' U' R U' R2 (U' D) R' U R D'", setup: invertAlgorithm("R2 U R' U R' U' R U' R2 (U' D) R' U R D'"), difficulty: 3 },
    { stepId: 'pll_full', name: 'Gb-Perm', notation: "R' U' R (U D') R2 U R' U R U' R U' R2 D", setup: invertAlgorithm("R' U' R (U D') R2 U R' U R U' R U' R2 D"), difficulty: 3 },
    { stepId: 'pll_full', name: 'Gc-Perm', notation: "R2 U' R U' R U R' U R2 (U D') R U' R' D", setup: invertAlgorithm("R2 U' R U' R U R' U R2 (U D') R U' R' D"), difficulty: 3 },
    { stepId: 'pll_full', name: 'Gd-Perm', notation: "R U R' (U' D) R2 U' R U' R' U R' U R2 D'", setup: invertAlgorithm("R U R' (U' D) R2 U' R U' R' U R' U R2 D'"), difficulty: 3 },
  ]
}
