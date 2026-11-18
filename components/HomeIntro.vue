<template>
	<section class="section section__grey" aria-labelledby="intro-title">
		<div class="intro" id="intro">
			<div class="layout">
				<div class="layout__third monospace opacity__50">
					<span class="block" data-splitting effect__titleRandom>01 / About</span>
				</div>
				<div class="intro__content layout__second" effect__textFade>
					<h2 id="intro-title" class="intro__title text-title" data-splitting>Self-custody bitcoin with the calm of a modern money app.</h2>
					<p class="text-large" data-splitting>Glid is an open-source Bitcoin wallet for iPhone, for people who earn and hold bitcoin and want it to feel as easy as the rest of their money.</p>
					<p class="text-large" data-splitting>Your keys stay on your phone. Nobody else holds your money, and nobody else can move it. Your first self-custody wallet should feel calm, with plain language and an easy way to back up.</p>
					<p class="text-large" data-splitting>People look after what they feel they own. Your wallets, your colours, your names. Money you feel attached to is money you protect.</p>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

/* Figma 1665 frame: 745px column, 90px title gap, 40px paragraph gap. */
.intro {
	// Keep the column's grid position; cap the measure of its text.
	&__content > * {
		max-width: 44.75vw;

		@media (max-width: $break-s) {
			max-width: none;
		}
	}

	&__title {
		margin-bottom: 5.4vw;
		color: var(--primarycolor);

		@media (max-width: $break-s) {
			margin-bottom: 40px;
		}
	}

	.text-large {
		margin-bottom: 1em;
	}
}
</style>
