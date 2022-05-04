import type { AppProps as NextAppProps } from 'next/app'
import type { LayoutProps } from '@typings/layout_props'
import type { ReactNode } from 'react'

import { useRouter } from 'next/router'

import { Provider as ReduxProvider } from 'react-redux'
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme
} from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'

import { store } from '../app/store'

import constants from 'src/constants'

import '../sass/globals.scss'
import { getLocaleOrThrow } from '@utils/get_locale_or_throw'

import theme from '@theme/index'
import useColorScheme from '@hooks/use_color_scheme.hook'

interface AppProps extends NextAppProps {
  Component: NextAppProps['Component'] & {
    layout?: ({ children, layoutProps }: LayoutProps) => JSX.Element
  }
}

interface AppProviderProps {
  colorScheme: ColorScheme
  toggleColorScheme: (colorScheme?: ColorScheme) => void
  children: ReactNode | ReactNode[]
}

const AppProvider = ({
  children,
  colorScheme,
  toggleColorScheme
}: AppProviderProps) => {
  return (
    <ReduxProvider store={store}>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        {
          <MantineProvider theme={theme}>
            <NotificationsProvider position="bottom-center">
              {children}
            </NotificationsProvider>
          </MantineProvider>
        }
      </ColorSchemeProvider>
    </ReduxProvider>
  )
}

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const { colorScheme, setColorScheme } = useColorScheme()

  const appProviderProps = {
    colorScheme: colorScheme,
    toggleColorScheme: (maybeColorScheme?: 'dark' | 'light') => {
      if (maybeColorScheme) {
        setColorScheme(maybeColorScheme)
      }
    }
  }

  if (Component.layout) {
    const layoutProps = {
      locale: getLocaleOrThrow(router.locale),
      ...constants
    }

    return (
      <AppProvider {...appProviderProps}>
        <Component.layout layoutProps={layoutProps}>
          <Component {...pageProps} />
        </Component.layout>
      </AppProvider>
    )
  }

  return (
    <AppProvider {...appProviderProps}>
      <Component {...pageProps} />
    </AppProvider>
  )
}
