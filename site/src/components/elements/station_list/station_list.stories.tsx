import type { StoryFn } from '@storybook/react'
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
        stationName: { fi: 'Ainola', en: 'Ainola', sv: 'Ainola' }
      }
    ],
    locale: 'fi'
  }
}
