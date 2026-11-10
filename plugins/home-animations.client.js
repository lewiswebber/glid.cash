import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Splitting from 'splitting'
import { TextAnimator } from '~/assets/js/textanimator'

// Stud's text, title, banner and overlay effects, scoped to this homepage.
export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger)
  ScrollTrigger.config({
    ignoreMobileResize: true
  })
  return {
    provide: {
      initHomeAnimations(root) {
        const originals = [...root.querySelectorAll('[data-splitting]')].map(el => [el, el.innerHTML])
        Splitting({
          target: originals.map(([el]) => el),
          by: 'words'
        })
        const media = gsap.matchMedia()
        media.add({
          mobile: '(max-width: 600px)',
          desktop: '(min-width: 601px)',
          reduce: '(prefers-reduced-motion: reduce)'
        }, context => {
          if (context.conditions.reduce) return
          const mobile = context.conditions.mobile
          const scrub = mobile ? 0.5 : true
          root.querySelectorAll('[effect__textFade]').forEach(el => {
            gsap.fromTo(el.querySelectorAll('.word'), {
              opacity: 0
            }, {
              ease: 'none',
              opacity: 1,
              stagger: 0.05,
              scrollTrigger: {
                trigger: el,
                start: mobile ? 'top 80%' : 'top 90%',
                end: mobile ? 'bottom 80%' : 'bottom 90%',
                scrub
              }
            })
          })
          root.querySelectorAll('[effect__titleRandom]').forEach(el => {
            gsap.set(el, {
              perspective: 1000
            })
            gsap.fromTo(el.querySelectorAll('.word'), {
              transformOrigin: '50% 100%',
              opacity: 0,
              z: -100
            }, {
              ease: 'power4',
              opacity: 1,
              rotationX: 0,
              z: 0,
              stagger: {
                each: 0.03,
                from: 'random'
              },
              scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                end: 'top 50%',
                scrub
              }
            })
          })
          root.querySelectorAll('[effect__fadeOut]').forEach(el => {
            gsap.fromTo(el, {
              opacity: 1,
              yPercent: 0
            }, {
              ease: 'none',
              opacity: 0,
              yPercent: mobile ? 0 : 50,
              // Measure the non-animated banner, not the browser's changing viewport height.
              scrollTrigger: {
                trigger: el.parentElement,
                start: 'top top',
                end: 'bottom top',
                scrub
              }
            })
          })
          const hoverCleanup = []
          if (!mobile) root.querySelectorAll('.button, .hover_effect').forEach(el => {
            const animator = new TextAnimator(el)
            const enter = () => animator.animate()
            const leave = () => animator.reset()
            el.addEventListener('mouseenter', enter)
            el.addEventListener('mouseleave', leave)
            el.addEventListener('focus', enter)
            el.addEventListener('blur', leave)
            hoverCleanup.push(() => {
              animator.destroy()
              el.removeEventListener('mouseenter', enter)
              el.removeEventListener('mouseleave', leave)
              el.removeEventListener('focus', enter)
              el.removeEventListener('blur', leave)
            })
          })
          const overlays = [...root.querySelectorAll('[effect__overlayIn]')]
          overlays.forEach(el => {
            for (let i = 0; i < (mobile ? 15 : 8); i++) el.appendChild(document.createElement('div'))
            gsap.fromTo(el.children, {
              transformOrigin: '50% 100%',
              opacity: 1,
              scaleY: 0
            }, {
              ease: 'power4',
              scaleY: 1.01,
              opacity: 1,
              stagger: {
                grid: 'auto',
                each: 0.03,
                axis: 'y',
                from: 'end'
              },
              scrollTrigger: {
                trigger: el,
                start: 'top 0%',
                end: 'top -130%',
                scrub
              }
            })
          })
          return () => {
            hoverCleanup.forEach(cleanup => cleanup())
            overlays.forEach(el => el.replaceChildren())
          }
        }, root)
        const refresh = () => ScrollTrigger.refresh()
        document.fonts.ready.then(() => {
          if (root.isConnected) refresh()
        })
        window.addEventListener('load', refresh, {
          once: true
        })
        return () => {
          window.removeEventListener('load', refresh)
          media.revert()
          originals.forEach(([el, html]) => {
            el.innerHTML = html
            el.classList.remove('splitting', 'words')
          })
        }
      }
    }
  }
})
