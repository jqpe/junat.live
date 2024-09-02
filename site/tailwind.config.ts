import type { Config } from 'tailwindcss'

import defaultTheme from 'tailwindcss/defaultTheme'

import sharedConfig from '@junat/tailwind'

export default {
  ...sharedConfig,
  content: [...sharedConfig.content, '../node_modules/@junat/ui/dist/**/*.js'],
  theme: {
    ...sharedConfig.theme,
    extend: {
      ...sharedConfig.theme.extend,
      minWidth: defaultTheme.maxWidth,
    },
  },
} satisfies Config
