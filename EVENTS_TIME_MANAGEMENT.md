# Adding Times to Event Cards

## Current Implementation

The `/events` page now uses an expandable "Show times" drawer inside each experience card. This eliminates the need for separate left-side time cards and creates a cleaner, more curated experience.

## How Times Are Managed

### Data Structure
Each event card displays times using the `TimeSlot` interface:

```typescript
interface TimeSlot {
  datetime: Date;
  bookingUrl: string;
  bookingSource: "eventbrite" | "rezclick" | "acuity";
}
```

### Current Source
All times currently come from **Eventbrite** via the `getCCFEvents()` function in `lib/eventbrite.ts`.

## How to Add More Times

### Option 1: Add Times from Other Platforms
To integrate RezClick or Acuity times alongside Eventbrite:

1. Create a new API client (similar to `lib/eventbrite.ts`):
   - `lib/rezclick.ts` for RezClick
   - `lib/acuity.ts` for Acuity

2. Fetch and merge the times in `app/events/page.tsx`:
   ```typescript
   const eventbriteEvents = await getCCFEvents();
   const rezclickEvents = await getRezClickEvents();
   const allEvents = [...eventbriteEvents, ...rezclickEvents];
   ```

3. The `ShowTimesDrawer` component will automatically handle mixed sources - each "Book" button links to the correct platform.

### Option 2: Manually Add Times to Specific Events
To add times that don't come from APIs (e.g., private sessions):

1. In `components/EventsGrid.tsx`, after grouping events, inject additional times:
   ```typescript
   const groupedEvents = groupEvents(cityEvents);
   
   // Find specific event and add manual times
   const dateNightEvent = groupedEvents.find(e => 
     e.title.toLowerCase().includes("date night")
   );
   
   if (dateNightEvent) {
     dateNightEvent.times.push({
       datetime: new Date("2025-12-30T19:00"),
       bookingUrl: "https://rezclick.com/...",
       bookingSource: "rezclick"
     });
   }
   ```

### Option 3: Future Enhancement - Database
For long-term scalability, move to a database:
- Store all events in a CMS or database
- Include times from multiple platforms
- Query and merge server-side
- Same `TimeSlot` interface works unchanged

## Files Changed

### New Files
- `components/ShowTimesDrawer.tsx` - Client component for expandable times
- `EVENTS_TIME_MANAGEMENT.md` - This documentation

### Modified Files
- `components/EventsGrid.tsx`
  - Updated `GroupedEvent` interface to use `TimeSlot[]`
  - Modified `groupEvents()` to create `TimeSlot` objects
  - Refactored `EventCard` to use `ShowTimesDrawer`
  - Removed inline time listings

## Component Behavior

### Collapsed (Default)
Shows:
- Experience title
- Category badge
- Next available time
- "View upcoming times ▾" button

### Expanded
Shows:
- All upcoming times (up to `maxVisible`, default 4)
- Each time with "Book →" button
- "View all X times" button if more than 4 exist

## Design Notes
- Smooth height/opacity transitions (300ms)
- Matches CCF glass morphism aesthetic
- Mobile-friendly collapsible pattern
- No separate schedule pages needed
- Platform-agnostic booking links
