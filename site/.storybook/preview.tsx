import type { Preview, Decorator } from '@storybook/react'

import React from 'react'

import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindCss from '../tailwind.config'

const { theme } = resolveConfig(tailwindCss)

const BG_DARK = theme.colors.gray[900]
const BG_LIGHT = theme.colors.gray[100]

import { initialize, mswLoader } from 'msw-storybook-addon'
import { rest } from 'msw'

import '../src/styles/global.css'

initialize({
  onUnhandledRequest: ctx => {
    if (ctx.url.host === 'rata.digitraffic.fi') {
      console.error(`Failed to mock ${ctx.method} request to ${ctx.url}`)
    }
  }
})

const parameters: Preview['parameters'] = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  backgrounds: {
    default: 'light',
    values: [
      { name: 'light', value: BG_LIGHT },
      { name: 'dark', value: BG_DARK }
    ]
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
                stationName: { fi: 'Ainola', en: 'Ainola', sv: 'Ainola' },
                stationShortCode: 'AIN'
              }
            ])
          )
        }
      )
    ]
  }
}

const THEME: Decorator = (Story, ctx) => {
  if (ctx.globals.backgrounds.value === BG_DARK) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }

  return <div>{Story()}</div>
}

const decorators: Preview['decorators'] = [THEME]
const loaders: Preview['loaders'] = [mswLoader]

const previewConfig: Preview = { parameters, decorators, loaders }

export default previewConfig
