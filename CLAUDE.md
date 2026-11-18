# glid.cash

Marketing site for Glid, an open-source, self-custody Bitcoin wallet for iPhone (in development, TestFlight first). A single landing page (`/`) plus legal pages (`/privacy`, `/terms`), prerendered as a static site.

Keep this file current. When a convention changes, a new pattern is introduced, or something non-obvious is learned, update the relevant section here in the same change.

## Stack

- Nuxt 3 (Vue 3, `<script setup>`), statically generated: `npm run generate` → `.output/public`.
- SCSS (sass), no CSS framework. Do not add Tailwind or a UI library.
- GSAP + ScrollTrigger for scroll effects, Lenis for smooth scrolling, Splitting for word splits.
- Three.js for the 3D phone in the banner, on all screen sizes (loaded client-side only).
- Node: the Nuxt CLI needs Node ≥ 20.12. The default `/usr/local/bin/node` (20.10) fails; use nvm's v24: `PATH=~/.nvm/versions/node/v24.19.0/bin:$PATH npm run generate`.
- Tests: `node --test tests/*.test.mjs` (currently just the text-scramble animator).

## Layout of the codebase

- `pages/index.vue`: the homepage: `HomeBanner3D`, `HomeIntro`, `Design`. Calls `$initHomeAnimations(root)` on mount and its cleanup on unmount.
- `components/SiteHeader.vue`: the fixed bottom nav (glass pills: logo + links, TestFlight CTA). Used on every page. On mobile "Open-Source" shortens to "Open" (`__long` suffix hidden); below 360px the links hide.
- `components/PlusGrid.vue`: the two fixed `+` marks, mounted once in `app.vue`.
- `components/Design.vue`: the "02 / Design" slideshow. The section is `(1 + (slides − 1) × perSlide + 2 × hold) × 100svh` tall with a sticky 100svh inner. Images use a wipe: each incoming slide's frame rises while its content is counter-translated so it stays still (transforms only, no repaint). Text slides cross-fade, and a progress bar (current slide number, fill, total) sits at the card bottom. On desktop the sticky panel scales up (`enterScale` → 1) as the section enters. No snapping, and reversing is automatic. Where supported, it all runs as CSS animations on a view timeline of the section, with each element's range computed in the script from the `settings` object at the top. Fallback: JS writes the slide position `--s` and CSS derives the same motion from it, with geometry cached via ResizeObserver so each scroll frame reads only `scrollY`. Avoid IntersectionObserver gating there: it proved unreliable. Screens are `public/img/design/N.jpg` with `.avif` versions (`avifenc -q 80`).
- `components/Features.vue`: the earlier stacked-cards features section, kept for reuse but not on the page.
- `components/HomeBanner3D.vue`: the banner, with the WebGL phone. Tunables are in `phoneSettings`; `showLightingControls` opens a dev-only lighting panel (`PhoneLightingControls`, lazy-loaded). The "Coming soon" badge follows the `<h1>` in the DOM (kept out of the heading) and is placed with CSS: centred above on mobile, anchored above "yours" on desktop via anchor positioning (centred fallback).
- `components/HomeBanner.vue`: static-image version of the banner, not on the page; the fallback if the 3D phone ever needs dropping on mobile.
- `components/SiteFooter.vue`, `HomeIntro.vue`: sections.
- `assets/content/home.js`: `features` copy, and `design` (that copy plus each slide's screen, alt text and gradient colours). Long-form product copy lives in `assets/glid-overview.md` (git-ignored, local only).
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

## Pending

- `SiteHeader.vue`: `OPEN_SOURCE_URL` and `TESTFLIGHT_URL` are `#` placeholders until the repo and TestFlight invite are public.
