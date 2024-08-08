import type { Meta, StoryFn } from '@storybook/react'
import type { SpinnerProps } from './'

import { Spinner } from './'

export const Default: StoryFn<SpinnerProps> = args => {
  return <Spinner {...args} />
}

export default { component: Spinner } satisfies Meta<SpinnerProps>
