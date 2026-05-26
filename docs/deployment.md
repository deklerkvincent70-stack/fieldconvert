# Deployment

FieldConvert is a standard Next.js application and can deploy to Vercel, Cloudflare Pages or Netlify.

## Vercel

1. Import the repository in Vercel.
2. Set framework preset to `Next.js`.
3. Add environment variables from `.env.example`.
4. Build command: `npm run build`.
5. Output is handled automatically by Vercel.

## Cloudflare Pages

1. Connect the repository in Cloudflare Pages.
2. Build command: `npm run build`.
3. Output directory: `.next`.
4. Add the Cloudflare Next.js adapter if you need full SSR beyond static/exported routes.
5. Add environment variables from `.env.example`.

## Netlify

1. Connect the repository in Netlify.
2. Build command: `npm run build`.
3. Publish directory: `.next`.
4. Install or enable the Netlify Next.js runtime.
5. Add environment variables from `.env.example`.

## Performance Checklist

- Keep conversion data in static modules where possible.
- Lazy-load future heavy AI or charting features.
- Use static generation for conversion pages.
- Use edge caching for static routes and API responses that do not depend on live rates.
- Keep service worker cache small for low-bandwidth markets.
