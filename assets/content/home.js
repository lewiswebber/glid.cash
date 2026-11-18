// Copy adapted from assets/glid-overview.md. Images are temporary Stud placeholders.
export const features = {
	subtitle: '02 / Features',
	title: 'Your Bitcoin.Your wallets. Your way.',
	contents: [{
		title: 'Make it yours',
		paragraphs: [
			"Give each wallet its own colours and theme, carried through every screen of the app, so each one has a personality of its own. The more familiar your money feels, the easier it becomes to look after.",
			"Whether you’re putting bitcoin aside for the future or keeping some ready to spend, separate wallets give each part of your money a purpose. You can see what belongs where without having to keep track in your head."
		]
	}, {
		title: 'Every payment, in plain English',
		paragraphs: [
			"A payment should still make sense when you come back to it months later. By saving the people you pay and adding labels, you can recognise each transaction and see what it was worth in your currency that day.",
			"That same clarity carries through to getting paid: share a QR code or link with a fresh address, then export your history whenever you need a record."
		]
	}, {
		title: 'Calm by design',
		paragraphs: [
			"Taking care of your own bitcoin can feel like a big step. Glid makes that first move easier to understand, with a straightforward backup experience and keys that stay on your phone, under your control.",
			"Once you’re settled in, you can see how your holdings have changed without being drawn into watching every price movement. There’s room to hold your bitcoin and get on with your day."
		]
	}, {
		title: 'Free and open',
		paragraphs: [
			"When an app looks after something as personal as your money, you should be able to see how it works. Glid’s code will be public, so anyone can examine how it handles keys and check the decisions behind it.",
			"That openness extends to the whole app on your phone. Everything from organising your wallets to sending and receiving bitcoin will be free and open source."
		]
	}].map((item, index) => ({
		...item,
		image: `/img/features/culture${index + 1}.jpg`,
		alt: ''
	}))
}

// Design section: one slide per app screen recording (/img/design/N.mp4, N.jpg poster), with
// copy written to match each recording, and its gradient (Figma 322:1281).
// The first paragraph is the only one shown on mobile, so it carries the main point.
export const design = {
	subtitle: '02 / Design',
	slides: [{
		screen: 1,
		video: true,
		title: 'Make it Yours',
		paragraphs: [
			"Give each wallet its own colours and theme, carried through every screen of the app, so each one has a personality of its own. The more familiar your money feels, the easier it becomes to look after.",
			"Whether you’re putting bitcoin aside for the future or keeping some ready to spend, separate wallets give each part of your money a purpose. You can see what belongs where without having to keep track in your head."
		],
		alt: 'Glid personal wallet, then choosing its colour theme',
		gradient: ['#7c7c7c', '#2b4e64']
	}, {
		screen: 2,
		video: true,
		title: 'Payments Made Simple',
		paragraphs: [
			"Paste an address or scan a QR code, choose how much, and you’re ready to go. Amounts show in your own currency, so you always know what you’re sending.",
			"There’s no jargon to decode along the way, just a clear check before anything leaves your wallet. Afterwards, the payment sits in your history, easy to recognise when you look back."
		],
		alt: 'Glid transactions list, then starting a payment by entering a Bitcoin address',
		gradient: ['#7c7c7c', '#88441e']
	}, {
		screen: 3,
		video: true,
		title: 'Calm by Design',
		paragraphs: [
			"Taking care of your own bitcoin can feel like a big step. Glid makes that first move easier to understand, with a straightforward backup experience and keys that stay on your phone, under your control.",
			"Once you’re settled in, you can see how your holdings have changed without being drawn into watching every price movement. There’s room to hold your bitcoin and get on with your day."
		],
		alt: 'Glid wallet setup: choosing and confirming a PIN',
		gradient: ['#bbbbbb', '#517386']
	}, {
		screen: 4,
		video: true,
		title: 'Free and Open',
		paragraphs: [
			"When an app looks after something as personal as your money, you should be able to see how it works. Glid’s code will be public, so anyone can examine how it handles keys and check the decisions behind it.",
			"That openness extends to the whole app on your phone. Everything from organising your wallets to sending and receiving bitcoin will be free and open source."
		],
		alt: 'Glid savings wallet, then receiving bitcoin with a QR code and address',
		gradient: ['#7c7c7c', '#395340']
	}]
}
