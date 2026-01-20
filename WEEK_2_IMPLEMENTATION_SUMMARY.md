# Week 2: Measurement & Conversion Optimization - Implementation Complete

## 🎯 Executive Summary

All Week 2 features have been successfully implemented and tested. The build completes successfully with no TypeScript errors. All features are **feature-flagged** and **disabled by default** for safe rollout.

**Implementation Date**: January 2025  
**Build Status**: ✅ Passing (257 pages generated)  
**TypeScript**: ✅ No errors  
**Dependencies**: ✅ web-vitals@4.x installed

---

## 📦 What Was Implemented

### 1. Core Web Vitals Tracking ✅ (ALWAYS ON)
**Location**: [lib/analytics.ts](lib/analytics.ts#L165-L225), [components/GoogleAnalytics.tsx](components/GoogleAnalytics.tsx#L40-L54)

**Metrics Tracked**:
- **LCP** (Largest Contentful Paint)
- **CLS** (Cumulative Layout Shift)
- **INP** (Interaction to Next Paint)
- **FCP** (First Contentful Paint)
- **TTFB** (Time to First Byte)

**Data Sent to GA4**:
```javascript
{
  event_category: 'Web Vitals',
  event_label: '<metric_id>',
  value: <rounded_value>,
  metric_value: <rounded_value>,
  metric_id: '<unique_id>',
  metric_rating: 'good' | 'needs-improvement' | 'poor',
  page_path: '/chicago',
  city: 'chicago' | 'eugene' | 'global',
  device_type: 'mobile' | 'tablet' | 'desktop',
  connection_type: '4g' | '3g' | 'unknown',
  non_interaction: true
}
```

**Integration**: Automatically loaded via GoogleAnalytics component in root layout. Uses web-vitals v4 library with dynamic import for optimal performance.

---

### 2. CRO (Conversion Rate Optimization) Helpers ✅ (DEFAULT: OFF)
**Location**: [components/CROHelpers.tsx](components/CROHelpers.tsx)

#### Components Created:
1. **UrgencyMessage** - Optional urgency messaging near CTAs
2. **SocialProof** - Optional recent booking activity display  
3. **CROStack** - Combined helper for both features

#### Feature Flags:
```bash
NEXT_PUBLIC_CRO_URGENCY=0        # 1 to enable
NEXT_PUBLIC_CRO_SOCIAL_PROOF=0   # 1 to enable
```

#### Usage Example:
```tsx
import { CROStack } from "@/components/CROHelpers";

<CROStack 
  urgencyMessage="Limited spots available this week"
  socialProofCount="23 people"
  socialProofTimeframe="in the last 48 hours"
/>
```

**Current Integration**: Homepage hero section (below A/B test variant)

---

### 3. Enhanced Analytics Hooks ✅ (ALWAYS ON)
**Location**: [lib/analyticsHooks.ts](lib/analyticsHooks.ts)

#### Hooks Created:

1. **useScrollDepth()** - Tracks scroll progression
   - Thresholds: 25%, 50%, 75%, 90%
   - Throttled to 200ms intervals
   - Fires GA4 event: `scroll_depth`

2. **useSectionVisibility(sectionName)** - IntersectionObserver tracking
   - Fires when section 50%+ visible
   - GA4 event: `section_view`
   - Example: `useSectionVisibility('Homepage Hero')`

3. **useCTATracking()** - Enhanced CTA click attribution
   - Adds context: location, text, type
   - Supplements existing `begin_checkout` events
   - GA4 event: `cta_click`

#### Usage Example:
```tsx
import { useScrollDepth, useSectionVisibility } from "@/lib/analyticsHooks";

export default function MyPage() {
  useScrollDepth();  // Track scroll depth automatically
  const heroRef = useSectionVisibility('Hero Section');
  
  return <section ref={heroRef}>...</section>;
}
```

**Current Integration**: Homepage (scroll depth + 3 section visibility tracking points)

---

### 4. A/B Testing Framework ✅ (DEFAULT: OFF)
**Location**: [lib/ab-testing.ts](lib/ab-testing.ts)

#### Functions:
- `useABTest(testName)` - React hook for variant assignment
- `getVariant(testName)` - Get current variant (A or B)
- `setVariant(variant, testName)` - Set and track variant
- `trackConversion(testName, variant)` - Track conversion events

#### Features:
- **Cookie-based**: `ccf_ab` cookie (30-day expiry, SameSite=Lax)
- **50/50 split**: Random assignment on first visit
- **URL override**: `?ab=A` or `?ab=B` for QA/preview
- **SSR-safe**: Always returns 'A' during SSR to prevent hydration mismatch

#### Feature Flag:
```bash
NEXT_PUBLIC_AB_TESTS=0  # 1 to enable
```

#### Active Test:
**Test**: `hero_subheading_test`  
**Location**: Homepage hero section  
**Variants**:
- **A (Control)**: "Expert-guided pottery, glass fusion, mosaics, and more..."
- **B (Test)**: "Book hands-on pottery, glass fusion, mosaics, and more today..."

**GA4 Events**:
- `ab_test_exposure` - Fired on variant assignment
- `ab_test_conversion` - Fired on booking click (via BookingLink)

---

### 5. Enhanced CTA Tracking ✅ (ALWAYS ON)
**Location**: [components/BookingLink.tsx](components/BookingLink.tsx)

#### New Props:
```tsx
<BookingLink
  href="..."
  city="Chicago"
  classNameText="Date Night Pottery"
  classId="date-night-wheel"
  ctaLocation="Hero"           // NEW
  ctaType="primary"            // NEW
>
  Book Now
</BookingLink>
```

#### GA4 Event:
```javascript
{
  event: 'cta_click',
  event_category: 'CTA',
  cta_location: 'Hero',
  cta_text: 'Book Now',
  cta_type: 'primary' | 'secondary' | 'text-link',
  page_path: '/chicago',
  non_interaction: false
}
```

**Note**: This is **additive** to existing `begin_checkout` tracking. Both events fire on CTA click.

---

## 🚀 Deployment Checklist

### Required Environment Variables

Add to Netlify (or your hosting platform):

```bash
# Week 2: Measurement & Conversion Features
# All features are OFF by default for safe rollout

# CRO Features (OFF by default)
NEXT_PUBLIC_CRO_URGENCY=0
NEXT_PUBLIC_CRO_SOCIAL_PROOF=0

# A/B Testing (OFF by default)  
NEXT_PUBLIC_AB_TESTS=0

# Core Web Vitals tracking is ALWAYS ON (no flag needed)
```

### Rollout Strategy

**Phase 1: Measurement Only** (Recommended first)
```bash
NEXT_PUBLIC_CRO_URGENCY=0
NEXT_PUBLIC_CRO_SOCIAL_PROOF=0
NEXT_PUBLIC_AB_TESTS=0
```
- Core Web Vitals tracking active
- Scroll depth tracking active
- Section visibility tracking active
- Enhanced CTA tracking active
- **Monitor GA4 for 1-2 weeks**

**Phase 2: Enable A/B Testing**
```bash
NEXT_PUBLIC_AB_TESTS=1
```
- Hero subheading test goes live
- Track `ab_test_exposure` and `ab_test_conversion` events
- **Run for minimum 2-4 weeks** for statistical significance

**Phase 3: Enable CRO Helpers** (Only if data supports it)
```bash
NEXT_PUBLIC_CRO_URGENCY=1          # If spots truly are limited
NEXT_PUBLIC_CRO_SOCIAL_PROOF=1     # If you have real booking data
```
- **IMPORTANT**: Only enable if messaging is truthful
- Social proof requires actual booking data integration

---

## 📊 GA4 DebugView Testing

### How to Test Locally:

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Open GA4 DebugView**:
   - Go to GA4 property → Configure → DebugView
   - Visit `http://localhost:3000/?debug_mode=1`

3. **Events to verify**:
   - ✅ `LCP`, `CLS`, `INP`, `FCP`, `TTFB` (Web Vitals)
   - ✅ `scroll_depth` (25%, 50%, 75%, 90%)
   - ✅ `section_view` (Hero, Groups, Why Us)
   - ✅ `cta_click` (with location/text/type parameters)
   - ✅ `ab_test_exposure` (if NEXT_PUBLIC_AB_TESTS=1)
   - ✅ `begin_checkout` (existing booking tracking, still works)

### QA URL Parameters:

- **A/B Test Variant Override**: `?ab=A` or `?ab=B`
- **GA4 Debug Mode**: `?debug_mode=1`
- **Combined**: `http://localhost:3000/?ab=B&debug_mode=1`

---

## 🔍 Cookie Verification

### A/B Test Cookie:

**Name**: `ccf_ab`  
**Value**: `A` or `B`  
**Expires**: 30 days  
**Path**: `/`  
**SameSite**: `Lax`

**To inspect**:
1. Open DevTools → Application tab → Cookies
2. Look for `ccf_ab` cookie
3. Test variant persistence across page navigation

---

## 🗂️ Files Changed

### New Files Created:
1. `components/CROHelpers.tsx` - CRO components (UrgencyMessage, SocialProof)
2. `lib/analyticsHooks.ts` - Analytics hooks (scroll depth, section visibility, CTA tracking)
3. `lib/ab-testing.ts` - A/B testing framework with cookie management
4. `components/HomePageClient.tsx` - Client component for homepage with A/B test + analytics

### Modified Files:
1. `lib/analytics.ts` - Added `reportWebVitals()` function
2. `components/GoogleAnalytics.tsx` - Integrated web-vitals library
3. `components/BookingLink.tsx` - Enhanced with CTA taxonomy (location, text, type)
4. `app/layout.tsx` - Simplified (removed server-side onWebVitals prop)
5. `app/page.tsx` - Refactored to use HomePageClient for interactivity
6. `.env.example` - Added Week 2 feature flag documentation
7. `package.json` - Added `web-vitals` dependency

---

## 🧪 Testing Recommendations

### 1. Core Web Vitals
- [ ] Open Chrome DevTools → Performance Insights
- [ ] Check Lighthouse scores (should maintain 90+ performance)
- [ ] Verify metrics appear in GA4 DebugView

### 2. Scroll Depth
- [ ] Scroll homepage slowly
- [ ] Check DevTools console for `[Scroll Depth]` logs
- [ ] Verify events at 25%, 50%, 75%, 90% in GA4

### 3. Section Visibility
- [ ] Scroll through homepage sections
- [ ] Check DevTools console for `[Section Visibility]` logs
- [ ] Verify `section_view` events in GA4

### 4. A/B Testing
- [ ] Enable with `NEXT_PUBLIC_AB_TESTS=1`
- [ ] Clear cookies, refresh page
- [ ] Verify `ccf_ab` cookie is set
- [ ] Test URL override: `?ab=B`
- [ ] Check `ab_test_exposure` event in GA4

### 5. CRO Helpers
- [ ] Enable with `NEXT_PUBLIC_CRO_URGENCY=1`
- [ ] Verify urgency message appears on homepage
- [ ] Enable with `NEXT_PUBLIC_CRO_SOCIAL_PROOF=1`
- [ ] Verify social proof displays (if enabled)

---

## 🎛️ Rollback Instructions

### Emergency Rollback (Disable Everything):
```bash
# Set all feature flags to 0
NEXT_PUBLIC_CRO_URGENCY=0
NEXT_PUBLIC_CRO_SOCIAL_PROOF=0
NEXT_PUBLIC_AB_TESTS=0
```

**No code changes needed** - features will be completely disabled.

### Individual Feature Rollback:
- **A/B Test**: Set `NEXT_PUBLIC_AB_TESTS=0`
- **Urgency**: Set `NEXT_PUBLIC_CRO_URGENCY=0`
- **Social Proof**: Set `NEXT_PUBLIC_CRO_SOCIAL_PROOF=0`

**Core Web Vitals, scroll depth, and section visibility cannot be disabled** (always-on analytics features).

---

## 📈 Expected GA4 Events

### New Events (Week 2):

| Event Name | Category | Parameters | Frequency |
|------------|----------|------------|-----------|
| `LCP`, `CLS`, `INP`, `FCP`, `TTFB` | Web Vitals | metric_value, metric_rating, city, device_type, connection_type | Once per page load |
| `scroll_depth` | Engagement | scroll_depth (25/50/75/90) | 4x per full page scroll |
| `section_view` | Engagement | section_name | Once per section visibility |
| `cta_click` | CTA | cta_location, cta_text, cta_type | Every CTA click with taxonomy |
| `ab_test_exposure` | A/B Testing | test_name, variant | Once per test assignment |
| `ab_test_conversion` | A/B Testing | test_name, variant | On booking click (A/B test active) |

### Existing Events (Still Work):

| Event Name | Status | Notes |
|------------|--------|-------|
| `page_view` | ✅ Working | Auto-tracked on route change |
| `begin_checkout` | ✅ Enhanced | Now includes optional CTA taxonomy |

---

## 💡 Best Practices

1. **Core Web Vitals**: Monitor in GA4 → Engagement → Pages and screens → Add "metric_rating" dimension
2. **Scroll Depth**: Track in GA4 → Engagement → Events → Filter by `scroll_depth`
3. **A/B Testing**: Run for minimum 2-4 weeks before declaring a winner
4. **CRO Helpers**: Only enable if messaging is honest and data-backed
5. **Cookie Consent**: A/B testing cookie (`ccf_ab`) is functional (not tracking), no consent needed in most jurisdictions

---

## 🔒 Security & Privacy

- ✅ No PII (Personally Identifiable Information) collected
- ✅ All GA4 events use anonymous metrics
- ✅ A/B test cookie is functional (not tracking/marketing)
- ✅ Client-side only (no server-side data collection)
- ✅ Respects user privacy (no cross-site tracking)

---

## 📞 Support & Questions

If you encounter issues:

1. **Check DevTools Console**: Look for `[GA]`, `[Web Vitals]`, `[Scroll Depth]`, `[Section Visibility]`, `[A/B Test]` logs
2. **Verify Environment Variables**: Ensure feature flags are set correctly in Netlify
3. **Test in DebugView**: Use `?debug_mode=1` to see live GA4 events
4. **Check TypeScript**: Run `npx tsc --noEmit` to verify no type errors
5. **Build Locally**: Run `npm run build` to test production build

---

## ✅ Week 2 Completion Status

**All Features Implemented**:
- [x] Core Web Vitals tracking (LCP, CLS, INP, FCP, TTFB)
- [x] Scroll depth tracking (25%, 50%, 75%, 90%)
- [x] Section visibility tracking (IntersectionObserver)
- [x] Enhanced CTA click taxonomy (location, text, type)
- [x] CRO helpers (UrgencyMessage, SocialProof) with feature flags
- [x] A/B testing framework (cookie-based, URL override support)
- [x] Hero subheading A/B test implementation
- [x] Feature flags added to .env.example
- [x] TypeScript validation passing
- [x] Production build successful (257 pages)
- [x] Documentation complete

**Ready for deployment** with feature flags set to 0 (safe rollout) ✅

---

## 📚 Additional Resources

- [Web Vitals Documentation](https://web.dev/vitals/)
- [GA4 Events Reference](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [Next.js Performance Monitoring](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)
- [A/B Testing Best Practices](https://cxl.com/blog/ab-testing-guide/)
