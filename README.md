# FlashLocal

FlashLocal is a mobile-first local deal feed for last-minute offers.

The product helps small businesses fill slow hours quickly. Merchants publish time-sensitive offers through a WhatsApp-style assistant. Nearby customers open a lightweight mobile site, see live offers around them, and redeem before the deal expires.

Live site: https://flashlocal-six.vercel.app

Repository: https://github.com/prodigalson/flashlocal

## Product Summary

FlashLocal is built around one simple loop:

1. A merchant sends a plain-language deal.
2. The assistant turns the message into a structured deal.
3. The merchant confirms the details.
4. The deal appears in a nearby customer feed.
5. The deal expires automatically.

The MVP intentionally avoids payments, native apps, POS integrations, complex merchant dashboards, and customer accounts. The first version is focused on speed, clarity, and local discovery.

## Core Promise

For customers:

- Find nearby last-minute deals.
- See what is open now.
- Sort by distance, expiry, discount, or recency.
- Get a redemption code.
- Share a deal.
- Open directions.

For merchants:

- Publish a deal through chat.
- Confirm structured details before anything goes live.
- Pause or extend a deal.
- Avoid dashboard complexity.
- Use WhatsApp as the primary workflow.

For operators:

- Moderate merchant access.
- Verify businesses before publication.
- Keep the consumer feed clean.
- Expire old deals automatically.

## Current Prototype

This repository is a static prototype that demonstrates the product experience.

Implemented today:

- Mobile-first homepage
- Nearby deal feed
- Category filters
- List view
- Map view
- Sort controls
- Deal cards with distance, expiry, category, discount, and actions
- WhatsApp share text with URL preview metadata
- English and Italian language toggle
- Merchant workflow page
- WhatsApp-style merchant assistant simulator
- Structured deal preview
- Publish simulation
- Merchant onboarding strip
- Responsive desktop, tablet, and mobile layouts
- Production deployment on Vercel

Not implemented yet:

- Real backend
- Real database
- Real geospatial queries
- Real WhatsApp Business API integration
- Real AI API calls
- Real merchant accounts
- Real admin moderation
- Real analytics
- Persistent published deals

## Live Pages

### `/`

The customer-facing deal feed.

Primary jobs:

- Explain the product quickly.
- Show the current location context.
- Show nearby live deals.
- Let users filter, sort, switch views, redeem, share, and route.

Key UI areas:

- Header with brand, Info link, and language toggle
- Hero copy with primary customer action
- Live status block
- Location band
- Category chips
- List and map segmented control
- Sort dropdown
- Deal feed
- Map pin view

### `/how-it-works.html`

The merchant and product explanation page.

Primary jobs:

- Explain the merchant workflow.
- Show how chat becomes a structured deal.
- Demonstrate confirmation before publishing.
- Explain merchant onboarding at a glance.

Key UI areas:

- Header with Deals link and language toggle
- Four-step workflow
- WhatsApp-style assistant simulator
- Structured preview card
- Publish action
- Merchant onboarding strip

## User Flows

### Customer Flow

1. Customer opens FlashLocal.
2. Site shows fallback location or uses customer location.
3. Customer filters by category.
4. Customer sorts by nearest, ending soon, biggest discount, or newest.
5. Customer chooses list or map view.
6. Customer taps a deal.
7. Customer gets a code, shares it, or opens route directions.

### Merchant Flow

1. Merchant sends a deal in plain language.
2. Assistant extracts structured fields.
3. Assistant asks follow-up questions if required fields are missing.
4. Merchant confirms the preview.
5. Deal goes live.
6. Merchant can extend, pause, or update the deal.
7. Deal expires automatically at end time.

### Admin Flow

The production admin flow should include:

1. Merchant profile submission
2. WhatsApp number verification
3. Business verification
4. First deal review
5. Abuse and duplicate checks
6. Approval to publish
7. Ongoing moderation queue

## Button Copy System

Button copy should stay short, direct, and action-oriented.

Current customer-facing labels:

- `See deals`
- `For merchants`
- `Near me`
- `Get code`
- `Share`
- `Route`

