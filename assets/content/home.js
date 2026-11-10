// Copy adapted from assets/glid-overview.md. Images are temporary Stud placeholders.
export const features = {
  subtitle: '02 / Features',
  title: 'Your Bitcoin.Your wallets. Your way.',
  contents: [{
    title: 'Make it yours',
    paragraphs: [
      "Whether you’re putting bitcoin aside for the future or keeping some ready to spend, separate wallets give each part of your money a purpose. You can see what belongs where without having to keep track in your head.",
      "Give those wallets names, colours and styles that feel like you. The more familiar your money feels, the easier it becomes to look after."
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
