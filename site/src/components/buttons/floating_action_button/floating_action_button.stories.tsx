import type { StoryFn } from '@storybook/react'
import type { ComponentPropsWithoutRef } from 'react'

import { FloatingActionButton } from './'
import Close from '~/components/icons/close.svg'

export const Default: StoryFn<
  ComponentPropsWithoutRef<typeof FloatingActionButton>
> = args => {
  return (
    <FloatingActionButton {...args}>
      <Close fill="white" />
    </FloatingActionButton>
  )
}

export default { component: FloatingActionButton }
