<script setup>
import { TESTFLIGHT_URL } from '~/assets/content/links'

const route = useRoute()
const router = useRouter()
const { $lenis, $scrollToSection } = useNuxtApp()

// Homepage sections. Clicks scroll there without adding a #hash to the URL: on the homepage
// directly, from other pages via history state (handled in plugins/lenis.client.ts). The
// href keeps /#id so opening in a new tab, or without JS, still lands on the section.
const links = [
	{ id: 'intro', label: 'About' },
	{ id: 'design', label: 'Design' },
	// Hidden on mobile to make room for the TestFlight pill.
	{ id: 'contact', label: 'Contact', desktopOnly: true }
]

// Plain left clicks only; modified clicks (new tab, etc.) keep the default.
const isPlainClick = event => event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey

function goToSection(event, id) {
	if (!isPlainClick(event)) return
	event.preventDefault()
	if (route.path === '/') $scrollToSection(id)
	else router.push({ path: '/', state: { section: id } })
}

// On the homepage, the logo scrolls back to the top instead of reloading.
function scrollHome(event) {
	if (route.path !== '/' || !isPlainClick(event)) return

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
	<header class="site-header monospace">
		<nav class="site-header__nav site-header__pill" aria-label="Main navigation">
			<NuxtLink to="/" class="site-header__logo" aria-label="Glid homepage" @click="scrollHome">
				<img src="/logo.svg" width="131" height="62" alt="Glid">
			</NuxtLink>
			<div class="site-header__links">
				<a v-for="link in links" :key="link.id" :href="`/#${link.id}`" class="hover_effect" :class="{ 'site-header__link--desktop': link.desktopOnly }" @click="goToSection($event, link.id)"><span>{{ link.label }}</span></a>
			</div>
		</nav>
		<a :href="TESTFLIGHT_URL" class="site-header__cta site-header__pill hover_effect" target="_blank" rel="noopener">
			<span>TestFlight</span>
		</a>
	</header>
</template>

<style lang="scss">
@use '~/assets/scss/variables' as *;

/* Desktop sizes from the Figma 1665 frame, in vw. */
.site-header {
	position: fixed;
	z-index: 11;
	right: var(--edge);
	bottom: var(--edge);
	left: var(--edge);
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	align-items: center;
	color: #fff;
	pointer-events: none;

	&__pill {
		display: flex;
		align-items: center;
		height: max(4.08vw, 44px);
		padding: 0 1.92vw;
		border-radius: var(--radius);
		background: rgb(255 255 255 / 20%);
		-webkit-backdrop-filter: blur(2.8vw);
		backdrop-filter: blur(2.8vw);
		pointer-events: auto;
	}

	&__nav {
		grid-column: 2;
		min-width: 30.27vw;
	}

	&__logo {
		display: block;
		flex-shrink: 0;

		img {
			display: block;
			width: max(3.77vw, 40px);
			height: auto;
		}
	}

	&__links {
		display: flex;
		flex: 1;
		justify-content: center;
		gap: 1.2em;
		padding-left: 1.92vw;
	}

	&__cta {
		grid-column: 3;
		justify-self: end;
		justify-content: center;
		min-width: 9.49vw;
	}

	/* Mobile: one full-width bar along the bottom. */
	@media (max-width: $break-s) {
		bottom: calc(var(--edge) + env(safe-area-inset-bottom));
		grid-template-columns: 1fr auto;
		gap: 6px;

		&__pill {
			height: 50px;
			padding: 0 14px;
			border-radius: 10px;
			-webkit-backdrop-filter: blur(24px);
			backdrop-filter: blur(24px);
		}

		&__nav {
			grid-column: 1;
			min-width: 0;
		}

		&__logo img {
			width: 52px;
		}

		&__links {
			gap: 1.4em;
			padding-left: 10px;
		}

		&__link--desktop {
			display: none;
		}

		&__cta {
			grid-column: 2;
			min-width: 0;
		}
	}
}
</style>
