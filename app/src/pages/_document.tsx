import { Head, Html, Main, NextScript } from 'next/document'

import { SITE_NAME } from '@junat/core/constants'

export default function Document() {
  return (
    <Html>
      <Head>
        <script
          async
          src="https://analytics.junat.live/script.js"
          data-website-id="d9cc456e-d163-4432-991a-021091149b58"
          // Prevents the tracking script from running on preview environment
          data-domains="junat.live"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />

        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/fonts/Geist.var.woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/fonts/Poppins.woff2"
          crossOrigin="anonymous"
        />

        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
        <meta name="application-name" content={SITE_NAME} />
        <meta name="msapplication-TileColor" content="#603cba" />
      </Head>
      <script
        dangerouslySetInnerHTML={{
          __html: `
          try {
            ;(function () {
              function setTheme(theme) {
                window.__theme = theme
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              }
          
              var preferredTheme
              try {
                preferredTheme = localStorage.getItem('theme')
              } catch (err) {}
          
              window.__setPreferredTheme = function (theme) {
                preferredTheme = theme
                setTheme(theme)
                try {
                  localStorage.setItem('theme', theme)
                } catch (err) {}
              }
          
              var initialTheme = preferredTheme
              var darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
          
              if (!initialTheme) {
                initialTheme = darkQuery.matches ? 'dark' : 'light'
              }
              setTheme(initialTheme)
          
              darkQuery.addEventListener('change', e => {
                if (!preferredTheme) {
                  setTheme(e.matches ? 'dark' : 'light')
                }
              })
            })()
          } catch (e) {
            console.info(e)
          }`,
        }}
      />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