Current Italian labels:

- `Vedi offerte`
- `Per esercenti`
- `Vicino a me`
- `Codice`
- `Invia`
- `Vai`

Current merchant workflow labels:

- `Preview`
- `Go live`
- `Pizza deal`
- `Lunch deal`
- `Extend time`
- `Pause deal`

Copy rules:

- Use verbs where the user is taking action.
- Keep labels under 14 characters when possible.
- Avoid generic labels like `Submit`, `Continue`, or `Click here`.
- Avoid backend/vendor terms in user-facing UI.
- Keep AI provider names out of the product interface.
- Prefer customer outcomes over internal implementation language.

## WhatsApp Sharing

Deal sharing is designed around WhatsApp link previews.

When a customer taps `Share`, FlashLocal builds a WhatsApp message with:

- Merchant name
- Localized deal title
- Discount or price
- Time remaining
- A FlashLocal URL with the deal ID in the query string

Example English share text:

```text
Forno Rosso: 10 lunch menus left
€8 menu. Ends in 34 min.
https://flashlocal-six.vercel.app/?deal=1
```

Example Italian share text:

```text
Forno Rosso: 10 menu pranzo rimasti
€8 menu. Scade tra 34 min.
https://flashlocal-six.vercel.app/?deal=1
```

The URL provides the WhatsApp preview card through Open Graph tags:

- `og:title`: `FlashLocal - Live nearby deals`
- `og:description`: `Find last-minute local deals nearby. Open now, ending soon, ready to redeem.`
- `og:image`: `https://flashlocal-six.vercel.app/whatsapp-preview.png`
- `og:image:width`: `1200`
- `og:image:height`: `630`
- `og:url`: `https://flashlocal-six.vercel.app/`

Current limitation:

- This static prototype uses one site-level preview image, `whatsapp-preview.png`, for all deals.
- Production should generate deal-specific share URLs and server-render deal-specific Open Graph metadata.

Production recommendation:

- Route shares through `/deal/:id`.
- Server-render `og:title` as merchant plus deal title.
- Server-render `og:description` as discount, expiry, and neighborhood.
- Use merchant or category imagery where available.
- Fall back to the FlashLocal branded preview image when deal imagery is missing.

## AI Layer

The production AI workflow should use the Voska AI API as the structured extraction layer for merchant WhatsApp messages.

Voska should remain infrastructure. It should not appear as a consumer-facing or merchant-facing brand inside the product UI.

Expected responsibilities:

- Parse natural-language merchant messages.
- Extract title, category, discount, price, quantity, start time, end time, location, redemption method, and terms.
- Normalize dates and times.
- Detect missing required fields.
- Ask concise follow-up questions.
- Return a validated deal object.
- Support English and Italian at launch.
- Flag risky, misleading, or ambiguous offers for admin review.
- Classify update intents such as pause, extend, edit price, change quantity, or cancel.

Example merchant message:

```text
Add 30% off pizza from 6pm to 8pm today
```

Example structured output:

```json
{
  "title": "30% off pizza",
  "category": "food",
  "discount": {
    "type": "percent",
    "value": 30
  },
  "valid_from": "2026-06-06T18:00:00+02:00",
  "valid_until": "2026-06-06T20:00:00+02:00",
  "quantity": null,
  "redemption": "Show code FLASH30",
  "terms": "Merchant confirms before publishing",
  "requires_admin_review": false
}
```

## Production Architecture

Recommended production stack:

- Frontend: Next.js or equivalent React framework
- Hosting: Vercel
- Database: Postgres with PostGIS
- Messaging: WhatsApp Business API
- AI extraction: Voska AI API
- Maps: Google Maps, Mapbox, or OpenStreetMap
- Admin: lightweight web dashboard
- Observability: structured logs, error tracking, and deal lifecycle metrics

Suggested services:

```text
Customer web app
  -> Deal API
  -> Postgres/PostGIS
  -> Redemption service

Merchant WhatsApp webhook
  -> Message parser
  -> Voska AI API
  -> Deal validator
  -> Confirmation flow
  -> Deal API

Admin dashboard
  -> Merchant verification
  -> Deal moderation
  -> Abuse review
```

