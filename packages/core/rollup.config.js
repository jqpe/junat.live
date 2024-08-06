import { defineConfig } from 'rollup'

import sharedConfig from '@junat/rollup/typescript-package.js'

export default defineConfig({
  ...sharedConfig,
  external: ['intl-messageformat'],
})
