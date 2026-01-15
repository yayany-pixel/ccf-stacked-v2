# GA4 Webhook Integration Guide

## Overview

The GA4 webhook function receives booking confirmation data from external systems (Zapier, Make, or direct API calls) and forwards conversion events to Google Analytics 4 using the Measurement Protocol.

**Function URL:** `https://colorcocktailfactory.com/.netlify/functions/ga4-webhook`

## Supported Events

1. **`purchase`** - Track completed bookings/transactions
2. **`generate_lead`** - Track booking initiation or form submissions

---

## Environment Variables Setup

### Required Variables

Set these in **Netlify Dashboard** → **Site Settings** → **Environment Variables**:

| Variable | Description | Example |
|----------|-------------|---------|
| `GA4_MEASUREMENT_ID` | Your GA4 Measurement ID | `G-XXXXXXXXXX` |
| `GA4_API_SECRET` | GA4 Measurement Protocol API secret | `abc123def456...` |
| `WEBHOOK_SECRET` | Secret key for webhook authentication | `your-random-secret-string-here` |

### How to Get GA4 Credentials

**GA4_MEASUREMENT_ID:**
- Already available in your GA4 property (format: `G-XXXXXXXXXX`)

**GA4_API_SECRET:**
1. Go to GA4 Admin → Data Streams → Select your web stream
2. Click "Measurement Protocol API secrets"
3. Click "Create" to generate a new secret
4. Copy the secret value (you won't be able to see it again!)

**WEBHOOK_SECRET:**
- Generate a strong random string (e.g., using `openssl rand -hex 32`)
- This is YOUR custom secret - share it only with trusted webhook sources

### Setting Environment Variables in Netlify

```bash
# Via Netlify CLI
netlify env:set GA4_MEASUREMENT_ID "G-XXXXXXXXXX"
netlify env:set GA4_API_SECRET "your-ga4-api-secret"
netlify env:set WEBHOOK_SECRET "your-webhook-secret"

# Or manually in Netlify Dashboard:
# 1. Go to Site Settings → Environment Variables
# 2. Click "Add a variable"
# 3. Add each variable with its value
# 4. Click "Save"
```

---

## API Reference

### Endpoint

```
POST https://colorcocktailfactory.com/.netlify/functions/ga4-webhook
```

### Headers

```
Content-Type: application/json
X-Webhook-Secret: your-webhook-secret
```

### Request Body

#### Purchase Event

```json
{
  "event_name": "purchase",
  "transaction_id": "booking-12345",
  "value": 110.00,
  "currency": "USD",
  "city": "Chicago",
  "class_category": "workshop",
  "class_name": "Date Night Pottery",
  "class_id": "date-night-wheel",
  "booking_provider": "rezclick",
  "link_url": "https://rezclick.com/book/...",
  "client_id": "optional-ga-client-id"
}
```

**Required fields for purchase:**
- `event_name` (must be "purchase")
- `transaction_id` (unique booking/order ID for deduplication)
- `value` (numeric transaction amount)
- `currency` (3-letter ISO code, e.g., "USD")

**Optional but recommended:**
- `client_id` (GA4 client ID for user attribution - if missing, a random one is generated)
- `city`, `class_name`, `class_id`, `class_category`, `booking_provider`, `link_url`

#### Generate Lead Event

```json
{
  "event_name": "generate_lead",
  "city": "Eugene",
  "class_name": "Beginner Wheel Throwing",
  "class_id": "beginner-wheel",
  "booking_provider": "eventbrite",
  "link_url": "https://eventbrite.com/...",
  "client_id": "optional-ga-client-id"
}
```

**Required fields for generate_lead:**
- `event_name` (must be "generate_lead")
- At least one of: `city`, `class_name`, or `class_id`

### Response

#### Success (200)

```json
{
  "success": true,
  "message": "purchase event sent to GA4",
  "client_id": "generated",
  "transaction_id": "booking-12345"
}
```

#### Error (400/401/500)

```json
{
  "error": "Unauthorized: Invalid or missing X-Webhook-Secret header"
}
```

---

## Testing

### cURL Test Command

#### Test Purchase Event

```bash
curl -X POST https://colorcocktailfactory.com/.netlify/functions/ga4-webhook \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: your-webhook-secret" \
  -d '{
    "event_name": "purchase",
    "transaction_id": "test-booking-001",
    "value": 75.00,
    "currency": "USD",
    "city": "Chicago",
    "class_name": "Turkish Lamp Making",
    "class_id": "turkish-lamp",
    "class_category": "workshop",
    "booking_provider": "rezclick"
  }'
```

#### Test Generate Lead Event

```bash
curl -X POST https://colorcocktailfactory.com/.netlify/functions/ga4-webhook \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: your-webhook-secret" \
  -d '{
    "event_name": "generate_lead",
    "city": "Eugene",
    "class_name": "Pottery Workshop",
    "class_id": "pottery-101",
    "booking_provider": "eventbrite"
  }'
```

### Verify in GA4

1. Go to GA4 → **Reports** → **Realtime**
2. Send test event using cURL above
3. Within 10-30 seconds, you should see:
   - Event count increase
   - Event name appear in realtime report
   - Event parameters visible when you drill down

Note: Events appear in standard reports after 24-48 hours of processing.

---

## Integration Examples

### Zapier Setup

1. **Trigger:** New booking in your booking system (Rezclick, Eventbrite, etc.)
2. **Action:** Webhooks by Zapier → Custom Request

**Configuration:**
```
Method: POST
URL: https://colorcocktailfactory.com/.netlify/functions/ga4-webhook

Headers:
  Content-Type: application/json
  X-Webhook-Secret: your-webhook-secret

Body (JSON):
{
  "event_name": "purchase",
  "transaction_id": "{{booking_id}}",
  "value": {{booking_amount}},
  "currency": "USD",
  "city": "{{city}}",
  "class_name": "{{class_title}}",
  "class_id": "{{class_slug}}",
  "booking_provider": "rezclick"
}
```

**Field Mapping (adjust based on your trigger data):**
- `{{booking_id}}` → Unique booking/transaction ID from trigger
- `{{booking_amount}}` → Total price (numeric)
- `{{city}}` → "Chicago" or "Eugene"
- `{{class_title}}` → Human-readable class name
- `{{class_slug}}` → URL-friendly class identifier

### Make (Integromat) Setup

1. **Trigger Module:** HTTP Webhook or your booking platform
2. **HTTP Module:** Make a Request

**Configuration:**
```
URL: https://colorcocktailfactory.com/.netlify/functions/ga4-webhook
Method: POST

Headers:
  Content-Type: application/json
  X-Webhook-Secret: your-webhook-secret

Body Type: Raw
Content Type: JSON (application/json)

Body:
{
  "event_name": "purchase",
  "transaction_id": "{{trigger.bookingId}}",
  "value": {{trigger.amount}},
  "currency": "USD",
  "city": "{{trigger.city}}",
  "class_name": "{{trigger.className}}",
  "class_id": "{{trigger.classId}}",
  "booking_provider": "eventbrite"
}
```

### Direct API Integration

If you control your booking system's backend:

```javascript
// Node.js example
async function trackBookingConversion(bookingData) {
  const response = await fetch(
    'https://colorcocktailfactory.com/.netlify/functions/ga4-webhook',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': process.env.WEBHOOK_SECRET,
      },
      body: JSON.stringify({
        event_name: 'purchase',
        transaction_id: bookingData.id,
        value: bookingData.total,
        currency: 'USD',
        city: bookingData.location,
        class_name: bookingData.className,
        class_id: bookingData.classSlug,
        booking_provider: 'rezclick',
      }),
    }
  );

  const result = await response.json();
  console.log('GA4 tracking result:', result);
}
```

---

## Security Best Practices

1. **Keep WEBHOOK_SECRET private** - Never commit it to Git or share publicly
2. **Rotate secrets periodically** - Update `WEBHOOK_SECRET` every 6-12 months
3. **Use HTTPS only** - The function enforces HTTPS via Netlify
4. **Monitor failed requests** - Check Netlify function logs for unauthorized attempts
5. **Validate transaction_id uniqueness** - Use truly unique IDs to prevent duplicate conversions in GA4

---

## Troubleshooting

### Error: "Unauthorized: Invalid or missing X-Webhook-Secret header"

- **Cause:** Missing or incorrect webhook secret in request header
- **Fix:** Ensure `X-Webhook-Secret` header matches the value in Netlify env vars

### Error: "GA4 not configured"

- **Cause:** Missing `GA4_MEASUREMENT_ID` or `GA4_API_SECRET` environment variables
- **Fix:** Set both variables in Netlify dashboard and redeploy

### Error: "purchase events require transaction_id"

- **Cause:** Missing required field for purchase event
- **Fix:** Include `transaction_id`, `value`, and `currency` in your webhook payload

### Events not appearing in GA4

1. **Check Realtime reports first** (not standard reports - those have 24-48h delay)
2. **Verify Measurement ID** - Ensure it matches your GA4 property
3. **Check API Secret** - Regenerate if you suspect it's incorrect
4. **Review Netlify function logs** - Look for errors in the function execution
5. **Test with cURL** - Use the test command above to isolate integration issues

### How to check Netlify function logs

```bash
# Via Netlify CLI
netlify functions:log ga4-webhook

# Or in Netlify Dashboard:
# Functions tab → ga4-webhook → View logs
```

---

## Client ID Attribution Notes

- **If `client_id` is provided:** GA4 can attribute the conversion to the user's session
- **If `client_id` is missing:** Function generates a random ID, event is tracked but user attribution is limited
- **Best practice:** Capture and pass the GA `client_id` when users click booking links (see main BookingLink component)

To get client_id on your website:

```javascript
// In your booking click handler
gtag('get', 'G-XXXXXXXXXX', 'client_id', (clientId) => {
  // Pass clientId to booking system, then include in webhook
  console.log('Client ID:', clientId);
});
```

---

## Deduplication Strategy

**Transaction ID deduplication:**
- GA4 automatically deduplicates events with the same `transaction_id` within a 24-hour window
- Always use unique, stable transaction IDs from your booking system
- No additional storage-based deduplication is implemented in the function

---

## Performance & Limits

- **Function timeout:** 10 seconds (Netlify default)
- **Payload size limit:** 1MB (Netlify default)
- **GA4 Measurement Protocol limits:**
  - 20 events per request (this function sends 1 at a time)
  - Event name max 40 characters
  - Parameter name max 40 characters
  - Parameter value max 100 characters (strings)

---

## Files Changed

- ✅ `netlify/functions/ga4-webhook.ts` - Main webhook function (NEW)
- ✅ `GA4_WEBHOOK_GUIDE.md` - This documentation (NEW)

## Verification Checklist

- [ ] Environment variables set in Netlify (GA4_MEASUREMENT_ID, GA4_API_SECRET, WEBHOOK_SECRET)
- [ ] Function deploys successfully (check Netlify deploy logs)
- [ ] cURL test returns 200 response
- [ ] Test event appears in GA4 Realtime reports
- [ ] Zapier/Make webhook configured and tested
- [ ] Webhook secret kept secure (not in code/logs)
- [ ] Team trained on how to use this integration

---

**Questions?** Check Netlify function logs or GA4 DebugView for detailed event information.
