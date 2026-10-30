const https = require('https');
const userId = process.env.ACUITY_USER_ID;
const apiKey = process.env.ACUITY_API_KEY;
const auth = Buffer.from(`${userId}:${apiKey}`).toString('base64');
const options = {
  hostname: 'acuityscheduling.com',
  path: '/api/v1/appointment-types/79006616',
  method: 'GET',
  headers: { 'Authorization': `Basic ${auth}` }
};
const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(data);
  });
});
req.end();
