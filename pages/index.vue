<template>
  <main class="hero">
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
.hero {
  position: relative;
  min-height: 100vh;
  min-height: 100svh;
  background-image: linear-gradient(174.48deg, #000 -18.149%, #2b4e64 47.361%, #7c7c7c 101.39%);
}

/* Figma: 130.73px wide on a 1665px frame, scales up beyond that */
.hero__logo {
  position: absolute;
  top: 52%;
  left: 50%;
  width: max(130.73px, 7.85vw);
  margin: 0;
  transform: translate(-50%, -50%);
}

.hero__logo img {
  display: block;
  width: 100%;
  height: auto;
}

.hero__meta {
  position: absolute;
  bottom: max(34px, env(safe-area-inset-bottom));
  left: 50%;
  margin: 0;
  transform: translateX(-50%);
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 14px;
  line-height: normal;
  color: #a5afb4;
  text-align: center;
  text-transform: uppercase;
  white-space: nowrap;
}
</style>
