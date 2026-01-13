# 🎯 GA4 + GTM + Server-Side + Webhook Implementation Plan
## Color Cocktail Factory — Complete Analytics Blueprint

**Client:** Color Cocktail Factory (CCF)  
**Website:** https://colorcocktailfactory.com/  
**Business Model:** Multi-city creative workshops (Chicago + Eugene)  
**Booking Platforms:** RezClick, Eventbrite, Acuity (off-site conversions)  
**Goal:** Maximum actionable data while staying practical and compliant.

---

## 📋 Table of Contents

1. [Implementation Phases Overview](#implementation-phases-overview)
2. [Phase 1: Client-Side GTM + GA4 Setup](#phase-1-client-side-gtm--ga4-setup)
3. [Phase 2: Webhook Tracking (Off-Site Purchases)](#phase-2-webhook-tracking-off-site-purchases)
4. [Phase 3: Server-Side Tagging (Optional but Recommended)](#phase-3-server-side-tagging-optional-but-recommended)
5. [Consent Mode v2 Implementation](#consent-mode-v2-implementation)
6. [BigQuery Export Setup](#bigquery-export-setup)
7. [Verification & Debugging Checklist](#verification--debugging-checklist)
8. [Quick Questions (Optional)](#quick-questions-optional)

---

## Implementation Phases Overview

### Phase 1: Client-Side Foundation (Week 1) ⭐ **START HERE**
- GTM container setup
- GA4 property + data stream
- Core event tracking (pageviews, click-outs, form submissions)
- Custom dimensions/metrics registration
- **Value:** Immediate visibility into traffic, user behavior, and click-out patterns

### Phase 2: Webhook Purchase Tracking (Week 2-3)
- Measurement Protocol integration for Eventbrite/Acuity webhooks
- Transaction deduplication logic
- Client ID stitching (where possible)
- **Value:** Attribute revenue to marketing channels, see which campaigns drive bookings

### Phase 3: Server-Side + Advanced (Week 4+)
- GTM Server Container on Cloud Run
- Custom subdomain (tag.colorcocktailfactory.com)
- BigQuery export for raw data ownership
- **Value:** Better data quality, ad platform performance, future-proof analytics

---

## Phase 1: Client-Side GTM + GA4 Setup

### 1.1 Create GA4 Property

**Steps:**
1. Go to https://analytics.google.com
2. Click **Admin** (bottom left)
3. Under **Account**, click **Create Account**
   - Account Name: `Color Cocktail Factory`
   - Check data sharing settings (recommended: all except benchmarking)
4. Click **Next**, then **Create Property**
   - Property Name: `CCF - Production`
   - Timezone: `(GMT-06:00) America/Chicago`
   - Currency: `United States Dollar (USD)`
5. Click **Next**, fill business info:
   - Industry: `Arts & Entertainment` or `Other`
   - Business size: Select appropriate
6. Click **Create** → Accept ToS
7. **Data Streams:** Click **Web**
   - Website URL: `https://colorcocktailfactory.com`
   - Stream name: `CCF Main Site`
   - Enhanced measurement: **Enable all** (scroll, video, file downloads, etc.)
8. Copy **Measurement ID** (starts with `G-XXXXXXXXXX`)

---

### 1.2 Create GTM Container

**Steps:**
1. Go to https://tagmanager.google.com
2. Click **Create Account**
   - Account Name: `Color Cocktail Factory`
   - Container Name: `colorcocktailfactory.com`
   - Target Platform: **Web**
3. Click **Create** → Accept ToS
4. Copy **GTM Container ID** (format: `GTM-XXXXXXX`)
5. **Install GTM snippet** (see Next.js section below)

---

### 1.3 Install GTM on Next.js Site

Replace your current `GoogleAnalytics.tsx` component with GTM implementation:

**File:** `components/GoogleTagManager.tsx` (NEW)

```tsx
"use client";

import Script from "next/script";

export default function GoogleTagManager() {
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

  if (!GTM_ID) {
    console.warn('[GTM] Missing NEXT_PUBLIC_GTM_ID');
    return null;
  }

  return (
    <>
      {/* Google Tag Manager Script */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `,
        }}
      />
    </>
  );
}
```

**File:** `components/GoogleTagManagerNoScript.tsx` (NEW)

```tsx
export default function GoogleTagManagerNoScript() {
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

  if (!GTM_ID) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
}
```

**Update:** `app/layout.tsx`

```tsx
import GoogleTagManager from "@/components/GoogleTagManager";
import GoogleTagManagerNoScript from "@/components/GoogleTagManagerNoScript";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>{/* existing head content */}</head>
      <body>
        <GoogleTagManager />
        <GoogleTagManagerNoScript />
        {children}
        {/* existing components */}
      </body>
    </html>
  );
}
```

**Environment Variables:** `.env.local`

```bash
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX  # Your GTM container ID
```

**Deploy to Netlify:**
1. Netlify Dashboard → Site Settings → Environment Variables
2. Add `NEXT_PUBLIC_GTM_ID` = `GTM-XXXXXXX`
3. Trigger redeploy

---

### 1.4 Configure GA4 Tag in GTM

**Steps:**
1. In GTM, click **Tags** → **New**
2. Tag Configuration:
   - Tag Type: **Google Analytics: GA4 Configuration**
   - Measurement ID: `G-XXXXXXXXXX` (from step 1.1)
   - **Advanced Settings:**
     - Tag Firing Options: **Once per page**
     - Consent Settings: Skip for now (configure in Phase 3)
3. Triggering:
   - Trigger Type: **All Pages**
4. Name tag: `GA4 - Config Tag`
5. **Save**

---

### 1.5 Register Custom Dimensions & Metrics

**In GA4 Admin:**
1. Go to **Admin** → **Property** → **Custom definitions**
2. Click **Create custom dimension** for each:

| Display Name | Parameter Name | Scope | Description |
|--------------|----------------|-------|-------------|
| City | `city` | Event | Chicago or Eugene |
| Class Category | `class_category` | Event | pottery, glass, mosaic, etc. |
| Class Name | `class_name` | Event | Full class title |
| Class ID | `class_id` | Event | Stable slug (date-night-wheel) |
| Booking Provider | `booking_provider` | Event | eventbrite, acuity, rezclick |
| Link URL | `link_url` | Event | Destination URL for click-outs |

**Custom Metrics:**

| Display Name | Parameter Name | Unit | Description |
|--------------|----------------|------|-------------|
| Booking Click Value | `booking_click_value` | Currency | Estimated value per click-out |

---

### 1.6 Event Taxonomy & Tracking Plan

**GA4 Recommended Events (Use These):**

| Event Name | When It Fires | Parameters |
|------------|---------------|------------|
| `page_view` | Every page load (auto) | `page_location`, `page_title` |
| `view_item_list` | User views activity listings | `item_list_name` (e.g., "Chicago Classes"), `items[]` |
| `select_item` | Clicks on class card/tile | `item_list_name`, `items[]` |
| `view_item` | Views class detail page | `items[]`, `value`, `currency` |
| `begin_checkout` | Clicks "Book Now" / click-out | `items[]`, `value`, `currency`, `booking_provider`, `city` |
| `purchase` | Webhook from Eventbrite/Acuity | `transaction_id`, `value`, `currency`, `items[]` |
| `generate_lead` | Submits private event form | `value`, `currency`, `city` |
| `sign_up` | Newsletter signup | N/A |

**Item Parameters (for `items[]` array):**

```javascript
{
  item_id: "date-night-wheel",          // class_id slug
  item_name: "Date Night on the Wheel", // class_name
  item_category: "pottery",             // class_category
  item_variant: "chicago",              // city
  price: 75.00,                         // per person
  quantity: 1
}
```

---

### 1.7 Implement Click-Out Tracking (begin_checkout)

**Strategy:** Fire `begin_checkout` event whenever user clicks a booking button (RezClick, Eventbrite, Acuity, Gift Cards).

**GTM Implementation:**

#### Step 1: Create Data Layer Push Utility

**File:** `lib/analytics.ts` (NEW)

```typescript
// Type-safe GTM event tracking
declare global {
  interface Window {
    dataLayer: any[];
  }
}

export type BookingProvider = 'rezclick' | 'eventbrite' | 'acuity' | 'gift_card' | 'private_event';
export type City = 'chicago' | 'eugene' | 'both';

export interface ClassItem {
  item_id: string;        // slug like "date-night-wheel"
  item_name: string;      // "Date Night on the Wheel"
  item_category: string;  // "pottery", "glass", "mosaic"
  item_variant: string;   // "chicago" or "eugene"
  price: number;          // per person price
  quantity: number;       // default 1
}

// Track booking click-out (begin_checkout)
export function trackBeginCheckout(params: {
  provider: BookingProvider;
  city: City;
  item: ClassItem;
  url: string;
  value?: number;
}) {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'begin_checkout',
    booking_provider: params.provider,
    city: params.city,
    link_url: params.url,
    value: params.value || params.item.price,
    currency: 'USD',
    items: [params.item]
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('[GTM] begin_checkout:', params);
  }
}

// Track class detail page view (view_item)
export function trackViewItem(params: {
  item: ClassItem;
  city: City;
}) {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'view_item',
    city: params.city,
    class_id: params.item.item_id,
    class_name: params.item.item_name,
    class_category: params.item.item_category,
    value: params.item.price,
    currency: 'USD',
    items: [params.item]
  });
}

