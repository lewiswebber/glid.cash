import Lenis from 'lenis'

export default defineNuxtPlugin((nuxtApp) => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const lenis = new Lenis({
    autoRaf: true,
    smoothWheel: !reduceMotion,
  })

  nuxtApp.hook('page:finish', () => lenis.scrollTo(0, { immediate: true }))

  return { provide: { lenis } }
})
