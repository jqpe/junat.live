import path from 'node:path'
import type { StorybookConfig } from '@storybook/react-vite'

function getAbsolutePath(value: string) {
  // eslint-disable-next-line unicorn/prefer-module
  return path.dirname(require.resolve(path.join(value, 'package.json')))
}

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-themes'),
    getAbsolutePath('@storybook/addon-links'),
    {
      name: getAbsolutePath('@storybook/addon-essentials'),
      options: {
        backgrounds: false,
      },
    },
    getAbsolutePath('@storybook/addon-interactions'),
  ],
  core: {
    builder: '@storybook/builder-vite',
  },
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  staticDirs: ['./static'],
}
export default config
