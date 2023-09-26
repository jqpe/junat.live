import { Meta, StoryObj } from '@storybook/react'
import { Label, LabelProps } from './'

export const Default: StoryObj<LabelProps> = {
  render: args => <Label {...args}>label</Label>
}

const meta: Meta<typeof Label> = {
  component: Label
}
export default meta
