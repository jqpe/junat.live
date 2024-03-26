import { Meta, StoryObj } from '@storybook/react'
import { WeatherBadge } from './weather_badge'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const Default: StoryObj<typeof WeatherBadge> = {
  args: {
    place: 'Helsinki'
  }
}

export default {
  component: WeatherBadge,
  decorators: [
    Story => (
      <QueryClientProvider client={new QueryClient()}>
        {Story()}
      </QueryClientProvider>
    )
  ]
} satisfies Meta<typeof WeatherBadge>
