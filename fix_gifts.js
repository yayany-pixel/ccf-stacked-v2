const fs = require('fs');
let file = fs.readFileSync('lib/gifts.ts', 'utf8');

// Replace 25 with 35 for Eugene Beginner Wheel
file = file.replace(/\$25\.00/g, '$35.00');
file = file.replace(/\$25 value/g, '$35 value');
file = file.replace(/\$25/g, '$35');
file = file.replace(/price: 25,/g, 'price: 35,');
file = file.replace(/value === 25/g, 'value === 35');
file = file.replace(/amount >= 25/g, 'amount >= 35');
file = file.replace(/price = activity\.currentPrice \?\? 25;/g, 'price = activity.currentPrice ?? 35;');

fs.writeFileSync('lib/gifts.ts', file);
