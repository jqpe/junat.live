import type { StorybookConfig } from '@storybook/nextjs-vite'

import svgr from 'vite-plugin-svgr'

const config = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)', '../src/**/*.mdx'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-links',
    'msw-storybook-addon',
    '@storybook/addon-styling-webpack',
    '@storybook/addon-themes',
    '@storybook/addon-vitest',
  ],
  viteFinal: config => {
    config.plugins = config.plugins?.filter(p => {
      const name = (p as any)?.name ?? ''
      return !name.includes('next-image')
    })

    config.plugins?.unshift(
      svgr({
        include: ['**/*.svg', '/**/*.svg'],
      }),
    )

    return config
  },

  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
  },
  framework: {
    name: '@storybook/nextjs-vite',
    options: {
      nextConfigPath: undefined,
      // Tell the Next.js image plugin to ignore SVGs entirely
      image: {
        excludeFiles: ['**/*.svg'],
      },
    },
  },
  staticDirs: ['./static'],
} satisfies StorybookConfig

export default config
