import type { AppProps as NextAppProps } from 'next/app'
import type { FC } from 'react'

import '../sass/globals.scss'

interface AppProps extends NextAppProps {
  Component: NextAppProps['Component'] & { layout?: FC }
}

export default function MyApp({ Component, pageProps }: AppProps) {
  if (Component.layout) {
    return (
      <Component.layout>
        <Component {...pageProps} />
      </Component.layout>
    )
  }

  return <Component {...pageProps} />
}
