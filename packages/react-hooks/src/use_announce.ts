import type { Assertiveness, Message } from '@react-aria/live-announcer'

import React from 'react'
import { announce, destroyAnnouncer } from '@react-aria/live-announcer'

export const DEDUPE_TIMEOUT_SECS = 1000

export interface UseAnnounceProps {
  timeout?: number
  assertiveness?: Assertiveness
  /** @default {@link DEDUPE_TIMEOUT_SECS} */
  dedupeTimeoutSecs?: number
}

/**
 * Creates a live region for a11y.
 *
 * @returns
 * function to announce notifications to screen readers.
 * Features data deduplication, use props.dedupeTimeoutSecs to adjust (or disable w/ 0).
 *
 * @tutorial
 *
 * ```tsx
 * import { useAnnounce } from '@junat/react-hooks/use_announce'
 *
 * const Announcer = () => {
 *   const announce = useAnnounce()
 *   announce('This will be read by a screen reader')
 *   return null
 * }
 * ```
 */
export const useAnnounce = (props?: UseAnnounceProps) => {
  const lastMessage = React.useRef<Message>(null)

  // IMPORTANT! announcer is created with vanilla JS
  React.useEffect(() => destroyAnnouncer, [])

  return React.useCallback(
    (message: Message) => {
      if (lastMessage.current === message) return

      lastMessage.current = message
      announce(message, props?.assertiveness, props?.timeout)

      const dedupeTimeout = props?.dedupeTimeoutSecs ?? DEDUPE_TIMEOUT_SECS
      setTimeout(() => (lastMessage.current = ''), dedupeTimeout)
    },
    [props?.assertiveness, props?.timeout],
  )
}
