# ✅ GA4 Route Change Tracking - Implementation Summary

## 📝 Changes Made

### 1. Updated `components/GoogleAnalytics.tsx`

**Changes:**
- ✅ Now uses **only** `NEXT_PUBLIC_GA_ID_1` (removed multi-ID logic)
- ✅ Added Next.js App Router hooks: `usePathname()` and `useSearchParams()`
- ✅ Implemented automatic `page_view` tracking on route changes via `useEffect`
- ✅ Tracks SPA navigation without full page reload
- ✅ Includes proper page metadata: `page_path`, `page_location`, `page_title`
- ✅ Keeps Meta Pixel integration intact

**Diff:**
```diff
"use client";

import Script from "next/script";
+ import { usePathname, useSearchParams } from "next/navigation";
+ import { useEffect } from "react";

export default function GoogleAnalytics() {
+  const pathname = usePathname();
+  const searchParams = useSearchParams();
+  
-  // Get all GA IDs from environment variables
-  const GA_ID_1 = process.env.NEXT_PUBLIC_GA_ID_1;
-  const GA_ID_2 = process.env.NEXT_PUBLIC_GA_ID_2;
-  const GOOGLE_TAG_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID;
-  const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
-
-  // Collect all valid IDs
-  const measurementIds = [GA_ID_1, GA_ID_2, GOOGLE_TAG_ID, GOOGLE_ADS_ID].filter(
-    (id): id is string => typeof id === "string" && id.length > 0
-  );
+  // Only use NEXT_PUBLIC_GA_ID_1 as specified
+  const GA_ID = process.env.NEXT_PUBLIC_GA_ID_1;

-  // If no IDs are configured, don't render anything
-  if (measurementIds.length === 0) {
+  // If GA ID is not configured, don't render anything
+  if (!GA_ID) {
    return null;
  }

+  // Track route changes for App Router SPA navigation
+  useEffect(() => {
+    if (!GA_ID) return;
+
+    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
+    
+    // Fire page_view event on route change
+    if (typeof window !== 'undefined' && window.gtag) {
+      window.gtag('event', 'page_view', {
+        page_path: url,
+        page_location: window.location.href,
+        page_title: document.title
+      });
+
+      if (process.env.NODE_ENV === 'development') {
+        console.log('[GA] Page view tracked:', url);
+      }
+    }
+  }, [pathname, searchParams, GA_ID]);

  return (
    <>
      <Script
        strategy="afterInteractive"
-        src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
+        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
-            
-            ${measurementIds.map((id) => `gtag('config', '${id}');`).join('\n            ')}
+            gtag('config', '${GA_ID}', {
+              page_path: window.location.pathname + window.location.search
+            });
            
            ${process.env.NODE_ENV === 'development' ? `
-            console.log('[GA] Initialized with IDs:', ${JSON.stringify(measurementIds)});
+            console.log('[GA] Initialized with ID: ${GA_ID}');
            ` : ''}
          `,
        }}
      />
    </>
  );
}
```

---

### 2. Created `lib/analytics.ts` (NEW)

**Purpose:** Safe, type-safe wrapper functions for Google Analytics tracking

**Exports:**
- ✅ `isGtagAvailable()` - Check if GA is loaded
- ✅ `trackEvent(name, params)` - Track custom events (no-ops if gtag unavailable)
- ✅ `trackPageView(path, title)` - Manual page view tracking
- ✅ `setUserProperties(props)` - Set user properties
- ✅ `trackOutboundLink(url, label)` - Track external link clicks
- ✅ `trackFormSubmit(formName, destination)` - Track form submissions
- ✅ `trackSearch(searchTerm)` - Track search queries
- ✅ `trackVideo(action, title, url)` - Track video interactions

**Usage Example:**
```typescript
import { trackEvent, trackFormSubmit } from '@/lib/analytics';

// Track a button click
trackEvent('button_click', {
  button_name: 'Book Now',
  city: 'chicago',
  class_name: 'Date Night Pottery'
});

// Track form submission
trackFormSubmit('newsletter_signup', '/thanks/newsletter');
```

---

### 3. Created `types/global.d.ts` (NEW)

**Purpose:** TypeScript declarations for gtag global

**Contents:**
```typescript
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'set' | 'js',
      targetIdOrDate: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}
