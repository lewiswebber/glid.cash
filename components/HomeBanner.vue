<template>
  <section class="hero">
    <div class="hero__content" effect__fadeOut>
      <picture class="hero__phone">
        <source srcset="/phone.avif" type="image/avif">
        <img src="/phone.webp" width="510" height="904" alt="Glid app showing a wallet balance of $12,708.48"
          fetchpriority="high" decoding="async">
      </picture>

      <div class="hero__tagline">
        <h1 class="text-lead">Bitcoin. Made simple.</h1>
        <p class="hero__tagline-sub text-lead">Multi-wallet, Self-custody,<br>Open-source.</p>
        <span class="hero__badge monospace pill">Coming soon</span>
      </div>



    </div>
    <!-- <div class="overlay overlay__grey hide__mobile" effect__overlayIn aria-hidden="true"></div> -->
  </section>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

/* Desktop layout uses rounded viewport-relative sizes and offsets. */
/* The banner owns its gradient so subsequent sections can scroll beneath it. */
.hero {
  position: relative;
  height: 100vh;
  height: 100svh;
  overflow: hidden;
  background: linear-gradient(0deg, #7c7c7c 0%, #2b4e64 50%, #000 110%);

  &__content {
    position: absolute;
    inset: 0;
    height: 100%
  }

  @media (max-width: $break-s) {
    background: linear-gradient(170deg, #7c7c7c 0%, #2b4e64 50%, #000 110%);
  }

  &__phone {
    position: absolute;
    top: -9%;
    left: 50%;
    /* Sized off viewport height (904 / 945 tall), capped at 40vw so it can't run into the tagline */
    width: min(54svh, 40vw);
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
    top: 48svh;
    left: 4vw;
    color: #fff;

    .hero__tagline-sub {
      margin-top: 0.1em;
      opacity: 0.5;
    }
  }

  &__badge {
    margin-top: 24px;
    color: rgba(255, 255, 255, .7);
  }

  @media (min-width: $break-s) {
    &__tagline {
      top: auto;
      bottom: 7svh;
      left: 4vw;
    }
  }

  /*
  Mobile: Figma frame 402 × 874, in px.
  Crop the phone above the screen; keep the text anchored to the bottom.
  */
  @media (max-width: $break-s) {
    &__badge {
      display: none;
    }

    &__phone {
      // Use the stable banner height: dvh changes as mobile browser bars retract.
      top: -35svh;
      bottom: auto;
      left: 50%;
      width: 390px;
      margin-left: -220px;
      transform: none;
    }

    &__tagline {
      top: auto;
      bottom: calc(150px + env(safe-area-inset-bottom));
      left: 50%;
      width: 340px;
      text-align: center;
      transform: translateX(-50%);

      .hero__tagline-sub {
        margin-top: 0.1em;
      }
    }
  }

}
</style>
