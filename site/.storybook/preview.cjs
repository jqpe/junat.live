const React = require('react')

const styles = require('@junat/design/dist/styles')
const { getCssText } = require('@junat/design')

const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
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

module.exports = { parameters, decorators }
