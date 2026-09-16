# Ask CCF — staff guide

Ask CCF is the AI assistant behind the **Ask CCF** button in the bottom-left corner of the
public site. It answers questions about classes, policies, pottery pickup and private
parties, and it can only state facts that come from the live booking system, the curated
knowledge base in this repo, or the staff-maintained pickup tracker.

It is **not** connected to anyone's personal ChatGPT account or chat history, and it has no
access to private staff documents. Everything it knows is in the files listed below.

---

## 1. Updating what the assistant knows

All studio information lives in one file: **`lib/askccf/knowledge.ts`**.

Each entry looks like this:

```ts
{
  id: "byob",
  title: "BYOB rules",
  topics: ["byob", "alcohol", "wine", "beer", "drinks", "21"],
  cities: ["all"],                        // or ["chicago"], ["eugene"], ["online"]
  content: "CCF is BYOB-friendly for most classes …",
  source: "https://colorcocktailfactory.com/birthday-parties",
  verifiedOn: "2026-09-12",
  conflict: undefined,                     // see below
}
```

To change an answer:

1. Edit `content` so it says what the website and studio policy actually say.
2. Update `source` (where you confirmed it) and `verifiedOn` (today's date, `YYYY-MM-DD`).
3. Add words customers might use to `topics` — that is how the assistant finds the entry.
4. Bump `KNOWLEDGE_VERSION` at the top of the file so it is obvious when knowledge last moved.
5. Deploy. Nothing else needs to change.

### Flagging conflicts instead of guessing

When the site says two different things (for example, one page promises a 7-day refund and a
class listing says no refunds), set `conflict` to a short explanation. The assistant then
refuses to state a single number: it explains that the detail varies, gives the range if
there is one, and points the customer at `support@colorcocktailfactory.com`.

Entries currently carrying a conflict flag:

| Entry | What disagrees |
| --- | --- |
| `hours` | Only the homepage publishes hours; individual listings vary. |
| `booking-how` | The Chicago header still links to RezClick while listings book through Acuity. |
| `ages` | Only the private-events page states a minimum age. |
| `pickup-general` | Pickup timelines are given as 2–3 weeks, 3 weeks, 30 days and "a few days" on different pages. |
| `cancellation` | 7-day, 48-hour and "no refunds or rescheduling" wording all appear on the site. |
| `private-events` | Per-person pricing appears as both $45–85 and $55–85. |

Clearing a conflict is a content decision: fix the wording on the website first, then remove
the flag here.

---

## 2. Classes, prices and dates

The assistant never stores class data. Every recommendation is fetched live from Acuity
Scheduling using the same `ACUITY_USER_ID` / `ACUITY_API_KEY` credentials the rest of the site
uses (`lib/askccf/catalog.ts`), so a change you make in Acuity is live within five minutes.

Things worth knowing:

- **Ticket coverage.** The assistant only says "one ticket covers two people" when the listing
  itself says so, and it quotes the sentence it relied on. If a listing is silent, customers
  are told the price is per ticket and that checkout confirms the total. If you want a class
  described as per-couple, put it in the description ("one ticket per couple", "two seats per
  ticket", "one ticket is good for two people").
- **Seats and dates** come from Acuity's live class availability, including real remaining
  seat counts. Classes with nothing on the schedule in the next 60 days are not recommended,
  so retired seasonal listings can stay active in Acuity without resurfacing.
- **One-off private bookings** (for example "Moira's Birthday Private Event") are hidden
  automatically: any title that names a private event, or that names no craft at all, is
  filtered out. To hide anything else, add its Acuity appointment-type ID to the
  `CCF_AI_HIDDEN_CLASS_IDS` environment variable as a comma-separated list.
- **Booking and payment always finish in the normal Acuity checkout.** The assistant links; it
  never takes payment, holds seats or confirms a booking.

---

## 3. Pottery pickup tracker

Pickup answers come from the `ask_ccf_pickup_orders` table in Netlify Database. A customer
must give **both** the email used to book **and** the last name on the booking before anything
is revealed, and only pickup-relevant fields are returned.

Rows look like this:

| Column | Meaning |
| --- | --- |
| `customer_email` | Email used for the booking (matching is case-insensitive). |
| `customer_last_name` | Last name on the booking. |
| `order_ref` | Optional internal reference. |
| `class_name` | Which class the pieces came from. |
| `city` | `Chicago` or `Eugene`. |
| `class_date` | Date of the class. |
| `status` | `in_studio`, `firing`, `glazing`, `ready`, `picked_up` — only `ready` lets the assistant say a piece is ready. |
| `ready_on` | Date the pieces became (or will be) ready, if known. |
| `piece_count` | Number of pieces. |
| `note` | Anything the customer should know at pickup. |

With no matching row, the assistant says it has no verified record, gives the general timeline
**clearly labelled as an estimate**, states that elapsed time alone cannot confirm a specific
piece is ready, and offers the staff route. That behaviour is deliberate — please do not work
around it by telling customers the assistant can confirm readiness.

You can add rows with any Postgres client (`netlify db` in the CLI, or the Netlify UI's
database tab).

---

## 4. Private-party inquiries

When a customer gives name, email, city, preferred date, group size and activity, the
assistant builds a summary card. **Nothing is sent until the customer presses Send.**

On Send, the inquiry is:

1. saved to `ask_ccf_inquiries` (durable, with a dedupe key so a double-tap cannot create two
   leads), then
2. posted to the existing **`private-party`** Netlify form — so the staff notifications you
   already have configured fire exactly as they do for the website form.

Inquiries therefore appear in the same place as every other private-party lead, under
**Project configuration → Forms → private-party**, with a `details` line noting that they came
from the assistant (phone and free-text notes are folded into `details`, because the
registered form has no phone field).

If the notification hand-off fails, the customer is told plainly that it did not go through
and is asked to email the studio. The assistant never confirms receipt it cannot verify.

---

## 5. Environment variables and usage controls

Nothing here is required for the assistant to work — every value has a sensible default. All
of these are set under **Project configuration → Environment variables**.

| Variable | Default | What it does |
| --- | --- | --- |
| `CCF_AI_ENABLED` | `true` | Set to `false` to switch the assistant off; the widget then shows an unavailable message with the studio email. |
| `CCF_AI_MODEL` | `gpt-5.4-mini` | Which OpenAI model to use. Must support tool calling. |
| `CCF_AI_MAX_TOKENS` | `900` | Maximum reply length. |
| `CCF_AI_TIMEOUT_MS` | `25000` | Timeout for a single model call. |
| `CCF_AI_TURN_BUDGET_MS` | `50000` | Total budget for one customer message, including data lookups. |
| `CCF_AI_MAX_TOOL_ROUNDS` | `4` | How many lookup rounds one message may trigger. |
| `CCF_AI_HISTORY_TURNS` | `12` | How much conversation history is sent back to the model. |
| `CCF_AI_MAX_MESSAGE_CHARS` | `1500` | Longest accepted customer message. |
| `CCF_AI_RATE_PER_IP_HOUR` | `40` | Messages per visitor IP per hour. |
| `CCF_AI_RATE_PER_SESSION_HOUR` | `30` | Messages per browser session per hour. |
| `CCF_AI_PICKUP_LOOKUPS_PER_HOUR` | `6` | Pickup lookups per session per hour. |
| `CCF_AI_INQUIRIES_PER_SESSION_DAY` | `3` | Private-party inquiries per session per day. |
| `CCF_AI_DAILY_REQUEST_CAP` | `3000` | Hard daily ceiling on assistant requests site-wide. |
| `CCF_AI_HIDDEN_CLASS_IDS` | — | Comma-separated Acuity appointment-type IDs to hide from recommendations. |
| `CCF_AI_HASH_SALT` | — | Optional salt for the one-way hashes used in rate-limit keys. Set it once; changing it just resets counters. |
| `CCF_AI_BASE_URL` | — | Escape hatch to point at a different OpenAI-compatible endpoint. |

### Where the AI usage is billed

The assistant talks to OpenAI through **Netlify AI Gateway**, using the gateway credentials
Netlify injects at runtime (`NETLIFY_AI_GATEWAY_KEY` / `NETLIFY_AI_GATEWAY_BASE_URL`). No
OpenAI account or API key of your own is involved, and none is stored in the repo.

Usage is billed to the project's Netlify team as AI credits. You can see it under
**Team settings → Billing → Usage**. Per-day, per-model request and token totals are also
recorded in the `ask_ccf_usage` table, which is the quickest way to see what the assistant
itself is spending:

```sql
select day, model, requests, prompt_tokens, completion_tokens, errors
from ask_ccf_usage order by day desc limit 14;
```

If the studio ever prefers to bill OpenAI directly, set `OPENAI_API_KEY` (and optionally
`OPENAI_BASE_URL`); the assistant prefers a direct key when one exists and otherwise uses the
gateway. No code change is needed either way.

---

## 6. What the assistant will not do

By design, and verified by tests:

- It will not invent schedules, prices, discounts, seat counts or urgency.
- It will not approve, deny or promise refunds, credits, cancellations, reschedules or policy
  exceptions — those go to `support@colorcocktailfactory.com` or the normal booking workflow.
- It will not reveal a pickup record without both the booking email and the last name.
- It will not treat instructions inside a customer message (or inside data it looks up) as
  rules it has to follow.
- It will not confirm a private-party inquiry that did not actually submit.
- It does not send names, emails or conversation text to Google Analytics — only event counts
  (`ask_ccf_open`, `ask_ccf_recommendation_click`, `begin_checkout`, `ask_ccf_inquiry_submit`).

## 7. Where the code lives

| File | Purpose |
| --- | --- |
| `components/askccf/AskCCFWidget.tsx` | The chat button, panel, suggestions and session handling. |
| `components/askccf/ClassCards.tsx` | Booking cards (live images, prices and links only). |
| `components/askccf/InquiryCard.tsx` | Private-party summary with the explicit Send button. |
| `app/api/ask-ccf/chat/route.ts` | Server-side chat endpoint: validation, limits, timeouts, tool loop. |
| `app/api/ask-ccf/inquiry/route.ts` | Inquiry submission: save, notify, confirm only on success. |
| `lib/askccf/prompt.ts` | The assistant's operating rules and tone. |
| `lib/askccf/tools.ts` | The lookups the assistant is allowed to perform. |
| `lib/askccf/catalog.ts` | Live Acuity catalog, pricing units, availability. |
| `lib/askccf/knowledge.ts` | The studio knowledge base (edit this). |
| `lib/askccf/store.ts` | Durable inquiries, pickup tracker, rate limits, usage. |
| `lib/askccf/config.ts` | Environment-driven configuration. |
| `db/schema.ts`, `netlify/database/migrations/` | Database tables and migrations. |
| `tests/selftest.ts` | `npm test` — includes the assistant's guardrail checks. |
