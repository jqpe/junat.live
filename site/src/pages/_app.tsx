import type { AppProps as NextAppProps } from 'next/app'
import type { LayoutProps } from '@typings/layout_props'

import { useRouter } from 'next/router'
import { ReactChild } from 'react'

import { Provider } from 'react-redux'

import { store } from '../app/store'

import constants from 'src/constants'

import '../sass/globals.scss'
import { getLocaleOrThrow } from '@utils/get_locale_or_throw'

interface AppProps extends NextAppProps {
  Component: NextAppProps['Component'] & {
    layout?: ({ children, layoutProps }: LayoutProps) => JSX.Element
  }
}

const provider = (children: ReactChild | ReactChild[]) => {
  return <Provider store={store}>{children}</Provider>
}

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  if (Component.layout) {
    const layoutProps = {
      locale: getLocaleOrThrow(router.locale),
      ...constants
    }

    return provider(
      <Component.layout layoutProps={layoutProps}>
        <Component {...pageProps} />
      </Component.layout>
    )
  }

  return provider(<Component {...pageProps} />)
}
