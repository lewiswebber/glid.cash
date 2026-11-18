<script setup>
const title = 'Terms & Conditions — Glid'
const description = 'Terms for using the Glid website and current iOS TestFlight prototype.'

useSeoMeta({
	title,
	description,
	ogTitle: title,
	ogDescription: description,
	ogUrl: 'https://glid.cash/terms',
	twitterTitle: title,
	twitterDescription: description
})
useHead({
	link: [{ rel: 'canonical', href: 'https://glid.cash/terms' }]
})
</script>

<template>
	<div class="terms">
		<SiteHeader />
		<main id="top" class="layout">
			<div class="layout__third" aria-hidden="true" />
			<article class="layout__second">
				<h1>Terms & <br/>Conditions</h1>
				<p class="monospace opacity__50">Last updated: 17 November 2026</p>
				<p>
					These terms cover glid.cash and the current Glid iOS TestFlight prototype, provided
					by STUD LONDON LTD ("we", "our", or "us"). Please read them before using the website
					or testing the app. If you do not agree, please do not use them.
				</p>

				<h2 class="monospace opacity__50">001. The Current Product</h2>
				<p>
					Glid is in early development. The current TestFlight app is an interface prototype
					using sample wallets, balances, transactions, prices, and fees. It does not connect
					to the Bitcoin network or send real transactions. Website descriptions of the
					intended wallet describe our product direction; they are not a promise that those
					features are available in the current beta or will launch on a particular date.
				</p>
				<p>
					Wallet creation, import, backup, PIN, and Face ID screens are demonstrations.
					They do not currently provide working wallet storage, recovery, or security.
					Do not enter real recovery phrases, private keys, or passwords, and do not send
					funds to any address displayed in the prototype. Use sample information only.
				</p>

				<h2 class="monospace opacity__50">002. Testing the App</h2>
				<p>
					You may use the beta to explore its interface and provide feedback, subject to these
					terms and Apple’s applicable terms. You are responsible for using a compatible
					device and complying with laws that apply to your use.
				</p>
				<p>
					Beta software may contain errors, crash, lose local settings, or behave unexpectedly.
					Builds may expire, features may change, and testing may end before a public release.
					Do not rely on the prototype for payments, financial records, or storing valuable information.
				</p>
				<p>
					Distribution through TestFlight is also subject to
					<a href="https://www.apple.com/legal/internet-services/itunes/testflight/" target="_blank" rel="noopener noreferrer">Apple’s TestFlight terms</a>
					and any applicable app licence terms. These website terms do not replace or reduce
					your rights under those terms or mandatory consumer law.
				</p>

				<h2 class="monospace opacity__50">003. Acceptable Use</h2>
				<p>
					Do not use the website or app for unlawful activity, distribute malware, interfere
					with other users, or attempt to access systems or information without authorisation.
					Do not misrepresent your relationship with Glid or STUD LONDON LTD.
				</p>
				<p>
					If you discover a security issue, please report it to us privately using the contact
					details below. Do not access another person’s data or disrupt a service while investigating.
					Nothing here restricts activities that applicable law expressly permits.
				</p>

				<h2 class="monospace opacity__50">004. Financial Information</h2>
				<p>
					The website and prototype provide product information and demonstrations, not
					financial, investment, tax, or legal advice. Sample balances, prices, fees, and
					transactions are not live quotes, offers, or evidence of funds you own.
					The current prototype does not hold funds, execute trades, or provide custody services.
				</p>

				<h2 class="monospace opacity__50">005. Ownership and Feedback</h2>
				<p>
					Rights in Glid’s name, branding, design, software, and website content belong to
					STUD LONDON LTD or their respective owners. Permission to test the app does not
					transfer ownership of those materials. Where code or other materials are released
					under a separate open-source or third-party licence, that licence governs those materials.
				</p>
				<p>
					Feedback is voluntary. You retain ownership of material you submit, but allow us
					to use your suggestions to evaluate and improve Glid without an obligation to
					implement them or pay compensation. This does not give us permission to publish
					your personal information; its handling is described in our Privacy Policy.
				</p>

				<h2 class="monospace opacity__50">006. Privacy and External Services</h2>
				<p>
					Our <NuxtLink to="/privacy">Privacy Policy</NuxtLink> explains local app data,
					TestFlight diagnostics and feedback, website tracking, and correspondence.
					Please do not include real recovery phrases, private keys, or other sensitive
					wallet information in feedback or support messages.
				</p>
				<p>
					External services, including Apple’s TestFlight and any block explorer you choose
					to open, have their own terms and privacy policies. We do not control their content
					or availability. A link does not mean that we endorse everything on that service.
				</p>

				<h2 class="monospace opacity__50">007. Availability and Changes</h2>
				<p>
					We may update the website or beta to fix problems, develop features, address
					security risks, or comply with legal requirements. We may suspend access where
					reasonably necessary for those purposes or for a serious breach of these terms.
					We may also end the beta programme. Where reasonably practicable, we will give
					notice of significant changes or the end of testing.
				</p>
				<p>
					We do not promise uninterrupted availability or a particular release date.
					You may stop testing at any time and remove the app from your device.
				</p>

				<h2 class="monospace opacity__50">008. Responsibility and Your Rights</h2>
				<p>
					We provide the prototype for evaluation in its current development state and do
					not promise that it is error-free or suitable for use as a working wallet.
					This description does not remove any legal rights you have.
				</p>
				<p>
					Nothing in these terms excludes or limits liability for fraud, fraudulent
					misrepresentation, death or personal injury caused by negligence, or any other
					liability that cannot lawfully be excluded or limited. Your mandatory consumer
					rights remain unaffected. Any responsibility for loss or damage is subject to
					applicable law; these terms do not impose a blanket waiver of your rights.
				</p>

				<h2 class="monospace opacity__50">009. Updates to These Terms</h2>
				<p>
					We may revise these terms to reflect changes to Glid or legal requirements.
					We will publish the revised terms here and update the date above, and provide
					appropriate notice of material changes. Changes will not retrospectively remove
					rights you already have. Any future live wallet functionality may require updated
					terms before you use it.
				</p>

				<h2 class="monospace opacity__50">010. Questions and Disputes</h2>
				<p>
					If you have a concern, please contact STUD LONDON LTD at
					<a href="mailto:hello@stud.house">hello@stud.house</a> so we can try to resolve it.
					These terms do not restrict your right to seek legal remedies or bring a claim
					in a court available to you under applicable law.
				</p>
			</article>
		</main>
		<SiteFooter />
	</div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.terms {
	article {
		color: var(--grey);
		padding: 10vw 0 10vw;
		line-height: 1.5;
	}

	h1 {
		color: var(--primarycolor);
		margin-bottom: 32px;
	}

	h2 {
		color: var(--primarycolor);
		margin: 48px 0 16px;
	}

	p {
		max-width: 40vw;
		margin-bottom: 24px;
	}

	article a {
		text-decoration: underline;
		text-underline-offset: .2em;
		overflow-wrap: anywhere;
	}

	@media (max-width: $break-s) {
		article {
			padding: 20svh 0 10svh;
		}

		p {
			max-width: 100%;
		}
	}
}
</style>
