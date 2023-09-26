import type { StoryFn } from '@storybook/react'
import type { ComponentPropsWithoutRef } from 'react'

import { DigitrafficError as DError } from '@junat/digitraffic'

import { DigitrafficError } from './'

export const Default: StoryFn<
  Partial<ComponentPropsWithoutRef<typeof DigitrafficError>>
> = args => {
  return (
    <DigitrafficError
      error={
        new DError({
          path: '/',
          body: 'body',
          status: 404,
          statusText: 'Not found',
          type: 'error'
        })
      }
      failureCount={0}
      isError={true}
      locale="en"
      refetch={() => Promise.reject()}
      {...args}
    />
  )
}

export default { component: DigitrafficError }
