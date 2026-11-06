const fs = require('fs');
const path = require('path');

function searchFiles(dir, regex) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(searchFiles(file, regex));
    } else if (file.match(/\.(tsx|ts|jsx|js|css)$/)) {
      const content = fs.readFileSync(file, 'utf8');
      if (regex.test(content)) {
        results.push(file);
      }
    }
  });
  return results;
}

const filesWithColors = searchFiles('./app', /(bg-|text-|border-|ring-)(\[#|gray-|black|white|zinc-|slate-|neutral-)/);
const componentFilesWithColors = searchFiles('./components', /(bg-|text-|border-|ring-)(\[#|gray-|black|white|zinc-|slate-|neutral-)/);
console.log([...new Set([...filesWithColors, ...componentFilesWithColors])].join('\n'));