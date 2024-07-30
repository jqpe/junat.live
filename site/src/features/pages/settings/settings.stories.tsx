import type { Meta, StoryFn } from '@storybook/react'

import { withPageLayout } from '~/../.storybook/utils'
import { Settings } from './components/page'

export const Default: StoryFn<typeof Settings> = () => {
  return <Settings />
}

export default {
  component: Settings,
  decorators: [withPageLayout()],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Settings>
