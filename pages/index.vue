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
      <span class="hero__badge">Coming soon</span>
    </div>

    <h1 class="hero__logo">
      <img src="/logo.svg" width="131" height="62" alt="Glid">
    </h1>

  </main>
</template>

<style scoped lang="scss">
/* Desktop layout uses rounded viewport-relative sizes and offsets. */
/* The root canvas paints the full-bleed gradient (main.scss). */
.hero {
  position: fixed;
  inset: 0;
  overflow: visible;

  &__phone {
    position: absolute;
    top: -9vh;
    left: 50%;
    /* Sized off viewport height (904 / 945 tall), capped at 40vw so it can't run into the tagline */
    width: min(54vh, 40vw);
    transform: translateX(-50%);
    pointer-events: none;

    img {
      display: block;
      width: 100%;
      height: auto;
    }
  }

  &__tagline {
    position: absolute;
    top: 48vh;
    left: 4vw;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 2.8vw;
    line-height: 0.9;
    letter-spacing: -0.02em;
    color: #fff;

    p {
      margin: 0;
    }

    .hero__tagline-sub {
      margin-top: 0.1em;
      opacity: 0.5;
    }
  }

  &__logo {
    position: absolute;
    bottom: 4vh;
    left: 4vw;
    width: 7vw;
    margin: 0;

    img {
      display: block;
      width: 100%;
      height: auto;
    }
  }

  &__badge {
    display: inline-block;
    margin-top: 24px;
    padding: 15px 30px;
    border: 1px solid rgb(255 255 255 / 50%);
    border-radius: 999px;
    font-family: 'Geist Mono', ui-monospace, monospace;
    font-size: 11px;
    line-height: 1;
    letter-spacing: 0.1em;
    color: rgba(255,255,255,.7);

    text-transform: uppercase;
    white-space: nowrap;
  }

  @media (min-width: 768px) {
    &__logo {
      top: 5vh;
      bottom: auto;
    }

    &__tagline {
      top: auto;
      bottom: 7vh;
      left: 4vw;
    }

  }

  /*
  Mobile: Figma frame 402 × 874, in px.
  Crop the phone above the screen; keep the text anchored to the bottom.
  */
  @media (max-width: 767px) {
    &__badge {
      display: none;
    }

    &__phone {
      top: min(-126px, calc(100vh - 1000px));
      top: min(-126px, calc(100dvh - 1000px));
      bottom: auto;
      left: 50%;
      width: 390px;
      margin-left: -220px;
      transform: none;
    }

    &__tagline {
      top: auto;
      bottom: calc(162px + env(safe-area-inset-bottom));
      left: 50%;
      width: 340px;
      font-size: 26px;
      text-align: center;
      transform: translateX(-50%);

      .hero__tagline-sub {
        margin-top: 0.1em;
      }
    }

    &__logo {
      bottom: calc(61px + env(safe-area-inset-bottom));
      left: 50%;
      width: 86px;
      transform: translateX(-50%);
    }

  }
}
</style>
