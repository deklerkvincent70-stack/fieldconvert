# ConcreteMix Pro

Production-ready offline-first concrete calculator for contractors, builders, owner-builders and onsite crews. The app opens directly to the calculator, stores all data locally, installs as a PWA, and keeps working after installation without a backend, login, cloud sync or live currency service.

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

- Mobile-first React + Next.js PWA with install metadata and offline service worker.
- Concrete volume calculator for slab, circle, column, beam, stair and custom volume.
- Purpose-based MPa, PSI, mix ratio and cement type recommendations.
- Built-in strength database from 5 MPa to 30 MPa+ design mix guidance.
- Cement, sand, aggregate, water, bags, mixer loads and wheelbarrow estimates.
- Offline cost calculator with local currency symbol and saved prices.
- Settings for dark/light mode, units, bag size, wastage, dry factor, water-cement ratio, densities and site capacities.
- Local-only persistence through browser storage for settings, costs and saved estimates.
- Printable PDF workflow through the browser print dialog, plus native share where supported.

## Sample Calculation

Default slab example:

- Shape: rectangle slab
- Dimensions: 4 m x 3 m x 0.1 m
- Wet volume: 1.2 m³ / 1,200 liters / 42.38 ft³
- Purpose: domestic slab
- Recommended strength: 20 MPa / 2,900 PSI
- Ratio: 1 : 1.5 : 3
- Dry volume factor: 1.54
- Default wastage: 5%

## Screenshots

- Mobile: `public/screenshots/mobile.svg`
- Desktop: `public/screenshots/desktop.svg`

## Build Targets

### Web PWA

```powershell
npm run build
npm start
```

Deploy the built Next.js app to any static/server Next host. The PWA manifest and `public/sw.js` provide install and offline behavior.

### Android APK and iOS

This codebase is ready for the React + Capacitor route. Add Capacitor when native packaging is needed:

```powershell
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx cap init ConcreteMixPro com.concretemix.pro --web-dir=.next
npm run build
npx cap add android
npx cap add ios
npx cap sync
npx cap open android
npx cap open ios
```

Build the APK from Android Studio. Build iOS from Xcode on macOS with an Apple developer account.

### Windows Desktop

Use the PWA install flow in Microsoft Edge or package the web app with a desktop wrapper such as Electron/Tauri if a standalone `.exe` installer is required.

## Architecture

- UI layer: `components/concrete-mix-pro.tsx`
- Calculation engine: `lib/concrete/engine.ts`
- Unit utilities: `lib/concrete/units.ts`
- Offline persistence: `lib/concrete/storage.ts`
- PDF/print export service: `lib/concrete/pdf.ts`
- Concrete data and defaults: `lib/concrete/data.ts`
