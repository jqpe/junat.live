import type { Preview, ReactRenderer } from '@storybook/react'

import { withThemeByClassName } from '@storybook/addon-themes'

import { http, HttpResponse } from 'msw'
import { initialize, mswLoader } from 'msw-storybook-addon'

import '../src/styles/global.css'
import '../src/styles/reset.css'

initialize({
  onUnhandledRequest: ctx => {
    if (/rata.digitraffic.fi/.test(ctx.url)) {
      console.error(`Failed to mock ${ctx.method} request to ${ctx.url}`)
    }
  }
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    },
    msw: {
      handlers: [
        http.get('https://rata.digitraffic.fi/api/v1/metadata/stations', () => {
          return HttpResponse.json([
            {
              countryCode: 'FI',
              latitude: 1,
              longitude: 2,
              stationName: 'Ainola',
              stationShortCode: 'AIN'
            },
            {
              countryCode: 'FI',
              latitude: 1,
              longitude: 2,
              stationName: 'Helsinki asema',
              stationShortCode: 'HKI'
            },
            {
              countryCode: 'FI',
              latitude: 1,
              longitude: 2,
              stationName: 'Riihimäki asema',
              stationShortCode: 'RI'
            }
          ])
        })
      ]
    }
  },
  decorators: [
    withThemeByClassName<ReactRenderer>({
      themes: { light: '', dark: 'dark' },
      defaultTheme: 'light',
      parentSelector: 'html'
    })
  ],
  loaders: [mswLoader],
  globalTypes: { theme: { type: 'string' } }
}

export default preview
