# Booking Click Tracking Implementation

## Overview
All outbound booking links now track as GA4 `begin_checkout` events with CCF-specific parameters.

## What Changed

### Files Created
1. **`components/BookingLink.tsx`** - Reusable component that wraps all booking links with automatic GA4 tracking
2. **`lib/analytics.ts`** (updated) - Added `trackBeginCheckout()`, `detectBookingProvider()`, and `BookingProvider` type

### Files Updated
3. **`app/[city]/[slug]/page.tsx`** - Replaced ButtonPill with BookingLink for "Open booking" and "Open calendar" buttons
4. **`components/StackedSection.tsx`** - Homepage cards now use BookingLink for primary/secondary booking CTAs
5. **`components/HomeTimesDrawer.tsx`** - Booking platform icons (Groupon/RezClick, Eventbrite, Acuity) and time slot links use BookingLink
6. **`components/ShowTimesDrawer.tsx`** - Time slot "Book →" buttons use BookingLink
7. **`components/EventsGrid.tsx`** - "Book Now" buttons for Eventbrite/Acuity events use BookingLink
8. **`components/AcuitySeriesCard.tsx`** - Individual time slot booking links and main "Book This Class" button use BookingLink
9. **`app/events/[slug]/page.tsx`** - Event detail "Book This Event" button uses BookingLink

---

## Tracking Parameters

Every booking click fires a GA4 `begin_checkout` event with:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `city` | City where class is located | `Chicago`, `Eugene` |
| `class_category` | Type of workshop | `workshop` (default) |
| `class_name` | Display name of the class | `Date Night Pottery` |
| `class_id` | Slug/identifier | `date-night-wheel` |
| `booking_provider` | Detected from URL | `rezclick`, `eventbrite`, `acuity`, `unknown` |
| `link_url` | Full destination URL | `https://rezclick.com/...` |

---

## BookingLink Component Usage

```tsx
import BookingLink from '@/components/BookingLink';

<BookingLink
  href="https://www.rezclick.com/color-cocktail-factory/date-night-pottery"
  city="Chicago"
  classNameText="Date Night Pottery"
  classId="date-night-wheel"
  className="btn btn-primary"
>
  Book Now
</BookingLink>
```

### Props
- **`href`** (required): Booking URL (RezClick, Eventbrite, Acuity)
- **`city`** (required): `"Chicago"` or `"Eugene"`
- **`classNameText`** (required): Human-readable class name
- **`classId`** (required): Slug/identifier (matches URL structure)
- **`classCategory`** (optional): Defaults to `"workshop"`
- **`className`** (optional): CSS classes for styling
- **`onClick`** (optional): Additional click handler
- **`target`**, **`rel`**, **`ariaLabel`** (optional): Standard link attributes

---

## Booking Provider Detection

The `detectBookingProvider()` function automatically determines the provider from the URL:

```typescript
detectBookingProvider('https://rezclick.com/...')        // → 'rezclick'
detectBookingProvider('https://eventbrite.com/...')      // → 'eventbrite'
detectBookingProvider('https://acuityscheduling.com/...') // → 'acuity'
detectBookingProvider('https://example.com/...')         // → 'unknown'
```

You can also manually specify:
```typescript
trackBeginCheckout({
  city: 'Chicago',
  class_name: 'Pottery',
  class_id: 'pottery',
  booking_provider: 'rezclick', // Manual override
  link_url: 'https://...'
});
```

---

## Verification in GA4

### Step 1: Enable DebugView
1. Open your website with: `?debug_mode=true` appended to URL
2. Example: `https://colorcocktailfactory.com/chicago/date-night-wheel?debug_mode=true`

