import type { AppProps as NextAppProps } from 'next/app'
import type { FC, ReactChild } from 'react'

import { Provider } from 'react-redux'

import { store } from '../app/store'

import '../sass/globals.scss'

interface AppProps extends NextAppProps {
  Component: NextAppProps['Component'] & { layout?: FC }
}

const provider = (children: ReactChild | ReactChild[]) => {
  return <Provider store={store}>{children}</Provider>
}

export default function MyApp({ Component, pageProps }: AppProps) {
  if (Component.layout) {
    return provider(
      <Component.layout>
        <Component {...pageProps} />
      </Component.layout>
    )
  }

  return provider(<Component {...pageProps} />)
}
