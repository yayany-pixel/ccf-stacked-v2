# 📊 Analytics Dashboard Setup Guide

## 🎯 The Best Dashboard Configuration

This guide will help you set up the **ultimate analytics dashboard** for Color Cocktail Factory, combining Google Analytics 4, Meta Pixel, and Netlify Analytics.

---

## 1️⃣ Google Analytics 4 - Custom Dashboard Setup

### Access Your Dashboard
1. Go to [https://analytics.google.com](https://analytics.google.com)
2. Select your property (GA ID: `G-CPKCDF56W2`)

### Create Your Master Dashboard

**Step 1: Create a New Dashboard**
1. Click **Reports** in left sidebar
2. Click **Library** at bottom
3. Click **Create new report**
4. Choose **Dashboard** (not Report)
5. Name it: "CCF Daily Dashboard"

**Step 2: Add These Cards**

#### Card 1: Real-Time Users
- **Metric:** Active users (last 30 minutes)
- **Dimension:** None
- **Visualization:** Scorecard (big number)

#### Card 2: Today's Traffic
- **Metrics:** Users, Sessions, Pageviews
- **Dimension:** Date (compare to yesterday)
- **Visualization:** Scorecard

#### Card 3: Top Pages (Today)
- **Metrics:** Views, Users, Avg. time on page
- **Dimension:** Page path and screen class
- **Filters:** Last 24 hours
- **Visualization:** Table
- **Rows to show:** 10

#### Card 4: Traffic Sources
- **Metrics:** Users, Sessions
- **Dimension:** Session source/medium
- **Visualization:** Pie chart
- **Filters:** Last 7 days

#### Card 5: City Performance
- **Metrics:** Pageviews, Users
- **Dimension:** Page path (filter: contains /chicago OR /eugene)
- **Visualization:** Bar chart

#### Card 6: Device Breakdown
- **Metrics:** Users, Sessions, Bounce rate
- **Dimension:** Device category
- **Visualization:** Table

#### Card 7: Conversions (RezClick Events)
- **Metrics:** Event count
- **Dimension:** Event name (filter: RezClick)
- **Filters:** Last 30 days
- **Visualization:** Timeline

#### Card 8: Geographic Data
- **Metrics:** Users
- **Dimension:** Country, City
- **Visualization:** Geo map
- **Top 10 cities**

### Save and Pin
- Click **Save**
- Click **⭐ Add to favorites** to pin to top nav

---

## 2️⃣ Google Analytics - Custom Reports

### Report 1: Daily Performance Report

**Create:**
1. **Explorations** (left sidebar) → **Create new exploration**
2. Choose **Free form** template
3. Name: "Daily Performance - CCF"

**Configuration:**
- **Metrics:** Users, Sessions, Bounce rate, Avg. session duration, Conversions
- **Dimensions:** Date, Source/Medium, Device category
- **Date range:** Last 30 days
- **Comparison:** Compare to previous period

**Filters:**
- Exclude internal traffic (your IP)
- Exclude referral spam

**Segments to add:**
- New users vs Returning users
- Mobile vs Desktop
- Organic search vs Direct vs Referral

**Save and share link**

---

### Report 2: Content Performance Report

**Create:**
1. **Explorations** → **Create new exploration**
2. Choose **Free form**
3. Name: "Content Performance - CCF"

**Configuration:**
- **Metrics:** Pageviews, Unique pageviews, Avg. time on page, Exit rate
- **Dimensions:** Page path, Page title, Landing page
- **Date range:** Last 30 days

**Custom dimensions:**
- Create dimension: "Page Type" (Blog, Activity, City, Other)
  - Go to **Admin** → **Custom definitions** → **Create custom dimension**
  - Dimension name: Page Type
  - Scope: Event
  - Event parameter: page_type

**Segments:**
- Blog posts (`/blog/`)
- Activity pages (`/chicago/` or `/eugene/`)
- Landing pages (entry pages with >10 sessions)

**Sort by:** Pageviews (descending)

---

### Report 3: Conversion Funnel

**Create:**
1. **Explorations** → **Funnel exploration**
2. Name: "Booking Funnel - CCF"

**Steps:**
1. **Landing Page** → Any page view
2. **Activity Viewed** → Page path contains `/chicago/` OR `/eugene/`
3. **Booking Intent** → Event: `RezClick` OR `scroll_depth > 50%`
4. **External Click** → Outbound link click

**Metrics to track:**
- Completion rate
- Drop-off at each step
- Time to complete

**Breakdown by:**
- Device category
- Source/Medium
- City (Chicago vs Eugene)

---

## 3️⃣ Meta Pixel Dashboard

### Access Events Manager
1. Go to [https://business.facebook.com/events_manager](https://business.facebook.com/events_manager)
2. Select your pixel: `1554498828184467`

### Custom Dashboard Setup

**Overview Tab:**
- **Today's Activity:** Real-time events
- **Event Trends:** Last 7 days vs previous 7 days

**Events to Track:**
- `PageView` (automatic)
- `RezClick` (custom event - booking clicks)
- `ViewContent` (when viewing specific activities)

**Create Custom Audience:**
1. Click **Audiences** tab
2. **Create Audience** → **Custom Audience**
3. Name: "Website Visitors - 30 Days"
4. Source: Website
5. Events: All website visitors in last 30 days

**Create Lookalike Audience:**
1. From custom audience above
2. Location: Chicago, IL + Eugene, OR (25 mile radius)
3. Audience size: 1% (most similar)

---

## 4️⃣ Netlify Analytics

### Access Dashboard
1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Select site: **colorcocktailfactory.com**
3. Click **Analytics** tab

### Enable Netlify Analytics (Optional - $9/month)
**Benefits:**
- Server-side tracking (no ad blockers)
- No cookies needed (GDPR compliant)
- Bandwidth usage
- Geographic data
- Status code tracking (errors)

**To Enable:**
1. Analytics tab → **Enable Analytics**
2. Billing: $9/month per site

**What You Get:**
- Pageviews (total + unique)
- Top pages
- Top sources/referrers
- Bandwidth by resource
- Geo map of visitors
- 404 errors tracking

---

## 5️⃣ Unified Dashboard (Recommendation)

### Option A: Google Data Studio (Free)

**Create Multi-Source Dashboard:**

1. Go to [https://lookerstudio.google.com](https://lookerstudio.google.com)
2. **Create** → **Report**
3. Name: "CCF Master Dashboard"

**Add Data Sources:**
- Google Analytics 4 (connect your property)
- (Optional) Meta Ads connector
- (Optional) Google Sheets for manual data

**Layout:**

**Page 1: Traffic Overview**
- Scorecard: Users (today, this week, this month)
- Timeline: Users over time (last 30 days)
- Table: Top 10 pages
- Pie chart: Traffic sources
- Bar chart: Device breakdown

**Page 2: Content Performance**
- Table: All pages sorted by views
- Heatmap: Pages by day of week
- Bar chart: Blog posts vs Activities
- Scorecard: Avg. time on page

**Page 3: Conversions**
- Timeline: RezClick events over time
- Table: Pages with highest conversion rate
- Funnel: Landing → Activity → Click
- Scorecard: Total conversions this month

**Page 4: Geography**
- Geo map: Users by city
- Table: Top 10 cities
- Bar chart: Chicago vs Eugene page performance

**Share:**
- Click **Share** → **Schedule email delivery**
- Send daily report to your email at 9am

---

### Option B: Custom Internal Dashboard (Advanced)

Create a real-time dashboard on your website using Google Analytics API.

**Benefits:**
- Embedded on your site
- Custom metrics
- Real-time updates
- Beautiful UI matching your brand

**Implementation:** (Let me know if you want me to build this!)

---

## 6️⃣ Daily Monitoring Routine

### Morning Check (5 minutes)
1. **Google Analytics** → Realtime
   - How many users right now?
   - Which pages are they on?

2. **Google Analytics** → Reports → Engagement → Overview
   - Yesterday's total users
   - Compare to last week
   - Identify trends

3. **Meta Events Manager** → Overview
   - RezClick events yesterday
   - Any unusual spikes/drops?

### Weekly Deep Dive (30 minutes)
1. **Traffic Report**
   - Total users this week
   - Top 5 pages
   - Best traffic source
   - Mobile vs Desktop ratio

2. **Content Performance**
   - Which blog posts got views?
   - Which activities are popular?
   - Chicago vs Eugene traffic split

3. **Conversions**
   - Total RezClick events
   - Conversion rate by page
   - Which CTAs perform best?

4. **Issues**
   - Any 404 errors?
   - Any pages with high bounce rate (>80%)?
   - Any slow pages (>5s load time)?

### Monthly Analysis (1-2 hours)
1. **Month-over-month comparison**
2. **Identify top performers** (content, sources, campaigns)
3. **Optimize low performers** (improve CTAs, update content)
4. **Set next month's goals**

---

## 7️⃣ Key Performance Indicators (KPIs)

### Primary KPIs
- **Daily Users:** Target 50-100+ (depends on marketing)
- **Conversion Rate:** 3-5% (visitors who click booking)
- **Avg. Session Duration:** 1-3 minutes
- **Bounce Rate:** 40-60%

### Secondary KPIs
- **Pages per Session:** 2-3 pages
- **Mobile Traffic %:** 50-70%
- **Returning Visitors:** 20-30%
- **Blog Engagement:** 2+ min average time

### Growth Metrics
- **Week-over-week growth:** 5-10%
- **New vs Returning:** 70% new, 30% return
- **Social traffic growth:** 10-15% month-over-month
- **Email list signups:** Track separately

---

## 8️⃣ Alerts to Set Up

### Google Analytics Alerts

1. **Admin** → **Custom alerts** → **New alert**

**Alert 1: Traffic Drop**
- Condition: Users decreases by 30% compared to previous period
- Period: Day
- Send email: Yes

**Alert 2: Traffic Spike**
- Condition: Users increases by 100% compared to previous period
- Period: Day
- Send email: Yes (could indicate viral content or ad success)

**Alert 3: High Bounce Rate**
- Condition: Bounce rate > 80% for any page
- Period: Week
- Send email: Yes

**Alert 4: Error Pages**
- Condition: 404 errors > 20 per day
- Period: Day
- Send email: Yes

---

## 9️⃣ Recommended Tools

### Free Tools
- ✅ Google Analytics 4 (you have this)
- ✅ Meta Pixel (you have this)
- ✅ Google Search Console (set up if you haven't)
- ✅ Google Data Studio / Looker Studio (free dashboards)
- ⭐ Hotjar (heatmaps, session recordings) - Free plan available

### Paid Tools (Optional)
- Netlify Analytics ($9/month) - Server-side tracking
- Plausible Analytics ($9/month) - Privacy-focused, simple
- Fathom Analytics ($14/month) - Privacy-first alternative
- Mixpanel (Free up to 100k events) - Advanced user analytics

---

## 🎯 Next Steps

1. **Now:** Access Google Analytics and create the custom dashboard (15 min)
2. **Today:** Set up Google Data Studio unified dashboard (30 min)
3. **This Week:** Enable Google Search Console and submit sitemap
4. **This Month:** Review first month's data and set baseline KPIs

---

## 📧 Questions?

If you need help with any of these setups, just ask! I can:
- Create custom Google Data Studio templates
- Build a real-time analytics page on your website
- Set up advanced conversion tracking
- Create automated weekly email reports

---

**Your Analytics Stack:**
- ✅ Google Analytics (G-CPKCDF56W2)
- ✅ Meta Pixel (1554498828184467)
- ✅ Netlify Hosting & Analytics
- ✅ Custom Dashboard at `/analytics`
