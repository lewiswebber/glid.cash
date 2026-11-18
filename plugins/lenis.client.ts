import Lenis from 'lenis'
import ScrollTrigger from 'gsap/ScrollTrigger'
export default defineNuxtPlugin(nuxtApp => {
	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
	const lenis = new Lenis({
		autoRaf: true,
		// Section links are handled below, so the URL never gains a #hash.
		anchors: false,
		smoothWheel: !reduceMotion
	})
	lenis.on('scroll', () => ScrollTrigger.update())

	// Scroll to a homepage section by id, without touching the URL. The position is measured
	// from the real scroll offset rather than left to Lenis, whose own idea of it can lag
	// behind (e.g. after a browser hash jump on first load).
	const scrollToSection = (id: string, immediate = reduceMotion) => {
		const target = document.getElementById(id)
		if (!target) return false
		// Re-measure first: after a page change Lenis may still clamp to the old page's height.
		lenis.resize()
		lenis.scrollTo(target.getBoundingClientRect().top + window.scrollY, { immediate, force: true })
		return true
	}

	// Jump to a section requested by the nav from another page (passed in history state, so
	// it never shows in the URL), or by an old /#section link, then drop the hash and the
	// request. Returns whether there was one.
	const arrive = () => {
		const section = history.state?.section || decodeURIComponent(location.hash.slice(1))
		if (!section || !document.getElementById(section)) return false
		history.replaceState({ ...history.state, section: null }, '', location.pathname + location.search)
		// Wait a frame so the page has laid out before measuring the target.
		requestAnimationFrame(() => scrollToSection(section, true))
		return true
	}

	// Client-side navigations: arrive at the section, or start at the top.
	nuxtApp.hook('page:finish', () => {
		if (!arrive()) lenis.scrollTo(0, { immediate: true })
	})
	// First load (e.g. a shared /#section link), once the app has hydrated.
	onNuxtReady(arrive)

	return {
		provide: {
			lenis,
			scrollToSection
		}
	}
})
