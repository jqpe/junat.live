import type { Meta, StoryFn } from '@storybook/react'

import { PrimaryButton } from '.'

export const Default: StoryFn<typeof PrimaryButton> = args => {
  return <PrimaryButton {...args}>primary button</PrimaryButton>
}

export default {
  component: PrimaryButton,
  parameters: {
    controls: { disable: true },
  },
} satisfies Meta<typeof PrimaryButton>
