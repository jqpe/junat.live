import type { StoryFn } from '@storybook/react'
import type { ComponentPropsWithoutRef } from 'react'

import { Popover } from './'

interface Props extends ComponentPropsWithoutRef<typeof Popover> {
  children: string
}

export const Default: StoryFn<Props> = args => {
  return <Popover {...args} />
}

export default {
  component: Popover,
  args: {
    label: 'Popover label',
    triggerLabel: 'Label for the trigger button used for accessibility',
    closeLabel: 'Label for the close button used for accessibility',
    children: 'Popover can have arbitary children'
  }
}
