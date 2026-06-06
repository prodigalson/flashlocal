# FlashLocal

Mobile-first prototype for a local last-minute deals marketplace.

FlashLocal lets consumers discover nearby time-sensitive offers and gives merchants a WhatsApp-style AI assistant for publishing deals quickly.

## What is built

- Mobile-first consumer deal feed
- Category filters and sorting
- List view and map view
- Deal cards with expiry, distance, discount, share, directions, and redeem actions
- English and Italian UI toggle
- Merchant WhatsApp-style AI assistant simulator
- Structured deal preview before publishing
- Publish flow that adds a new merchant deal to the live feed
- Merchant onboarding status strip

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

This is a static prototype. The production version should add a backend, PostGIS deal indexing, WhatsApp Business API integration, merchant verification, moderation, and persistent analytics.
