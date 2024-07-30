import type { Meta, StoryFn } from '@storybook/react'
import type { Locale } from '~/types/common'

import { useRouter } from 'next/router'

import { withI18n, withPageLayout } from '~/../.storybook/utils'
import { Station as StationPage } from './components/page'

export const Default: StoryFn<typeof StationPage> = () => {
  const router = useRouter()

  return (
    <StationPage
      locale={router.locale as Locale}
      station={{
        stationName: { en: 'Ainola', fi: 'Ainola', sv: 'Ainola' },
        countryCode: 'FI',
        latitude: 32,
        longitude: 12,
        stationShortCode: 'AIN',
      }}
    />
  )
}

export default {
  component: StationPage,
  decorators: [withPageLayout(), withI18n()],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      router: { locale: 'en' },
    },
  },
} satisfies Meta<typeof StationPage>
