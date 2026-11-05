const fs = require('fs');
const path = require('path');

const replacements = [
  // Backgrounds
  { regex: /bg-\[#080A10\]/g, replacement: 'bg-background' },
  { regex: /bg-black/g, replacement: 'bg-background' },
  { regex: /bg-gray-900/g, replacement: 'bg-background' },
  { regex: /bg-gray-950/g, replacement: 'bg-background' },
  { regex: /bg-zinc-900/g, replacement: 'bg-background' },
  { regex: /bg-zinc-950/g, replacement: 'bg-background' },
  { regex: /bg-slate-900/g, replacement: 'bg-background' },
  { regex: /bg-slate-950/g, replacement: 'bg-background' },
  
  { regex: /bg-gray-800/g, replacement: 'bg-surface' },
  { regex: /bg-zinc-800/g, replacement: 'bg-surface' },
  { regex: /bg-slate-800/g, replacement: 'bg-surface' },
  { regex: /bg-gray-850/g, replacement: 'bg-surface' },
  
  { regex: /bg-gray-700/g, replacement: 'bg-surface-secondary' },
  { regex: /bg-white\/5/g, replacement: 'bg-surface-secondary' },
  { regex: /bg-white\/10/g, replacement: 'bg-surface-secondary' },
  { regex: /bg-white\/20/g, replacement: 'bg-surface-secondary' },
  { regex: /bg-gray-800\/50/g, replacement: 'bg-surface/50' },
  
  // Text
  { regex: /text-white/g, replacement: 'text-primary' },
  { regex: /text-gray-50/g, replacement: 'text-primary' },
  { regex: /text-gray-100/g, replacement: 'text-primary' },
  { regex: /text-gray-200/g, replacement: 'text-primary' },
  
  { regex: /text-gray-300/g, replacement: 'text-secondary' },
  { regex: /text-gray-400/g, replacement: 'text-secondary' },
  { regex: /text-zinc-300/g, replacement: 'text-secondary' },
  { regex: /text-zinc-400/g, replacement: 'text-secondary' },
  { regex: /text-slate-300/g, replacement: 'text-secondary' },
  { regex: /text-slate-400/g, replacement: 'text-secondary' },
  
  // Borders
  { regex: /border-gray-800/g, replacement: 'border-border' },
  { regex: /border-gray-700/g, replacement: 'border-border' },
  { regex: /border-white\/10/g, replacement: 'border-border' },
  { regex: /border-white\/20/g, replacement: 'border-border' },
  { regex: /border-zinc-800/g, replacement: 'border-border' },
  { regex: /border-slate-800/g, replacement: 'border-border' },

  // Rings
  { regex: /ring-gray-800/g, replacement: 'ring-border' },
  { regex: /ring-white\/10/g, replacement: 'ring-border' },

  // Purple/Pink/Neon accents
  { regex: /text-purple-400/g, replacement: 'text-accent' },
  { regex: /text-purple-500/g, replacement: 'text-accent' },
  { regex: /text-pink-400/g, replacement: 'text-accent' },
  { regex: /text-pink-500/g, replacement: 'text-accent' },
  { regex: /bg-purple-600/g, replacement: 'bg-btn' },
  { regex: /bg-pink-600/g, replacement: 'bg-btn' },
  { regex: /bg-purple-500/g, replacement: 'bg-btn' },
  { regex: /bg-pink-500/g, replacement: 'bg-btn' },
  { regex: /hover:bg-purple-500/g, replacement: 'hover:bg-btn' },
  { regex: /hover:bg-pink-500/g, replacement: 'hover:bg-btn' },
];

function processFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  for (const { regex, replacement } of replacements) {
    content = content.replace(regex, replacement);
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}

function walk(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      walk(file);
    } else if (file.match(/\.(tsx|ts|jsx|js|css)$/)) {
      processFile(file);
    }
  });
}

walk('./app');
walk('./components');
