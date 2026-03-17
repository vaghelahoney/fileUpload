const fs = require('fs');
const path = require('path');
const pkg = require('e:/Bharat/package.json');
const deps = Object.keys(pkg.dependencies || {});

function getFiles(dir, acc = []) {
  try {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const p = path.join(dir, f);
      if (fs.statSync(p).isDirectory()) getFiles(p, acc);
      else if (p.endsWith('.ts') || p.endsWith('.tsx')) acc.push(p);
    }
  } catch (e) { }
  return acc;
}

const all = getFiles('e:/Bharat/src');
const toRemove = [];

// Check radix UI dependencies specifically, along with some others that usually power components.
const checkDeps = deps.filter(d => d.startsWith('@radix-ui/react-') ||
  ['embla-carousel-react', 'recharts', 'cmdk', 'vaul', 'input-otp', 'react-resizable-panels', 'react-day-picker'].includes(d)
);

for (const d of checkDeps) {
  let used = false;
  for (const c of all) {
    try {
      const txt = fs.readFileSync(c, 'utf8');
      if (txt.includes(`from '${d}'`) || txt.includes(`from "${d}"`) || txt.includes(`require('${d}')`) || txt.includes(`require("${d}")`)) {
        used = true;
        break;
      }
    } catch (e) { }
  }
  if (!used) toRemove.push(d);
}

fs.writeFileSync('e:/Bharat/unused-deps.json', JSON.stringify(toRemove, null, 2));
console.log('Done.');