// Track class listing view (view_item_list)
export function trackViewItemList(params: {
  listName: string;
  items: ClassItem[];
  city?: City;
}) {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'view_item_list',
    item_list_name: params.listName,
    city: params.city,
    items: params.items
  });
}

// Track lead generation (private events form)
export function trackGenerateLead(params: {
  city?: City;
  value?: number;
}) {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'generate_lead',
    city: params.city || 'both',
    value: params.value || 0,
    currency: 'USD'
  });
}

// Track newsletter signup
export function trackSignUp() {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'sign_up',
    method: 'newsletter'
  });
}
```

#### Step 2: Update ButtonPill Component

**File:** `components/ui/ButtonPill.tsx`

```tsx
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { trackBeginCheckout, type BookingProvider, type ClassItem } from "@/lib/analytics";

// ... existing variant styles ...

export default function ButtonPill({
  href,
  children,
  variant = "secondary",
  className,
  full,
  trackingData
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  full?: boolean;
  trackingData?: {
    provider: BookingProvider;
    city: 'chicago' | 'eugene' | 'both';
    item: ClassItem;
  };
}) {
  const isExternal = href.startsWith("http");

  const handleClick = () => {
    if (trackingData) {
      trackBeginCheckout({
        provider: trackingData.provider,
        city: trackingData.city,
        item: trackingData.item,
        url: href,
        value: trackingData.item.price
      });
    }
  };

  return (
    <Link 
      href={href} 
      className={cn(base, styles[variant], full ? "w-full" : "", className)}
      onClick={handleClick}
      {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {children}
    </Link>
  );
}
```

#### Step 3: Add Tracking to Activity Pages

**File:** `app/[city]/[slug]/page.tsx` (example usage)

```tsx
import { trackBeginCheckout, type ClassItem } from "@/lib/analytics";
import ButtonPill from "@/components/ui/ButtonPill";

// In your component:
const classItem: ClassItem = {
  item_id: activity.slug,
  item_name: activity.heroTitle,
  item_category: getCategoryFromSlug(activity.slug), // helper function
  item_variant: city.param,
  price: 75.00, // or pull from config
  quantity: 1
};

// In JSX:
<ButtonPill 
  href={bookingUrl}
  variant="primary"
  trackingData={{
    provider: getProviderFromUrl(bookingUrl), // 'rezclick' | 'eventbrite' | 'acuity'
    city: city.param,
    item: classItem
  }}
>
  Book in {city.label}
</ButtonPill>
```

#### Step 4: Create GTM Trigger & Tag

**In GTM:**

1. **Create Trigger:**
   - Type: **Custom Event**
   - Event Name: `begin_checkout`
   - Name: `Event - begin_checkout`

2. **Create GA4 Event Tag:**
   - Tag Type: **Google Analytics: GA4 Event**
   - Configuration Tag: Select `GA4 - Config Tag`
   - Event Name: `begin_checkout`
   - Event Parameters:
     - `booking_provider` → `{{dlv - booking_provider}}`
     - `city` → `{{dlv - city}}`
     - `link_url` → `{{dlv - link_url}}`
     - `value` → `{{dlv - value}}`
     - `currency` → `{{dlv - currency}}`
     - `items` → `{{dlv - items}}`
   - Trigger: `Event - begin_checkout`
   - Name: `GA4 - begin_checkout`

3. **Create Data Layer Variables** (for each parameter):
   - Variables → New → Data Layer Variable
   - Variable Name: `dlv - booking_provider`
   - Data Layer Variable Name: `booking_provider`
   - Repeat for: `city`, `link_url`, `value`, `currency`, `items`

---

### 1.8 Gift Card & Private Event Tracking

**Gift Cards:**

```tsx
<ButtonPill 
  href="https://app.acuityscheduling.com/catalog.php?owner=35932879&category=Gift+Cards"
  trackingData={{
    provider: 'gift_card',
    city: 'both',
    item: {
      item_id: 'gift-card',
      item_name: 'Gift Card',
      item_category: 'gift',
      item_variant: 'digital',
      price: 0, // variable amount
      quantity: 1
    }
  }}
>
  Buy Gift Card
</ButtonPill>
```

**Private Events (Form Submission):**

```tsx
// In form onSubmit handler:
import { trackGenerateLead } from "@/lib/analytics";

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  
  // Submit form logic...
  
  trackGenerateLead({
    city: formData.city as 'chicago' | 'eugene' | 'both',
    value: 500 // estimated lead value
  });
  
  // Redirect to thank you page
};
```

---

## Phase 2: Webhook Tracking (Off-Site Purchases)

**Challenge:** CCF bookings happen on Eventbrite, Acuity, and RezClick. We need to send `purchase` events back to GA4 to close the attribution loop.

**Solution:** Use GA4 Measurement Protocol + webhooks.

---

### 2.1 GA4 Measurement Protocol Basics

**Endpoint:**
```
POST https://www.google-analytics.com/mp/collect?measurement_id=G-XXXXXXXXXX&api_secret=YOUR_API_SECRET
```

**Required Fields:**
- `measurement_id`: Your GA4 Measurement ID (G-XXXXXXXXXX)
- `api_secret`: Generate in GA4 Admin → Data Streams → Measurement Protocol API secrets
- `client_id`: User's Google Analytics client ID (critical for attribution)
- `events[]`: Array of events to send

---

### 2.2 Generate API Secret

**Steps:**
1. GA4 Admin → Data Streams → Click your web stream
2. Scroll to **Measurement Protocol API secrets**
3. Click **Create**
4. Nickname: `Webhook Integration`
5. Copy the secret (looks like: `AbCdEfGhIjKlMnOpQrStUvWxYz123456`)
6. Store securely (never commit to git)

---

### 2.3 Client ID Passing Strategy

**Problem:** GA4 needs `client_id` to stitch webhook purchases back to website sessions.

**Solutions (in order of preference):**

#### Option A: Pass client_id in Booking URL (BEST)

**Implementation:**

```typescript
// lib/analytics.ts
export function getClientId(): string | null {
  if (typeof window === 'undefined') return null;
  
  // GA4 stores client_id in cookie: _ga_XXXXXXXXXX
  const gaCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('_ga_'))
    ?.split('=')[1];
  
  if (gaCookie) {
    // Format: GS1.1.123456789.1234567890.1.1.1234567890.0.0.0
    // Client ID is 3rd and 4th segments combined
    const parts = gaCookie.split('.');
    if (parts.length >= 4) {
      return `${parts[2]}.${parts[3]}`;
    }
  }
  
  return null;
}

