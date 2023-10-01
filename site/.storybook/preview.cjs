const React = require('react')

const styles = require('@junat/design/styles')
const colors = require('@junat/design/colors')
const mswLoader = require('msw-storybook-addon')

const { getCssText } = require('@junat/design')

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
  loaders: [mswLoader]
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

module.exports = { parameters, decorators }
