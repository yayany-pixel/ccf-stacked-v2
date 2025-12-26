# Quick Setup: Daily Digest

## 1. Environment Variables in Netlify

Go to: **Netlify Dashboard → Your Site → Site Settings → Environment Variables**

Click **Add a variable** and add each of these:

### Required Variables

| Variable | Value | Notes |
|----------|-------|-------|
| `EVENTBRITE_TOKEN` | `3UWP6A57LFGGGCI23VQA` | Already configured |
| `EVENTBRITE_ORG_ID` | `213181179995` | Already configured |
| `ACUITY_USER_ID` | `35932879` | Already configured |
| `ACUITY_API_KEY` | `09fce6787fa7467207fb557c1652d72a` | Already configured |
| `EMAIL_PROVIDER` | `resend` | Choose: resend, postmark, or sendgrid |
| `EMAIL_API_KEY` | `YOUR_API_KEY_HERE` | Get from your email provider |
| `DIGEST_TO` | `support@colorcocktailfactory.com` | Recipient email |
| `DIGEST_FROM` | `info@colorcocktailfactory.com` | Must be verified sender |

### Optional Variables

| Variable | Default | Notes |
|----------|---------|-------|
| `DIGEST_TIMEZONE` | `America/Chicago` | Timezone for send times |
| `LOW_ENROLLMENT_THRESHOLD` | `5` | Flag classes with fewer registrations |

## 2. Set Up Email Provider

### Option A: Resend (Recommended)

1. Go to [resend.com](https://resend.com)
2. Sign up and verify your domain: `colorcocktailfactory.com`
3. Get API key from dashboard
4. Add to Netlify:
   - `EMAIL_PROVIDER=resend`
   - `EMAIL_API_KEY=re_xxxxxxxxxxxxx`
   - `DIGEST_FROM=info@colorcocktailfactory.com`

### Option B: Postmark

1. Go to [postmarkapp.com](https://postmarkapp.com)
2. Create server and verify sender signature
3. Get server token
4. Add to Netlify:
   - `EMAIL_PROVIDER=postmark`
   - `EMAIL_API_KEY=your_server_token`

### Option C: SendGrid

1. Go to [sendgrid.com](https://sendgrid.com)
2. Verify sender identity
3. Create API key with Mail Send permissions
4. Add to Netlify:
   - `EMAIL_PROVIDER=sendgrid`
   - `EMAIL_API_KEY=SG.xxxxxxxxxxxxx`

## 3. Deploy to Netlify

```bash
git add .
git commit -m "Add daily operations digest scheduled function"
git push origin main
```

Netlify will automatically:
- Deploy the scheduled function
- Start running it every 15 minutes
- Send emails at 8:00 AM, 1:30 PM, and 5:00 PM Central Time

## 4. Verify It's Working

### Check Function Logs

1. Go to **Netlify Dashboard → Functions**
2. Click on `daily-digest`
3. View logs - you should see:
   - Every 15 minutes: `[Digest Skip] Not a send time`
   - At send times: `[Digest Send] Send time detected`

### Check Email Inbox

- Check `support@colorcocktailfactory.com`
- First email arrives at 8:00 AM CT tomorrow (or next send time)
- Check spam folder if not in inbox

## 5. Troubleshooting

**No emails arriving:**
- Check Netlify function logs for errors
- Verify `DIGEST_FROM` is verified in email provider
- Confirm `EMAIL_API_KEY` is correct
- Check spam folder

**Wrong data in digest:**
- Verify Acuity and Eventbrite credentials
- Check function logs for API errors

**Wrong send times:**
- Confirm `DIGEST_TIMEZONE=America/Chicago`
- Check Netlify build settings for timezone

## Email Schedule

Digests are sent at:
- **8:00 AM CT** - Morning update
- **1:30 PM CT** - Midday update
- **5:00 PM CT** - Evening update

## Sample Email

**Subject:** `CCF Today — Chicago + Eugene — Thursday, Dec 26`

**Body:**
```
CHICAGO
• 10:00 AM — Beginner Wheel Throwing — 14 registered (4 seats left)
• 5:30 PM — Date Night on the Wheel — 16 registered 🔴 FULL

EUGENE
• 1:00 PM — Mosaic Creations — 9 registered
• 3:00 PM — Glass Fusion — 3 registered ⚠️ LOW ENROLLMENT

Total registrations today: 64

—
ColorCocktailFactory.com
```

## Security Notes

✅ **Safe:**
- No customer PII exposed (only counts)
- No confirmation URLs used
- Credentials stored server-side only

⚠️ **Important:**
- Never commit `.env.local` (already in `.gitignore`)
- Protect email provider API keys
- `DIGEST_FROM` must be verified sender

---

For detailed documentation, see [DAILY_DIGEST.md](DAILY_DIGEST.md)
