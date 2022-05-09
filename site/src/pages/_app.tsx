import type { AppProps as NextAppProps } from 'next/app'
import type { LayoutProps } from '@typings/layout_props'
import type { ReactNode } from 'react'

import { useRouter } from 'next/router'

import { Provider as ReduxProvider } from 'react-redux'

import { store } from '../app/store'

import constants from 'src/constants'

import '../sass/globals.scss'
import { getLocaleOrThrow } from '@utils/get_locale_or_throw'

interface AppProps extends NextAppProps {
  Component: NextAppProps['Component'] & {
    layout?: ({ children, layoutProps }: LayoutProps) => JSX.Element
  }
}

interface AppProviderProps {
  children: ReactNode | ReactNode[]
}

const AppProvider = ({ children }: AppProviderProps) => {
  return <ReduxProvider store={store}>{children}</ReduxProvider>
}

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  if (Component.layout) {
    const layoutProps = {
      locale: getLocaleOrThrow(router.locale),
      ...constants
    }

    return (
      <AppProvider>
        <Component.layout layoutProps={layoutProps}>
          <Component {...pageProps} />
        </Component.layout>
      </AppProvider>
    )
  }

  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  )
}
