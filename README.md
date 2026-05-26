# FieldConvert

Modern mobile-first unit conversion platform and PWA for engineering, construction, farming, mining, trades, education and African-market field use.

## Run Locally

```powershell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Checks

```powershell
npm run typecheck
npm run build
npm start
```

## What Is Included

- Next.js App Router with static SEO conversion pages
- React + TypeScript + Tailwind CSS
- Shared conversion engine and practical calculator logic
- Natural-language conversion parser for phrase-style input
- PWA manifest, install support and service worker offline cache
- API route at `POST /api/convert`
- Dynamic sitemap and robots routes
- Lightweight admin overview for categories, calculators and SEO inventory
- Deployment docs for Vercel, Cloudflare Pages and Netlify

## Example URLs

- `/convert/cm-to-inch`
- `/convert/hectare-to-acre`
- `/construction/concrete-calculator`
- `/farming/crop-spacing-calculator`
- `/tools/solar-sizing-calculator`
- `/admin`

## Environment

Copy `.env.example` to `.env.local` and set values as needed.

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_ADSENSE_CLIENT_ID=
NEXT_PUBLIC_ANALYTICS_ID=
CURRENCY_API_URL=
CURRENCY_API_KEY=
ADMIN_TOKEN=change-me
```

## API Examples

```bash
curl -X POST http://localhost:3000/api/convert \
  -H "Content-Type: application/json" \
  -d "{\"category\":\"length\",\"from\":\"foot\",\"to\":\"centimeter\",\"value\":6.1667}"
```

```bash
curl -X POST http://localhost:3000/api/convert \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"Convert 6 foot 2 to cm\"}"
```

## Notes

Currency detection is scaffolded for African currencies and can be connected to a live FX provider through `CURRENCY_API_URL` and `CURRENCY_API_KEY`. The admin route is currently a lightweight operational shell; add authentication and persistent storage before exposing editorial controls publicly.
