import type { Meta, StoryFn } from '@storybook/react'

import { DigitrafficError } from '@junat/digitraffic'

import { ErrorMessage } from './error_message'

export const DigitrafficNetworkError: StoryFn<typeof ErrorMessage> = () => {
  return (
    <ErrorMessage
      error={new DigitrafficError({ path: '/', status: 0, type: 'error' })}
    />
  )
}

export const DigitrafficTooManyRequestsError: StoryFn<
  typeof ErrorMessage
> = () => {
  return (
    <ErrorMessage
      error={new DigitrafficError({ path: '/', status: 429, type: 'default' })}
    />
  )
}

export const UnknownError: StoryFn<typeof ErrorMessage> = () => {
  return <ErrorMessage error={0} />
}

export const DigitrafficUnknownError: StoryFn<typeof ErrorMessage> = () => {
  return (
    <ErrorMessage
      error={new DigitrafficError({ path: '/', status: 404, type: 'default' })}
    />
  )
}

export default {
  component: ErrorMessage,
  parameters: {
    nextjs: {
      router: {
        locale: 'en',
      },
    },
  },
  argTypes: { error: { table: { disable: true } } },
} satisfies Meta<typeof ErrorMessage>
