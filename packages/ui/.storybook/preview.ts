import type { Preview, ReactRenderer } from '@storybook/react'

import { withThemeByClassName } from '@storybook/addon-themes'

import './reset.css'
import './tailwind.css'

const preview: Preview = {
  decorators: [
    withThemeByClassName<ReactRenderer>({
      themes: { light: '', dark: 'dark' },
      defaultTheme: 'light',
      parentSelector: 'html',
    }),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /date$/i,
      },
    },
  },
  globalTypes: {
    globalTypes: { theme: { type: 'string' } },
  },
}

export default preview
