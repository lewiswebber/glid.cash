<script setup>
// TODO: replace with the public repository and TestFlight invite URLs.
const OPEN_SOURCE_URL = '#'
const TESTFLIGHT_URL = '#'

const route = useRoute()
const { $lenis } = useNuxtApp()

// Same-page anchors on the homepage; full paths from the legal pages.
const anchor = id => (route.path === '/' ? `#${id}` : `/#${id}`)

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
	<header class="site-header monospace">
		<nav class="site-header__nav site-header__pill" aria-label="Main navigation">
			<a href="/" class="site-header__logo" aria-label="Glid homepage" @click="scrollHome">
				<img src="/logo.svg" width="131" height="62" alt="Glid">
			</a>
			<div class="site-header__links">
				<a :href="anchor('intro')" class="hover_effect"><span>About</span></a>
				<a :href="anchor('design')" class="hover_effect"><span>Design</span></a>
				<!-- "Open" on mobile to fit; the hover scramble (desktop) reads the full label. -->
				<a :href="OPEN_SOURCE_URL" class="hover_effect" target="_blank" rel="noopener"
					aria-label="Open source"><span>Open<span class="site-header__long">-Source</span></span></a>
			</div>
		</nav>
		<a :href="TESTFLIGHT_URL" class="site-header__cta site-header__pill hover_effect" target="_blank"
			rel="noopener">
			<span>Testflight</span>
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
			width: 44px;
		}

		&__links {
			gap: 1em;
			padding-left: 10px;
		}

		&__long {
			display: none;
		}

		&__cta {
			grid-column: 2;
			min-width: 0;
		}

		// Narrowest phones: not enough room beside the CTA.
		@media (max-width: 359px) {
			&__links {
				display: none;
			}
		}
	}
}
</style>
