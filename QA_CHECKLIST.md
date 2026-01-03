# QA Checklist — Website Optimization Implementation

## ✅ P0: Critical Priority Items (Must Test First)

### Forms & Submissions

#### Newsletter Signup Form
- [ ] **Form Rendering**: Newsletter form appears in footer on all pages
- [ ] **Client Validation**: Email field requires `@` symbol before submission
- [ ] **Honeypot Field**: Hidden `bot-field` exists in form (check HTML source)
- [ ] **Netlify Detection**: Check Netlify deployment logs for "newsletter" form detection
- [ ] **Submission**: Fill out valid email → submit → should redirect to `/thanks/newsletter`
- [ ] **Error Handling**: Try submitting with invalid data → should show error message
- [ ] **Loading State**: Submit button shows "Subscribing..." during submission
- [ ] **Accessibility**: Form inputs have proper `aria-label` attributes

**Expected Behavior**: Form submits via POST to Netlify (no mailto link, no email client opening)

#### Private Party Inquiry Form  
- [ ] **Form Rendering**: Private party form appears on `/private-events` page
- [ ] **All Fields**: Name, email, city, date, group size, occasion, budget, project, details all render
- [ ] **Required Fields**: Cannot submit without name, email, date, group size, occasion
- [ ] **Honeypot Field**: Hidden `bot-field` exists in form (check HTML source)
- [ ] **Netlify Detection**: Check Netlify deployment logs for "private-party" form detection
- [ ] **Submission**: Fill out complete form → submit → should redirect to `/thanks/private-party`
- [ ] **Error Handling**: Try submitting incomplete form → should show error message
- [ ] **Loading State**: Submit button shows "Sending..." during submission
- [ ] **Date Validation**: Cannot select dates in the past or within 7 days
- [ ] **Accessibility**: All form inputs have proper `aria-label` attributes

**Expected Behavior**: Form submits via POST to Netlify (no mailto link generated, no email client opening)

### Thank You/Confirmation Pages

#### `/thanks/newsletter`
- [ ] **Page Loads**: URL accessible without 404
- [ ] **Success Message**: Shows green checkmark and "You're all set!" headline
- [ ] **Content**: Explains what happens next (welcome email, monthly newsletter, unsubscribe option)
- [ ] **Cross-Selling**: Shows 6 workshop types with links (Wheel Throwing, Mosaics, Glass Fusion, Terrariums, Bonsai, Candle)
- [ ] **CTA Button**: "View All Workshops" button links to `/activities`
- [ ] **Navigation**: "Back to homepage" link works
- [ ] **SEO**: Page has `robots: noindex, nofollow` meta tag (check HTML source)
- [ ] **Mobile**: Layout responsive on mobile devices

#### `/thanks/private-party`
- [ ] **Page Loads**: URL accessible without 404
- [ ] **Success Message**: Shows green checkmark and "Your inquiry is on its way!" headline
- [ ] **Content**: Explains 24-hour response time, what to expect next
- [ ] **Project Examples**: Shows 4 popular party projects with pricing (Wheel Throwing, Turkish Lamps, Handbuilt Pottery, Glass Fusion)
- [ ] **Secondary CTAs**: Links to `/team-building`, `/birthday-parties`, `/bachelorette-parties` work
- [ ] **Primary CTA**: "Browse All Workshop Types" button links to `/activities`
- [ ] **Navigation**: "Back to homepage" link works
- [ ] **SEO**: Page has `robots: noindex, nofollow` meta tag (check HTML source)
- [ ] **Mobile**: Layout responsive on mobile devices

### Structured Data Fixes

#### Eugene Placeholder Removal
- [ ] **Chicago Data Intact**: Visit `/chicago` → view page source → search for `"+1-312-881-9929"` → should exist
- [ ] **Chicago Address**: Search for `"1000 W 35th St"` → should exist in LocalBusiness schema
- [ ] **Chicago Geo**: Search for `"latitude": 41.8307` and `"longitude": -87.6567` → should exist
- [ ] **Chicago Hours**: Search for `openingHoursSpecification` → should exist with Wed-Sun hours
- [ ] **Eugene No Placeholder**: Visit `/eugene` → view page source → search for `"XXX"` → should NOT exist anywhere
- [ ] **Eugene No Fake Phone**: Search for `"+1-541-"` → should NOT exist in structured data
- [ ] **Eugene Minimal Data**: Eugene schema should only have `addressLocality: "Eugene"` and `addressRegion: "OR"` (no street address, postal code, geo coordinates, or phone)
- [ ] **Eugene No Opening Hours**: Eugene schema should NOT include `openingHoursSpecification`

