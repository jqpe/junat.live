import type { Meta, StoryFn } from '@storybook/react'
import type { GeolocationButtonProps } from './geolocation_button'
import type { Locale } from '~/types/common'

import { ToastProvider } from '@junat/ui/components/toast/index'

import { translate } from '~/i18n'
import { GeolocationButton } from './geolocation_button'

export const Default: StoryFn<GeolocationButtonProps> = args => {
  return (
    <ToastProvider>
      <GeolocationButton
        translations={translate('en')('errors')}
        stations={[
          {
            countryCode: 'fi',
            stationShortCode: 'LEN',
            longitude: 24.968_343,
            latitude: 60.315_732,
            stationName: {
              en: 'Helisnki airport',
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
