# Customer behavior in Simple Analytics

Added October 31, 2026. These are aggregate events, recorded only after analytics
consent on the production website. Open Events Explorer and add the metadata
columns listed below; group by class, city, button, or destination to compare counts.

| Question | Event | Useful columns |
| --- | --- | --- |
| Which cards get seen? | `class_card_view` | `class_name`, `city`, `card_position` |
| Which cards get clicked? | `class_card_click` | `class_name`, `city`, `click_target`, `card_position` |
| Which buttons and menus get used? | `button_click` | `button_name`, `page_path`, `placement`, `action` |
| Which links get clicked? | `link_click` | `button_name`, `page_path`, `destination_page`, `destination_host` |
| Where do people go immediately after the homepage? | `homepage_next_page` | `previous_page`, `destination_page` |
| How do visitors move between pages? | `page_transition` | `previous_page`, `destination_page`, `entry_page`, `after_homepage` |
| Which workshops lead toward booking? | `booking_start` | `class_name`, `city`, `booking_provider`, `appointment_type_id` |
| Which filters, cities, and extra cards are used? | `homepage_filter_selected`, `city_selected`, `homepage_show_more` | `class_category`, `city`, `selection_source`, `new_visible_count` |
| How far down do visitors read? | `scroll_depth` | `page_path`, `scroll_depth` (25, 50, 75, 90) |
| How long is a page visible? | `page_engagement` | `page_path`, `engaged_seconds` (15, 30, 60) |
| Do visitors reach the private-party section/footer? | `section_view` | `page_path`, `section_name` |
| Do forms get started, fail browser validation, or get submitted? | `form_start`, `form_error`, `form_submit_attempt` | `form_name`, `page_path` |
| Which forms report success? | `inquiry_success`, `newsletter_signup` | `form_name`, `placement`, `city` |
| Is studio help useful? | `studio_help_open`, `studio_help_class_click` | `page_path`, `class_name` |

Page views also include entry/previous-page context. Home includes `/`, `/chicago`,
and `/eugene`. Paths are remembered in memory within the current page lifecycle;
same-site referrers recover the immediately previous page after a full navigation.
This does not identify a customer or reconstruct journeys across tabs, devices,
or a later visit. No new persistent visitor identifier or session cookie is added.

Card impressions require at least 25% visibility and count once per card/city
per component lifetime (reset when consent is withdrawn). Compare clicks per
impression alongside raw clicks: lower cards naturally have fewer chances to be
seen. Repeated clicks are intentional interactions, so this ratio is not a unique
visitor conversion percentage. A card click can also create a general link event;
compare each event separately rather than adding the two totals together.

`booking_start` means a handoff toward the booking provider, not a paid booking.
Browsing a class detail page is a card/link click. Payment and interactions inside
external Acuity/Eventbrite/RezClick pages or cross-origin frames are outside this
tracker. Form submit attempts are not success; inquiry success reflects the site's
existing success signal, not a confirmed reservation or verified non-spam lead.

Form values, chat text, emails, phone numbers, URL queries/fragments, and private
routes are excluded from the new event metadata. No screenshots, session replay,
or keystrokes are collected. Rejected consent, DNT/GPC, and preview domains prevent
collection; revocation drops pending events and stops engagement/scroll tracking.
Background vendor time/scroll pings remain disabled; consent-aware milestones
provide the engagement measurements instead. Ad blockers can still prevent data.

Checks: `node --import tsx tests/simple-analytics.ts`, `npm run test:analytics`,
then `npm run build` and `node tests/simple-analytics-browser.cjs`.
The browser test intercepts all analytics requests and submits no real forms.
Set `CHROMIUM_PATH` for a custom browser executable; `SA_SCRIPT_FILE` can point to
the official Simple Analytics script to test its actual payloads without sending
test traffic. No historical behavior is reconstructed.
