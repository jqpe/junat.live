import { useCallback, useState } from 'react'

export default function useGeolocation() {
  const [position, setPosition] = useState<GeolocationPosition>()
  const [error, setError] = useState<GeolocationPositionError>()

  const onError: PositionErrorCallback = error => {
    setError(error)
  }
  const onSuccess: PositionCallback = position => {
    setPosition(position)
  }

  const getCurrentPosition = useCallback(() => {
    if (window) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError)
    }
  }, [])

  return { error, position, getCurrentPosition }
}
