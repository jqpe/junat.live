import type { StoryFn } from '@storybook/react'
import type { ComponentPropsWithoutRef } from 'react'

import { Notification } from './notification'

export const Default: StoryFn<
  Partial<ComponentPropsWithoutRef<typeof Notification>>
> = args => {
  return (
    <Notification
      body="Notification to be used inline"
      title="Notification"
      {...args}
    />
  )
}

export default { component: Notification }