**Expected Behavior**: Chicago has complete verified data; Eugene omits unverified fields entirely (no placeholders, no XXX, no fake data)

### Sitemap Updates

#### New Routes in Sitemap
Visit `https://colorcocktailfactory.com/sitemap.xml` and verify these URLs are present:

**Blog Routes:**
- [ ] `https://colorcocktailfactory.com/blog`
- [ ] `https://colorcocktailfactory.com/blog/pottery-101-beginners-guide`
- [ ] `https://colorcocktailfactory.com/blog/chicago-date-night-ideas`
- [ ] `https://colorcocktailfactory.com/blog/eugene-date-night-ideas`
- [ ] `https://colorcocktailfactory.com/blog/pilsen-student-guide`

**Audience/Customer-Type Pages:**
- [ ] `https://colorcocktailfactory.com/team-building`
- [ ] `https://colorcocktailfactory.com/birthday-parties`
- [ ] `https://colorcocktailfactory.com/bachelorette-parties`
- [ ] `https://colorcocktailfactory.com/corporate`

**Existing Routes (Verify Still Present):**
- [ ] Homepage, Chicago, Eugene
- [ ] `/gift-cards`, `/private-events`, `/events`, `/activities`
- [ ] All city-specific activity pages (e.g., `/chicago/date-night-wheel-throwing`)

**Metadata Check:**
- [ ] Blog posts have `lastModified` matching their publish dates (Jan 2025)
- [ ] Audience pages have `priority: 0.9` (high conversion priority)
- [ ] Blog posts have `changeFrequency: monthly`

### Security Headers

#### Netlify Headers Configuration
After deployment, use browser DevTools or `curl -I` to verify response headers:

- [ ] **X-Frame-Options**: `DENY` (prevents iframe embedding)
- [ ] **X-Content-Type-Options**: `nosniff` (prevents MIME sniffing)
- [ ] **X-XSS-Protection**: `1; mode=block` (legacy XSS protection)
- [ ] **Referrer-Policy**: `strict-origin-when-cross-origin`
- [ ] **Permissions-Policy**: `camera=(), microphone=(), geolocation=()`
- [ ] **Strict-Transport-Security**: `max-age=31536000; includeSubDomains; preload`
- [ ] **Content-Security-Policy**: Present and allows Google Analytics, Meta Pixel, Acuity Scheduling

**Test Method:**
```bash
# In terminal (replace with your deployed URL):
curl -I https://colorcocktailfactory.com
```

Or in Chrome DevTools:
1. Open any page on the site
2. Open DevTools (F12)
3. Go to Network tab
4. Reload page
5. Click on the document (first item)
6. Check "Response Headers" section

---

## ✅ P1: High Priority Items

### Accessibility

#### Skip to Content Link
- [ ] **Keyboard Focus**: Press Tab immediately on page load → should reveal "Skip to main content" link
- [ ] **Visibility**: Link appears in top-left with white background and purple ring
- [ ] **Functionality**: Click/Enter on skip link → should jump to `#main-content`
- [ ] **Hidden by Default**: Link not visible to mouse users (screen-reader accessible only)

**Test Method**: Load homepage → press Tab key → skip link should appear

#### Main Landmark
- [ ] **Homepage**: View source of `/` → `<main id="main-content">` should exist
- [ ] **Screen Reader**: Use screen reader (NVDA/JAWS) → should announce "main" landmark

#### Form Accessibility (Already Tested Above)
- [ ] All form inputs have `aria-label` attributes
- [ ] Error messages use `role="alert"` and `aria-describedby`
- [ ] Invalid inputs have `aria-invalid="true"`

### Breadcrumb Schema

