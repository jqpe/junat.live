import { globalCss } from '../index.js'

export const reset = globalCss({
  '*:where(:not(iframe, canvas, img, svg, video):not(svg *))': {
    all: 'unset',
    display: 'revert',
    colorScheme: 'light dark'
  },

  '*, *::before, *::after': {
    boxSizing: 'border-box'
  },

  'ol, ul': {
    listStyle: 'none'
  },

  img: {
    maxWidth: '100%'
  },

  table: {
    borderCollapse: 'collapse'
  },

  textarea: {
    whiteSpace: 'revert'
  }
})
