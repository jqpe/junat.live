import type { Meta, StoryFn } from '@storybook/react'
import type { SpinnerProps } from './spinner'

import { Spinner } from './spinner'

export const Default: StoryFn<SpinnerProps> = args => {
  return <Spinner {...args} />
}

export default { component: Spinner } satisfies Meta<SpinnerProps>
