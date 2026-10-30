const https = require('https');

const userId = process.env.ACUITY_USER_ID;
const apiKey = process.env.ACUITY_API_KEY;
const auth = Buffer.from(`${userId}:${apiKey}`).toString('base64');

const options = {
  hostname: 'acuityscheduling.com',
  path: '/api/v1/appointment-types',
  method: 'GET',
  headers: {
    'Authorization': `Basic ${auth}`
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const types = JSON.parse(data);
    const toUpdate = types.filter(t => t.price == '25.00' && (t.name.toLowerCase().includes('wheel')));
    console.log(JSON.stringify(toUpdate.map(t => ({id: t.id, name: t.name, price: t.price})), null, 2));
  });
});
req.end();
