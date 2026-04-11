import type { Meta, StoryObj } from '@storybook/nextjs'

import { NotFound } from './404'

export const Default: StoryObj<typeof NotFound> = {}

const meta: Meta = {
  component: NotFound,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
