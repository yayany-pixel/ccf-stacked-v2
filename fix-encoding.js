const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib', 'config.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Fix time range separators - replace '" with en dash
content = content.replace(/'"/g, '–');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed remaining time range encoding in config.ts');
