# 3-Month Pottery Membership - Dynamic Pricing Test Results

## Pricing Logic Test Cases (Central Time)

### Test Scenarios

| Current Time (CT) | Day | Expected Status | Expected Price | Expected Badge | Countdown Direction |
|-------------------|-----|-----------------|----------------|----------------|---------------------|
| Thursday 11:00 PM | Thu | Regular | $219 | Regular Price | Starts in ~10 hours |
| Friday 8:00 AM | Fri | Regular | $219 | Regular Price | Starts in 1 hour |
| Friday 9:00 AM | Fri | **PROMO** | **$179** | Weekend Deal | Ends in ~63 hours |
| Friday 5:00 PM | Fri | **PROMO** | **$179** | Weekend Deal | Ends in ~55 hours |
| Saturday 10:00 AM | Sat | **PROMO** | **$179** | Weekend Deal | Ends in ~38 hours |
| Saturday 9:00 PM | Sat | **PROMO** | **$179** | Weekend Deal | Ends in ~27 hours |
| Sunday 12:00 PM | Sun | **PROMO** | **$179** | Weekend Deal | Ends in ~12 hours |
| Sunday 11:00 PM | Sun | **PROMO** | **$179** | Weekend Deal | Ends in 1 hour |
| Sunday 11:59 PM | Sun | **PROMO** | **$179** | Weekend Deal | Ends in 1 hour |
| Monday 12:00 AM | Mon | Regular | $219 | Regular Price | Starts in ~129 hours |
| Tuesday 3:00 PM | Tue | Regular | $219 | Regular Price | Starts in ~90 hours |

## Pricing Rules (Verified)

### Promo Window
- **Start**: Friday 9:00 AM CT
- **End**: Sunday 11:59 PM CT
- **Price**: $179 (save $40)

### Regular Window
- **Start**: Monday 12:00 AM CT
- **End**: Friday 8:59 AM CT
- **Price**: $219

### Countdown Rules
✅ Hours only (no minutes displayed)
✅ Always round UP (Math.ceil)
✅ Minimum 1 hour shown
✅ Updates every 60 seconds

## Display Text (Exact Strings)

### When Promo is Active
- Badge: "Weekend Deal"
- Price: "$179"
- Strikethrough: "$219"
- Deadline: "Deal ends Sunday at 11:59 PM CT"
- Countdown: "Ends in X hours"

### When Promo is Inactive
- Badge: "Regular Price"
- Price: "$219"
- Subtext: "Next Weekend Deal starts Friday at 9:00 AM CT"
- Countdown: "Starts in X hours"

## Edge Case Testing

### Friday Before 9:00 AM
- Current: Friday 8:45 AM CT
- Status: Regular ($219)
- Countdown: "Starts in 1 hour" (ceil(0.25) = 1)

### Sunday Night
- Current: Sunday 11:30 PM CT
- Status: Promo ($179)
- Countdown: "Ends in 1 hour" (ceil(0.5) = 1)

### Monday Morning
- Current: Monday 12:01 AM CT
- Status: Regular ($219)
- Next promo: Friday 9:00 AM (4 days, 8 hours, 59 minutes = ceil(104.98) = 105 hours)

## Timezone Handling

- **Primary Timezone**: America/Chicago (Central Time)
- **Library**: date-fns-tz v3.x
- **Functions Used**:
  - `toZonedTime(date, tz)` - Convert UTC to Chicago time
  - `fromZonedTime(date, tz)` - Convert Chicago time to UTC
  - `format(date, formatString, { timeZone })` - Format with timezone

## Implementation Notes

### Client-Side Hydration
- Initial render shows loading skeleton
- Prevents SSR/CSR mismatch
- Updates every 60 seconds via setInterval

### SSR Safety
- No server-side pricing calculation (would cause hydration issues)
- Client-only computation ensures consistent user experience
- Loading state prevents flash of incorrect content

## Manual Verification Steps

1. **Visit**: https://colorcocktailfactory.com/pottery-membership
2. **Check Date/Time**: Confirm current Central Time
3. **Verify Badge**: Should show "Weekend Deal" (Fri 9AM - Sun 11:59PM) or "Regular Price"
4. **Verify Price**: $179 during weekend, $219 otherwise
5. **Check Countdown**: Hours only, minimum 1 hour, updates every minute
6. **Wait 60 seconds**: Confirm countdown decrements by 1 hour
7. **Test Friday 9:00 AM**: Price should switch from $219 to $179 exactly at 9:00 AM CT
8. **Test Monday 12:00 AM**: Price should switch from $179 to $219 exactly at midnight CT

## Files Implemented

1. **lib/pricingWindow.ts** - Core pricing logic with timezone handling
2. **components/PricingDisplay.tsx** - React component with countdown
3. **app/pottery-membership/page.tsx** - Full landing page

## Dependencies Added

```bash
npm install date-fns date-fns-tz
```

- **date-fns**: ^4.1.0 (date manipulation)
- **date-fns-tz**: ^3.2.0 (timezone conversion)