## Data Model

### Merchant

Recommended fields:

- `id`
- `business_name`
- `category`
- `phone_number`
- `whatsapp_id`
- `address`
- `latitude`
- `longitude`
- `verification_status`
- `created_at`
- `updated_at`

### Deal

Recommended fields:

- `id`
- `merchant_id`
- `title`
- `description`
- `category`
- `discount_type`
- `discount_value`
- `display_price`
- `quantity_limit`
- `quantity_remaining`
- `starts_at`
- `expires_at`
- `redemption_code`
- `redemption_instructions`
- `terms`
- `status`
- `latitude`
- `longitude`
- `created_at`
- `updated_at`

### Redemption

Recommended fields:

- `id`
- `deal_id`
- `code`
- `created_at`
- `redeemed_at`
- `user_agent_hash`
- `approx_location`

### Moderation Event

Recommended fields:

- `id`
- `deal_id`
- `merchant_id`
- `event_type`
- `reason`
- `reviewer_id`
- `created_at`

## Deal Lifecycle

Recommended deal statuses:

- `draft`
- `needs_details`
- `pending_confirmation`
- `pending_admin_review`
- `live`
- `paused`
- `expired`
- `rejected`

State rules:

- Draft deals never appear in the consumer feed.
- Pending confirmation deals wait for merchant approval.
- Pending admin review deals wait for operator approval.
- Live deals appear only between `starts_at` and `expires_at`.
- Paused deals disappear immediately.
- Expired deals disappear automatically.
- Rejected deals remain in admin history but never go live.

## Validation Rules

Required fields before publishing:

- Merchant ID
- Title
- Category
- Discount or offer value
- Valid start time
- Valid end time
- Location
- Redemption method

Recommended validation:

- End time must be after start time.
- End time should be within a short window, usually under 24 hours.
- Category must map to an approved taxonomy.
- Location must match a verified merchant location.
- Redemption code must be unique per active deal.
- Deal copy must not imply false scarcity unless quantity is known.
- Alcohol-centered content should be category controlled and age-aware if added later.

## Localization

Current prototype supports:

- English
- Italian

Production localization should cover:

- All button labels
- Deal categories
- Sort labels
- Error states
- Empty states
- Confirmation messages
- Merchant assistant prompts
- Structured preview fields
- Redemption copy

Known style choice:

- The app currently avoids accented Italian characters in source text to keep files ASCII-only.
- Production can switch to full Italian typography once localization files are separated and encoded intentionally.

## Accessibility

Current accessibility work:

- Semantic buttons and links
- Labels for major sections
- `aria-live` chat window
- Alt text on deal images
- 44px minimum touch targets after QA
- Focus-visible styles

Production accessibility checklist:

- Verify contrast on all states.
- Add skip link.
- Ensure map pins have clear accessible labels.
- Avoid color-only status cues.
- Test with keyboard only.
- Test with VoiceOver and TalkBack.

## QA Status

Recent gstack QA checks covered:

- Homepage load
- How It Works load
- Browser console health
- Mobile, tablet, and desktop screenshots
- Language toggle
- Category filters
- Sort order
- List and map view toggle
- Map pins
- Redeem action
- Share action
- Directions action
- Merchant chat empty submit
- Merchant chat custom message
- Merchant quick actions
- Publish confirmation
- Touch target audit

Latest fixed QA issues:

- Italian merchant workflow leaked English values in structured preview.
- Share and Directions did not visibly navigate in the QA browser.

Current QA result:

- No app console errors found.
- Touch target audit passes.
- Italian merchant preview uses localized values.
- Share opens WhatsApp URL.
- Directions opens Google Maps URL.

## Design Review Status

Recent gstack design review fixes:

- Removed duplicate homepage hero area.
- Tightened How It Works mobile layout.
- Added missing How It Works Italian translations.
- Improved touch targets.
- Added hover, active, and focus states.
- Reworked typography away from generic default styling.

Current design direction:

- Quiet, utility-first, mobile-first.
- Local deal feed first.
- Merchant explanation moved off the homepage.
- No visible AI provider branding in the UI.

