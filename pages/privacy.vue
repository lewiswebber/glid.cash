<script setup>
const title = 'Privacy Policy — Glid'
const description = 'How Glid handles information when you use our website and TestFlight app or contact us.'

useSeoMeta({
	title,
	description,
	ogTitle: title,
	ogDescription: description,
	ogUrl: 'https://glid.cash/privacy',
	twitterTitle: title,
	twitterDescription: description
})
useHead({
	link: [{ rel: 'canonical', href: 'https://glid.cash/privacy' }]
})
</script>

<template>
	<div class="privacy">
		<SiteHeader />
		<main id="top" class="layout">
			<div class="layout__third" aria-hidden="true" />
			<article class="layout__second">
				<h1>Privacy Policy</h1>
				<p class="monospace opacity__50">Last updated: 17 November 2026</p>
				<p>
					Glid is provided by STUD LONDON LTD ("we", "our", or "us"). This policy covers
					glid.cash, the Glid iOS app currently available through TestFlight, and communications
					with us. STUD LONDON LTD is responsible for the personal information we handle as
					described below.
				</p>

				<h2 class="monospace opacity__50">001. The Current App</h2>
				<p>
					Glid is currently an interface prototype for testing. Wallets, balances, transactions,
					prices, and fees use sample data. The app does not currently connect to the Bitcoin
					network or send real transactions. Wallet import, backup, PIN, and Face ID screens
					are demonstrations, not functioning wallet storage or security features.
				</p>
				<p>
					The current app does not require an account, send information you enter to our servers,
					or include advertising or analytics SDKs. We do not receive your wallet names,
					entered recovery phrases, PINs, passwords, or scanned addresses through the app.
					Please use test information only, not real recovery phrases, private keys, or funds.
					TestFlight’s separate data handling is explained below.
				</p>

				<h2 class="monospace opacity__50">002. Information on Your Device</h2>
				<p>
					Display preferences, such as appearance and selected currency, are saved on your
					device. Information entered in the prototype’s forms is handled locally in app
					memory. The sample iCloud backup screens do not currently access or upload to iCloud.
				</p>
				<p>
					If you use the QR scanner and grant camera permission, the app processes the camera
					feed on your device to read QR codes. It does not record or upload camera images.
					You can change camera permission in iOS Settings. Copy and paste actions use your
					device’s clipboard when you choose those actions; pasted information is not sent to us.
				</p>

				<h2 class="monospace opacity__50">003. TestFlight</h2>
				<p>
					Apple automatically collects crash logs and beta usage information and shares them
					with us through TestFlight. This includes information about app installs, sessions,
					your device, operating system, and app version. Depending on how you join the beta,
					we may also see your name and email address; these are not shown to us when you join
					only through a public invitation link. Feedback you submit, including comments and
					screenshots, is also shared with us and may include your contact details.
				</p>
				<p>
					We use this information to investigate problems and improve Glid. We do not share
					TestFlight testing data with third parties. Apple handles information under its own
					<a href="https://www.apple.com/legal/privacy/data/en/test-flight/" target="_blank" rel="noopener noreferrer">TestFlight privacy notice</a>,
					which explains its collection and retention practices.
				</p>

				<h2 class="monospace opacity__50">004. Website and Contact Information</h2>
				<p>
					Website hosting and analytics services may process technical and usage information,
					including your IP address, browser and device type, and pages visited. The website
					uses Google Tag Manager to manage tracking tags. Depending on the tags enabled,
					analytics services may use cookies or similar technologies. You can manage or block
					cookies in your browser settings. This website tracking is separate from the app.
				</p>
				<p>
					If you email us, we receive your email address and the information you include.
					We use this to respond to enquiries and support requests. Please avoid including
					sensitive wallet information in emails, screenshots, or TestFlight feedback.
				</p>

				<h2 class="monospace opacity__50">005. How We Use and Share Information</h2>
				<p>
					We use information to operate and secure the website, respond to messages, understand
					website usage, and improve the app using beta feedback. Where applicable, we rely on
					our legitimate interests in maintaining and improving Glid and responding to enquiries,
					consent where required, and compliance with legal obligations.
				</p>
				<p>
					We do not sell personal information. Website hosting, email, and analytics providers
					may process website or correspondence data to provide their services. We may disclose
					information where required by law. The TestFlight information described above is
					subject to Apple’s restrictions on sharing.
				</p>

				<h2 class="monospace opacity__50">006. Retention and Security</h2>
				<p>
					We keep correspondence and any beta feedback or diagnostic information we retain
					only as long as needed to respond to you, investigate issues, improve the beta, or
					meet legal obligations. Apple controls retention within its TestFlight service.
					You can contact us to request deletion of information we hold about you.
				</p>
				<p>
					Local app preferences can be removed by deleting the app from your device.
					Deleting the app does not delete information already shared through TestFlight or
					email. No method of electronic storage or internet transmission is completely secure.
				</p>

				<h2 class="monospace opacity__50">007. External Services</h2>
				<p>
					If you choose to open an external link, including a transaction link to mempool.space,
					that service receives the information needed to load the page, such as your IP address
					and the transaction identifier in the link. Its own privacy policy applies. We do not
					control the privacy practices of external websites or Apple’s services.
				</p>

				<h2 class="monospace opacity__50">008. Your Rights</h2>
				<p>
					Depending on applicable law, you may have rights to access, correct, or delete your
					personal information, restrict or object to its use, or request a portable copy.
					Where processing relies on consent, you may withdraw it. Contact us below to make
					a request, including for TestFlight information available to us. We cannot retrieve
					information that stays solely on your device.
				</p>
				<p>
					You may also complain to your local data protection authority. In the UK, this is the
					<a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer">Information Commissioner’s Office (ICO)</a>.
				</p>

				<h2 class="monospace opacity__50">009. Changes to This Policy</h2>
				<p>
					This policy describes the current website and TestFlight prototype. We will update
					it as Glid develops, including before introducing features that change how personal
					information is handled. The date above indicates the latest update.
				</p>

				<h2 class="monospace opacity__50">010. Contact</h2>
				<p>
					For privacy questions or requests, contact STUD LONDON LTD at
					<a href="mailto:hello@stud.house">hello@stud.house</a>.
				</p>
			</article>
		</main>
		<SiteFooter />
	</div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.privacy {
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
