import { useCallback, useState } from 'react'

export default function useGeolocation({
  handleError,
  handlePosition
}: {
  handleError?: PositionErrorCallback
  handlePosition?: PositionCallback
}) {
  const [position, setPosition] = useState<GeolocationPosition>()

  const getCurrentPosition = useCallback(() => {
    if (typeof window !== 'undefined') {
      const onSuccess: PositionCallback = sPosition => {
        setPosition(sPosition)
        handlePosition?.(sPosition)
      }

      navigator.geolocation.getCurrentPosition(onSuccess, handleError)
    }
  }, [handleError, handlePosition])

  return { position, getCurrentPosition }
}