// Append to booking URLs
export function buildBookingUrlWithClientId(baseUrl: string): string {
  const clientId = getClientId();
  if (!clientId) return baseUrl;
  
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}ga_client_id=${clientId}`;
}
```

**Update ButtonPill:**

```tsx
const finalHref = trackingData 
  ? buildBookingUrlWithClientId(href) 
  : href;

return <Link href={finalHref} onClick={handleClick}>...</Link>
```

**In Eventbrite/Acuity webhook payload:**
- Look for `ga_client_id` parameter in confirmation URL
- Include in Measurement Protocol POST

#### Option B: Fallback (No client_id)

If you can't pass client_id:
- Set `client_id` to a stable value like `webhook.{transaction_id}`
- GA4 will track purchases but won't attribute them to specific sessions
- You'll still see revenue in reports, just not tied to campaigns

---

### 2.4 Eventbrite Webhook Setup

**Steps:**

1. **Eventbrite Dashboard:**
   - Organization Settings → Webhooks
   - Endpoint URL: Your Zapier/Make webhook URL (see 2.5)
   - Actions: `order.placed`, `order.updated`
   - Save

2. **Webhook Payload Example:**

```json
{
  "api_url": "https://www.eventbriteapi.com/v3/orders/123456789/",
  "config": {
    "action": "order.placed",
    "endpoint_url": "https://hooks.zapier.com/hooks/catch/..."
  }
}
```

