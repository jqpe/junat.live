/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      keyframes: {
        translate: {
          '0%': { transform: 'translate3d(-500%, -500%, 0)' },
          '100%': { transform: 'translate3d(0, 0, 0)' }
        },
        fadein: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },
        'dialog-content': {
          '0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(0.96)' },
          '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' }
        }
      },
      animation: {
        translate: 'translate 1s infinite'
      },
      fontFamily: {
        ui: 'Poppins',
        body: 'Inter'
      },
      colors: {
        primary: {
          100: '#fdfaff',
          200: '#f6eaff',
          300: '#eacdff',
          400: '#d292ff',
          500: '#c779ff',
          600: '#9100f9',
          700: '#7100c2',
          800: '#420071',
          900: '#09000f'
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
          900: '#000305'
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
          900: 'hsla(201, 95.50%, 0.92%, 0.980)'
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
          900: '#030304'
        }
      }
    }
  },
  plugins: []
}
