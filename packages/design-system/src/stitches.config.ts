import { createStitches, defaultThemeMap } from '@stitches/react'

import {
  primary,
  primaryA,
  secondary,
  secondaryA,
  slateGray,
  slateGrayA
} from './colors/index.js'

export const {
  config,
  createTheme,
  css,
  getCssText,
  globalCss,
  keyframes,
  prefix,
  reset,
  styled,
  theme
} = createStitches({
  prefix: 'junat',
  theme: {
    colors: {
      ...primary,
      ...primaryA,
      ...secondary,
      ...secondaryA,
      ...slateGray,
      ...slateGrayA
    },
    space: {
      1: '5px',
      2: '10px',
      3: '15px',
      4: '20px',
      5: '25px',
      6: '30px'
    },
    lineHeights: {
      sm: '130%',
      md: '175%'
    },
    fontSizes: {
      /* PC font sizes */
      /* https://type-scale.com/?size=14&scale=1.2 */
      'pc-h1': '2.49rem',
      'pc-h2': '2.07rem',
      'pc-h3': '1.73rem',
      'pc-h4': '1.44rem',
      'pc-h5': '1.2rem',
      'pc-paragraph': '1rem',
      'pc-caption': '0.83rem',
      /* Mobile font sizes */
      /* https://type-scale.com/?size=14&scale=1.175 */
      'mobile-h1': '1.96rem',
      'mobile-h2': '1.67rem',
      'mobile-h3': '1.42rem',
      'mobile-h4': '1.21rem',
      'mobile-h5': '1.03rem',
      'mobile-paragraph': '0.88rem',
      'mobile-caption': '0.74rem'
    }
  },
  media: {
    dark: '(prefers-color-scheme: dark)',
    large: '(min-width: 34.375rem)'
  },
  themeMap: {
    ...defaultThemeMap,
    outlineOffset: 'space'
  }
})