3. **Fetch Full Order Details:**
   - In Zapier/Make, make GET request to `api_url`
   - Extract: `id`, `name`, `email`, `costs.gross.value`, `event.id`, `event.name`

---

### 2.5 Zapier/Make Webhook → GA4 Integration

**Zapier Flow:**

1. **Trigger: Webhook by Zapier**
   - Type: Catch Raw Hook
   - Copy webhook URL
   - Paste into Eventbrite webhook settings
   - Test by creating a test order

2. **Action: HTTP Request**
   - Method: **POST**
   - URL: `https://www.google-analytics.com/mp/collect`
   - Query String:
     - `measurement_id` = `G-XXXXXXXXXX`
     - `api_secret` = `YOUR_API_SECRET`
   - Headers:
     - `Content-Type`: `application/json`
   - Body (JSON):

```json
{
  "client_id": "{{ga_client_id_or_fallback}}",
  "events": [
    {
      "name": "purchase",
      "params": {
        "transaction_id": "{{order_id}}",
        "value": {{total_value}},
        "currency": "USD",
        "booking_provider": "eventbrite",
        "city": "{{extract_city_from_event_name}}",
        "items": [
          {
            "item_id": "{{event_id}}",
            "item_name": "{{event_name}}",
            "item_category": "workshop",
            "price": {{ticket_price}},
            "quantity": {{quantity}}
          }
        ]
      }
    }
  ]
}
```

3. **Test:**
   - Create test order on Eventbrite
   - Check Zapier task history for successful POST
   - Verify in GA4: Admin → DebugView (if using `debug` in Measurement Protocol)

**Make.com Flow (alternative):**

- HTTP Webhook → Watch Events
- Copy webhook URL to Eventbrite
- HTTP → Make a Request (same structure as above)

---

### 2.6 Acuity Webhook Setup

**Steps:**

1. **Acuity Settings:**
   - Integrations → Webhooks
   - URL: Your Zapier/Make webhook URL
   - Events: `appointment.scheduled`, `appointment.rescheduled`
   - Save

2. **Payload Example:**

```json
{
  "id": 123456789,
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "amountPaid": "75.00",
  "appointmentTypeID": 12345,
  "calendar": "Chicago Studio"
}
```

3. **Zapier/Make:**
   - Same structure as Eventbrite
   - Map: `id` → `transaction_id`, `amountPaid` → `value`
   - Extract city from `calendar` field

---

### 2.7 RezClick Integration (No Native API)

**Problem:** RezClick has no webhook/API.

**Solutions:**

#### Option A: Email Parsing (Easiest)

1. **Setup:**
   - RezClick sends confirmation emails to support@colorcocktailfactory.com
   - Use Zapier **Email Parser** or **Gmail Trigger**
   - Parse: Order ID, Amount, Class Name, Date

2. **Zapier Flow:**
   - Trigger: **Email Parser by Zapier** (or Gmail → New Email)
   - Filter: Subject contains "Booking Confirmation"
   - Parse fields using regex patterns
   - Action: HTTP POST to GA4 Measurement Protocol (same as above)

3. **Pros:** No RezClick involvement needed  
   **Cons:** Delayed (email lag), brittle (template changes break parsing)

#### Option B: Scheduled Export + CSV Import

1. **Manual Export:**
   - Download RezClick bookings CSV weekly
   - Upload to Google Sheets

2. **Zapier/Make:**
   - Trigger: Google Sheets → New Row
   - Action: HTTP POST to GA4 Measurement Protocol

3. **Pros:** More reliable than email parsing  
   **Cons:** Manual step, not real-time

#### Option C: Lightweight Middleware (Advanced)

1. **Create Netlify Function:**
   - `/api/rezclick-webhook.ts`
   - Accepts form data from a hidden iframe on RezClick confirmation page
   - Forwards to GA4 Measurement Protocol

2. **Contact RezClick support:**
   - Ask if they can add a hidden iframe or pixel to confirmation pages
   - Point to your Netlify function

