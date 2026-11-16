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

## License

The website code is licensed under the [MIT License](LICENSE).
Original images and Glid branding are not covered by the code licence;
all rights to those assets are reserved by their owner. Third-party assets
retain their own licences, as listed below.

## Credits

- The 3D model is based on ["IPhone 15 Pro"](https://sketchfab.com/3d-models/iphone-15-pro-9e045e469d514fea9dda2ccd161f5fa3)
  by [Sketcher](https://sketchfab.com/jnanbr07), licensed under
  [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
  See the [model attribution](public/img/iphone_15/license.txt).
- Geist Mono by Vercel, in collaboration with basement.studio, is licensed
  under the [SIL Open Font License 1.1](assets/fonts/OFL.txt).
