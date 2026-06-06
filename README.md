# FlashLocal

Mobile-first prototype for a local last-minute deals marketplace.

FlashLocal lets consumers discover nearby time-sensitive offers and gives merchants a WhatsApp-style assistant for publishing deals quickly.

## What is built

- Mobile-first consumer deal feed
- Category filters and sorting
- List view and map view
- Deal cards with expiry, distance, discount, share, directions, and redeem actions
- English and Italian UI toggle
- Merchant WhatsApp-style assistant simulator
- Structured deal preview before publishing
- Publish flow that adds a new merchant deal to the live feed
- Merchant onboarding status strip

## AI layer

The production AI flow should use the Voska AI API as the structured extraction layer for merchant WhatsApp messages.

Expected Voska responsibilities:

- Parse natural-language deal creation and update messages
- Normalize discount, price, category, start time, end time, quantity, location, redemption method, and exclusions
- Ask concise follow-up questions only when required fields are missing
- Return a validated deal object before publishing
- Support English and Italian merchant messages at launch
- Flag risky, misleading, or ambiguous offers for manual admin review

## Run locally

```bash
python3 -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173
```

## Files

- `index.html` - app shell and interface
- `styles.css` - responsive mobile-first styling
- `app.js` - deal data, filtering, map/list modes, localization, and merchant assistant simulator
- `flashlocal-mobile.png` - mobile screenshot
- `flashlocal-map.png` - map screenshot

## Notes

This is a static prototype. The production version should add a backend, PostGIS deal indexing, WhatsApp Business API integration, Voska AI API extraction, merchant verification, moderation, and persistent analytics.
