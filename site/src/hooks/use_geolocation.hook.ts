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
      const onSuccess: PositionCallback = position => {
        setPosition(position)
        handlePosition?.(position)
      }

      navigator.geolocation.getCurrentPosition(onSuccess, handleError)
    }
  }, [handleError, handlePosition])

  return { position, getCurrentPosition }
}
