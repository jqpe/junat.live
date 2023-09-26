import type { StoryFn } from '@storybook/react'

import { PrimaryButton, PrimaryButtonProps } from './'

export const Default: StoryFn<PrimaryButtonProps> = args => {
  return (
    <PrimaryButton size="xs" {...args}>
      primary button
    </PrimaryButton>
  )
}

export default { component: PrimaryButton }
