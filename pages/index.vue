<script setup>
import { features } from '~/assets/content/home'
const homepage = ref(null)
const {
  $initHomeAnimations
} = useNuxtApp()
let cleanup
onMounted(() => {
  cleanup = $initHomeAnimations?.(homepage.value)
})
onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <div ref="homepage">
    <SiteHeader />
    <main id="top">
      <HomeBanner />
      <HomeIntro />
      <Features :contents="features" id="features" />
    </main>
    <SiteFooter />
  </div>
</template>
