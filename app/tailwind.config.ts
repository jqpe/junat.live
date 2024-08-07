import type { Config } from 'tailwindcss'

import sharedConfig from '@junat/tailwind'

export default {
  ...sharedConfig,
  content: [
    'index.html',
    './src/**/*.tsx',
    '../node_modules/@junat/ui/dist/**/*.js',
  ],
} satisfies Config
