import path from 'node:path'
import type { StorybookConfig } from '@storybook/react-vite'

function getAbsolutePath<T extends string>(value: T) {
  return path.resolve(process.cwd(), 'node_modules', value) as T
}

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-essentials'),
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
