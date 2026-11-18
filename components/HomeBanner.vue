<template>
	<section class="hero">
		<div class="hero__content" effect__fadeOut>
			<picture class="hero__phone">
				<source srcset="/phone.avif" type="image/avif">
				<img src="/phone.webp" width="510" height="904" alt="Glid app showing a wallet balance of $12,708.48"
					fetchpriority="high" decoding="async">
			</picture>

			<div class="hero__tagline">
				<!-- The badge follows the h1 so it stays out of the heading; CSS places it above. -->
				<div class="hero__headline">
					<h1 class="text-title">Bitcoin wallet that feels like <em>yours.</em></h1>
					<p class="hero__badge monospace opacity__50">Coming soon</p>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

/* Desktop sizes in vw/svh; the gradient scrolls with the page. */
.hero {
	position: relative;
	height: 100vh;
	height: 100svh;
	overflow: hidden;
	background: linear-gradient(180deg, #7c7c7c 0%, #2b4e64 50%, #000 100%);

	&__content {
		position: absolute;
		inset: 0;
	}

	@media (max-width: $break-s) {
		background: linear-gradient(170deg, #7c7c7c 0%, #2b4e64 50%, #000 110%);
	}

	&__phone {
		position: absolute;
		top: -9%;
		left: 50%;
		// Sized off the viewport height, capped at 40vw so it can't run into the tagline.
		width: min(54svh, 40vw);
		transform: translateX(-50%);
		pointer-events: none;

		img {
			display: block;
			width: 100%;
			height: auto;
		}
	}

	/* Centred headline (Figma 1665 frame: 74px, vertically centred). */
	&__tagline {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 6vw;
		color: #fff;
		text-align: center;
		pointer-events: none;
	}

	&__headline {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	&__badge {
		order: -1;
		margin-bottom: 1.2vw;
		padding: .5em 1.4em;
		border: 1px solid currentColor;
		border-radius: 999px;
		white-space: nowrap;
	}

	// Desktop: above the gap between "like" and "yours", anchored to the <em>.
	// Without anchor positioning it stays centred above the headline.
	@supports (anchor-name: --a) {
		@media (min-width: ($break-s + 1px)) {
			em {
				anchor-name: --hero-yours;
			}

			&__badge {
				position: absolute;
				position-anchor: --hero-yours;
				bottom: anchor(top);
				left: anchor(left);
				margin-bottom: .6vw;
				translate: -50% 0;
			}
		}
	}

	/*
	Mobile: Figma frame 402 × 874, in px.
	Crop the phone above the screen; keep the text anchored to the bottom.
	*/
	@media (max-width: $break-s) {
		&__phone {
			top: -35svh;
			left: 50%;
			width: 390px;
			margin-left: -220px;
			transform: none;
		}

		/* Mobile keeps the bottom-centred tagline above the nav. */
		&__badge {
			margin-bottom: 16px;
		}

		&__tagline {
			align-items: flex-end;
			padding: 0 0 calc(150px + env(safe-area-inset-bottom));

			h1 {
				width: 340px;
			}
		}
	}
}
</style>
