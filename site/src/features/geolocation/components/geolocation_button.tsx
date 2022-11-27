import { Spinner } from '@components/elements/spinner'
import { theme } from '@junat/design'

import translate from '@utils/translate'
import React from 'react'

import Position from '../assets/Position.svg'
import { useGeolocation, UseGeolocationProps } from '../hooks/use_geolocation'

import { StyledButton } from '../styles'

export interface GeolocationButtonProps extends UseGeolocationProps {
  label: string
}

export function GeolocationButton({
  label,
  locale,
  setStations
}: GeolocationButtonProps) {
  const [loading, setLoading] = React.useState(false)
  const geolocation = useGeolocation({
    locale,
    setStations: stations => {
      setLoading(false)
      setStations(stations)
    },
    onError: () => setLoading(false)
  })

  return (
    <StyledButton
      type="button"
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
    </StyledButton>
  )
}
