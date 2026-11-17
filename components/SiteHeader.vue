<script setup>
const route = useRoute()
const { $lenis } = useNuxtApp()

function scrollHome(event) {
  if (route.path !== '/' || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

  event.preventDefault()
  const immediate = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if ($lenis) {
    $lenis.scrollTo(0, { immediate })
  } else {
    window.scrollTo({ top: 0, behavior: immediate ? 'instant' : 'smooth' })
  }
}
</script>

<template>
  <header class="site-header">
    <div class="layout">
      <div class="layout__third">
        <a href="/" class="logo" aria-label="Glid homepage" @click="scrollHome">
          <img src="/logo.svg" width="131" height="62" alt="Glid">
        </a>
      </div>
      <!-- <nav class="nav layout__second monospace" aria-label="Main navigation">
        <a href="#intro" class="hover_effect"><span>Intro,</span></a>
        <a href="#features" class="hover_effect"><span>Features</span></a>
      </nav> -->
    </div>
    <div class="nav nav__right monospace">
      <a href="mailto:wbbr.co@gmail.com" class="contact pill hover_effect"><span>Contact</span></a>
    </div>
  </header>
</template>

<style lang="scss">
@use '~/assets/scss/variables' as *;
.site-header {
  position: fixed;
  z-index: 11;
  top: 0;
  width: 100%;
  color: #fff;
  mix-blend-mode: difference;
  > .layout {
    align-items: center;
    min-height: calc(3vw + 48px);
  }

  .nav a {
    margin-right: .5vw;
    &:last-child {
      margin-right: 0;
    }
  }

  .nav__right {
    right: 0;
    position: fixed;
    padding: 1.5vw 3vw;
    z-index: 4;
    top: 0;
  }

  .nav__right a {
    margin-left: 10.8vw;
  }

  .logo {
    display: inline-block;
    img {
      display: block;
      width: 5vw;
      height: auto;
    }

    @media (max-width: $break-l) {
      img {
        width: 65px;
      }
    }
  }

  @media (max-width: $break-s) {

    top: auto;
    bottom: 0;

    .nav {
      display: none;
    }

    .layout__third {
      display: flex;
      justify-content: center;
    }

    .logo {
      padding: 5px 0;
    }
  }
}
</style>
