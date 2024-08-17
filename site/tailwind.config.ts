import sharedConfig from '@junat/tailwind'

export default {
  ...sharedConfig,
  content: [...sharedConfig.content, '../node_modules/@junat/ui/dist/**/*.js'],
}
