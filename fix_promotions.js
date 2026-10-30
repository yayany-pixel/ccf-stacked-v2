const fs = require('fs');
let file = fs.readFileSync('lib/promotions.ts', 'utf8');
const lines = file.split('\n');
let insideWheel = false;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('"workshopName":')) {
    if (lines[i].toLowerCase().includes('wheel') || lines[i].toLowerCase().includes('cup creations on the wheel')) {
      insideWheel = true;
    } else {
      insideWheel = false;
    }
  }
  
  if (insideWheel && lines[i].includes('25,')) {
    if (lines[i].includes('promoPrice') || lines[i].includes('regularPrice')) {
      lines[i] = lines[i].replace('25,', '35,');
    }
  }
}
fs.writeFileSync('lib/promotions.ts', lines.join('\n'));
