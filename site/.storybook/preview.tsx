import type { Preview, Decorator } from '@storybook/react'

import React from 'react'

import * as styles from '@junat/design/styles'
import * as colors from '@junat/design/colors'
import { initialize, mswLoader } from 'msw-storybook-addon'
import { rest } from 'msw'

import { getCssText } from '@junat/design'

import '../src/global.css'

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
      { name: 'light', value: colors.slateGray.slateGray100 },
      { name: 'dark', value: colors.slateGray.slateGray900 }
    ]
  },
  msw: {
    handlers: [
      rest.get(
        'https://rata.digitraffic.fi/api/v1/metadata/stations',
        (req, res, ctx) => {
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

/**
 * Includes CSS globals and CSS reset
 */
const STYLES_DECORATOR: Decorator = Story => {
  styles.global()
  styles.reset()

  return (
    <div>
      <style>{getCssText()}</style>
      {Story()}
    </div>
  )
}

const decorators: Preview['decorators'] = [STYLES_DECORATOR]
const loaders: Preview['loaders'] = [mswLoader]

const previewConfig: Preview = { parameters, decorators, loaders }

export default previewConfig
