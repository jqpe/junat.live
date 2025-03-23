import type { UseGeolocationProps } from '@junat/react-hooks/use_geolocation'

import { motion } from 'motion/react'
import React from 'react'

import { useGeolocation } from '@junat/react-hooks/use_geolocation'
import { FloatingActionButton } from '@junat/ui/components/floating_action_button'
import Position from '@junat/ui/icons/position.svg'

import { Spinner } from '~/components/spinner'
import { translate } from '~/i18n'

export interface GeolocationButtonProps extends UseGeolocationProps {
  label: string
}

export function GeolocationButton({
  translations,
  label,
  locale,
  onStations,
  stations,
  onError: userDefinedOnErrorCb,
  onSuccess,
}: Readonly<GeolocationButtonProps>) {
  const [loading, setLoading] = React.useState(false)
  const geolocation = useGeolocation({
    translations,
    stations,
    locale,
    onSuccess,
    onStations: stations => {
      setLoading(false)
      onStations?.(stations)
    },
    onError: error => {
      userDefinedOnErrorCb?.(error)
      setLoading(false)
    },
  })

  return (
    <FloatingActionButton
      as={motion.button}
      whileHover={{ scale: 1.1 }}
      disabled={loading}
      style={{
        pointerEvents: loading ? 'none' : 'initial',
      }}
      aria-label={label}
      onClick={() => {
        setLoading(true)
        geolocation.getCurrentPosition()
      }}
    >
      {loading ? (
        <Spinner className="bg-primary-200" />
      ) : (
        <Position
          width={24}
          height={24}
          className="fill-primary-200"
          aria-label={translate(locale)('geolocationIcon')}
        />
      )}
    </FloatingActionButton>
  )
}
