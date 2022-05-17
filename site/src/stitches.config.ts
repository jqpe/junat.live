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
    }
  }
})
