const siteUrl = 'https://glid.cash'
const title = 'Glid — Non-custodial Bitcoin wallet for iOS'
const description = 'Glid is a simple, beautifully designed non-custodial Bitcoin wallet for iOS. Coming soon.'
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {
    enabled: false
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },
  css: ['lenis/dist/lenis.css', '~/assets/scss/main.scss'],
  runtimeConfig: {
    public: {
      siteUrl
    }
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
      title,
      meta: [{
        name: 'description',
        content: description
      }, {
        name: 'theme-color',
        content: '#7c7c7c'
      }, {
        name: 'color-scheme',
        content: 'dark'
      }, {
        name: 'apple-mobile-web-app-title',
        content: 'Glid'
      }, {
        name: 'format-detection',
        content: 'telephone=no'
      }, {
        property: 'og:type',
        content: 'website'
      }, {
        property: 'og:site_name',
        content: 'Glid'
      }, {
        property: 'og:title',
        content: title
      }, {
        property: 'og:description',
        content: description
      }, {
        property: 'og:url',
        content: siteUrl
      }, {
        property: 'og:image',
        content: `${siteUrl}/og.jpg`
      }, {
        property: 'og:image:width',
        content: '1200'
      }, {
        property: 'og:image:height',
        content: '630'
      }, {
        property: 'og:image:alt',
        content: 'Glid'
      }, {
        property: 'og:locale',
        content: 'en_GB'
      }, {
        name: 'twitter:card',
        content: 'summary_large_image'
      }, {
        name: 'twitter:title',
        content: title
      }, {
        name: 'twitter:description',
        content: description
      }, {
        name: 'twitter:image',
        content: `${siteUrl}/og.jpg`
      }],
      link: [{
        rel: 'canonical',
        href: `${siteUrl}/`
      }, {
        rel: 'icon',
        href: '/favicon.ico',
        sizes: '48x48'
      }, {
        rel: 'icon',
        href: '/favicon.svg',
        type: 'image/svg+xml'
      }, {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon.png'
      }, {
        rel: 'manifest',
        href: '/site.webmanifest'
      }],
      script: [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'MobileApplication',
          name: 'Glid',
          description,
          url: siteUrl,
          operatingSystem: 'iOS',
          applicationCategory: 'FinanceApplication',
          image: `${siteUrl}/icon-512.png`
        })
      }]
    }
  },
  nitro: {
    prerender: {
      routes: ['/']
    }
  }
})
