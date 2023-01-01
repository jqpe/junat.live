import { Meta, StoryObj } from '@storybook/react'
import { Label, LabelProps } from '~/components/elements/label'

export const Default: StoryObj<LabelProps> = {
  render: args => <Label {...args}>label</Label>
}

const meta: Meta<typeof Label> = {
  component: Label
}
export default meta
