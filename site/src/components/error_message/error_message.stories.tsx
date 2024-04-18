import { DigitrafficError } from '@junat/digitraffic'
import { Meta, StoryFn } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { ErrorMessage } from './'

export const DigitrafficNetworkError: StoryFn<typeof ErrorMessage> = args => {
  return (
    <ErrorMessage
      locale={args.locale}
      error={new DigitrafficError({ path: '/', status: 0, type: 'error' })}
    />
  )
}

export const DigitrafficTooManyRequestsError: StoryFn<
  typeof ErrorMessage
> = args => {
  return (
    <ErrorMessage
      locale={args.locale}
      error={new DigitrafficError({ path: '/', status: 429, type: 'default' })}
    />
  )
}

export const UnknownError: StoryFn<typeof ErrorMessage> = args => {
  return <ErrorMessage locale={args.locale} error={0} />
}

export const DigitrafficUnknownError: StoryFn<typeof ErrorMessage> = args => {
  return (
    <ErrorMessage
      locale={args.locale}
      error={new DigitrafficError({ path: '/', status: 404, type: 'default' })}
    />
  )
}

DigitrafficUnknownError.parameters = {
  msw: {
    handlers: [
      http.get('https://status.digitraffic.fi/api/v2/summary.json', () => {
        return HttpResponse.json({
          components: [
            {
              id: 'nfys4zwym2wz',
              name: 'Rail MQTT',
              status: 'major_outage'
            },
            {
              id: '9vty2wtf2tdz',
              name: '/api/v1/metadata/stations',
              status: 'under_maintenance'
            },
            {
              id: '2m8xs6g8chhd',
              name: 'Rail GraphQL',
              status: 'operational'
            }
          ]
        })
      })
    ]
  }
}

export default {
  component: ErrorMessage,
  args: { locale: 'en' },
  argTypes: { error: { table: { disable: true } } },
  decorators: [
    Story => (
      <QueryClientProvider client={new QueryClient()}>
        {Story()}
      </QueryClientProvider>
    )
  ]
} satisfies Meta<typeof ErrorMessage>
