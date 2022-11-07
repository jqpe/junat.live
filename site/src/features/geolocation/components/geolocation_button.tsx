import { theme } from '@junat/design'

import translate from '@utils/translate'

import Position from '../assets/Position.svg'
import { useGeolocation, UseGeolocationProps } from '../hooks/use_geolocation'

import { StyledButton } from './styles'

export interface GeolocationButtonProps extends UseGeolocationProps {
  label: string
}

export function GeolocationButton({
  label,
  locale,
  setStations
}: GeolocationButtonProps) {
  const geolocation = useGeolocation({
    locale,
    setStations
  })

  return (
    <StyledButton
      type="button"
      whileHover={{ scale: 1.1 }}
      aria-label={label}
      onClick={geolocation.getCurrentPosition}
    >
      <Position
        width={24}
        height={24}
        fill={theme.colors.slateGray300}
        aria-label={translate(locale)('geolocationIcon')}
      />
    </StyledButton>
  )
}
