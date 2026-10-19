const https = require('https');
const userId = process.env.ACUITY_USER_ID;
const apiKey = process.env.ACUITY_API_KEY;

const auth = Buffer.from(`${userId}:${apiKey}`).toString('base64');

const options = {
  hostname: 'acuityscheduling.com',
  path: '/api/v1/appointment-types',
  headers: {
    'Authorization': `Basic ${auth}`,
    'Accept': 'application/json'
  }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const types = JSON.parse(data);
    types.forEach(t => {
      console.log(`ID: ${t.id}, Price: ${t.price}, Name: ${t.name}`);
    });
  });
}).on('error', err => console.error(err));
