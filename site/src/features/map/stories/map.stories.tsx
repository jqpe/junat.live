import { Map } from '../components/map'

import type { StoryFn } from '@storybook/react'
import type { ComponentPropsWithoutRef } from 'react'

export const Default: StoryFn<ComponentPropsWithoutRef<typeof Map>> = args => {
  return <Map {...args} />
}

export default { component: Map }
