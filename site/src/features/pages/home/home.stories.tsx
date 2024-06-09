import type { Meta, StoryFn } from '@storybook/react'

import { Home } from './components/page'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import Page from '~/layouts/page'
import constants from '~/constants'
import { useFavorites } from '~/hooks/use_favorites'
import React from 'react'

export const Default: StoryFn<typeof Home> = args => {
  const router = useRouter()
  router.locale = 'en'
  // Favorites are persisted in local storage
  useFavorites(state => {
    const station = args.initialStations[0].stationShortCode
    if (state.isFavorite(station)) {
      state.removeFavorite(station)
    }
  })

  return <Home {...args} />
}

export const WithFavorites: StoryFn<typeof Home> = args => {
  const router = useRouter()
  router.locale = 'en'
  useFavorites(state =>
    state.addFavorite(args.initialStations[0].stationShortCode)
  )

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
          en: 'Helsinki airport'
        },
        countryCode: 'FI',
        latitude: 0,
        longitude: 1,
        stationShortCode: 'LEN'
      },
      {
        stationName: {
          sv: 'Ainola',
          fi: 'Ainola',
          en: 'Ainola'
        },
        countryCode: 'FI',
        latitude: 1,
        longitude: 2,
        stationShortCode: 'AIN'
      }
    ]
  },
  decorators: [
    Story => {
      return (
        <QueryClientProvider client={new QueryClient()}>
          <Page layoutProps={{ ...constants, locale: 'en' }}>{Story()}</Page>
        </QueryClientProvider>
      )
    }
  ],
  parameters: {}
} satisfies Meta<typeof Home>
