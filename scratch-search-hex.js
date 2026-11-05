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
      const matches = content.match(regex);
      if (matches) {
        results.push(`${file}: ${matches.length} matches`);
      }
    }
  });
  return results;
}

const res = searchFiles('./app', /\[#([0-9a-fA-F]{3,6})\]/g);
const res2 = searchFiles('./components', /\[#([0-9a-fA-F]{3,6})\]/g);
console.log([...res, ...res2].join('\n'));