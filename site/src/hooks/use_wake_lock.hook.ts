import { useEffect, useState } from 'react'

interface WakeLockSentinel {
  readonly released: boolean
  readonly type: string
  release(): Promise<undefined>
  onrelease?: (event: Event) => void
}

interface WakeLock {
  request: (type?: 'screen') => Promise<WakeLockSentinel>
}

/**
 * Requests the device to keep screen awake.
 */
export default function useWakeLock() {
  const [wakeLock, setWakeLock] = useState<{
    enabled: boolean
    sentinel?: WakeLockSentinel
  }>()

  const documentIsVisible =
    typeof window !== 'undefined' &&
    typeof window.document !== 'undefined' &&
    window.document.visibilityState === 'visible'

  useEffect(() => {
    if (document.visibilityState === 'hidden') {
      return
    }

    const navigator = window.navigator as Navigator & { wakeLock?: WakeLock }

    if (!navigator.wakeLock) {
      setWakeLock({ enabled: false })
      return
    }

    navigator.wakeLock
      .request()
      .then(sentinel => {
        setWakeLock({ enabled: true, sentinel })
      })
      .catch(() => setWakeLock({ enabled: false }))
  }, [documentIsVisible])

  return wakeLock
}
