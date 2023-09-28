import { Meta, StoryObj } from '@storybook/react'
import { Label, LabelProps } from './'

export const Default: StoryObj<LabelProps> = {
  render: args => <Label {...args}>label</Label>
}

export default {
  component: Label,
  parameters: {
    controls: { disable: true }
  }
} satisfies Meta<typeof Label>
