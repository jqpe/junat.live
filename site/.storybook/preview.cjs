const React = require('react')

const styles = require('@junat/design/styles')
const colors = require('@junat/design/colors')
const { initialize, mswLoader } = require('msw-storybook-addon')
const { rest } = require('msw')

const { getCssText } = require('@junat/design')

initialize({
  onUnhandledRequest: ctx => {
    if (ctx.url.host === 'rata.digitraffic.fi') {
      console.error(`Failed to mock ${ctx.method} request to ${ctx.url}`)
    }
  }
})

const parameters = {
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
      { name: 'light', value: colors.primary.primary100 },
      { name: 'dark', value: colors.primary.primary900 }
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
const STYLES_DECORATOR = Story => {
  styles.global()
  styles.reset()

  return React.createElement(
    'div',
    {},
    React.createElement('style', {}, getCssText()),
    Story()
  )
}

const decorators = [STYLES_DECORATOR]
const loaders = [mswLoader]

module.exports = { parameters, decorators, loaders }