#### Team Building Page Example
- [ ] **Page Load**: Visit `/team-building`
- [ ] **View Source**: Search for `"@type": "BreadcrumbList"`
- [ ] **Structure**: Should have 2 items: Home → Team Building
- [ ] **URLs**: Should have full URLs (https://colorcocktailfactory.com/...)
- [ ] **Position**: First item `position: 1`, second item `position: 2`

**Optional (For Future Implementation):**
- Apply breadcrumb schema to other audience pages (birthday-parties, bachelorette-parties)
- Apply to city activity pages (e.g., `/chicago/date-night-wheel-throwing`)
- Apply to blog posts

---

## 🔍 Regression Testing (Ensure Nothing Broke)

### Existing Functionality

#### Homepage
- [ ] Hero section loads with gradient background
- [ ] City selection cards (Chicago/Eugene) are clickable
- [ ] Quick links to both cities' activities work
- [ ] Newsletter signup form in footer works (uses new Netlify Form)
- [ ] Footer links all work
- [ ] Sticky "Book a Private Party" CTA appears and works

#### City Pages (`/chicago`, `/eugene`)
- [ ] City-specific workshop grids render
- [ ] Acuity booking links work
- [ ] "Show Times" drawer opens with calendar
- [ ] Private event form works (uses new Netlify Form)
- [ ] City toggle navigation works

#### Activities Pages
- [ ] `/activities` index page lists all workshops
- [ ] Individual activity pages (e.g., `/activities/date-night-wheel-throwing`) load correctly
- [ ] City-specific activity pages (e.g., `/chicago/beginner-wheel-throwing`) load correctly
- [ ] Acuity embeds/links work

#### Blog Pages
- [ ] `/blog` index lists all 4 blog posts
- [ ] Individual blog posts load and render markdown content
- [ ] Blog post images load (if they exist)
- [ ] Internal links within blog posts work

#### Events Page
- [ ] `/events` page loads
- [ ] Acuity calendar embed works
- [ ] Shows times drawer works

#### Gift Cards
- [ ] `/gift-cards` page loads
- [ ] NO "50% off" promotional text anywhere (previously removed)
- [ ] Acuity gift card purchase link works

#### Private Events
- [ ] `/private-events` page loads
- [ ] Private event form uses new Netlify Form (no mailto)

#### Audience Pages
- [ ] `/team-building` loads with complete content
- [ ] `/birthday-parties` loads with complete content  
- [ ] `/bachelorette-parties` loads with complete content
- [ ] All have FAQ schema in source code

---

## 📊 Analytics & Tracking (Verify Still Working)

- [ ] **Google Analytics**: Check browser network tab → requests to `www.google-analytics.com` present
- [ ] **Meta Pixel**: Check network tab → requests to `connect.facebook.net` present
- [ ] **Acuity Scheduling**: Booking embeds and links work correctly
- [ ] **No Console Errors**: Open browser console → no JavaScript errors on any page

---

## 🚀 Deployment Checks

### Pre-Deployment
- [ ] Run `npm run build` locally → build succeeds with no errors
- [ ] Run `npm run start` → site runs in production mode locally
- [ ] Check build output for warnings related to forms or sitemap

### Post-Deployment (Netlify)
- [ ] **Build Success**: Netlify deploy log shows successful build
- [ ] **Form Detection**: Netlify deploy log shows:
  - "newsletter" form detected
  - "private-party" form detected
- [ ] **Forms Dashboard**: Netlify dashboard shows 2 forms under "Forms" section
- [ ] **Environment**: Node 22 used (check build log)
- [ ] **Redirects**: No unexpected redirects
- [ ] **Headers**: Security headers applied (test with curl -I)

### Netlify Forms Setup
- [ ] **Notifications**: Configure email notifications for form submissions in Netlify dashboard
- [ ] **Spam Filter**: Netlify's honeypot spam filtering is active (default)
- [ ] **Test Submission**: Submit both forms and verify emails arrive

---

## 🔧 Known Limitations & Future Work

### Not Implemented (Out of Scope)
- **Dynamic OG Image Generation**: Not implemented (requires `/api/og` route with `@vercel/og` or manual image generation)
- **FAQ Page**: Not created (can reuse FAQ content from audience pages)
- **Reviews Page**: Not created (requires real testimonials, not fake data)
- **Additional Breadcrumbs**: Only implemented on team-building page as example

### Form Gotchas
- **Netlify Build Detection**: Forms must be server-rendered in HTML for Netlify to detect them. If forms don't work, check that they're not dynamically loaded client-side only.
- **Hidden Form Duplicate**: If Netlify doesn't detect forms, may need to add hidden static HTML version in a `<form>` tag that's always rendered server-side.
- **Honeypot Field**: Required for spam protection. Must be hidden with CSS/inline styles, not just `display: none` in Tailwind.

### Security Header Notes
- **CSP (Content Security Policy)**: Current policy allows `unsafe-inline` and `unsafe-eval` for scripts to support Google Analytics and Meta Pixel. This reduces security but is necessary for third-party analytics.
- **HSTS**: Only effective after HTTPS is enforced. Make sure Netlify is serving site over HTTPS.

---

## 📝 Manual Testing Script

### Complete User Journey Test

1. **Homepage Newsletter Signup:**
   - Load homepage
   - Scroll to footer
   - Enter email: `test@example.com`
   - Click Subscribe
   - Should redirect to `/thanks/newsletter`
   - Check for confirmation message
   - Click "View All Workshops" → should go to `/activities`

2. **Private Party Inquiry:**
   - Navigate to `/private-events`
   - Fill out all required fields:
     - Name: John Doe
     - Email: john@example.com
     - City: Chicago
     - Date: 2 weeks from today
     - Group Size: 15
     - Occasion: Team Building
     - Budget: $65
     - Project: Wheel throwing
     - Details: Looking for Friday evening
   - Click "Send Private Event Inquiry"
   - Should redirect to `/thanks/private-party`
   - Check for confirmation message

3. **Sitemap & Structured Data:**
   - Visit `/sitemap.xml` → verify all expected URLs
   - Visit `/chicago` → view source → verify LocalBusiness schema with real phone number
   - Visit `/eugene` → view source → verify NO "XXX" placeholders

4. **Accessibility:**
   - Load homepage
   - Press Tab key → skip link appears
   - Press Enter → jumps to main content
   - Navigate entire site with keyboard only

5. **Security Headers:**
   - Use browser DevTools Network tab
   - Check response headers on homepage request
   - Verify all expected security headers present

---

## ✅ Sign-Off Checklist

Before marking implementation complete:

- [ ] All P0 items tested and passing
- [ ] All P1 items tested and passing
- [ ] No regression in existing functionality
- [ ] Forms detected and working in Netlify
- [ ] Security headers live in production
- [ ] Sitemap includes all new routes
- [ ] No placeholder/fake data in structured data
- [ ] Analytics still tracking correctly
- [ ] No console errors on any page
- [ ] Mobile responsive on all new pages

---

## 🐛 Troubleshooting Guide

### Forms Not Working (mailto still triggering)
**Symptoms**: Clicking submit opens email client instead of redirecting to thank you page

**Fixes**:
1. Check that form has `method="POST"` attribute
2. Verify form has `data-netlify="true"` attribute
3. Ensure hidden input `<input type="hidden" name="form-name" value="newsletter">` exists
4. Check Netlify build log for form detection
5. May need to add static HTML form in page for Netlify parsing

### Forms Not Detected by Netlify
**Symptoms**: Netlify build log doesn't show form detection

**Fixes**:
1. Ensure forms are server-rendered (not client-only components)
2. Add static HTML form duplicate somewhere in app (can be hidden)
3. Rebuild/redeploy on Netlify
4. Check that Next.js is outputting static HTML (not purely client-side)

### Security Headers Not Appearing
**Symptoms**: `curl -I` doesn't show custom headers

**Fixes**:
1. Verify `netlify.toml` is in repository root
2. Check Netlify deploy log for configuration errors
3. Clear browser cache and test in incognito mode
4. Headers may take 1-2 minutes to propagate after deployment

### Sitemap Not Updating
**Symptoms**: New routes not in sitemap.xml

**Fixes**:
1. Verify `blogPosts` import in `app/sitemap.ts`
2. Rebuild locally with `npm run build`
3. Check `.next/static` directory for sitemap generation
4. Redeploy to Netlify
5. Clear CDN cache (may need 5-10 minutes)

### Structured Data Validation Errors
**Symptoms**: Google Rich Results Test shows errors

**Fixes**:
1. Use https://validator.schema.org/ to validate JSON-LD
2. Check that all required fields for LocalBusiness are present (for Chicago)
3. Ensure Eugene data doesn't include incomplete/placeholder values
4. Verify proper nesting and quotation marks

---

## 📚 Resources

- **Netlify Forms Docs**: https://docs.netlify.com/forms/setup/
- **Schema.org LocalBusiness**: https://schema.org/LocalBusiness
- **Schema.org BreadcrumbList**: https://schema.org/BreadcrumbList
- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Security Headers Check**: https://securityheaders.com/
- **WCAG Accessibility**: https://www.w3.org/WAI/WCAG21/quickref/

---

**Implementation Date**: January 2025  
**Next Review**: After first production deployment  
**Owner**: Engineering Team
