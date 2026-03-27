import type { StoryFn } from '@storybook/nextjs'
import type { ComponentPropsWithoutRef } from 'react'

import { StationList } from './'

export const Default: StoryFn<
  ComponentPropsWithoutRef<typeof StationList>
> = args => {
  return <StationList {...args} />
}

export default {
  component: StationList,
  args: {
    stations: [
      {
        stationShortCode: 'AIN',
        stationName: { fi: 'Ainola', en: 'Ainola' },
      },
    ],
    locale: 'fi',
  },
}