3. **Pros:** Automated, real-time  
   **Cons:** Requires RezClick cooperation

**Recommendation for RezClick:**  
Start with **Option A (Email Parsing)** for quick wins. Upgrade to Option C if volume justifies the effort.

---

### 2.8 Deduplication Strategy

**Problem:** Webhooks can fire multiple times (retries, updates).

**Solution:** Use `transaction_id` as unique identifier.

**GTM Setup:**

1. **Create Variable:**
   - Type: **Data Layer Variable**
   - Variable Name: `Transaction ID`
   - Data Layer Variable Name: `transaction_id`

2. **Create Trigger:**
   - Type: **Custom Event**
   - Event Name: `purchase`
   - **Additional Condition:**
     - `Transaction ID` → `does not equal` → `{{Last Transaction ID}}`

3. **Create Variable (Last Transaction ID):**
   - Type: **Custom JavaScript**
   - Code:
     ```javascript
     function() {
       return window.lastTransactionId || '';
     }
     ```

4. **Update GA4 Purchase Tag:**
   - Add Custom HTML tag (fires BEFORE GA4 tag):
     ```html
     <script>
       window.lastTransactionId = {{Transaction ID}};
     </script>
     ```

**Result:** GA4 only tracks each `transaction_id` once per session.

---

### 2.9 Sample Measurement Protocol Payloads

**Purchase Event (Complete Example):**

```json
{
  "client_id": "123456789.9876543210",
  "user_id": "user_123",
  "timestamp_micros": 1736797200000000,
  "non_personalized_ads": false,
  "events": [
    {
      "name": "purchase",
      "params": {
        "transaction_id": "EB-20260113-12345",
        "value": 150.00,
        "tax": 12.50,
        "currency": "USD",
        "booking_provider": "eventbrite",
        "city": "chicago",
        "class_id": "date-night-wheel",
        "class_name": "Date Night on the Wheel",
        "class_category": "pottery",
        "items": [
          {
            "item_id": "date-night-wheel",
            "item_name": "Date Night on the Wheel",
            "item_category": "pottery",
            "item_variant": "chicago",
            "price": 75.00,
            "quantity": 2
          }
        ]
      }
    }
  ]
}
```

**Lead Generation (Private Event):**

```json
{
  "client_id": "123456789.9876543210",
  "events": [
    {
      "name": "generate_lead",
      "params": {
        "value": 500,
        "currency": "USD",
        "city": "chicago",
        "lead_type": "private_event"
      }
    }
  ]
}
```

---

## Phase 3: Server-Side Tagging (Optional but Recommended)

**Why Server-Side?**
- **Data quality:** Bypass ad blockers (20-40% of users), get complete data
- **Performance:** Offload analytics JS to server, faster page loads
- **Privacy:** Control what data reaches third parties (GDPR/CCPA compliance)
- **Ad platforms:** Facebook/Google Ads get better signal → better ROAS

---

### 3.1 Setup GTM Server Container on Cloud Run

**Steps:**

#### A. Create Server Container in GTM

1. GTM → Admin → Container → **Create Container**
2. Container Name: `CCF Server Container`
3. Target Platform: **Server**
4. Click Create → Copy **Container Config** (JSON file)

#### B. Deploy to Google Cloud Run

1. **Enable APIs:**
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   ```

2. **Deploy Container:**
   ```bash
   gcloud run deploy gtm-server \
     --image=gcr.io/cloud-tagging-10302018/gtm-cloud-image:stable \
     --region=us-central1 \
     --platform=managed \
     --allow-unauthenticated \
     --set-env-vars "CONTAINER_CONFIG=$(cat container-config.json)"
   ```

3. **Get Service URL:**
   ```
   Service URL: https://gtm-server-xxxxx-uc.a.run.app
   ```

#### C. Setup Custom Domain (Optional but Recommended)

**Why:** First-party domain (`tag.colorcocktailfactory.com`) → better cookie persistence, less blocking.

**Steps:**

1. **Cloud Run → Manage Custom Domains**
2. Add domain: `tag.colorcocktailfactory.com`
3. Follow DNS verification steps (add TXT record)
4. Add CNAME record:
   ```
   tag.colorcocktailfactory.com → ghs.googlehosted.com
   ```
5. Wait for SSL cert provisioning (~15 min)

---

### 3.2 Route Web GTM to Server Container

**In Web GTM Container:**

1. **Update GA4 Config Tag:**
   - Click on `GA4 - Config Tag`
   - Fields to Set:
     - `server_container_url` → `https://tag.colorcocktailfactory.com`
     - (or Cloud Run URL if not using custom domain)
   - Save

2. **Publish Container:**
   - Submit → Version Name: `Server-side routing enabled`
   - Publish

**How It Works:**
- Web GTM sends events to your server container
- Server container validates, enriches, forwards to GA4
- Ad platforms (Facebook, Google Ads) also receive via server-side tags

---

### 3.3 Configure Server-Side GA4 Tag

**In Server Container:**

1. **Create Client:**
   - Type: **GA4**
   - Name: `GA4 Client`
   - Save

2. **Create GA4 Tag:**
   - Type: **Google Analytics: GA4**
   - Measurement ID: `G-XXXXXXXXXX`
   - Trigger: **All Events**
   - Save

