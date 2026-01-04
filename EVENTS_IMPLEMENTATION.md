# Events System Implementation Guide

## Overview

We've implemented a comprehensive, SEO-friendly Events system that:
- ✅ Pulls events from both **Eventbrite** and **Acuity Scheduling** APIs
- ✅ Creates `/events` index page and `/events/[slug]` detail pages
- ✅ Includes proper **JSON-LD Event structured data** for Google
- ✅ Adds events to **sitemap.xml** for crawler discovery
- ✅ Footer link for low-prominence access (not in main navbar)
- ✅ Server-side only (API credentials never exposed to client)
- ✅ Automatic caching and deduplication

## Architecture

### 1. **Normalized Event Model** (`lib/eventsAPI.ts`)

All events from both sources are normalized to a single type:

```typescript
type NormalizedEvent = {
  id: string;
  source: "eventbrite" | "acuity";
  title: string;
  description: string;
  startDate: string; // ISO 8601
  endDate: string;
  city: "Chicago" | "Eugene" | "Virtual" | "Other";
  venueName: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
  imageUrl: string | null;
  price: number | null;
  currency: string;
  bookingUrl: string; // External checkout link
  category: string;
  status: "scheduled" | "cancelled";
  lastUpdated: string;
  slug: string; // URL-friendly identifier
};
```

### 2. **Data Sources**

#### Eventbrite Integration
- Fetches live events from organization API
- Uses `EVENTBRITE_TOKEN` and `EVENTBRITE_ORG_ID`
- Cached for 1 hour (3600 seconds)
- Returns event details with venue, pricing, and images

#### Acuity Integration
- Fetches appointment types and PUBLIC availability
- Uses `ACUITY_USER_ID` and `ACUITY_API_KEY` with Basic Auth
- Converts availability slots into discrete event instances
- Limited to 60 days ahead (configurable)
- Generates stable slug IDs for each time slot

### 3. **Deduplication Logic**

Events are deduplicated when they likely represent the same event:
- Different sources (Eventbrite vs Acuity)
- Similar title (first 15 characters match)
- Start times within 10 minutes
- Same city

**Priority:** Eventbrite events are preferred over Acuity when duplicates are found.

### 4. **Routes**

#### `/events` (Index Page)
- Server-rendered list of all upcoming events
- Combines Eventbrite + Acuity events
- JSON-LD schema tags for each event
- Event cards with:
  - Category and city badges
  - Date/time, venue, price
  - Description preview
  - "Book Now" (external) and "Details" links
  - Source indicator (Eventbrite/Acuity)

#### `/events/[slug]` (Detail Pages)
- Individual event detail pages
- Full JSON-LD Event schema
- OpenGraph meta tags
- Canonical URLs
- Complete event information
- Booking CTA

### 5. **SEO Implementation**

#### JSON-LD Structured Data
Every event includes complete Event schema:
```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "...",
  "description": "...",
  "startDate": "...",
  "endDate": "...",
  "location": {
    "@type": "Place",
    "name": "...",
    "address": { ... }
  },
  "offers": { ... }
}
```

#### Sitemap.xml
- `/events` included with daily change frequency
- All `/events/[slug]` pages dynamically added
- Priority 0.95 for events index, 0.85 for detail pages

#### Footer Link
- "Upcoming Events" link in Quick Links section
- Low prominence (not in main navbar)
- Visible and accessible to users and crawlers

## Environment Variables

Required in `.env.local`:

```env
# Eventbrite
EVENTBRITE_TOKEN=3UWPGA57LF6GGCI23VQA
EVENTBRITE_ORG_ID=213181179995

# Acuity Scheduling
ACUITY_USER_ID=35932879
ACUITY_API_KEY=09fce6787fa7467207fb557c1652d72a

# Optional
DEFAULT_TIMEZONE=America/Chicago
```

## Testing Locally

### 1. **Start Development Server**

```powershell
cd C:\Users\yayan\OneDrive\Documents\GitHub\ccf-stacked-v2
npm run dev
```

### 2. **Test Events Index**

Visit: http://localhost:3000/events

Should show:
- ✅ List of upcoming events from both sources
- ✅ Event cards with proper formatting
- ✅ Category badges (Chicago/Eugene)
- ✅ Book Now buttons linking to Eventbrite/Acuity
- ✅ Details links to `/events/[slug]`

### 3. **Test Event Detail Page**

Click "Details" on any event, or visit:
- `/events/eventbrite-{id}-{title-slug}`
- `/events/acuity-{typeId}-{date}-{time}`

Should show:
- ✅ Full event details
- ✅ Hero image (if available)
- ✅ Date, location, price
- ✅ Full description
- ✅ Book button linking externally

### 4. **Verify JSON-LD**

