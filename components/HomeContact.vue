<script setup>
import { TESTFLIGHT_URL } from '~/assets/content/links'
</script>

<template>
	<section class="section section__grey" aria-labelledby="contact-title">
		<div class="contact" id="contact">
			<div class="layout">
				<div class="layout__third monospace opacity__50">
					<span class="block" data-splitting effect__titleRandom>03 / Contact</span>
				</div>
				<div class="contact__content layout__second" effect__textFade>
					<h2 id="contact-title" class="contact__title text-title" data-splitting>Glid is Coming Soon.</h2>
					<p class="text-large" data-splitting>Most Bitcoin wallets are cold and technical, built for experts. So many people leave their bitcoin on exchanges, because holding it themselves feels risky and confusing. We’re making Glid to close that gap, with a wallet that’s pleasant to open and easy to understand.</p>
					<p class="text-large" data-splitting>We’re getting the first version ready for iPhone, and you can try a very early build now through Apple’s TestFlight. If you’d like to join the beta, have a question, or just want to say hello, we’d love to hear from you.</p>
				</div>
				<div class="contact__action layout__second">
					<a :href="TESTFLIGHT_URL" class="contact__link text-large hover_effect" target="_blank" rel="noopener"><span>Join the Glid beta (TestFlight)</span></a>
					<a href="mailto:wbbr.co@gmail.com" class="contact__link text-large hover_effect"><span>Get in touch</span></a>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

/* Same rhythm as the intro: 745px column, 90px title gap (Figma 1665 frame). */
.contact {
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

	&__content .text-large {
		margin-bottom: 1em;
	}

	// Sits under the copy in the right-hand column, one link per line.
	&__action {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: .5em;
		margin-left: auto;
	}

	&__link {
		color: var(--primarycolor);
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: .15em;
	}
}
</style>
