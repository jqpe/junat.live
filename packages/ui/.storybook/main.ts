import type { StorybookConfig } from '@storybook/react-vite'

import { mergeConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-themes',
    '@storybook/addon-docs',
    '@storybook/addon-vitest',
  ],
  core: {
    builder: '@storybook/builder-vite',
  },
  viteFinal: async config => {
    return mergeConfig(config, {
      plugins: [svgr()],
    })
  },
  framework: '@storybook/react-vite',
  staticDirs: ['./static'],
}
export default config
