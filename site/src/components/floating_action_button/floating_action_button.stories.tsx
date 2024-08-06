import type { Meta, StoryFn } from '@storybook/react'
import type { ComponentPropsWithoutRef } from 'react'

import Close from '@junat/ui/icons/close.svg'
import { FloatingActionButton } from './'

type Props = ComponentPropsWithoutRef<typeof FloatingActionButton>

export const Default: StoryFn<Props> = args => {
  return (
    <FloatingActionButton {...args}>
      <Close fill="white" />
    </FloatingActionButton>
  )
}

export default {
  component: FloatingActionButton,
} satisfies Meta<Props>
