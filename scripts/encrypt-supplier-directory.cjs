const fs = require('node:fs');
const crypto = require('node:crypto');
const key = process.env.CCF_SUPPLIER_DATA_KEY;
if (!key || !/^[a-f0-9]{64}$/.test(key)) throw new Error('Load the private supplier data key before encrypting.');
const plaintext = fs.readFileSync('lib/supplier-directory.json');
const data = JSON.parse(plaintext);
if (!Array.isArray(data.entries) || !data.entries.length) throw new Error('Supplier directory is empty or invalid.');
const iv = crypto.randomBytes(12);
const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
fs.writeFileSync('lib/supplier-directory.enc.json', JSON.stringify({
  version: 1, algorithm: 'aes-256-gcm', iv: iv.toString('hex'),
  tag: cipher.getAuthTag().toString('hex'), ciphertext: ciphertext.toString('base64'),
}, null, 2) + '\n');
console.log(`Encrypted ${data.entries.length} supplier resources. No key or plaintext is written to the tracked file.`);
