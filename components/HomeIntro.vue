<template>
  <section class="section section__grey " aria-label="Introducing Glid">
    <div class="intro" id="intro">
      <div class="layout">
        <div class="layout__third monospace opacity__50">
          <span class="block" data-splitting effect__titleRandom>01 / Intro</span>
        </div>
        <div class="layout__second" effect__textFade>
          <p class="text-lead" data-splitting>Self-custody bitcoin with the calm of a modern money app. Glid is an open-source Bitcoin wallet for iPhone, for people who earn and hold bitcoin and want it to feel as easy as the rest of their money.</p>
          <p class="text-lead" data-splitting>Your keys stay on your phone. Nobody else holds your money, and nobody else can move it. Your first self-custody wallet should feel calm, with plain language and an easy way to back up.</p>
          <p class="text-lead" data-splitting>People look after what they feel they own. Your wallets, your colours, your names. Money you feel attached to is money you protect.</p>

        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;
.intro .text-lead {
  margin-bottom: 4vw;
  padding-right: 5vw;
  @media (max-width: $break-s) {
    margin-bottom: 30px;
  }
}
</style>
