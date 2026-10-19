const fs = require('fs');

const manifest = fs.readFileSync('lib/homepage/manifest.ts', 'utf-8');
const acuityPricesTxt = fs.readFileSync('acuity_prices.txt', 'utf-8');

const acuityPrices = new Map();
for (const line of acuityPricesTxt.split('\n')) {
  const match = line.match(/ID: (\d+), Price: ([\d.]+)/);
  if (match) {
    acuityPrices.set(parseInt(match[1]), parseFloat(match[2]));
  }
}

const currentExplicitPrices = {
  "chicago-beginner-wheel": 50,
  "eugene-cup-creations": 50,
  "chicago-mug-and-bowl": 55,
  "eugene-mug-and-bowl": 55,
  "chicago-cat-vase": 55,
  "chicago-cauldron": 55,
  "eugene-cauldron": 55,
  "chicago-date-night-wheel": 110,
  "eugene-date-night-wheel": 110,
  "chicago-matcha-bowl": 55,
  "eugene-matcha-bowl": 55,
  "chicago-charcuterie-board": 95,
  "eugene-charcuterie-board": 95,
  "chicago-wheel-pumpkin": 75,
  "chicago-cup-creations": 55,
  "chicago-mushroom": 55,
  "eugene-mushroom": 55,
  "chicago-pipe-and-ashtray": 55,
  "eugene-pipe-and-ashtray": 55,
  "chicago-clay-pumpkin": 55,
  "chicago-oogie-boogie": 55,
  "eugene-oogie-boogie": 55,
  "chicago-bonsai": 110,
  "chicago-terrarium": 55,
  "eugene-date-night-terrarium": 55,
  "chicago-date-night-on-fire": 295,
  "chicago-candle": 55,
  "chicago-date-night-candle": 55,
  "chicago-mosaic": 55,
  "chicago-paint-pottery": 55,
  "chicago-boobs-mug": 55,
  "chicago-glass-fusion": 75,
  "chicago-watercolor": 55,
  "eugene-watercolor": 55,
  "eugene-ceramic-chess": 110,
  "chicago-wheel-vase": 55,
  "chicago-ghost": 55,
  "chicago-handbuilt-vase": 75,
  "chicago-monster-lantern": 55,
  "chicago-make-and-paint-wheel": 180,
  "chicago-dildos-and-bottles": 55,
};

const newExplicitPrices = { ...currentExplicitPrices };

// This regex must match correctly, so let's simplify or read json
// The manifest array contains objects.
const blockRegex = /{\s*"key":\s*"([^"]+)",[\s\S]*?"appointmentTypeId":\s*(\d+),[\s\S]*?"city":\s*"([^"]+)"[\s\S]*?}/g;
let match;
while ((match = blockRegex.exec(manifest)) !== null) {
  const key = match[1];
  const typeId = parseInt(match[2]);
  const city = match[3];

  if (city === "chicago") {
    const price = acuityPrices.get(typeId);
    if (price !== undefined) {
      newExplicitPrices[key] = Math.round(price * 1.4);
    }
  }
}

for (const [key, val] of Object.entries(newExplicitPrices)) {
  console.log(`  "${key}": ${val},`);
}
