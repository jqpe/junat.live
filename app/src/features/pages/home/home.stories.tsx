import type { Meta, StoryFn } from '@storybook/react'
import type { Locale } from '~/types/common'

import { useRouter } from 'next/router'
import { within } from '@storybook/test'

import { withPageLayout } from '~/../.storybook/utils'
import { useFavorites } from '~/hooks/use_favorites'
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

WithFavorites.play = async ctx => {
  const canvas = within(ctx.canvasElement)
  const input = await canvas.findByRole('switch')
  input.click()
}

export default {
  component: Home,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [withPageLayout()],
  args: {
    initialStations: [
      {
        stationName: {
          sv: 'Helsingfors Flygplats',
          fi: 'Lentoasema',
          en: 'Helsinki airport',
        } as Record<Locale, string>,
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
        } as Record<Locale, string>,
        countryCode: 'FI',
        latitude: 1,
        longitude: 2,
        stationShortCode: 'AIN',
      },
    ],
  },
} satisfies Meta<typeof Home>
