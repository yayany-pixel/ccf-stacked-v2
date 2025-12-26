# Acuity Page Enhancements

This document describes the three major enhancements made to the `/events/acuity` page.

## Overview

The Acuity events page has been upgraded from showing individual time slots to displaying series-based cards with expanded functionality.

## Enhancement A: Paginated Time Slots ("More Times" Button)

### Implementation
- **Component**: `AcuitySeriesCard.tsx` (client component)
- **State Management**: Uses `useState` for local pagination
- **Initial Display**: Shows 6 time slots per series
- **Load More**: Increments by 6 additional times with each click
- **UI**: Expandable drawer showing "More times (X remaining)" button

### User Experience
1. Click "View upcoming times" to expand drawer
2. See first 6 available time slots
3. Click "More times" button to load 6 more
4. Continues until all times are visible
5. Click "Hide upcoming times" to collapse

### Code
```typescript
const [visibleTimesCount, setVisibleTimesCount] = useState(6);
const visibleTimes = series.times.slice(0, visibleTimesCount);
const hasMoreTimes = visibleTimesCount < totalTimes;

const handleShowMore = () => {
  setVisibleTimesCount(prev => Math.min(prev + 6, totalTimes));
};
```

## Enhancement B: Seat Availability Display

### Data Structure
Each `AcuityTimeSlot` now includes optional seat data:
```typescript
export type AcuityTimeSlot = {
  datetime: Date;
  startISO: string;
  bookingUrl: string;
  remainingSeats?: number;  // Seats left
  capacity?: number;         // Total capacity
};
```

### Extraction Logic
The system attempts to extract seat data from multiple possible Acuity API fields:
```typescript
const remainingSeats = slot.slotsAvailable ?? slot.spotsRemaining ?? slot.remaining;
const capacity = slot.capacity ?? type.paddingAfter;
```

### Display Rules
- **Sold Out**: `remainingSeats === 0` → Red "Sold out" badge
- **Low Availability**: `remainingSeats <= 3` → Yellow "X seats left"
- **Available**: `remainingSeats > 3` → Green "X seats available"
- **Capacity Only**: No remaining seats data → "Capacity: X"
- **No Data**: No seat info → Green "Available" badge

### API Limitations
**Note**: As of this implementation, Acuity's public availability endpoints do not consistently expose seat count data. The extraction logic is in place for future API updates or when using different endpoint configurations.

## Enhancement C: Workshop Images

### Image Mapping System
**File**: `lib/acuityImages.ts`

### Three-Tier Matching
1. **Exact Match**: Direct title → image mapping
2. **Partial Match**: Substring search (e.g., "wheel" matches "date-night-wheel")
3. **Category Fallback**: Uses category-based default image

### Image Directories
```
public/images/
├── categories/      # 9 category fallback images
│   ├── pottery.jpg
│   ├── mosaic.jpg
│   ├── glass-fusion.jpg
│   └── ...
└── workshops/       # Specific workshop images
    ├── date-night-wheel.jpg
    ├── turkish-lamp.jpg
    └── ...
```

### Adding New Images
1. Add image to `public/images/workshops/`
2. Update `lib/acuityImages.ts`:
```typescript
export const appointmentImages: Record<string, string> = {
  "workshop title": "/images/workshops/filename.jpg",
};
```

### Normalized Matching
Titles are normalized for fuzzy matching:
- Lowercase conversion
- Special character removal
- Whitespace normalization

Example: "Date Night on the Wheel!" → "date night on the wheel"

## Data Architecture Changes

### Old Structure (Individual Listings)
```typescript
type AcuityListing = {
  id: string;
  title: string;
  datetime: Date;
  startISO: string;
  location?: string;
  category: string;
  bookingUrl: string;
};
```

### New Structure (Series-Based)
```typescript
type AcuitySeries = {
  id: string;                    // Appointment type ID
  title: string;                 // Workshop name
  location?: string;             // Venue
  category: string;              // Category for grouping
  bookingUrl: string;            // Generic booking link
  times: AcuityTimeSlot[];       // All available times
};
```

### Benefits of Series Structure
- **Reduced visual clutter**: One card per workshop type instead of one per time
- **Better overview**: See all available times for a workshop at once
- **Improved UX**: Easier to compare schedules across workshops
- **More scalable**: Handles workshops with many time slots gracefully

## Component Architecture

### Server Component
**File**: `app/events/acuity/page.tsx`
- Fetches series data via `getAcuitySeries()`
- Groups by category
- Passes series to client cards
- Handles error states

### Client Component
**File**: `components/AcuitySeriesCard.tsx`
- Manages local state for pagination
- Handles drawer expand/collapse
- Displays images, times, and seat availability
- Individual booking links per time slot

### Data Fetcher
**File**: `lib/acuity.ts`
- Fetches from Acuity PUBLIC API
- Groups times by appointment type
- Extracts seat data (when available)
- Returns series with sorted times

## Security Notes

All enhancements maintain the critical security model:
- ✅ PUBLIC availability endpoints only
- ✅ No customer data access
- ✅ No confirmation URLs
- ✅ Server-side API key protection
- ✅ Only generic booking URLs exposed

## Performance Considerations

### Server-Side Caching
```typescript
export const revalidate = 300; // 5 minutes
```

### Image Optimization
- Next.js Image component with automatic optimization
- Lazy loading for off-screen images
- Responsive sizing with srcset generation

### Client-Side State
- Lightweight local state (pagination counter)
- No external state management needed
- Minimal re-renders (only on user interaction)

## Testing Checklist

- [ ] Visit `/events/acuity` with valid credentials
- [ ] Verify series cards display with category images
- [ ] Test "View upcoming times" expand/collapse
- [ ] Verify first 6 times show initially
- [ ] Click "More times" button, verify 6 more times load
- [ ] Repeat until all times visible
- [ ] Check seat availability badges (if API provides data)
- [ ] Test "Book This Class" main button
- [ ] Test individual time slot "Book" links
- [ ] Verify all booking URLs open Acuity public scheduler
- [ ] Test with no images (should fallback to category image)
- [ ] Test empty state (no upcoming workshops)
- [ ] Test error state (invalid credentials)
- [ ] Test not configured state (missing credentials)

## Future Enhancements

### Potential Additions
1. **Real-time seat updates**: WebSocket connection for live availability
2. **Filtering**: By category, date range, or location
3. **Sorting**: By date, popularity, or seats available
4. **Calendar view**: Alternative visualization of time slots
5. **Favorites**: Save preferred workshops (client-side storage)
6. **Notifications**: Alert when seats become available

### Image Improvements
1. Automated image optimization pipeline
2. Multiple image sizes for different devices
3. Blur placeholder generation
4. Admin UI for image management
5. Auto-detection of workshop types for smarter defaults

## Migration Notes

If you have existing Acuity integrations, note:
- `getAcuityListings()` is replaced by `getAcuitySeries()`
- Return type changed from `AcuityListing[]` to `AcuitySeries[]`
- Each series contains multiple times instead of single time
- Component structure changed from individual cards to expandable series cards
- Images now required in `/public/images/` directories

## Rollback Instructions

If you need to revert to the previous implementation:
1. Restore `lib/acuity.ts` to use `getAcuityListings()`
2. Restore old `app/events/acuity/page.tsx` (individual listing cards)
3. Remove `components/AcuitySeriesCard.tsx`
4. Remove `lib/acuityImages.ts`
5. Optional: Remove `/public/images/` directories

Backup files may be available in version control history.
