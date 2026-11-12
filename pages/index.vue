<script setup>
import { features } from '~/assets/content/home'
const homepage = ref(null)
const {
  $initHomeAnimations
} = useNuxtApp()
// Use the image banner for SSR and mobile; mount WebGL only above 600px.
const isDesktop = ref(false)
let cleanup
let removeMediaListener
let revision = 0
let disposed = false
onMounted(() => {
  const media = window.matchMedia('(min-width: 601px)')
  const updateBanner = async () => {
    const currentRevision = ++revision
    cleanup?.()
    cleanup = undefined
    isDesktop.value = media.matches
    await nextTick()
    if (disposed || currentRevision !== revision) return
    // Rebind effects after the active banner changes, including orientation changes.
    cleanup = $initHomeAnimations?.(homepage.value)
  }
  media.addEventListener('change', updateBanner)
  removeMediaListener = () => media.removeEventListener('change', updateBanner)
  updateBanner()
})
onBeforeUnmount(() => {
  disposed = true
  removeMediaListener?.()
  cleanup?.()
})
</script>

<template>
  <div ref="homepage">
    <SiteHeader />
    <main id="top">
      <HomeBanner3D v-if="isDesktop" />
      <HomeBanner v-else class="mobile-banner" />
      <HomeIntro />
      <Features :contents="features" id="features" />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

// SSR starts with the mobile banner. Hide its photo before JavaScript runs on
// desktop, preserving the shared background, text, and banner height.
@media (min-width: ($break-s + 1px)) {
  .mobile-banner :deep(.hero__phone) {
    visibility: hidden;
  }
}
</style>
