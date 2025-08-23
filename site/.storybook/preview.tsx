import type { Preview, ReactRenderer } from '@storybook/react'

import Link from 'next/link'
import { withThemeByClassName } from '@storybook/addon-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { initialize, mswLoader } from 'msw-storybook-addon'

import { UiContext } from '@junat/react-hooks/ui/provider'

import '../src/styles/global.css'
import '../src/styles/reset.css'

import { translate } from '../src/i18n'

initialize({
  onUnhandledRequest: ctx => {
    if (/rata.digitraffic.fi/.test(ctx.url)) {
      console.error(`Failed to mock ${ctx.method} request to ${ctx.url}`)
    }
  },
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    msw: {
      handlers: {
        metadata: http.get(
          'https://rata.digitraffic.fi/api/v1/metadata/stations',
          () => {
            return HttpResponse.json([
              {
                countryCode: 'FI',
                latitude: 1,
                longitude: 2,
                stationName: 'Ainola',
                stationShortCode: 'AIN',
              },
              {
                countryCode: 'FI',
                latitude: 1,
                longitude: 2,
                stationName: 'Helsinki asema',
                stationShortCode: 'HKI',
              },
              {
                countryCode: 'FI',
                latitude: 1,
                longitude: 2,
                stationName: 'Riihimäki asema',
                stationShortCode: 'RI',
              },
            ])
          },
        ),
      },
    },
  },
  decorators: [
    withThemeByClassName<ReactRenderer>({
      themes: { light: '', dark: 'dark' },
      defaultTheme: 'light',
      parentSelector: 'html',
    }),
    Story => {
      return (
        <QueryClientProvider client={new QueryClient()}>
          <UiContext
            value={{
              locale: 'en',
              Link,
              t: translate('en'),
              translate,
            }}
          >
            <Story />
          </UiContext>
        </QueryClientProvider>
      )
    },
  ],
  loaders: [mswLoader],
  globalTypes: { theme: { type: 'string' } },
}

export default preview
