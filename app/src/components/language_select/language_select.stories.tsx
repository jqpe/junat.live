import type { Meta, StoryFn } from '@storybook/react'
import type { ComponentPropsWithoutRef } from 'react'
import type { Locale } from '~/types/common'

import { useRouter } from 'next/router'

import { LanguageSelect } from './'

export const Default: StoryFn<
  Partial<ComponentPropsWithoutRef<typeof LanguageSelect>>
> = args => {
  const router = useRouter()
  router.locale = 'en'

  return (
    <LanguageSelect
      stations={[
        {
          stationName: {
            fi: 'Helsinki',
            sv: 'Helsingfors',
            en: 'Helsinki',
          } as Record<Locale, string>,
          stationShortCode: 'HKI',
        },
      ]}
      {...args}
    />
  )
}

export default {
  component: LanguageSelect,
  parameters: {
    controls: { disable: true },
  },
} as Meta
