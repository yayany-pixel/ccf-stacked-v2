# Homepage Booking Links Configuration Guide

## Overview
The homepage hero sections now include a collapsible "Upcoming times" drawer with booking platform icons (Groupon/RezClick, Eventbrite, and Acuity). This guide explains how to configure and manage these links.

## Files Changed

### New Files
- **`components/HomeTimesDrawer.tsx`** - Collapsible drawer component with booking platform icons

### Modified Files
- **`components/StackedSection.tsx`** 
  - Removed left schedule card column
  - Changed layout from 12-column grid to single centered column (`max-w-5xl`)
  - Added `HomeTimesDrawer` component inside hero card
  - Component now only renders when `section.bookingLinks` exists

- **`lib/config.ts`**
  - Updated `SectionConfig` type with new optional fields:
    - `bookingLinks?: { rezclick?: string; eventbrite?: string; acuity?: string; }`
    - `upcomingTimes?: Array<{ label: string; url: string; }>`
  - Added sample data to "Date Night on the Wheel" section
  - Added sample data to "Wheel Throwing for Beginners" section

## How to Add Booking Links

### Step 1: Locate the Section in config.ts

Each section is an object in the `sections` array in `lib/config.ts`. Find the section you want to update (search by `id` or `slug`).

Example sections:
- `"date-night-wheel"`
- `"beginner-wheel"`  
- `"mosaic"`
- `"candle-making"`

### Step 2: Add bookingLinks Object

Add the `bookingLinks` property to the section configuration. All three platforms are optional:

```typescript
{
  id: "date-night",
  slug: "date-night-wheel",
  // ... other config ...
  booking: { term: "date%20night" },
  
  // ADD THIS:
  bookingLinks: {
    rezclick: "https://www.rezclick.com/color-cocktail-factory/date-night-pottery",
    eventbrite: "https://www.eventbrite.com/e/date-night-on-the-wheel-tickets-123456",
    acuity: "https://app.acuityscheduling.com/schedule.php?owner=35932879&appointmentType=12345"
  },
  
  faqs: [ ... ]
}
```

### Step 3: Add upcomingTimes (Optional)

If you want to show specific time slots with direct booking links:

```typescript
bookingLinks: {
  rezclick: "https://www.rezclick.com/...",
  eventbrite: "https://www.eventbrite.com/...",
  acuity: "https://app.acuityscheduling.com/..."
},
upcomingTimes: [
  { label: "Fri Dec 27 · 5:30 PM", url: "https://www.rezclick.com/..." },
  { label: "Sat Dec 28 · 7:30 PM", url: "https://www.rezclick.com/..." },
  { label: "Sun Dec 29 · 5:30 PM", url: "https://www.rezclick.com/..." }
],
```

**Note:** If `upcomingTimes` is empty or omitted, the drawer will show: "Times coming soon — choose a booking option above"

## Platform-Specific URLs

### Groupon → RezClick
- **Purpose:** Groupon audiences are directed to RezClick for booking
- **Icon Label:** "Groupon" (but links to RezClick)
- **URL Format:** `https://www.rezclick.com/color-cocktail-factory/{experience-name}`
- **Example:** `https://www.rezclick.com/color-cocktail-factory/date-night-pottery`

### Eventbrite
- **Purpose:** Direct link to Eventbrite event page
- **Icon Label:** "Eventbrite"
- **URL Format:** `https://www.eventbrite.com/e/{event-name}-tickets-{event-id}`
- **Example:** `https://www.eventbrite.com/e/beginner-pottery-wheel-class-tickets-789012`
- **How to Get:** 
  1. Find event on Eventbrite dashboard
  2. Copy the public event URL
  3. Paste into config

