import type { Preview, ReactRenderer } from '@storybook/react'

import { withThemeByClassName } from '@storybook/addon-themes'

import { rest } from 'msw'
import { initialize, mswLoader } from 'msw-storybook-addon'

import '../src/styles/global.css'
import '../src/styles/reset.css'

initialize({
  onUnhandledRequest: ctx => {
    if (ctx.url.host === 'rata.digitraffic.fi') {
      console.error(`Failed to mock ${ctx.method} request to ${ctx.url}`)
    }
  }
})

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    },
    msw: {
      handlers: [
        rest.get(
          'https://rata.digitraffic.fi/api/v1/metadata/stations',
          (_req, res, ctx) => {
            return res(
              ctx.json([
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
            )
          }
        )
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
