import { Spinner } from '@components/elements/spinner'
import { theme } from '@junat/design'

import translate from '@utils/translate'
import { motion } from 'framer-motion'
import React from 'react'
import { FloatingActionButton } from '~/components/buttons/floating_action_button'

import Position from '~/components/icons/position.svg'
import { useGeolocation, UseGeolocationProps } from '../hooks/use_geolocation'

export interface GeolocationButtonProps extends UseGeolocationProps {
  label: string
}

export function GeolocationButton({
  label,
  locale,
  setStations,
  stations,
  onError: userDefinedOnErrorCb
}: GeolocationButtonProps) {
  const [loading, setLoading] = React.useState(false)
  const geolocation = useGeolocation({
    stations,
    locale,
    setStations: stations => {
      setLoading(false)
      setStations(stations)
    },
    onError: error => {
      userDefinedOnErrorCb?.(error)
      setLoading(false)
    }
  })

  return (
    <FloatingActionButton
      as={motion.button}
      whileHover={{ scale: 1.1 }}
      disabled={loading}
      css={{
        pointerEvents: loading ? 'none' : 'initial'
      }}
      aria-label={label}
      onClick={() => {
        setLoading(true)
        geolocation.getCurrentPosition()
      }}
    >
      {loading ? (
        <Spinner css={{ background: '$primary200' }} />
      ) : (
        <Position
          width={24}
          height={24}
          fill={theme.colors.primary200}
          aria-label={translate(locale)('geolocationIcon')}
        />
      )}
    </FloatingActionButton>
  )
}
