import fs from 'fs';

let raw = fs.readFileSync('C:/Users/guine/.local/share/opencode/tool-output/tool_f08852a840013iaqol3B0tywm2', 'utf8');

const match = raw.match(/algsetAlgs=\[([\s\S]*?)\],algsetScrambles=/);
if (!match) { console.log('not found'); process.exit(1); }

let data = match[1];
const algs = [];
const objRegex = /\{name:(\d+),alg:\[([^\]]*?)\],group:"([^"]+)",prob:\d+(?:,mask:"[^"]+")?\}/g;
let m;
while ((m = objRegex.exec(data)) !== null) {
  const name = m[1].replace(/'/g, '');
  let rawAlgs = m[2];
  // Split on commas between quoted strings
  let parts = [];
  let current = '';
  let inQuote = false;
  for (let ch of rawAlgs) {
    if (ch === '"') { inQuote = !inQuote; current += ch; }
    else if (ch === ',' && !inQuote) { parts.push(current.trim()); current = ''; }
    else { current += ch; }
  }
  if (current.trim()) parts.push(current.trim());
  let notation = parts[0].replace(/^"|"$/g, '');
  const group = m[3];
  algs.push({ name: parseInt(name), notation, group });
}

console.log(JSON.stringify(algs, null, 2));
