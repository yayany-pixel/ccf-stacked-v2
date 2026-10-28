const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "next.config.mjs");
let content = fs.readFileSync(file, "utf8");

content = content.replace(/images:\s*{\s*remotePatterns:\s*\[[\s\S]*?\],\s*},/m, `images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.evbuc.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.evbuc.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
    ],
  },`);

fs.writeFileSync(file, content, "utf8");
console.log("next.config.mjs fixed.");
