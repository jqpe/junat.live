import { DigitrafficError } from '@junat/digitraffic'
import { Meta, StoryFn } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorMessage } from './'

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
        locale: 'en'
      }
    }
  },
  argTypes: { error: { table: { disable: true } } },
  decorators: [
    Story => (
      <QueryClientProvider client={new QueryClient()}>
        {Story()}
      </QueryClientProvider>
    )
  ]
} satisfies Meta<typeof ErrorMessage>
