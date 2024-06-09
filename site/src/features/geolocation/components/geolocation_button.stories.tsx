import type { Meta, StoryFn } from '@storybook/react'

import { GeolocationButton, type GeolocationButtonProps } from './geolocation_button'
import { ToastProvider } from '@radix-ui/react-toast'

export const Default: StoryFn<GeolocationButtonProps> = args => {
  return (
    <ToastProvider>
      <GeolocationButton
        stations={[
          {
            longitude: 24.968_343,
            latitude: 60.315_732,
            stationName: {
              en: 'Helisnki airport',
              fi: 'Lentoasema',
              sv: 'Helsingfors flygplats'
            }
          }
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
      action: 'onStations'
    },
    onError: {
      action: 'onError'
    }
  },
  parameters: {
    controls: {
      disable: true
    }
  }
} satisfies Meta<GeolocationButtonProps>
