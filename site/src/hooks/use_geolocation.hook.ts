import { useCallback, useState } from 'react'

export default function useGeolocation({
  handleError
}: {
  handleError?: PositionErrorCallback
}) {
  const [position, setPosition] = useState<GeolocationPosition>()

  const onSuccess: PositionCallback = position => {
    setPosition(position)
  }

  const getCurrentPosition = useCallback(() => {
    if (typeof window !== 'undefined') {
      navigator.geolocation.getCurrentPosition(onSuccess, handleError)
    }
  }, [handleError])

  return { position, getCurrentPosition }
}
