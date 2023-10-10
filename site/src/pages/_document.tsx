import { Html, Head, Main, NextScript } from 'next/document'

import constants from 'src/constants'

export default function Document() {
  return (
    <Html>
      <Head>
        <script
          async
          defer
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
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="apple-mobile-web-app-title" content={constants.SITE_NAME} />
        <meta name="application-name" content={constants.SITE_NAME} />
        <meta name="msapplication-TileColor" content="#603cba" />
        <meta name="theme-color" content="#9100F9" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&family=Poppins&display=swap"
          rel="stylesheet"
        />
      </Head>
      <script
        dangerouslySetInnerHTML={{
          __html: `
          (function () {
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
          
            let initialTheme = preferredTheme
            const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
          
            if (!initialTheme) {
              initialTheme = darkQuery.matches ? 'dark' : 'light'
            }
            setTheme(initialTheme)
          
            darkQuery.addEventListener('change', e => {
              if (!preferredTheme) {
                setTheme(e.matches ? 'dark' : 'light')
              }
            })
          })()`
        }}
      />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
