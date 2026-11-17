<script setup>
const title = 'Privacy Policy — Glid'
const description = 'How Glid handles information when you visit glid.cash or contact us.'

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
          This policy explains how Glid ("we", "our", or "us") handles information when you
          visit glid.cash or contact us. It covers this website; it does not describe data
          handling within the Glid wallet app.
        </p>

        <h2 class="monospace">001. Information We Collect</h2>
        <p>
          If you email us, we receive your email address and any information you choose to
          include in your message. Website hosting and analytics services may also process
          technical and usage information, such as your IP address, browser and device type,
          and the pages you visit.
        </p>

        <h2 class="monospace">002. How We Use Your Information</h2>
        <p>
          We use information to respond to enquiries, operate and secure the website,
          understand how visitors use it, and improve its performance and content.
        </p>

        <h2 class="monospace">003. Sharing of Information</h2>
        <p>
          We do not sell your personal information. Hosting, email, and analytics providers
          may process information to provide their services. We may also disclose information
          where required by law.
        </p>

        <h2 class="monospace">004. Cookies and Analytics</h2>
        <p>
          This website loads Google Tag Manager in production to manage tracking tags.
          Depending on the tags enabled, Google and other analytics services may collect
          usage information and use cookies or similar technologies. You can manage or
          block cookies through your browser settings.
        </p>

        <h2 class="monospace">005. Retention and Security</h2>
        <p>
          We retain personal information for as long as needed for the purposes described
          above, including responding to enquiries and meeting legal obligations. No method
          of internet transmission or electronic storage is completely secure. Please do
          not email us wallet recovery phrases, private keys, or other sensitive wallet details.
        </p>

        <h2 class="monospace">006. External Links</h2>
        <p>
          Links to other websites are subject to those websites’ privacy policies.
          We are not responsible for their content or privacy practices.
        </p>

        <h2 class="monospace">007. Your Rights</h2>
        <p>
          Depending on applicable law, you may have rights to access, correct, or delete your
          personal information, restrict or object to its use, or request a portable copy.
          Where processing relies on consent, you may withdraw it. You may also complain to
          your local data protection authority. To make a request, contact us below.
        </p>

        <h2 class="monospace">008. Changes to This Policy</h2>
        <p>
          We may update this policy as the website changes. The date above indicates when
          it was last updated.
        </p>

        <h2 class="monospace">009. Contact</h2>
        <p>
          For privacy questions or requests, email
          <a href="mailto:wbbr.co@gmail.com">wbbr.co@gmail.com</a>.
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
    padding: 20vw 0 10vw;
    line-height: 1.5;
  }

  h1 {
    margin-bottom: 32px;
  }

  h2 {
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
    padding-bottom: 80px;

    article {
      padding: 20svh 0 10svh;
    }

    p {
      max-width: 100%;
    }
  }
}
</style>
