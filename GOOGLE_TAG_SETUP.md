# 🏷️ Google Tag Installation - COMPLETE GUIDE

## ⚠️ **PROBLEM IDENTIFIED**

Your Google Analytics tag is configured locally but **NOT deployed to production**.

### Why It's Not Working:
- ✅ Code is correct ([GoogleAnalytics.tsx](components/GoogleAnalytics.tsx))
- ✅ `.env.local` has the IDs
- ❌ **Netlify doesn't have the environment variables**
- ❌ Site was built before variables were added

---

## 🚀 **SOLUTION: Add to Netlify**

### Step 1: Add Environment Variables to Netlify

1. Go to **Netlify Dashboard**: https://app.netlify.com
2. Select your site: **colorcocktailfactory.com**
3. Go to **Site configuration** → **Environment variables**
4. Click **Add a variable** and add these:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_GA_ID_1` | `G-CPKCDF56W2` |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | `AW-17861847897` |
| `NEXT_PUBLIC_META_PIXEL_ID` | `1554498828184467` |

5. Click **Save**

### Step 2: Trigger New Deployment

**Option A: From Netlify Dashboard**
1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Clear cache and deploy site**

**Option B: From Git**
```bash
cd c:\Users\yayan\OneDrive\Documents\GitHub\ccf-stacked-v2
git add .
git commit -m "Add Google Analytics and Ads tracking" --allow-empty
git push
```

### Step 3: Verify Installation (5-10 minutes)

Once deployment completes:

1. **Visit your site:** https://www.colorcocktailfactory.com
2. **Open Developer Tools** (F12)
3. **Go to Network tab**
4. **Refresh page**
5. **Search for:** `gtag` or `googletagmanager`

You should see:
- ✅ Request to `googletagmanager.com/gtag/js?id=AW-17861847897`
- ✅ Request to `googletagmanager.com/gtag/js?id=G-CPKCDF56W2`

**Or use Google Tag Assistant:**
1. Install: https://tagassistant.google.com/
2. Visit your site
3. Click the extension
4. Should show: "Google Analytics: GA4" ✅

---

## 📊 **What Will Be Tracked**

Once deployed, these tags will automatically track:

### Google Analytics (G-CPKCDF56W2):
- All pageviews
- User sessions
- Traffic sources
- Device types
- Location data
- User flow through site

### Google Ads (AW-17861847897):
- All pageviews (for remarketing)
- Ready for conversion events
- Audience building
- Campaign measurement

### Meta Pixel (1554498828184467):
- Pageviews
- Custom events (RezClick, etc.)
- Audience building for Facebook/Instagram ads

---

## 🔍 **Testing in Dev Mode (Optional)**

To test locally before deploying:

```bash
cd c:\Users\yayan\OneDrive\Documents\GitHub\ccf-stacked-v2
npm run dev
```

Then open: http://localhost:3000

Check browser console - you should see:
```
[GA] Initialized with IDs: ["G-CPKCDF56W2", "AW-17861847897"]
[Meta Pixel] Initialized with ID: 1554498828184467
```

---

## ✅ **Verification Checklist**

After deployment:

- [ ] Visit https://www.colorcocktailfactory.com
- [ ] Open DevTools → Network tab
- [ ] See `gtag/js?id=G-CPKCDF56W2` loading
- [ ] See `gtag/js?id=AW-17861847897` loading
- [ ] Check Google Analytics Real-Time reports (see activity)
- [ ] Check Google Ads (should say "Tag active")
- [ ] Check Meta Events Manager (should see PageView events)

---

## 🎯 **Next Steps After Installation**

### 1. Set Up Conversions in Google Ads
```
1. Go to: https://ads.google.com
2. Tools → Conversions
3. Create conversion action:
   - Name: "Booking Click"
   - Source: Website
   - Category: Purchase
   - Value: Set if you know average booking value
```

### 2. Verify in Google Analytics
```
1. Go to: https://analytics.google.com
2. Select property: G-CPKCDF56W2
3. Go to: Reports → Realtime
4. Open your website in another tab
5. Should see yourself as active user
```

### 3. Test Meta Pixel
```
1. Install Meta Pixel Helper extension
2. Visit your website
3. Extension should light up green
4. Click extension → Should show PageView event
```

---

## 🆘 **Troubleshooting**

### "Tag still not showing after deploy"

**Clear Netlify cache:**
```bash
# In Netlify Dashboard:
Deploys → Trigger deploy → "Clear cache and deploy site"
```

**Check environment variables were saved:**
```bash
# In Netlify Dashboard:
Site configuration → Environment variables
# Verify all 3 variables are listed
```

### "Tag shows in dev but not production"

**Rebuild the site:**
```bash
npm run build
# Should complete without errors
```

### "Google Analytics not receiving data"

**Check if ad blockers are blocking:**
- Try in incognito mode
- Disable browser extensions
- Test on mobile device

**Check Google Analytics property:**
- Make sure you're looking at the right property (G-CPKCDF56W2)
- Real-time reports can take 1-2 minutes to show data

---

## 📞 **Need Help?**

If you're still having issues after following these steps:

1. Check Netlify build logs for errors
2. Verify all environment variables are set correctly
3. Make sure you're looking at the production site (not localhost)
4. Wait 24 hours for Google Analytics to start collecting data

---

## ✨ **Summary**

**Current Status:** ⚠️ Tags configured but not deployed

**Action Required:**
1. Add 3 environment variables to Netlify
2. Trigger new deployment
3. Wait 5-10 minutes
4. Verify tags are loading

**Time to Complete:** ~10 minutes

**Tags Being Installed:**
- Google Analytics 4: `G-CPKCDF56W2` ✅
- Google Ads: `AW-17861847897` ✅
- Meta Pixel: `1554498828184467` ✅

All code is ready - just needs to be deployed with environment variables!
