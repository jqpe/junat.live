import type { Meta, StoryFn } from '@storybook/react'

import { useRouter } from 'next/router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { useFavorites } from '~/hooks/use_favorites'
import Page from '~/layouts/page'
import { Home } from './components/page'

export const Default: StoryFn<typeof Home> = args => {
  const router = useRouter()
  router.locale = 'en'
  // Favorites are persisted in local storage
  useFavorites(state => {
    const station = args.initialStations[0]?.stationShortCode
    if (station && state.isFavorite(station)) {
      state.removeFavorite(station)
    }
  })

  return <Home {...args} />
}

export const WithFavorites: StoryFn<typeof Home> = args => {
  const router = useRouter()
  router.locale = 'en'
  useFavorites(state => {
    const code = args.initialStations[0]?.stationShortCode

    if (code) {
      state.addFavorite(code)
    }
  })

  return <Home {...args} />
}

export default {
  component: Home,
  args: {
    initialStations: [
      {
        stationName: {
          sv: 'Helsingfors Flygplats',
          fi: 'Lentoasema',
          en: 'Helsinki airport',
        },
        countryCode: 'FI',
        latitude: 0,
        longitude: 1,
        stationShortCode: 'LEN',
      },
      {
        stationName: {
          sv: 'Ainola',
          fi: 'Ainola',
          en: 'Ainola',
        },
        countryCode: 'FI',
        latitude: 1,
        longitude: 2,
        stationShortCode: 'AIN',
      },
    ],
  },
  decorators: [
    Story => {
      return (
        <QueryClientProvider client={new QueryClient()}>
          <Page>{Story()}</Page>
        </QueryClientProvider>
      )
    },
  ],
  parameters: {},
} satisfies Meta<typeof Home>
