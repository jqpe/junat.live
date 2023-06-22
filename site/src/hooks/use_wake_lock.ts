import React from 'react'

import { usePreferences } from './use_preferences'

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
 * Optionally the wake lock can be disabled via {@link usePreferences} hook.
 * The wake lock may also be disabled by user agent e.g. when battery is critically low.
 */
export const useWakeLock = () => {
  const shouldUseWakeLock = usePreferences(state => state.wakeLock)

  const [wakeLock, setWakeLock] = React.useState<{
    enabled: boolean
    sentinel?: WakeLockSentinel
  }>()

  React.useMemo(() => {
    if (shouldUseWakeLock === false && wakeLock?.enabled) {
      wakeLock.sentinel?.release()
      setWakeLock({ enabled: false })
    }
  }, [shouldUseWakeLock, wakeLock])

  const documentIsVisible =
    typeof window !== 'undefined' &&
    window.document !== undefined &&
    window.document.visibilityState === 'visible'

  React.useEffect(() => {
    if (shouldUseWakeLock === false) {
      return
    }

    if (document.visibilityState === 'hidden') {
      return
    }

    const navigator = window.navigator as Navigator & { wakeLock?: WakeLock }

    if (!navigator.wakeLock) {
      setWakeLock({ enabled: false })
      return
    }

    if (!wakeLock?.sentinel) {
      navigator.wakeLock
        .request()
        .then(sentinel => {
          setWakeLock({ enabled: true, sentinel })
        })
        .catch(() => setWakeLock({ enabled: false }))
    }

    return () => {
      if (!wakeLock?.sentinel?.released) {
        wakeLock?.sentinel?.release()
      }
    }
  }, [documentIsVisible, wakeLock?.sentinel, shouldUseWakeLock])

  return wakeLock
}
