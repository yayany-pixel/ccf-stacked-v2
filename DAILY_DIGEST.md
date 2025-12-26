# Daily Operations Email Digest

Automated daily email digest sent to staff with today's event and class registrations.

## Overview

The digest system:
- Runs as a **Netlify Scheduled Function** every 15 minutes
- **Internally gates** to send only at specific Central Time hours
- Pulls data from **Acuity** and **Eventbrite**
- Formats and sends a plain-text email to operations staff

## Send Times (America/Chicago)

- **8:00 AM** - Morning digest
- **1:30 PM** - Midday digest
- **5:00 PM** - Evening digest

## Architecture

### Files Created

1. **`netlify/functions/daily-digest.ts`**
   - Netlify scheduled function (cron: `*/15 * * * *`)
   - Time gating logic for America/Chicago
   - Orchestrates data fetching and email sending
   - Deduplication guards (log-based, upgrade to KV recommended)

2. **`lib/digestTypes.ts`**
   - TypeScript types for digest system
   - `DigestItem` - normalized event/class data structure
   - `DigestConfig` - configuration options
   - `DIGEST_SEND_TIMES` - send time constants

3. **`lib/acuityAdminDigest.ts`**
   - Fetches today's Acuity appointments
   - Groups by time slot and counts registrations
   - **SECURITY**: Uses admin endpoints but only exposes counts (no PII)
   - **SECURITY**: Does NOT use confirmation URLs

4. **`lib/eventbriteDigest.ts`**
   - Fetches today's Eventbrite events
   - Retrieves attendee counts per event
   - Normalizes to `DigestItem[]` format

5. **`lib/formatDigest.ts`**
   - Formats digest items into email subject + body
   - Groups by city (Chicago/Eugene)
   - Adds flags: FULL, LOW ENROLLMENT
   - Clean plain-text formatting

6. **`lib/email.ts`**
   - Provider-agnostic email wrapper
   - Supports: Resend, Postmark, SendGrid
   - Switch providers via `EMAIL_PROVIDER` env var

## Environment Variables

Add these to your Netlify environment variables (Site Settings → Environment Variables):

### Required

```bash
# Eventbrite (for event data)
EVENTBRITE_TOKEN=your_eventbrite_token
EVENTBRITE_ORG_ID=213181179995

# Acuity (for class bookings)
ACUITY_USER_ID=your_user_id
ACUITY_API_KEY=your_api_key

# Email provider
EMAIL_PROVIDER=resend
EMAIL_API_KEY=your_email_provider_api_key

# Digest recipients
DIGEST_TO=support@colorcocktailfactory.com
DIGEST_FROM=info@colorcocktailfactory.com
```

### Optional

```bash
DIGEST_TIMEZONE=America/Chicago
LOW_ENROLLMENT_THRESHOLD=5
```

## Email Providers

### Resend (Recommended)

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (colorcocktailfactory.com)
3. Get API key from dashboard
4. Set:
   ```
   EMAIL_PROVIDER=resend
   EMAIL_API_KEY=re_xxxxx
   DIGEST_FROM=info@colorcocktailfactory.com
   ```

### Postmark

