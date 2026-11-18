# glid.cash

Marketing site for Glid, an open-source, self-custody Bitcoin wallet for iPhone (in development, TestFlight first). A single landing page (`/`) plus legal pages (`/privacy`, `/terms`), prerendered as a static site.

Keep this file current. When a convention changes, a new pattern is introduced, or something non-obvious is learned, update the relevant section here in the same change.

## Git

- Work only on `main`. Never create branches or check out other branches unless explicitly asked; commit straight to `main`. This overrides any default of branching before committing.
- Commit or push only when asked.

## Stack

- Nuxt 3 (Vue 3, `<script setup>`), statically generated: `npm run generate` → `.output/public`.
- SCSS (sass), no CSS framework. Do not add Tailwind or a UI library.
- GSAP + ScrollTrigger for scroll effects, Lenis for smooth scrolling, Splitting for word splits.
- Three.js for the 3D phone in the banner, on all screen sizes (loaded client-side only).
- Node: the Nuxt CLI needs Node ≥ 20.12. The default `/usr/local/bin/node` (20.10) fails; use nvm's v24: `PATH=~/.nvm/versions/node/v24.19.0/bin:$PATH npm run generate`.
- Tests: `node --test tests/*.test.mjs` (currently just the text-scramble animator).

## Layout of the codebase

