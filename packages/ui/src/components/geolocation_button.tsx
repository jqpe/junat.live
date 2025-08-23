import type { UseGeolocationProps } from '@junat/react-hooks/use_geolocation'

import React from 'react'
import { motion } from 'motion/react'

import { useUi } from '@junat/react-hooks/ui'
import { useGeolocation } from '@junat/react-hooks/use_geolocation'
import Position from '@junat/ui/icons/position.svg'

import { FloatingActionButton } from './floating_action_button'
import { Spinner } from './spinner'

export interface GeolocationButtonProps
  extends Omit<UseGeolocationProps, 'translations'> {
  label: string
}

export function GeolocationButton({
  label,
  locale,
  onStations,
  stations,
  onError: userDefinedOnErrorCb,
  onSuccess,
}: Readonly<GeolocationButtonProps>) {
  const { t } = useUi()
  const [loading, setLoading] = React.useState(false)
  const geolocation = useGeolocation({
    translations: {
      badGeolocationAccuracy: t('errors.badGeolocationAccuracy'),
      positionError: t('errors.positionError'),
      positionTimeout: t('errors.positionTimeout'),
      positionUnavailable: t('errors.positionUnavailable'),
    },
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
          aria-label={t('geolocationIcon')}
        />
      )}
    </FloatingActionButton>
  )
}
