import type { Config } from 'tailwindcss/types/config'

import defaultConfig from 'tailwindcss/defaultConfig'

export const config = {
  content: ['./src/**/*.tsx'],
  darkMode: 'class',
  corePlugins: {
    preflight: false,
  },
  theme: {
    screens: {
      ...defaultConfig.theme?.screens,
      sm: '320px',
    },
    colors: {
      transparent: 'rgba(0,0,0,.0)',
      white: '#fff',
      error: {
        100: '#fffafa',
        200: '#feeae9',
        300: '#fdcccb',
        400: '#fa8e8b',
        500: '#f8726d',
        600: '#c91009',
        700: '#9c0c07',
        800: '#5a0704',
        900: '#0b0101',
      },
      primary: {
        100: '#fdfaff',
        200: '#f6eaff',
        300: '#eacdff',
        400: '#d292ff',
        500: '#c779ff',
        600: '#9100f9',
        700: '#7100c2',
        800: '#420071',
        900: '#09000f',
      },
      secondary: {
        100: '#f7fcff',
        200: '#def3fe',
        300: '#aae0fd',
        400: '#39b7fa',
        500: '#06a4f9',
        600: '#046aa1',
        700: '#03517b',
        800: '#022d45',
        900: '#000305',
      },
      secondaryA: {
        100: 'hsla(201, 95.50%, 98.38%, 0.040)',
        200: 'hsla(201, 95.50%, 93.39%, 0.071)',
        300: 'hsla(201, 95.50%, 82.96%, 0.118)',
        400: 'hsla(201, 95.50%, 60.37%, 0.283)',
        500: 'hsla(201, 95.50%, 49.98%, 0.412)',
        600: 'hsla(201, 95.50%, 32.31%, 0.512)',
        700: 'hsla(201, 95.50%, 24.69%, 0.632)',
        800: 'hsla(201, 95.50%, 13.75%, 0.850)',
        900: 'hsla(201, 95.50%, 0.92%, 0.980)',
      },
      gray: {
        100: '#fbfbfc',
        200: '#edeff3',
        300: '#d4d8e1',
        400: '#a5adc0',
        500: '#929cb3',
        600: '#59647f',
        700: '#444d62',
        800: '#252a35',
        900: '#030304',
      },
      grayA: {
        100: 'hsla(222,17.9%,98.6%,0.040)',
        200: 'hsla(222,17.9%,94.1%,0.071)',
        300: 'hsla(222,17.9%,85.7%,0.119)',
        400: 'hsla(222,17.9%,70%,0.283)',
        500: 'hsla(222,17.9%,63.8%,0.412)',
        600: 'hsla(222,17.9%,42.3%,0.512)',
        700: 'hsla(222,17.9%,32.5%,0.632)',
        800: 'hsla(222,17.9%,17.7%,0.850)',
        900: 'hsla(222,17.9%,1.3%,0.980)',
      },
    },
    fontSize: {
      sm: 'var(--text-sm)',
      base: 'var(--text-base)',
      lg: 'var(--text-lg)',
      xl: 'var(--text-xl)',
      '2xl': 'var(--text-2xl)',
      '3xl': 'var(--text-3xl)',
      '4xl': 'var(--text-4xl)',
    },
    extend: {
      spacing: {
        'header-height': 'var(--header-height)',
      },
      gridTemplateColumns: {
        'timetable-row': 'min(35%, 30vw) 1fr 0.4fr 0.4fr',
      },
      transitionProperty: { transform: 'transform' },
      keyframes: {
        translate: {
          '0%': { transform: 'translate3d(-500%, -500%, 0)' },
          '100%': { transform: 'translate3d(0, 0, 0)' },
        },
        fadein: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'dialog-content': {
          '0%': {
            opacity: '0',
            transform: 'translate(-50%, -48%) scale(0.96)',
          },
          '100%': { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
        },
        'toast-slide-left': {
          from: { transform: 'translateX(-var(--radix-toast-swipe-end-x))' },
          to: { transform: 'translateX(-110%)', opacity: '0' },
        },
        slideDownAndFade: {
          from: { opacity: '0', transform: 'translateY(-2px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeftAndFade: {
          from: { opacity: '0', transform: 'translateX(2px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideUpAndFade: {
          from: { opacity: '0', transform: 'translateY(2px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideRightAndFade: {
          from: { opacity: '0', transform: 'translateX(-2px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        translate: 'translate 1s infinite',
        'toast-slide-left': 'toast-slide-left 100ms ease-in forwards',
        slideDownAndFade:
          'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideLeftAndFade:
          'slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideUpAndFade: 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideRightAndFade:
          'slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
      fontFamily: {
        ui: 'Poppins',
        body: 'Inter',
      },
    },
  },
  plugins: [],
} satisfies Config

export default config