- `pages/index.vue`: the homepage: `HomeBanner3D`, `HomeIntro`, `Design`, `HomeContact`. Calls `$initHomeAnimations(root)` on mount and its cleanup on unmount.
- `components/SiteHeader.vue`: the fixed bottom nav (glass pill: logo + About / Design / Contact links to the homepage sections, as `#id` on the homepage and `/#id` elsewhere). Used on every page. The logo scrolls to the top when already on the homepage. The TestFlight CTA pill is commented out until the invite is ready (restore it, its URL, and `1fr auto` on the mobile grid).
- `components/HomeContact.vue`: "03 / Contact": "Glid is Coming Soon.", why we're making Glid, a coming-soon paragraph and a "Get in touch" mailto link, on the same layout as `HomeIntro`. Last section on the page, so the Design section fully scrolls out.
- `components/PlusGrid.vue`: the two fixed `+` marks, mounted once in `app.vue`.
- `components/Design.vue`: the "02 / Design" slideshow. The section is `(1 + (slides − 1) × perSlide + 2 × hold) × 100svh` tall with a sticky 100svh inner. Images use a wipe: each incoming slide's frame rises while its content is counter-translated so it stays still (transforms only, no repaint). Text slides cross-fade, and a progress bar (current slide number, fill, total) sits at the card bottom. On desktop the sticky panel scales up (`enterScale` → 1) as the section enters, and reverses on the way out (scales to `leaveScale` and fades from `leaveStart`). No snapping, and reversing is automatic. Where supported, it all runs as CSS animations on a view timeline of the section, with each element's range computed in the script from the `settings` object at the top. JS tracks the slide position from scroll: it drives video playback outside WebKit, and in browsers without scroll timelines it writes `--s` for CSS to derive the same motion from. Screens are `public/img/design/N.jpg` with `.avif` versions (`avifenc -q 80`); a slide with `video: true` plays `N.mp4` (muted, looping, inline) with `N.jpg` as its poster. Playback: each video plays at 60% uncovered and pauses at 40% (one at a time), and pauses while the section is off screen; visibility is `1 − |position − i|`, as IntersectionObserver can't see slides covering each other. Chrome etc.: each video loads once the section is within a screen of the viewport and the previous slide shows, holds on its first frame via a tiny seek, and restarts from 0:00 on each play. WebKit (desktop Safari and every iOS browser): that version made Safari take 10–20s to start each video, while plain autoplay was smooth, so WebKit videos start as plain autoplay (preload auto at mount), are paused on first play unless showing (holding their opening frame without a seek), and are then only played/paused: no seeks or reloads. `settings.safariRestart` (experimental) rewinds them only while fully covered. Reduced motion: posters only. Videos are used as provided: don't re-encode or compress them, and don't extract posters from them. The one allowed change is a lossless faststart remux (moves the index to the front so playback can start before the whole file downloads; video stream copied bit for bit): `ffmpeg -i in.mp4 -map 0 -c copy -movflags +faststart N.mp4`. The current 10-bit H.264 ("High 10") exports play smoothly in Safari and Chrome with plain autoplay; 8-bit H.264 or HEVC is the safer choice for broad hardware decoding.
- `components/Features.vue`: the earlier stacked-cards features section, kept for reuse but not on the page.
- `components/HomeBanner3D.vue`: the banner, with the WebGL phone. Tunables are in `phoneSettings`; `showLightingControls` opens a dev-only lighting panel (`PhoneLightingControls`, lazy-loaded). The "Coming soon" badge follows the `<h1>` in the DOM (kept out of the heading) and is placed with CSS: centred above on mobile, anchored above "yours" on desktop via anchor positioning (centred fallback).
- `components/HomeBanner.vue`: static-image version of the banner, not on the page; the fallback if the 3D phone ever needs dropping on mobile.
- `components/SiteFooter.vue`: footer (copyright left; Privacy and Terms right); its bottom padding clears the fixed nav.
- `components/HomeIntro.vue`: section.
- `assets/content/home.js`: `features` copy, and `design` (its own copy, written to match each slide's screen recording, plus alt text and gradient colours; only the first paragraph shows on mobile, so it carries the main point). Long-form product copy lives in `assets/glid-overview.md` (git-ignored, local only).
- `plugins/home-animations.client.js`: all scroll effects, driven by attributes:
  - `data-splitting`: split into `.word` spans (Splitting inserts `.whitespace` spans between words).
  - `effect__textFade`: words fade in on scroll (container).
  - `effect__titleRandom`: words appear in random order.
  - `effect__fadeOut2` (`HomeBanner3D`) / `effect__fadeOut` (`HomeBanner`): banner tagline fades out on scroll. CSS scroll timeline in `effects.scss` where supported, GSAP otherwise.
  - `.hover_effect` with an inner `<span>`: text-scramble hover (desktop only).
  GSAP sets inline `opacity` on `.word`, so don't style word opacity with CSS; use colour alpha if needed.
- `plugins/lenis.client.ts`: Lenis instance as `useNuxtApp().$lenis`, anchors enabled.
- `assets/scss/`: global styles, loaded via `main.scss`:
  - `_variables.scss`: breakpoints `$break-s: 600px`, `$break-l: 1300px`. Import in components with `@use '~/assets/scss/variables' as *;`.
  - `typography.scss`: all type tokens and text classes (`.text-title`, `.text-large`, `.text-lead`, `.monospace`, …).
  - `layout.scss`: `.layout` grid (`__third` 33% / `__second` 66%, 3vw gutters), `.section` (+ `__grey`), `.block`, `.opacity__50`. Remove classes when the last use goes.
  - `main.scss`: root tokens: colours (`--bgcolor`, `--grey`, `--primarycolor`, `--card`), `--radius` (small, e.g. nav pills), `--radius-l` (large cards), `--edge`.

## Code style

- Indent with tabs, displayed 4 wide (see `.editorconfig`). JSON, Markdown and YAML use 2 spaces.
- Vue SFC order: `<script setup>`, `<template>`, `<style lang="scss">` (scoped unless it must style global/JS-created nodes; reach JS-created nodes with `:deep()`).
- SCSS is nested BEM: one root block per component, children as `&__element`, modifiers as `&--modifier`, media queries nested inside the rule they change. No flat duplicate selectors.
- Reuse tokens and classes from `typography.scss` / `main.scss` before adding values. If a new size or colour repeats, add a token there.
- Keep comments short and about why, not what.
- Plain JS in most files; TypeScript where it's already used (`HomeBanner3D.vue`, `lenis.client.ts`, `nuxt.config.ts`).

## Design and layout rules

- Source of truth is Figma (file `cX7v0sspmGeBfdZBWzwI0I`, desktop frame 1665px wide). Convert px to vw on desktop: `px / 1665 * 100`. Note the Figma px value in a comment where it helps.
- Desktop: size and position with `vw` / `svh` (not px). Small px floors via `max()` are fine for legibility, e.g. `max(13px, .935vw)`.
- Mobile (`max-width: $break-s`): px is fine; the Figma mobile frame is 402 × 874.
- Full-screen sticky sections must keep content clear of the fixed bottom nav on mobile (50px bar + `--edge` + safe area).
- Prefer optimised image formats: ship `.avif` with a `<picture>` fallback to the original.
- Shared outer inset `--edge` (1.875vw desktop, 10px mobile) is used by the nav and plus marks; keep fixed UI aligned to it.
- When the design has small inconsistencies (near-identical font sizes, offsets), unify them onto one token rather than copying each value.
- Fonts: `--font-sans` (Helvetica stack) and `--font-mono` (Geist Mono, self-hosted). Figma sometimes says Helvetica Neue; use the project stack.

## Scroll animations and iOS Safari

- iOS Safari resizes the viewport as its toolbar shows and hides. JS scroll handlers (scroll events, `scrollY`, ScrollTrigger) can lag behind the real scroll during that resize, so scroll-linked motion jitters. Avoiding `vh` alone doesn't fix it.
- Build scroll-linked motion as CSS scroll-driven animations (`animation-timeline: scroll()` / `view()`, `animation-range`), with the JS version as the fallback behind `CSS.supports(...)`. Supported from Safari 26 and Chrome 115; done this way so far for `Design.vue` and the banner tagline fades (`effects.scss`, with GSAP fallback in `home-animations.client.js`).
- Use `svh` (or `lvh` for something that must cover the screen) for sizes; never `dvh`, `innerHeight` or `visualViewport.height` in scroll maths.
- WebGL (`HomeBanner3D`) can't use CSS timelines. Measure fixed elements relative to each other (e.g. the phone frame against the canvas), not against the viewport. The phone's scroll pose eases towards the scroll position (`phoneSettings.scroll.smoothing`, a time constant in seconds), which absorbs the uneven updates; if that's not enough, fall back to `HomeBanner` (static image) on mobile.

## Verifying locally

- Headless Chrome screenshots (`--screenshot` with `--virtual-time-budget`, page in an iframe for widths under 500px) are good for layout and for CSS scroll-timeline states after `scrollTo`.
- They can't verify JS scroll behaviour: no scroll events fire, and with `--dump-dom` no frames run (`requestAnimationFrame`, IntersectionObserver). Check scroll-driven JS and video playback in a real browser.

## SEO and accessibility

- One `<h1>` per page (homepage: the banner tagline). Section titles are `<h2>`, sub-items `<h3>`. Choose the tag for document structure and the class (`.text-title`, `.text-lead`) for looks.
- Sections use `aria-labelledby` pointing at their heading. Navigation goes in `<nav aria-label>`.
- Images need real `width`/`height` and meaningful `alt` (empty `alt` plus `aria-hidden` for decoration).
- Respect `prefers-reduced-motion` in any new animation.
- Site-wide meta, Open Graph and JSON-LD live in `nuxt.config.ts`; add new routes to `nitro.prerender.routes`.

## Writing (site copy)

- British English (colours, organise), plain language, no crypto jargon or hype.
- Lowercase "bitcoin" for the currency, "Bitcoin" for the network/protocol, as in the existing copy.
- Short, calm sentences. Matches the tone in `assets/glid-overview.md`.
- Short headings (slide and section titles) use Title Case, e.g. "Make it Yours", "Payments Made Simple", "Glid is Coming Soon.". Full-sentence headlines (banner, intro) stay in sentence case.

## Pending

- `SiteHeader.vue`: TestFlight CTA hidden (commented out) until the invite is ready.
