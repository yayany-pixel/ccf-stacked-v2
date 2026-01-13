# CCF Website - Navigation & Information Architecture Improvements

## Recommended Improvements (Priority Order)

### 1. **Add Persistent "Book Now" CTA in Header**
- **Current:** Book button only visible on larger screens
- **Improve:** Make "Book a Class" sticky/persistent across all breakpoints
- **Impact:** Reduces friction to conversion; always one click away from booking

### 2. **Consolidate Class Navigation Under "Explore Classes" Mega Menu**
- **Current:** Individual class links scattered in header (Date Night, Mosaics, Bonsai)
- **Improve:** Single "Explore Classes" dropdown with room-based categories (Mud Room, Glass Room, Roots Room, etc.)
- **Impact:** Cleaner header, easier browsing, matches mental model of physical studio

### 3. **Add Breadcrumb Navigation to All Class Detail Pages**
- **Current:** No breadcrumbs on /chicago/date-night-wheel type pages
- **Improve:** Show: Home > Chicago > Date Night Pottery
- **Impact:** Better SEO, clearer hierarchy, easier back-navigation

### 4. **Create Unified "Private Events" Hub Page with Filterable Options**
- **Current:** 4 separate pages (team-building, birthday, bachelorette, corporate)
- **Improve:** Single /private-events hub with filtering by group type, size, occasion
- **Impact:** Reduces decision fatigue, improves scannability, better lead capture

### 5. **Add "Recently Viewed Classes" or "Similar Classes" to Class Detail Pages**
- **Current:** No cross-selling or related content on class pages
- **Improve:** Show 3-4 related classes at bottom (e.g., "Also popular in Chicago")
- **Impact:** Increases pages per session, exposes variety, helps undecided visitors

### 6. **Implement Location-Aware Auto-Redirect or Smart Banner**
- **Current:** Homepage shows both locations equally
- **Improve:** Detect user location (IP-based) and suggest relevant city with dismiss option
- **Impact:** Personalized experience, faster path to booking for local visitors

### 7. **Add Quick Filters to /activities Page (Category, Location, Duration, Price)**
- **Current:** /activities shows all classes in list format
- **Improve:** Add filter sidebar: Room type, City, Duration (<2hrs, 2-4hrs), Price range
- **Impact:** Helps visitors narrow 20+ classes quickly, improves UX for browsers

### 8. **Consolidate Teach Section into Tabbed Single-Page Experience**
- **Current:** 7 separate pages under /teach (apply, faq, pay, how-it-works, etc.)
- **Improve:** Combine into /teach with tabs or accordion sections
- **Impact:** Reduces clicks to evaluate opportunity, better mobile experience

### 9. **Add Visual "Class Type" Icons to Location Hub Cards**
- **Current:** Text-only class links in Chicago/Eugene cards
- **Improve:** Add emoji/icons for quick scanning (🏺 pottery, ✨ glass, 🌱 nature)
- **Impact:** Faster visual processing, more engaging, accessible to scan-readers

### 10. **Create "Plan Your Visit" Section on Location Pages**
- **Current:** Hours and address buried in footer or small text
- **Improve:** Dedicated section with: Hours, Parking, What to Bring, BYOB policy, Accessibility
- **Impact:** Reduces support inquiries, builds confidence for first-time visitors

---

## Additional Quick Wins

### Mobile Optimization
- **Sticky bottom bar** with "Book Class" CTA on mobile (replaces header CTA)
- **Swipeable class cards** on location hubs instead of grid on mobile
- **One-tap phone/email** buttons on private events pages

### SEO & Content
- **Add FAQ schema** to class detail pages (e.g., "What should I wear?" "Can I bring drinks?")
- **Add LocalBusiness schema** with aggregateRating to location pages
- **Create location-specific blog categories** (e.g., /blog/chicago, /blog/eugene)

### Conversion Optimization
- **Add "Sold Out" badges** to calendar events (creates urgency)
- **Show "X spots left" on class listings** (scarcity principle)
- **Add exit-intent popup** offering 10% off first class or free gift card with purchase

---

## Information Architecture Summary

### Current Strengths ✅
- Clear location-first structure (Chicago vs Eugene)
- Comprehensive class catalog with dedicated detail pages
- Separate conversion paths (individual booking vs group inquiry)
- Strong content marketing (blog + teach recruitment)

### Current Gaps ⚠️
- No clear "room" or category taxonomy visible to users
- Private events scattered across 4 pages instead of unified hub
- Teach section too fragmented (7 pages for one flow)
- No personalization or location awareness
- Limited cross-selling between classes

### Ideal Future State 🎯
```
Homepage (location chooser)
├── Chicago (hub with room categories)
│   ├── Mud Room (pottery classes)
│   ├── Glass Room (mosaics, lamps, fusion)
│   ├── Roots Room (bonsai, terrarium)
│   ├── Crush & Create (candles, wine glass)
│   └── Paper & Pigment (watercolor, painting)
├── Eugene (hub with room categories - same structure)
├── Private Events (unified hub with filters)
│   ├── Filter by: Group size, Occasion, Budget
│   └── Single quote request form
├── Explore Classes (filterable catalog)
│   ├── Filter by: Location, Category, Duration, Price
│   └── Sort by: Popularity, Newest, Price
├── Teach (single-page tabbed experience)
│   ├── Overview tab
│   ├── Benefits & Pay tab
│   ├── FAQ tab
│   └── Apply tab (embedded form)
├── Blog (location-filtered content)
└── Gift Cards (e-commerce flow)
```

---

## Metrics to Track Post-Implementation

1. **Homepage → Class Detail CTR** (should increase with better navigation)
2. **Bounce rate on /activities** (should decrease with filters)
3. **Private event quote submissions** (should increase with unified hub)
4. **Mobile conversion rate** (should increase with sticky CTA)
5. **Pages per session** (should increase with related classes module)
6. **Teach application completions** (should increase with single-page flow)
7. **Time on site** (should increase with better navigation/discovery)
8. **Return visitor rate** (should increase with personalization)

---

## Implementation Phases

### Phase 1: Quick Wins (1-2 weeks)
- Add breadcrumbs
- Add class icons
- Sticky mobile CTA
- Related classes module

### Phase 2: Navigation Overhaul (2-4 weeks)
- Mega menu for classes
- Unified private events hub
- /activities page filters
- Single-page teach section

### Phase 3: Personalization (4-6 weeks)
- Location detection
- Recently viewed
- Exit-intent offers
- FAQ schema

---

**End of Recommendations**
