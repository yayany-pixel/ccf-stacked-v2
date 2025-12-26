# CCF Premium Stacked Card Sections (Next.js 14 + Tailwind)

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
```bash
# Copy the example file
cp .env.example .env.local
```

Then edit `.env.local` and add your Eventbrite private token:
```env
EVENTBRITE_TOKEN=your_private_token_here
EVENTBRITE_ORG_ID=213181179995
```

**Important:** Get your Eventbrite token from: https://www.eventbrite.com/platform/api#/introduction/authentication

The token is **server-only** and never exposed to the browser.

### 3. Run the development server
```bash
npm run dev
```

Open:
- http://localhost:3000/chicago
- http://localhost:3000/eugene
- http://localhost:3000/events (Upcoming Workshops)
- http://localhost:3000/gift-cards

## Private Events form behavior (IMPORTANT)

Because there is no backend, the private event form creates a **mailto:** link pre-filled with the request.
Update the destination inbox in:
- `lib/config.ts` → `PRIVATE_EVENT_EMAIL`

## Edit content

- Sections, colors, videos, schedules, FAQs, booking keywords: `lib/config.ts`
- RezClick bases per city: `lib/links.ts`
- Domain for SEO/OG + JSON-LD: `app/layout.tsx` and `lib/structuredData.ts`

## Run lightweight self-tests

```bash
npm run test
```