### Step 2: Open GA4 DebugView
1. Go to: [Google Analytics](https://analytics.google.com/)
2. Navigate to: **Admin → DebugView**
3. Select your property: **Color Cocktail Factory**

### Step 3: Test Booking Clicks
Click any booking link on the site. You should see:

**Event Name:** `begin_checkout`

**Event Parameters:**
```
city: Chicago
class_category: workshop
class_name: Date Night Pottery
class_id: date-night-wheel
booking_provider: rezclick
link_url: https://www.rezclick.com/color-cocktail-factory/date-night-pottery
```

### Step 4: Verify in Network Tab (Browser DevTools)
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Filter by: `collect`
4. Click a booking link
5. Look for request to `https://www.google-analytics.com/g/collect`
6. Check **Payload** tab for:
   - `en=begin_checkout`
   - `ep.city=Chicago`
   - `ep.class_name=Date%20Night%20Pottery`
   - `ep.booking_provider=rezclick`

---

## Custom Dimensions Setup in GA4

To analyze booking data properly, create these custom dimensions:

### Navigate to GA4:
**Admin → Data display → Custom definitions → Create custom dimension**

| Display Name | Event Parameter | Scope |
|--------------|-----------------|-------|
| City | `city` | Event |
| Class Category | `class_category` | Event |
| Class Name | `class_name` | Event |
| Class ID | `class_id` | Event |
| Booking Provider | `booking_provider` | Event |
| Link URL | `link_url` | Event |

---

## Example GA4 Reports

### Booking Funnel Report
1. **Exploration → Funnel exploration**
2. Steps:
   - Step 1: `page_view` (any page)
   - Step 2: `begin_checkout` (booking click)
   - Step 3: External goal completion (requires webhook)

### Top Booking Providers
1. **Exploration → Free form**
2. Dimensions: `Booking Provider`
3. Metrics: `Event count` (begin_checkout)
4. Breakdown: `City`, `Class Name`

### Conversion by Class
1. **Exploration → Free form**
2. Dimensions: `Class Name`, `City`
3. Metrics: `Event count` (begin_checkout)
4. Sort by: Descending

---

## Testing Checklist

- [ ] **Homepage sections** - Click booking buttons on Date Night, Beginner Wheel, Mosaics, etc.
- [ ] **City-specific pages** - Navigate to `/chicago/date-night-wheel` → "Open booking"
- [ ] **Events pages** - Click "Book Now" on `/events` Eventbrite/Acuity cards
- [ ] **Event detail pages** - Click "Book This Event" on `/events/[slug]`
- [ ] **Acuity page** - Click "Book →" and "Book This Class →" on `/events/acuity`
- [ ] **Homepage drawers** - Expand "View upcoming times" → Click platform icons (Groupon, Eventbrite, Acuity) and time slots

### Expected Behavior
- ✅ Link opens in new tab (external URLs)
- ✅ GA4 DebugView shows `begin_checkout` event
- ✅ Event parameters populated correctly
- ✅ No JavaScript errors in console
- ✅ No double-firing (one event per click)

---

## Preventing Double-Fire

The implementation ensures no duplicate events:
1. **BookingLink** component only fires once per click
2. **Event bubbling stopped** where necessary (e.g., `e.stopPropagation()` in drawers)
3. **No GTM conflicts** - Direct gtag.js implementation only

---

## Development Logging

In development mode (`NODE_ENV === 'development'`), all tracking calls log to console:

```javascript
[GA4] begin_checkout: {
  city: "Chicago",
  class_name: "Date Night Pottery",
  class_id: "date-night-wheel",
  booking_provider: "rezclick",
  link_url: "https://www.rezclick.com/..."
}
```

Production mode: Silent (no console output).

---

## Files Changed Summary

| File | Changes |
|------|---------|
| `components/BookingLink.tsx` | ✅ Created - Wrapper component with automatic tracking |
| `lib/analytics.ts` | ✅ Added `trackBeginCheckout()`, `detectBookingProvider()` |
| `app/[city]/[slug]/page.tsx` | ✅ Replaced 2 booking buttons with BookingLink |
| `components/StackedSection.tsx` | ✅ Replaced primary/secondary CTAs with conditional BookingLink |
| `components/HomeTimesDrawer.tsx` | ✅ Replaced 3 platform icons + time slots with BookingLink |
| `components/ShowTimesDrawer.tsx` | ✅ Replaced time slot links with BookingLink |
| `components/EventsGrid.tsx` | ✅ Replaced "Book Now" with BookingLink |
| `components/AcuitySeriesCard.tsx` | ✅ Replaced 2 booking buttons with BookingLink |
| `app/events/[slug]/page.tsx` | ✅ Replaced "Book This Event" with BookingLink |

**Total: 9 files modified, 2 files created**

---

## Next Steps

1. **Deploy to production** - Ensure `NEXT_PUBLIC_GA_ID_1` is set in Netlify
2. **Test in DebugView** - Verify events fire correctly
3. **Create custom dimensions** - Follow setup guide above
4. **Build reports** - Track booking funnel, provider performance, class popularity
5. **Webhook integration** (future) - Send `purchase` events back to GA4 from Eventbrite/Acuity/RezClick

---

## Troubleshooting

### Event not showing in DebugView
- ✅ Check browser console for `[GA4] begin_checkout:` log (development mode)
- ✅ Verify `NEXT_PUBLIC_GA_ID_1` environment variable is set
- ✅ Clear browser cache and reload
- ✅ Check Network tab for `/g/collect` requests

### Parameters missing
- ✅ Verify BookingLink has all required props: `city`, `classNameText`, `classId`, `href`
- ✅ Check for typos in prop names
- ✅ Ensure `trackBeginCheckout()` is called (check console logs)

### Double-firing events
- ✅ Check if multiple tracking libraries are loaded (GTM + gtag.js)
- ✅ Verify no duplicate onClick handlers
- ✅ Use browser DevTools to count `/g/collect` requests

### Provider detection not working
- ✅ Check URL format (must include `rezclick.com`, `eventbrite.com`, or `acuityscheduling.com`)
- ✅ Verify `detectBookingProvider()` logic in `lib/analytics.ts`
- ✅ Manually override with `booking_provider` prop if needed

---

## Contact & Support

For analytics questions:
- GA4 Property: **Color Cocktail Factory** (G-CPKCDF56W2)
- Measurement ID: `G-CPKCDF56W2`
- Implementation: Direct gtag.js (no GTM)
