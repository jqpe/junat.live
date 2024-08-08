import type { Meta, StoryObj } from '@storybook/react'

import { NotFound } from './'

export const Default: StoryObj<typeof NotFound> = {}

const meta: Meta = {
  component: NotFound,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