3. **Create Facebook Conversions API Tag (Optional):**
   - Type: **Facebook Conversions API**
   - Pixel ID: `1554498828184467`
   - Access Token: Generate in Facebook Events Manager
   - Trigger: **All Events**
   - Event Name Mapping:
     - `begin_checkout` → `InitiateCheckout`
     - `purchase` → `Purchase`
   - Save

4. **Publish Server Container**

---

### 3.4 Verify Server-Side Routing

**Check:**

1. **GTM Preview Mode:**
   - Web container → Preview
   - Check Network tab: requests go to `tag.colorcocktailfactory.com` (not `google-analytics.com`)

2. **Server Container Preview:**
   - Server container → Preview
   - Should see events arriving from web container

3. **GA4 DebugView:**
   - Should still see events (routed via server now)

---

## Consent Mode v2 Implementation

**What:** Google's privacy framework. Required for EU/UK traffic, recommended globally.

**Signals:**
- `ad_storage`: Advertising cookies (Google Ads, Meta Pixel)
- `analytics_storage`: Analytics cookies (GA4)
- `ad_user_data`: User data sharing for ads
- `ad_personalization`: Personalized ads

---

### 4.1 Basic Implementation (No CMP)

**For US-only traffic or basic compliance:**

**Update GTM Config Tag:**

```javascript
// In GTM, add this BEFORE GA4 Config Tag loads

<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

// Default: Denied (privacy-first)
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'analytics_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'wait_for_update': 500
});

// Auto-grant after 500ms if no banner shown
setTimeout(() => {
  gtag('consent', 'update', {
    'ad_storage': 'granted',
    'analytics_storage': 'granted',
    'ad_user_data': 'granted',
    'ad_personalization': 'granted'
  });
}, 500);
</script>
```

**Pros:** Simple, no UI needed  
**Cons:** Not GDPR-compliant (no user choice)

---

### 4.2 Advanced Implementation (With CMP)

**Recommended CMPs:**
- **Cookiebot:** Easy integration, free tier available
- **OneTrust:** Enterprise-grade
- **Osano:** Developer-friendly

**Implementation (Cookiebot Example):**

1. **Sign up:** https://www.cookiebot.com
2. **Add script to `<head>`:**

```html
<script id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid="YOUR-CBID" type="text/javascript"></script>
```

3. **GTM Consent Integration:**
   - Cookiebot automatically updates GTM consent state
   - Map cookie categories:
     - **Necessary** → Always granted
     - **Preferences** → `analytics_storage`
     - **Statistics** → `analytics_storage`
     - **Marketing** → `ad_storage`, `ad_user_data`, `ad_personalization`

4. **Update GA4 Tag:**
   - Built-in Consent Mode: **Enabled**
   - Modeling: **Enabled** (uses machine learning to estimate conversions when consent denied)

**Result:** Compliant with GDPR, CCPA, and other privacy laws.

---

## BigQuery Export Setup

**Why:** Own your raw GA4 data forever. Run custom SQL queries, build dashboards, train ML models.

**What You Get:**
- Daily export of all events
- Intraday export (streaming, updated every ~10 min)
- Full event parameters, user properties, device info

---

### 5.1 Enable BigQuery Export

**Steps:**

1. **GA4 Admin:**
   - Property → Product Links → BigQuery Links
   - Click **Link**

2. **Choose Project:**
   - Select Google Cloud Project (same as server container)
   - Or create new: `ccf-analytics`

3. **Configure Export:**
   - Export Type: **Daily + Streaming** (recommended)
   - Data Location: `US` (multi-region)
   - Events to Export: **All events**

4. **Finish Setup:**
   - Agree to terms
   - Click **Submit**

**Result:** Within 24 hours, datasets appear in BigQuery.

---

### 5.2 BigQuery Tables Schema

**Tables:**

- `analytics_XXXXXXXXX.events_YYYYMMDD` (daily export)
- `analytics_XXXXXXXXX.events_intraday_YYYYMMDD` (streaming)

**Key Fields:**

```sql
SELECT
  event_date,
  event_timestamp,
  event_name,
  user_pseudo_id,          -- client_id
  (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id') AS session_id,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'city') AS city,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'booking_provider') AS provider,
  ecommerce.transaction_id,
  ecommerce.purchase_revenue_in_usd
FROM
  `project.analytics_XXXXXXXXX.events_*`
WHERE
  _TABLE_SUFFIX BETWEEN '20260101' AND '20260131'
  AND event_name = 'purchase'
```

---

### 5.3 Sample Queries

**Daily Revenue by City:**

```sql
SELECT
  event_date,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'city') AS city,
  COUNT(*) AS purchases,
  ROUND(SUM(ecommerce.purchase_revenue_in_usd), 2) AS revenue
FROM
  `analytics_XXXXXXXXX.events_*`
WHERE
  event_name = 'purchase'
  AND _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
                       AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
GROUP BY event_date, city
ORDER BY event_date DESC, revenue DESC
```

**Top Classes by Bookings:**

```sql
SELECT
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'class_name') AS class_name,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'booking_provider') AS provider,
  COUNT(*) AS bookings
FROM
  `analytics_XXXXXXXXX.events_*`
WHERE
  event_name = 'begin_checkout'
  AND _TABLE_SUFFIX = FORMAT_DATE('%Y%m%d', CURRENT_DATE())
GROUP BY class_name, provider
ORDER BY bookings DESC
LIMIT 10
```

**Attribution Report (First Touch):**

