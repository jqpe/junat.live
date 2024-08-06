import type { Config } from 'tailwindcss'

import sharedConfig from '@junat/tailwind'

export default Object.assign(sharedConfig, {
  content: ['src/**/*.{tsx}', 'index.html'],
} satisfies Config)
