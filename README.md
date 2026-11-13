# glid.cash

Landing page for Glid, a simple, beautifully designed non-custodial Bitcoin wallet for iOS.

Nuxt 3 · Lenis · @nuxt/fonts (Geist Mono)

```bash
npm install
npm run dev       # http://localhost:3000
npm run generate  # static build in .output/public
```

Lenis is available anywhere as `useNuxtApp().$lenis`.

Google tracking (`GTM-NLQTRHVK`) is included in production builds and disabled in
local development. Set `NUXT_PUBLIC_ENABLE_GTAG=true` or `false` before running
Nuxt to override this (for static hosting, set it before `npm run generate`).
Analytics destinations are configured in Google's tag interface.