```

---

## 🔧 Environment Variables Required

### Netlify Environment Variables

**Add this to Netlify:**
1. Go to: **Site Settings** → **Environment Variables**
2. Add:
   - Key: `NEXT_PUBLIC_GA_ID_1`
   - Value: `G-CPKCDF56W2` (or your GA4 Measurement ID)

**After adding:**
- Trigger a new deployment (clear cache recommended)

---

## ✅ Verification Checklist

### Phase 1: Local Testing

- [ ] **Install dependencies** (if needed): `npm install`
- [ ] **Add GA ID to `.env.local`:**
  ```bash
  NEXT_PUBLIC_GA_ID_1=G-CPKCDF56W2
  ```
- [ ] **Start dev server:** `npm run dev`
- [ ] **Open browser console** - Look for:
  ```
  [GA] Initialized with ID: G-CPKCDF56W2
  ```
- [ ] **Navigate between pages** - Look for:
  ```
  [GA] Page view tracked: /chicago
  [GA] Page view tracked: /eugene
  [GA] Page view tracked: /blog
  ```

---

### Phase 2: Network Tab Verification

**Open DevTools → Network tab:**

- [ ] **Filter by:** `gtag` or `google-analytics`
- [ ] **On page load:**
  - See request to: `https://www.googletagmanager.com/gtag/js?id=G-CPKCDF56W2`
  - Status: **200 OK**
  - See request to: `https://www.google-analytics.com/g/collect?...`
  - Contains `en=page_view`

- [ ] **On route change (SPA navigation):**
  - Click link to another page (e.g., Homepage → Chicago)
  - See **new** request to: `https://www.google-analytics.com/g/collect?...`
  - Contains `en=page_view`
  - Contains `dl=` (page URL)

**Example Network Request:**
```
https://www.google-analytics.com/g/collect?
  v=2
  &tid=G-CPKCDF56W2
  &gtm=...
  &_p=...
  &en=page_view
  &dl=https://colorcocktailfactory.com/chicago
  &dt=Chicago Classes | Color Cocktail Factory
```

---

### Phase 3: GA4 DebugView

**Enable Debug Mode:**