```sql
WITH first_touch AS (
  SELECT
    user_pseudo_id,
    traffic_source.source AS first_source,
    traffic_source.medium AS first_medium,
    MIN(event_timestamp) AS first_visit
  FROM `analytics_XXXXXXXXX.events_*`
  WHERE event_name = 'session_start'
  GROUP BY 1, 2, 3
)
SELECT
  ft.first_source,
  ft.first_medium,
  COUNT(DISTINCT e.ecommerce.transaction_id) AS purchases,
  ROUND(SUM(e.ecommerce.purchase_revenue_in_usd), 2) AS revenue
FROM
  `analytics_XXXXXXXXX.events_*` e
JOIN
  first_touch ft ON e.user_pseudo_id = ft.user_pseudo_id
WHERE
  e.event_name = 'purchase'
GROUP BY 1, 2
ORDER BY revenue DESC
```

---

## Verification & Debugging Checklist

### ✅ Phase 1 Checklist (Client-Side GTM + GA4)

- [ ] **GTM Container Loads**
  - Open site → DevTools → Network tab
  - Filter: `googletagmanager.com/gtm.js`
  - Status: 200 OK
  - Verify `GTM-XXXXXXX` in URL

- [ ] **GTM Preview Mode Works**
  - GTM → Workspace → Preview
  - Enter site URL
  - Tag Assistant opens, shows Tags Fired

- [ ] **GA4 Config Tag Fires**
  - In Tag Assistant: `GA4 - Config Tag` → Fired on All Pages

- [ ] **GA4 DebugView Shows Events**
  - GA4 → Admin → DebugView
  - Open site in new tab with `?debug_mode=true`
  - See `page_view`, `session_start` events

- [ ] **Custom Dimensions Registered**
  - GA4 → Admin → Custom Definitions
  - See: `city`, `class_category`, `class_name`, etc.

- [ ] **begin_checkout Event Fires**
  - Click "Book Now" button
  - Tag Assistant shows: `GA4 - begin_checkout` tag fired
  - DebugView shows event with correct parameters

- [ ] **Realtime Report Shows Data**
  - GA4 → Reports → Realtime
  - See active users (you)
  - Check Event Count by Event Name → `begin_checkout` increments

- [ ] **Cross-Domain Tracking (If Needed)**
  - If booking platforms are on different domains:
  - GA4 Config Tag → Fields to Set → `linker` → `{"domains":["eventbrite.com","acuityscheduling.com"]}`

- [ ] **Enhanced Measurement Events Work**
  - Scroll 90% → `scroll` event
  - Click outbound link → `click` event
  - Play video → `video_start`, `video_progress`

- [ ] **No Errors in Console**
  - DevTools → Console tab
  - No GTM/GA4 related errors

---

### ✅ Phase 2 Checklist (Webhooks)

- [ ] **Measurement Protocol API Secret Created**
  - GA4 → Data Streams → Measurement Protocol API secrets
  - Secret copied and stored securely

- [ ] **Zapier/Make Webhook URL Set**
  - In Eventbrite/Acuity webhook settings
  - Test webhook sends successfully

- [ ] **Test Purchase Event Sent**
  - Create test order on Eventbrite/Acuity
  - Check Zapier/Make task history: Success
  - Verify GA4 DebugView shows `purchase` event (use `&debug_mode=1` in Measurement Protocol URL for testing)

- [ ] **Transaction ID Deduplication Works**
  - Send same `transaction_id` twice
  - Verify GA4 only counts once in reports

- [ ] **client_id Passing (If Implemented)**
  - Check booking URL contains `ga_client_id` parameter
  - Verify same `client_id` in webhook payload
  - GA4 attribution reports link purchase to session

- [ ] **Revenue Shows in GA4**
  - GA4 → Reports → Monetization → Ecommerce Purchases
  - See test purchase
  - Revenue amount correct

- [ ] **RezClick Integration (If Implemented)**
  - Email parser triggers correctly
  - OR manual CSV upload → Sheets → Zapier works
  - purchase events arrive in GA4

---

### ✅ Phase 3 Checklist (Server-Side)

- [ ] **Cloud Run Service Deployed**
  - `gcloud run services list` shows `gtm-server`
  - Service URL accessible (health check endpoint)

- [ ] **Custom Domain Works (If Configured)**
  - `https://tag.colorcocktailfactory.com/healthz` returns 200
  - SSL cert valid

- [ ] **Web GTM Routes to Server**
  - Network tab: requests to `tag.colorcocktailfactory.com` (not `analytics.google.com`)

- [ ] **Server Container Preview Mode**
  - Server GTM → Preview
  - Shows events arriving from web

- [ ] **GA4 Events Still Arrive**
  - GA4 DebugView/Realtime still shows events
  - No data loss vs. client-side

- [ ] **Facebook CAPI Tag Fires (If Configured)**
  - Server GTM Preview → Facebook Conversions API tag fired
  - Facebook Events Manager → Test Events shows events

- [ ] **Cost Monitoring**
  - Cloud Run usage stays within free tier (1M requests/month)
  - Set budget alert: $10/month

---

### ✅ Consent Mode Checklist

- [ ] **Default Consent Set**
  - GTM → Preview → Consent tab shows defaults (denied)

- [ ] **Consent Banner Shows (If CMP Installed)**
  - Site loads → banner appears
  - Click Accept → consent granted in GTM

