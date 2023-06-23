import { globalCss } from '../index.js'

const SYSTEM_FONTS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif" as const

export const global = globalCss({
  body: {
    backgroundColor: '$slateGray100',
    lineHeight: '175%',
    fontFamily: `'Inter', ${SYSTEM_FONTS}`,
    fontSize: '$mobile-paragraph',
    '@large': {
      fontSize: '$pc-paragraph'
    },
    scrollbarGutter: 'stable both-edges',
    overflow: 'overlay'
  },

  ...Object.fromEntries(
    ['h1', 'h2', 'h3', 'h4', 'h5'].map(key => [
      [key],
      {
        fontSize: `$mobile-${key}`,
        '@large': {
          fontSize: `$pc-${key}`
        },
        lineHeight: '130%',
        fontFamily: `'Poppins', ${SYSTEM_FONTS}`
      }
    ])
  ),

  'button:focus': {
    outline: '1px solid $secondary500',
    outlineOffset: '$xxs'
  },

  '::selection': {
    color: '$primary300',
    backgroundColor: '$slateGray800'
  },

  ':root.dark': {
    body: {
      backgroundColor: '$slateGray900',
      color: '$slateGray100'
    }
  }
})