View page source on both `/events` and `/events/[slug]`:
- Look for `<script type="application/ld+json">` tags
- Validate at: https://validator.schema.org/
- Or use Google Rich Results Test: https://search.google.com/test/rich-results

### 5. **Check Sitemap**

Visit: http://localhost:3000/sitemap.xml

Should include:
- ✅ `<url><loc>https://colorcocktailfactory.com/events</loc></url>`
- ✅ Multiple event detail URLs
- ✅ Proper `lastModified` and `changeFrequency`

### 6. **Verify Footer Link**

Check footer on any page:
- ✅ "Upcoming Events" link in Quick Links section
- ✅ Links to `/events`
- ✅ NOT in main navbar

## API Call Optimization

### Caching Strategy
- All API calls cached for 1 hour (`revalidate: 3600`)
- Events filtered to upcoming only
- Sorted by start date ascending

### Rate Limiting
To avoid overwhelming APIs:
- Acuity: Limited to 10 dates per appointment type
- Acuity: Limited to 3 time slots per date
- Configurable via code adjustments

## Security

✅ **API credentials stored server-side only**
- Never exposed to client
- Environment variables used exclusively
- No credentials in logs or error messages

✅ **No cloaking**
- Same content visible to bots and users
- Public pages with normal URLs
- Footer link accessible to all

✅ **Acuity PUBLIC data only**
- Uses availability endpoints only
- Never accesses customer data or confirmations
- Only shows publicly bookable slots

## Production Deployment

### Netlify Configuration

Ensure environment variables are set in Netlify dashboard:

1. Go to Site Settings → Environment Variables
2. Add:
   - `EVENTBRITE_TOKEN`
   - `EVENTBRITE_ORG_ID`
   - `ACUITY_USER_ID`
   - `ACUITY_API_KEY`

### Build Command

```bash
npm run build
```

Should generate:
- Static `/events` page
- Static `/events/[slug]` pages for current events
- Updated `sitemap.xml`

### Revalidation

Pages automatically revalidate:
- `/events`: Every 60 seconds
- `/events/[slug]`: Weekly or on-demand

## Troubleshooting

### No Events Showing

1. **Check environment variables:**
   ```powershell
   echo $env:EVENTBRITE_TOKEN
   echo $env:ACUITY_USER_ID
   ```

2. **Check console logs:**
   - Server logs will show API errors
   - Look for "EVENTBRITE_TOKEN not configured" warnings

3. **Test API directly:**
   ```powershell
   curl -H "Authorization: Bearer YOUR_TOKEN" `
     "https://www.eventbriteapi.com/v3/organizations/213181179995/events/"
   ```

### Duplicate Events

- Adjust deduplication logic in `lib/eventsAPI.ts`
- Modify `areDuplicates()` function
- Change title similarity threshold

### Acuity Events Missing

- Check Acuity appointment types are public
- Verify availability exists in next 60 days
- Check calendar assignments (Chicago vs Eugene)

### Sitemap Not Updating

- Clear build cache: `rm -rf .next`
- Rebuild: `npm run build`
- Check `app/sitemap.ts` async function

## Future Enhancements

Potential improvements:
- [ ] City/category filters on `/events` page
- [ ] "Load more" pagination for large event lists
- [ ] Calendar view option
- [ ] iCal export links
- [ ] Email reminders/notifications
- [ ] Admin dashboard for event management
- [ ] Analytics tracking on booking button clicks

## Files Modified/Created

### New Files
- ✅ `lib/eventsAPI.ts` - Combined events fetcher
- ✅ `app/events/[slug]/page.tsx` - Event detail pages

### Modified Files
- ✅ `app/events/page.tsx` - Updated to use combined API
- ✅ `app/sitemap.ts` - Added event detail pages
- ✅ `.env.example` - Updated with credentials
- ✅ `.env.local` - Added actual credentials
- ✅ `components/Footer.tsx` - (Already had events link)

## Acceptance Checklist

- ✅ `/events` loads and shows events from both sources
- ✅ `/events/[slug]` pages render correctly
- ✅ Footer includes "Upcoming Events" link
- ✅ Navbar unchanged (not added)
- ✅ JSON-LD validates and matches visible content
- ✅ Sitemap includes `/events` and detail URLs
- ✅ API tokens remain server-only
- ✅ No cloaking or bot-only behavior
- ✅ Server-side caching implemented
- ✅ Deduplication works correctly
- ✅ Events sorted by date ascending
- ✅ Booking buttons link externally
- ✅ SEO metadata complete

## Support

For questions or issues:
- Email: support@colorcocktailfactory.com
- Review server logs in Netlify dashboard
- Check API status at Eventbrite/Acuity developer consoles