## Running Locally

This is a static site. No build step is required.

Run:

```bash
python3 -m http.server 4173
```

Open:

```text
http://127.0.0.1:4173
```

Test the secondary page:

```text
http://127.0.0.1:4173/how-it-works.html
```

## Deployment

The project is linked to Vercel.

Production URL:

```text
https://flashlocal-six.vercel.app
```

Manual production deploy:

```bash
npx --yes vercel --prod --yes
```

GitHub remote:

```text
https://github.com/prodigalson/flashlocal.git
```

## Repository Structure

```text
.
├── README.md
├── app.js
├── how-it-works.html
├── index.html
├── styles.css
├── flashlocal-map.png
├── flashlocal-mobile.png
└── screenshots/
```

### `index.html`

Defines the customer-facing app shell:

- Header
- Homepage copy
- Deal feed controls
- Deal card template
- Map view container

### `how-it-works.html`

Defines the product explanation and merchant simulator:

- Workflow steps
- Chat panel
- Structured preview
- Merchant onboarding strip

### `styles.css`

Defines the responsive visual system:

- Layout
- Typography
- Buttons
- Deal cards
- Map pins
- Merchant console
- Mobile and desktop breakpoints

### `app.js`

Contains prototype application logic:

- Deal seed data
- English and Italian strings
- Filter logic
- Sort logic
- List rendering
- Map rendering
- Redemption alerts
- Share and route actions
- Merchant chat parsing
- Structured preview rendering
- Publish simulation

## Development Notes

This repository is intentionally simple because it is still a product prototype.

Current constraints:

- Deal data lives in `app.js`.
- Published merchant deals are not persisted after refresh.
- The map is a visual prototype, not a real map SDK.
- The merchant assistant is simulated in the browser.
- Share and route actions navigate the current tab for mobile reliability.

When converting to production:

1. Move static deal data into Postgres.
2. Replace map prototype with real geospatial map.
3. Replace browser parser with server-side Voska extraction.
4. Add WhatsApp webhook ingestion.
5. Add merchant verification.
6. Add admin moderation.
7. Add expiry jobs.
8. Add analytics.
9. Add automated tests.

## Testing Plan For Production

Minimum automated tests:

- Deal parser accepts valid merchant messages.
- Deal parser asks follow-up questions for missing end time.
- Deal validator rejects expired or invalid deals.
- Deal feed returns only live deals.
- Deal feed sorts by distance.
- Deal feed sorts by expiry.
- Category filter returns matching deals.
- Language toggle updates all visible UI strings.
- Redemption code appears for active deal.
- Paused deal disappears from feed.
- Expired deal disappears from feed.
- Admin review blocks risky deals.

Minimum browser QA:

- Load homepage on mobile.
- Load homepage on desktop.
- Toggle English and Italian.
- Filter every category.
- Test empty category state.
- Sort by each option.
- Toggle map and list.
- Get code.
- Share deal.
- Open route.
- Submit merchant message.
- Test missing required merchant details.
- Publish confirmed deal.
- Pause active deal.
- Extend active deal.

## Roadmap

### MVP

- Backend deal API
- Postgres and PostGIS schema
- Real geolocation
- Real map
- WhatsApp webhook
- Voska AI extraction
- Merchant confirmation flow
- Admin approval queue
- Expiry job
- Basic analytics

### V1

- Merchant verification
- Merchant dashboard fallback
- Redemption tracking
- Deal performance summaries
- Abuse detection
- Multi-neighborhood launch
- More robust Italian localization

### Later

- Native app consideration
- Payment or prepaid deal support
- POS integrations
- Loyalty features
- Customer saved preferences
- Merchant subscription billing

## Product Principles

- Keep the customer feed clean.
- Keep merchant work inside WhatsApp.
- Make every deal time-bound.
- Make distance and expiry obvious.
- Confirm before publishing.
- Do not expose infrastructure branding in the UI.
- Avoid dashboards until chat is not enough.
- Favor fast local liquidity over broad marketplace complexity.

## License

Prototype repository. License has not been selected yet.
