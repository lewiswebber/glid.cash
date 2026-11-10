import Lenis from 'lenis'
import ScrollTrigger from 'gsap/ScrollTrigger'
export default defineNuxtPlugin(nuxtApp => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const lenis = new Lenis({
    autoRaf: true,
    anchors: true,
    smoothWheel: !reduceMotion
  })
  lenis.on('scroll', () => ScrollTrigger.update())
  nuxtApp.hook('page:finish', () => lenis.scrollTo(0, {
    immediate: true
  }))
  return {
    provide: {
      lenis
    }
  }
})
