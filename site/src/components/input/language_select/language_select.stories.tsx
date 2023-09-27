import type { Meta, StoryFn } from '@storybook/react'
import type { ComponentPropsWithoutRef } from 'react'

import { LanguageSelect } from './'
import { useRouter } from 'next/router'

export const Default: StoryFn<
  Partial<ComponentPropsWithoutRef<typeof LanguageSelect>>
> = args => {
  const router = useRouter()
  router.locale = 'en'

  return (
    <LanguageSelect
      router={router}
      stations={[
        {
          stationName: { fi: 'Helsinki', sv: 'Helsingfors', en: 'Helsinki' },
          stationShortCode: 'HKI'
        }
      ]}
      {...args}
    />
  )
}

export default {
  component: LanguageSelect,
  parameters: {
    controls: { disable: true }
  }
} as Meta
