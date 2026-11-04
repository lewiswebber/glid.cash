<template>
  <main class="hero">
    <picture class="hero__phone">
      <source srcset="/phone.avif" type="image/avif">
      <img
        src="/phone.webp"
        width="510"
        height="904"
        alt="Glid app showing a wallet balance of $12,708.48"
        fetchpriority="high"
        decoding="async"
      >
    </picture>

    <div class="hero__tagline">
      <p>Bitcoin. Made simple.</p>
      <p class="hero__tagline-sub">Multi-wallet, Self-custody,<br>Open-source.</p>
    </div>

    <h1 class="hero__logo">
      <img src="/logo.svg" width="130.73" height="62.1597" alt="Glid">
    </h1>

    <p class="hero__meta">
      Coming soon<br>
      <span>&copy;2026</span>
    </p>
  </main>
</template>

<style scoped>
/*
  Desktop: Figma frame 1665 × 945.
  Horizontal values and sizes in vw (px / 16.65), vertical offsets in vh (px / 9.45).
*/
/* The root canvas paints the full-bleed gradient (main.css). */
.hero {
  position: fixed;
  inset: 0;
  overflow: visible;
}

.hero__phone {
  position: absolute;
  top: -9.1vh;
  left: 50%;
  /* Sized off viewport height (904 / 945 tall), capped at 40vw so it can't run into the tagline */
  width: min(53.97vh, 40vw);
  transform: translateX(-50%);
  pointer-events: none;
}

.hero__phone img {
  display: block;
  width: 100%;
  height: auto;
}

.hero__tagline {
  position: absolute;
  top: 47.83vh;
  left: 4.144vw;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 2.643vw;
  line-height: 0.9;
  letter-spacing: -0.02em;
  color: #fff;
}

.hero__tagline p {
  margin: 0;
}

.hero__tagline .hero__tagline-sub {
  margin-top: 0.418em;
  opacity: 0.5;
}

.hero__logo {
  position: absolute;
  bottom: 4.004vh;
  left: 3.844vw;
  width: 6.667vw;
  margin: 0;
}

.hero__logo img {
  display: block;
  width: 100%;
  height: auto;
}

.hero__meta {
  position: absolute;
  right: 2.282vw;
  bottom: 3.175vh;
  margin: 0;
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: max(10px, 0.841vw);
  line-height: normal;
  color: #fff;
  opacity: 0.5;
  text-transform: uppercase;
  white-space: nowrap;
}

/*
  Mobile: Figma frame 402 × 874, in px.
  Crop the phone above the screen; keep the text anchored to the bottom.
*/
@media (max-width: 767px) {
  .hero__phone {
    top: min(-126px, calc(100vh - 1000px));
    top: min(-126px, calc(100dvh - 1000px));
    bottom: auto;
    left: 50%;
    width: 390px;
    margin-left: -220px;
    transform: none;
  }

  .hero__tagline {
    top: auto;
    bottom: calc(162px + env(safe-area-inset-bottom));
    left: 50%;
    width: 340px;
    font-size: 26px;
    text-align: center;
    transform: translateX(-50%);
  }

  .hero__tagline .hero__tagline-sub {
    margin-top: 0.1em;
  }

  .hero__logo {
    bottom: calc(61px + env(safe-area-inset-bottom));
    left: 50%;
    width: 85.76px;
    transform: translateX(-50%);
  }

  .hero__meta {
    display: none;
  }
}
</style>
