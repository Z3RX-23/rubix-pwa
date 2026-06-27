import fs from 'fs';

// === Parse Full OLL ===
let rawOll = fs.readFileSync('C:/Users/guine/.local/share/opencode/tool-output/tool_f08852a840013iaqol3B0tywm2', 'utf8');
const ollMatch = rawOll.match(/algsetAlgs=\[([\s\S]*?)\],algsetScrambles=/);
const ollData = ollMatch[1];
const ollAlgs = [];
const ollRegex = /\{name:(\d+),alg:\[([^\]]*?)\],group:"([^"]+)",prob:\d+(?:,mask:"[^"]+")?\}/g;
let m;
while ((m = ollRegex.exec(ollData)) !== null) {
  const num = parseInt(m[1]);
  let rawAlgs = m[2];
  let parts = [];
  let current = '';
  let inQuote = false;
  for (let ch of rawAlgs) {
    if (ch === '"') { inQuote = !inQuote; current += ch; }
    else if (ch === ',' && !inQuote) { parts.push(current.trim()); current = ''; }
    else { current += ch; }
  }
  if (current.trim()) parts.push(current.trim());
  const notation = parts[0].replace(/^"|"$/g, '');
  ollAlgs.push({ num, notation });
}

// === Full PLL (from earlier fetch) ===
const pllAlgs = [
  { name: 'H', notation: "M2 U M2 U2 M2 U M2" },
  { name: 'Z', notation: "M' U M2 U M2 U M' U2 M2" },
  { name: 'Ua', notation: "M2 U M U2 M' U M2" },
  { name: 'Ub', notation: "M2 U' M U2 M' U' M2" },
  { name: 'Aa', notation: "x L2 D2 L' U' L D2 L' U L'" },
  { name: 'Ab', notation: "x' L2 D2 L U L' D2 L U' L" },
  { name: 'E', notation: "x' L' U L D' L' U' L D L' U' L D' L' U L D" },
  { name: 'F', notation: "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R" },
  { name: 'Ja', notation: "x R2 F R F' R U2 r' U r U2" },
  { name: 'Jb', notation: "R U R' F' R U R' U' R' F R2 U' R'" },
  { name: 'Ra', notation: "R U' R' U' R U R D R' U' R D' R' U2 R'" },
  { name: 'Rb', notation: "R2 F R U R U' R' F' R U2 R' U2 R" },
  { name: 'T', notation: "R U R' U' R' F R2 U' R' U' (R U R') F'" },
  { name: 'Y', notation: "F R U' R' U' R U R' F' R U R' U' R' F R F'" },
  { name: 'V', notation: "R' U R' U' y R' F' R2 U' R' U R' F R F" },
  { name: 'Na', notation: "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'" },
  { name: 'Nb', notation: "R' (U R U' R') F' U' F R U R' F R' F' R U' R" },
  { name: 'Ga', notation: "R2 U R' U R' U' R U' R2 (U' D) R' U R D'" },
  { name: 'Gb', notation: "R' U' R (U D') R2 U R' U R U' R U' R2 D" },
  { name: 'Gc', notation: "R2 U' R U' R U R' U R2 (U D') R U' R' D" },
  { name: 'Gd', notation: "R U R' (U' D) R2 U' R U' R' U R' U R2 D'" },
];

// === Generate cfop-seed.ts ===
let output = `export const cfopSeed = {
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
`;

// Cross (intuitive, keep basic)
output += `    // === CROSS (intuitive) ===
    { stepId: 'cross', name: 'Cross', notation: 'Intuitive', difficulty: 1 },

    // === F2L (intuitive) ===
    { stepId: 'f2l', name: 'F2L', notation: 'Intuitive', difficulty: 1 },

`;

// 2-Look OLL (10)
output += `    // === 2-LOOK OLL (10) from JPerm ===
    { stepId: 'oll_2look', name: 'I-Shape', notation: "F R U R' U' F'", difficulty: 1 },
    { stepId: 'oll_2look', name: 'L-Shape', notation: "f R U R' U' f'", difficulty: 1 },
    { stepId: 'oll_2look', name: 'Dot Shape', notation: "F R U R' U' F' f R U R' U' f'", difficulty: 3 },
    { stepId: 'oll_2look', name: 'H', notation: "R U R' U R U' R' U R U2 R'", difficulty: 2 },
    { stepId: 'oll_2look', name: 'Pi', notation: "R U2 (R2 U' R2 U' R2) U2 R", difficulty: 2 },
    { stepId: 'oll_2look', name: 'U', notation: "R2 D R' U2 R D' R' U2 R'", difficulty: 2 },
    { stepId: 'oll_2look', name: 'T', notation: "r U R' U' r' F R F'", difficulty: 2 },
    { stepId: 'oll_2look', name: 'L', notation: "F R' F' r U R U' r'", difficulty: 2 },
    { stepId: 'oll_2look', name: 'Antisune', notation: "R U2 R' U' R U' R'", difficulty: 1 },
    { stepId: 'oll_2look', name: 'Sune', notation: "R U R' U R U2 R'", difficulty: 1 },

`;

// Full OLL (57)
output += `    // === FULL OLL (57) from JPerm ===\n`;
for (const a of ollAlgs) {
  output += `    { stepId: 'oll_full', name: 'OLL ${a.num}', notation: "${a.notation}", difficulty: ${a.num <= 8 ? 1 : a.num <= 27 ? 2 : a.num <= 45 ? 3 : 4} },\n`;
}
output += '\n';

// 2-Look PLL (6)
output += `    // === 2-LOOK PLL (6) from JPerm ===
    { stepId: 'pll_2look', name: 'Headlights', notation: "R U R' U' R' F R2 U' R' U' R U R' F'", difficulty: 2 },
    { stepId: 'pll_2look', name: 'Diagonal', notation: "F R U' R' U' R U R' F' R U R' U' R' F R F'", difficulty: 3 },
    { stepId: 'pll_2look', name: 'PLL (H)', notation: "M2 U M2 U2 M2 U M2", difficulty: 1 },
    { stepId: 'pll_2look', name: 'PLL (Z)', notation: "M' U (M2 U M2 U) M' U2 M2", difficulty: 3 },
    { stepId: 'pll_2look', name: 'PLL (Ua)', notation: "R U' (R U R U) R U' R' U' R2", difficulty: 2 },
    { stepId: 'pll_2look', name: 'PLL (Ub)', notation: "R2 U (R U R' U') R' U' R' U R'", difficulty: 2 },

`;

// Full PLL (21)
output += `    // === FULL PLL (21) from JPerm ===\n`;
for (const a of pllAlgs) {
  output += `    { stepId: 'pll_full', name: '${a.name}-Perm', notation: "${a.notation}", difficulty: ${['H','Z','Ua','Ub'].includes(a.name) ? 1 : ['Aa','Ab','T','Y','Ja','Jb'].includes(a.name) ? 2 : ['F','Ra','Rb','V','Ga','Gb','Gc','Gd'].includes(a.name) ? 3 : 4} },\n`;
}

output += `  ]
};
`;

fs.writeFileSync('C:/Users/guine/Documents/Projetos/AppRubix/rubix-pwa/src/data/cfop-seed.ts', output);
console.log('Done! cfop-seed.ts generated.');
