/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      keyframes: {
        translate: {
          '0%': { transform: 'translate3d(-500%, -500%, 0)' },
          '100%': { transform: 'translate3d(0, 0, 0)' }
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
