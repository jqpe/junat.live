import { Html, Head, Main, NextScript } from 'next/document'

import constants from 'src/constants'

import { getCssText } from '@junat/design'
import { NoScript } from '@components/NoScript'
import * as styles from '../styles/'

import translation from '@utils/translate'

export default function Document() {
  styles.reset()
  styles.global()

  return (
    <Html>
      <Head>
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
        <link rel="manifest" href="/api/site.webmanifest" />
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
        <style
          id="stitches"
          dangerouslySetInnerHTML={{ __html: getCssText() }}
        />
      </Head>
      <body>
        <NoScript translations={translation('all')('errors', 'nojs')} />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