1. **Option A (Browser Extension):**
   - Install: [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
   - Enable extension
   - Visit your site

2. **Option B (URL Parameter):**
   - Add `?debug_mode=true` to any URL
   - Example: `http://localhost:3000?debug_mode=true`

**In GA4:**
- [ ] Go to: **Admin** → **DebugView**
- [ ] See your device/session appear
- [ ] **On page load:**
  - See `session_start` event
  - See `page_view` event
  - Click event → Parameters show:
    - `page_location`: Full URL
    - `page_title`: Page title
    - `page_path`: Path (e.g., `/chicago`)

- [ ] **On route change:**
  - Navigate to different page in your app
  - See **new** `page_view` event fire
  - Parameters update with new URL

**Screenshot Example:**
```
DebugView Timeline:
├─ session_start (14:23:45)
├─ page_view (14:23:45)
│  ├─ page_location: https://colorcocktailfactory.com/
│  ├─ page_title: Color Cocktail Factory | Pottery & Creative Workshops
│  └─ page_path: /
├─ page_view (14:24:02) ← Route change!
│  ├─ page_location: https://colorcocktailfactory.com/chicago
│  ├─ page_title: Chicago Classes | Color Cocktail Factory
│  └─ page_path: /chicago
```

---

### Phase 4: GA4 Realtime Report

- [ ] Go to: **Reports** → **Realtime**
- [ ] See:
  - Active users: 1 (you)
  - Event count by Event name:
    - `page_view` increments as you navigate
  - Views by Page title and screen name:
    - Shows pages you visited

---

### Phase 5: Custom Event Testing (Optional)

**Test the analytics helper:**

1. **Add test button to any page:**
   ```tsx
   import { trackEvent } from '@/lib/analytics';
   
   <button onClick={() => trackEvent('test_event', { test_param: 'hello' })}>
     Test GA4 Event
   </button>
   ```

2. **Click button**
3. **Check:**
   - [ ] Console shows: `[GA] Event tracked: test_event { test_param: 'hello' }`
   - [ ] Network tab shows new `/g/collect` request with `en=test_event`
   - [ ] GA4 DebugView shows `test_event` with parameter `test_param: hello`

---

## 🚀 Deployment to Netlify

### Before Deploying:

- [ ] **Commit changes:**
  ```bash
  git add components/GoogleAnalytics.tsx lib/analytics.ts types/global.d.ts
  git commit -m "Add GA4 route change tracking and analytics helpers"
  git push
  ```

- [ ] **Add environment variable in Netlify:**
  - Dashboard → Site Settings → Environment Variables
  - Add: `NEXT_PUBLIC_GA_ID_1` = `G-CPKCDF56W2`

- [ ] **Trigger deploy:**
  - Option A: Push triggers automatic deploy
  - Option B: Manual deploy → **Clear cache and deploy site**

### After Deployment:

- [ ] **Visit production site:** https://colorcocktailfactory.com
- [ ] **Repeat verification steps above** (but remove `?debug_mode=true`)
- [ ] **Check GA4 Realtime:** Should see production traffic
- [ ] **Navigate between pages:** Verify `page_view` events fire

---

## 🔍 Troubleshooting

### Issue: "gtag is not defined" errors

**Solution:**
- Check environment variable is set correctly
- Verify `NEXT_PUBLIC_GA_ID_1` in Netlify (not just `.env.local`)
- Clear Netlify cache and redeploy

---

### Issue: Page views not firing on route change

**Check:**
- Open console → Look for `[GA] Page view tracked:` logs (dev mode)
- Verify `useEffect` is running (add console.log in useEffect)
- Check Network tab for `/g/collect` requests on navigation

**Common causes:**
- Hard navigation (full page reload) instead of client-side navigation
- Using `<a href>` instead of `<Link>`
- Conditional rendering removing/re-mounting component

---

### Issue: Events not appearing in GA4

**Wait time:**
- DebugView: Real-time (instant)
- Realtime Reports: 1-2 minutes delay
- Standard Reports: 24-48 hours delay

**Check:**
- Verify GA4 Measurement ID is correct
- Check DebugView first (most reliable)
- Ensure ad blockers are disabled for testing

---

### Issue: Multiple page_view events for one navigation

**Possible causes:**
- GoogleAnalytics component rendered multiple times
- Verify it's only included once in `layout.tsx`
- Check for duplicate `<GoogleAnalytics />` components

---

## 📊 What Gets Tracked Automatically

**With this implementation:**

✅ **Initial page load** (first visit)
- `session_start` event
- `page_view` event

✅ **Route changes** (SPA navigation)
- `page_view` event on every pathname or search param change
- Includes full URL, path, and title

✅ **Enhanced Measurement** (if enabled in GA4)
- Scrolls (90% depth)
- Outbound clicks (external links)
- Site search (if configured)
- Video engagement (YouTube embeds)
- File downloads

❌ **NOT tracked automatically:**
- Custom button clicks (use `trackEvent()`)
- Form submissions (use `trackFormSubmit()`)
- Class bookings (use `trackEvent('begin_checkout', ...)`)
- Newsletter signups (use `trackEvent('sign_up')`)

**To track custom events, use the helpers in `lib/analytics.ts`**

---

## 📚 Next Steps

### 1. Track Booking Click-Outs

Update your booking buttons to track conversions:

```tsx
import { trackEvent } from '@/lib/analytics';

<button onClick={() => {
  trackEvent('begin_checkout', {
    booking_provider: 'rezclick',
    city: 'chicago',
    class_name: 'Date Night Pottery',
    value: 75.00,
    currency: 'USD'
  });
  // Then navigate to booking URL
}}>
  Book Now
</button>
```

### 2. Track Form Submissions

```tsx
import { trackFormSubmit } from '@/lib/analytics';

const handleSubmit = (e: FormEvent) => {
  e.preventDefault();
  
  trackFormSubmit('private_event_inquiry', '/thanks/private-party');
  
  // Submit form...
};
```

### 3. Register Custom Dimensions in GA4

**For the events you'll track:**
1. GA4 → Admin → Custom Definitions
2. Create dimensions:
   - `city` (event scope)
   - `class_name` (event scope)
   - `booking_provider` (event scope)

### 4. Monitor Data Quality

**Weekly check:**
- GA4 → Reports → Realtime
- Verify events are flowing
- Check for anomalies (traffic spikes, errors)

---

## ✨ Benefits of This Implementation

✅ **Automatic route tracking** - No manual tracking needed for page navigation  
✅ **Type-safe helpers** - TypeScript support for all tracking functions  
✅ **Graceful degradation** - No errors if GA4 fails to load or is blocked  
✅ **Development logging** - See what's being tracked in console (dev mode only)  
✅ **Production-ready** - Works with Netlify deployment pipeline  
✅ **Lightweight** - No additional dependencies  
✅ **SPA-optimized** - Designed for Next.js App Router

---

## 📄 Files Modified

1. ✅ `components/GoogleAnalytics.tsx` - Updated with route change tracking
2. ✅ `lib/analytics.ts` - NEW: Helper functions for event tracking
3. ✅ `types/global.d.ts` - NEW: TypeScript declarations

**No changes to:**
- ❌ `app/layout.tsx` (GoogleAnalytics already included)
- ❌ `components/MetaPixel.tsx` (kept intact as requested)
- ❌ `package.json` (no new dependencies)

---

**Status:** ✅ Ready to deploy  
**Compatibility:** Next.js 14+ App Router  
**Environment:** Client-side only (uses `"use client"`)

**Questions?** Check the troubleshooting section or GA4 DebugView.
