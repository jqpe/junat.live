import type { AppProps as NextAppProps } from 'next/app'
import type { LayoutProps } from '@typings/layout_props'

import { useRouter } from 'next/router'

import constants from 'src/constants'

import dynamic from 'next/dynamic'

import { getLocale } from '@utils/get_locale'
import { useWakeLock } from '@hooks/use_wake_lock'
import translate from '@utils/translate'
import { AppProvider } from './provider'

import 'maplibre-gl/dist/maplibre-gl.css'

const NoScript = dynamic(() => import('@components/common/no_script'))

interface AppProps extends NextAppProps {
  Component: NextAppProps['Component'] & {
    layout?: ({ children, layoutProps }: LayoutProps) => JSX.Element
  }
}

export function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  useWakeLock()

  if (Component.layout) {
    const layoutProps = {
      locale: getLocale(router.locale),
      ...constants
    }

    return (
      <AppProvider>
        <Component.layout layoutProps={layoutProps}>
          <NoScript>
            {translate(getLocale(router.locale))('errors', 'nojs')}
          </NoScript>

          <Component {...pageProps} />
        </Component.layout>
      </AppProvider>
    )
  }

  return (
    <AppProvider>
      <NoScript>
        {translate(getLocale(router.locale))('errors', 'nojs')}
      </NoScript>

      <Component {...pageProps} />
    </AppProvider>
  )
}
