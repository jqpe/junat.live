import { motion } from 'framer-motion'
import React from 'react'

import { FloatingActionButton } from '~/components/floating_action_button'
import Position from '~/components/icons/position.svg'
import { Spinner } from '~/components/spinner'

import { theme } from '~/lib/tailwind.css'
import translate from '~/utils/translate'

import { useGeolocation, type UseGeolocationProps } from '../hooks/use_geolocation'

export interface GeolocationButtonProps extends UseGeolocationProps {
  label: string
}

export function GeolocationButton({
  label,
  locale,
  onStations,
  stations,
  onError: userDefinedOnErrorCb,
  onSuccess
}: GeolocationButtonProps) {
  const [loading, setLoading] = React.useState(false)
  const geolocation = useGeolocation({
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
    }
  })

  return (
    <FloatingActionButton
      as={motion.button}
      whileHover={{ scale: 1.1 }}
      disabled={loading}
      style={{
        pointerEvents: loading ? 'none' : 'initial'
      }}
      aria-label={label}
      onClick={() => {
        setLoading(true)
        geolocation.getCurrentPosition()
      }}
    >
      {loading ? (
        <Spinner style={{ background: theme.colors.primary[200] }} />
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
