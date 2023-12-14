import React from 'react'

/**
 * The value this type points to may be null or undefined, but will exist sometime in the future; used for expensive DOM calculations and futures.
 */
type Deferred = undefined | null

/**
 * Attach an event listener for event. The listener is automatically removed when the hook this is detached.
 * The element may be nullish with the presumption that it will exist in the future.
 */
export function useEventListener<K extends keyof HTMLElementEventMap>(
  element: HTMLElement | Deferred,
  eventKey: K,
  callback: EventListener
) {

  React.useEffect(() => {
    if (element) {
      element.addEventListener(eventKey, callback)
    }

    return function cleanup() {
      return element?.removeEventListener(eventKey, callback)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element])
}