- [ ] **GA4 Pings Without Cookies (Denied State)**
  - GA4 → Admin → Data Settings → Data Collection → Consent Mode
  - Shows "Consent mode detected"

- [ ] **Conversion Modeling Enabled**
  - GA4 → Admin → Attribution Settings
  - Reporting Identity: **Blended** (uses modeling + observed data)

---

### ✅ BigQuery Checklist

- [ ] **Export Enabled in GA4**
  - GA4 → Admin → BigQuery Links → Status: Linked

- [ ] **Tables Appear in BigQuery**
  - BigQuery Console → `analytics_XXXXXXXXX` dataset exists
  - `events_YYYYMMDD` tables (wait 24h for first export)

- [ ] **Sample Query Runs**
  - Execute daily revenue query → returns data

- [ ] **Scheduled Queries (Optional)**
  - BigQuery → Scheduled Queries
  - Create daily aggregation job → saves to summary table

---

## Quick Questions (Optional)

**To finalize exact tracking mappings, please provide:**

### A. Booking Platform Mappings

For each class/workshop, which platform powers bookings?

| Class Name | Chicago Platform | Eugene Platform |
|------------|------------------|-----------------|
| Date Night Pottery | RezClick | RezClick |
| Beginner Wheel | ??? | ??? |
| Mosaics | ??? | ??? |
| Glass Fusion | ??? | ??? |
| Gift Cards | Acuity | Acuity |
| Private Events | Contact Form | Contact Form |

**Why:** Determines `booking_provider` parameter values.

---

### B. Pricing Information

Average price per class (for `value` parameter in events):

- Pottery classes: $___
- Glass/Mosaic: $___
- Private events (estimated lead value): $___
- Gift cards (average): $___

**Why:** Used in `begin_checkout` and `purchase` events for revenue tracking.

---

### C. City Toggle Behavior

Does your site have a city selector that persists across pages?

- [ ] Yes, user selects city and it's remembered
- [ ] No, each page is city-specific (/chicago/... vs /eugene/...)
- [ ] Mixed: homepage has selector, then city-locked pages

**Why:** Determines how we capture `city` parameter (localStorage, URL parsing, or event data).

---

### D. RezClick Email Format

Forward a sample RezClick confirmation email to analyze for parsing.

**Needed fields:**
- Order/Confirmation ID
- Total amount paid
- Class name
- Date/time
- Customer email (for deduplication)

**Why:** Builds reliable regex patterns for email parser.

---

### E. Eventbrite/Acuity Admin Access

Do you have admin/owner access to:

- [ ] Eventbrite organization settings (to add webhooks)
- [ ] Acuity admin panel (to add webhooks)
- [ ] RezClick dashboard (to check export options)

**Why:** Needed to configure webhook endpoints.

---

## 🎯 Next Steps (Action Plan)

### Week 1: Foundation
1. Create GA4 property (30 min)
2. Create GTM container (15 min)
3. Install GTM on site (1 hour)
4. Register custom dimensions (30 min)
5. Deploy to Netlify with env vars (30 min)
6. Verify in DebugView (1 hour)

### Week 2: Event Tracking
1. Implement `trackBeginCheckout()` utility (2 hours)
2. Add tracking to all booking buttons (3 hours)
3. Test click-out events (1 hour)
4. Implement form tracking (generate_lead) (1 hour)
5. Verify in GA4 Realtime (1 hour)

### Week 3: Webhooks
1. Generate Measurement Protocol API secret (15 min)
2. Setup Eventbrite webhook → Zapier (2 hours)
3. Setup Acuity webhook → Zapier (2 hours)
4. Configure client_id passing (2 hours)
5. Test purchase events (2 hours)
6. Setup RezClick email parser (3 hours)

### Week 4: Advanced (Optional)
1. Deploy GTM Server Container to Cloud Run (2 hours)
2. Configure custom domain (1 hour)
3. Route web GTM to server (30 min)
4. Setup Facebook CAPI (1 hour)
5. Enable BigQuery export (30 min)
6. Implement Consent Mode (with/without CMP) (2-4 hours)

---

## 📚 Resources

### Official Documentation
- **GA4 Setup:** https://support.google.com/analytics/answer/9304153
- **GTM Setup:** https://support.google.com/tagmanager/answer/6103696
- **Measurement Protocol:** https://developers.google.com/analytics/devguides/collection/protocol/ga4
- **Server-Side Tagging:** https://developers.google.com/tag-platform/tag-manager/server-side
- **Consent Mode:** https://support.google.com/analytics/answer/9976101
- **BigQuery Export:** https://support.google.com/analytics/answer/9358801

### CCF-Specific Files to Update
- `components/GoogleTagManager.tsx` (NEW)
- `lib/analytics.ts` (NEW)
- `components/ui/ButtonPill.tsx` (add tracking)
- `app/layout.tsx` (install GTM)
- `.env.local` → `NEXT_PUBLIC_GTM_ID`

### Testing Tools
- **GA4 DebugView:** https://analytics.google.com → DebugView
- **GTM Preview:** https://tagmanager.google.com → Preview mode
- **Tag Assistant:** https://tagassistant.google.com/
- **Measurement Protocol Validator:** https://ga-dev-tools.google/ga4/event-builder/

---

**Questions?** Drop them in the "Quick Questions" section above or start with Phase 1 and iterate. You'll have actionable data within 2-3 weeks.

**Your maximum appetite for information, delivered.** 🎯
