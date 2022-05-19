import { createStitches } from '@stitches/react'

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
      /* Primary */
      primary100: '#fdfaff',
      primary200: '#f6eaff',
      primary300: '#eacdff',
      primary400: '#d292ff',
      primary500: '#c779ff',
      primary600: '#9100f9',
      primary700: '#7100c2',
      primary800: '#420071',
      primary900: '#09000f',
      /* Secondary */
      secondary100: '#fafcfb',
      secondary200: '#e8f1ee',
      secondary300: '#c8ddd5',
      secondary400: '#89b6a5',
      secondary500: '#71a792',
      secondary600: '#436d5d',
      secondary700: '#335347',
      secondary800: '#1c2e27',
      secondary900: '#020303',
      /* Slate gray */
      slateGray100: '#fbfbfc',
      slateGray200: '#edeff3',
      slateGray300: '#d4d8e1',
      slateGray400: '#a5adc0',
      slateGray500: '#929cb3',
      slateGray600: '#59647f',
      slateGray700: '#444d62',
      slateGray800: '#252a35',
      slateGray900: '#030304'
    },
    space: {
      1: '5px',
      2: '10px',
      3: '15px',
      4: '20px',
      5: '25px',
      6: '30px'
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
      'mobile-h1': '2.49rem',
      'mobile-h2': '2.07rem',
      'mobile-h3': '1.73rem',
      'mobile-h4': '1.44rem',
      'mobile-h5': '1.2rem',
      'mobile-paragraph': '1rem',
      'mobile-caption': '0.83rem'
    }
  },
  media: {
    dark: '(prefers-color-scheme: dark)',
    large: '(min-width: 34.375rem)'
  }
})
