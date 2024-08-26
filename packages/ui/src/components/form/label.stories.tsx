import type { Meta, StoryObj } from '@storybook/react'

import { Label } from './label'

export const Default: StoryObj<typeof Label> = {
  render: args => <Label {...args}>label</Label>,
}

export default {
  component: Label,
  parameters: {
    controls: { disable: true },
  },
} satisfies Meta<typeof Label>
