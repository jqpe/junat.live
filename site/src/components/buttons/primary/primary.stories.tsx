import type { Meta, StoryFn } from '@storybook/react'

import { PrimaryButton, PrimaryButtonProps } from './'

export const Default: StoryFn<PrimaryButtonProps> = args => {
  return <PrimaryButton {...args}>primary button</PrimaryButton>
}

export default {
  component: PrimaryButton,
  parameters: {
    controls: { disable: true }
  }
} satisfies Meta<PrimaryButtonProps>
