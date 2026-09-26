// Test API credentials are read from the environment; never hard-code secrets here.
const EVENTBRITE_TOKEN = process.env.EVENTBRITE_TOKEN || '';
const EVENTBRITE_ORG_ID = process.env.EVENTBRITE_ORG_ID || '';
const ACUITY_USER_ID = process.env.ACUITY_USER_ID || '';
const ACUITY_API_KEY = process.env.ACUITY_API_KEY || '';

if (!EVENTBRITE_TOKEN || !EVENTBRITE_ORG_ID || !ACUITY_USER_ID || !ACUITY_API_KEY) {
  console.error('Missing required API environment variables.');
  process.exit(1);
}

console.log('Testing Eventbrite API...');
try {
  const ebResponse = await fetch(
    `https://www.eventbriteapi.com/v3/organizations/${EVENTBRITE_ORG_ID}/events/?status=live&order_by=start_asc&page_size=5`,
    {
      headers: {
        'Authorization': `Bearer ${EVENTBRITE_TOKEN}`,
      }
    }
  );
  
  if (!ebResponse.ok) {
    console.error('❌ Eventbrite API Error:', ebResponse.status, ebResponse.statusText);
    const errorData = await ebResponse.json();
    console.error('Error details:', JSON.stringify(errorData, null, 2));
  } else {
    const ebData = await ebResponse.json();
    console.log('✅ Eventbrite API Success!');
    console.log(`   Found ${ebData.events?.length || 0} events`);
    if (ebData.events?.length > 0) {
      console.log('   First event:', ebData.events[0].name.text);
    }
  }
} catch (error) {
  console.error('❌ Eventbrite fetch error:', error.message);
}

console.log('\nTesting Acuity API...');
try {
  const authString = Buffer.from(`${ACUITY_USER_ID}:${ACUITY_API_KEY}`).toString('base64');
  const acuityResponse = await fetch(
    'https://acuityscheduling.com/api/v1/appointments?max=5',
    {
      headers: {
        'Authorization': `Basic ${authString}`,
      }
    }
  );
  
  if (!acuityResponse.ok) {
    console.error('❌ Acuity API Error:', acuityResponse.status, acuityResponse.statusText);
    const errorData = await acuityResponse.json();
    console.error('Error details:', JSON.stringify(errorData, null, 2));
  } else {
    const acuityData = await acuityResponse.json();
    console.log('✅ Acuity API Success!');
    console.log(`   Found ${acuityData?.length || 0} appointments`);
    if (acuityData?.length > 0) {
      console.log('   First appointment:', acuityData[0].type);
    }
  }
} catch (error) {
  console.error('❌ Acuity fetch error:', error.message);
}
