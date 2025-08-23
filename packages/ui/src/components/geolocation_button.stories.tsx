import type { Meta, StoryFn } from '@storybook/react'
import type { Locale } from '@junat/core/types'
import type { GeolocationButtonProps } from './geolocation_button'

import { GeolocationButton } from './geolocation_button'
import { ToastProvider } from './toast'

export const Default: StoryFn<GeolocationButtonProps> = args => {
  return (
    <ToastProvider>
      <GeolocationButton
        stations={[
          {
            countryCode: 'fi',
            stationShortCode: 'LEN',
            longitude: 24.968_343,
            latitude: 60.315_732,
            stationName: {
              en: 'Helsinki airport',
              fi: 'Lentoasema',
            } as Record<Locale, string>,
          },
        ]}
        label="Geolocation button"
        locale="en"
        onStations={args.onStations}
        onError={args.onError}
      />
    </ToastProvider>
  )
}

export default {
  component: GeolocationButton,
  argTypes: {
    onStations: {
      action: 'onStations',
    },
    onError: {
      action: 'onError',
    },
  },
  parameters: {
    controls: {
      disable: true,
    },
  },
} satisfies Meta<GeolocationButtonProps>