1. Sign up at [postmarkapp.com](https://postmarkapp.com)
2. Verify sender signature
3. Get server token
4. Set:
   ```
   EMAIL_PROVIDER=postmark
   EMAIL_API_KEY=your_server_token
   ```

### SendGrid

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Verify sender identity
3. Create API key
4. Set:
   ```
   EMAIL_PROVIDER=sendgrid
   EMAIL_API_KEY=SG.xxxxx
   ```

## Email Format

### Subject

```
CCF Today — Chicago + Eugene — Thursday, Dec 26
```

### Body Example

```
CHICAGO
• 10:00 AM — Beginner Wheel Throwing — 14 registered (4 seats left)
• 5:30 PM — Date Night on the Wheel — 16 registered 🔴 FULL

EUGENE
• 1:00 PM — Mosaic Creations — 9 registered
• 3:00 PM — Glass Fusion — 3 registered ⚠️ LOW ENROLLMENT

EVENTBRITE EXCLUSIVES
• 7:00 PM — Special Workshop — 22 registered (8 seats left)

Total registrations today: 64

—
ColorCocktailFactory.com
```

## Deployment

### 1. Set Environment Variables in Netlify

Go to: **Netlify Dashboard → Site Settings → Environment Variables**

Add all required variables listed above.

### 2. Deploy

The scheduled function will automatically deploy with your next push to production.

### 3. Verify in Netlify Logs

Go to: **Functions → daily-digest**

You'll see logs every 15 minutes:
- `[Digest Skip] Not a send time` (most runs)
- `[Digest Send] Send time detected` (at 8:00 AM, 1:30 PM, 5:00 PM CT)

## Security Notes

✅ **Safe Practices:**
- Admin endpoints used ONLY for counting registrations
- No customer PII exposed in emails (names, emails, etc.)
- No confirmation URLs used or sent
- Credentials stored server-side only (Netlify env vars)

⚠️ **Important:**
- Never commit `.env.local` (already in `.gitignore`)
- Email provider API keys are sensitive - protect them
- DIGEST_FROM must be a verified sender in your email provider

## Duplication Prevention

**Current Implementation (Log-based):**
- Generates deduplication key: `MM/DD/YYYY, HH:MM`
- Logs key on each send
- Accepts potential duplicates within 15-minute window

**Recommended Upgrade (Netlify Blobs):**

```typescript
import { getStore } from "@netlify/blobs";

async function hasAlreadySent(key: string): Promise<boolean> {
  const store = getStore("digest-sends");
  const sent = await store.get(key);
  return sent !== null;
}

async function markAsSent(key: string): Promise<void> {
  const store = getStore("digest-sends");
  await store.set(key, "sent", { ttl: 86400 }); // 24 hour TTL
}
```

## Testing Locally

**Note:** Scheduled functions don't run locally. To test:

### Option 1: Manual Invocation

Create `test/test-digest.ts`:

```typescript
import { getAcuityDigestItems } from "../lib/acuityAdminDigest";
import { getEventbriteDigestItems } from "../lib/eventbriteDigest";
import { formatDigestSubject, formatDigestBody } from "../lib/formatDigest";

async function test() {
  const acuity = await getAcuityDigestItems();
  const eventbrite = await getEventbriteDigestItems();
  const all = [...acuity, ...eventbrite];
  
  console.log(formatDigestSubject(all, new Date()));
  console.log(formatDigestBody(all, { lowEnrollmentThreshold: 5, timezone: "America/Chicago" }));
}

test();
```

Run: `tsx test/test-digest.ts`

### Option 2: Netlify CLI

```bash
netlify functions:invoke daily-digest
```

## Monitoring

Check digest delivery:
1. **Netlify Function Logs** - See execution logs
2. **Email Provider Dashboard** - Confirm delivery status
3. **support@colorcocktailfactory.com inbox** - Verify emails arrive

## Troubleshooting

**No emails received:**
- Check Netlify function logs for errors
- Verify EMAIL_API_KEY is correct
- Confirm DIGEST_FROM is verified in email provider
- Check spam folder

**Wrong send times:**
- Verify DIGEST_TIMEZONE=America/Chicago
- Check Netlify build uses correct time

**Missing data:**
- Check ACUITY_USER_ID and ACUITY_API_KEY
- Verify EVENTBRITE_TOKEN has permissions
- Review function logs for API errors

**Duplicate emails:**
- Upgrade to Netlify Blobs for persistent deduplication
- Current log-based approach may send duplicates in 15-min window

## Future Enhancements

- [ ] Add Netlify Blobs for deduplication persistence
- [ ] HTML email formatting (currently plain text)
- [ ] Weekly summary digest
- [ ] Custom send times via environment variables
- [ ] Slack notifications as alternative to email
- [ ] Dashboard link in email for real-time view