### Acuity
- **Purpose:** Remaining inventory / additional seats
- **Icon Label:** "Acuity"
- **URL Format:** `https://app.acuityscheduling.com/schedule.php?owner={owner_id}&appointmentType={type_id}`
- **Placeholder:** Use `"ACUITY_PLACEHOLDER_{SECTION_NAME}"` until real link is available
- **Example:** `https://app.acuityscheduling.com/schedule.php?owner=35932879&appointmentType=45678`

**Finding Acuity URLs:**
1. Log into Acuity Scheduling dashboard
2. Go to Appointment Types
3. Click on the specific class/appointment type
4. Copy the "Scheduling Page Link"
5. Paste into config

## UI Behavior

### When Links Are Present
- Icon appears with full opacity and color
- Clickable, opens in new tab
- Hover effect (glow + border highlight)

### When Link Is Missing
- Icon appears grayed out (40% opacity)
- Not clickable
- Shows tooltip: "Link not set yet"

### Drawer States
- **Collapsed (default):** "View upcoming times ▾"
- **Expanded:** "Hide upcoming times ▴" + booking icons + times list

## Example: Complete Section with All Links

```typescript
{
  id: "mosaic",
  anchorId: "mosaic",
  navLabel: "Mosaic",
  slug: "mosaic",
  // ... video, overlay, schedule, hero content ...
  
  bookingLinks: {
    rezclick: "https://www.rezclick.com/color-cocktail-factory/mosaic-workshop",
    eventbrite: "https://www.eventbrite.com/e/mosaic-workshop-all-skills-tickets-456789",
    acuity: "https://app.acuityscheduling.com/schedule.php?owner=35932879&appointmentType=67890"
  },
  upcomingTimes: [
    { label: "Fri Dec 27 · 3:30 PM", url: "https://www.rezclick.com/color-cocktail-factory/mosaic-workshop" },
    { label: "Sat Dec 28 · 12:00 PM", url: "https://www.eventbrite.com/e/mosaic-workshop-all-skills-tickets-456789" },
    { label: "Sun Dec 29 · 2:00 PM", url: "https://app.acuityscheduling.com/schedule.php?owner=35932879&appointmentType=67890" }
  ],
  
  faqs: [ ... ]
}
```

## Sections Currently Configured

### ✅ Date Night on the Wheel
- **RezClick:** ✓ Configured
- **Eventbrite:** ✓ Configured  
- **Acuity:** ⏳ Placeholder (`ACUITY_PLACEHOLDER_DATE_NIGHT`)
- **Times:** 3 sample times added

### ✅ Wheel Throwing for Beginners
- **RezClick:** ✓ Configured
- **Eventbrite:** ✓ Configured
- **Acuity:** ❌ Not set
- **Times:** None (will show empty state)

### ⏳ All Other Sections
Need bookingLinks added to:
- Private Parties & Corporate
- Mosaic Workshop
- Turkish Lamp Mosaic
- Glass Fusion
- Bonsai
- Terrarium
- Candle Making
- Wine Glass Painting
- Paper & Pigment
- Painting
- Parent & Me
- Gift Cards

## Quick Update Checklist

To add booking links to a section:

1. [ ] Open `lib/config.ts`
2. [ ] Find section by `slug` or `id`
3. [ ] Add `bookingLinks` object with platform URLs
4. [ ] (Optional) Add `upcomingTimes` array with specific time slots
5. [ ] Save file - dev server will hot-reload
6. [ ] Visit homepage section to verify drawer appears
7. [ ] Click "View upcoming times" to verify icons display
8. [ ] Test each platform icon link

## Troubleshooting

**Drawer doesn't appear:**
- Check that `bookingLinks` object exists in config
- At least one platform URL must be provided

**Icon is grayed out:**
- That platform's URL is missing or undefined
- Add the URL or use a placeholder like `"ACUITY_PLACEHOLDER_NAME"`

**Times don't show:**
- `upcomingTimes` array is empty or missing
- This is expected - empty state message will display

**Links don't work:**
- Verify URLs are complete and valid
- Check for typos in URL format
- Test URL directly in browser first
