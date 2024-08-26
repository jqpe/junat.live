import React from 'react'

/**
 * JUN-227 — using two components which both use https://www.npmjs.com/package/react-remove-scroll causes
 * both to calculate removed scrollbar. Since the first one sets margin-right the
 * other will instead apply to padding, effectively offsetting body by --removed-body-scroll-bar-size
 *
 * @internal
 */
export const useModalFix = (fixModal?: boolean) => {
  React.useEffect(() => {
    if (!fixModal || !('document' in globalThis)) return

    const body = document.querySelector('body')
    const margin = body?.style.getPropertyValue('margin-right')
    const padding = body?.style.getPropertyValue('padding-right')

    if (margin && padding && padding === margin) {
      body?.style.setProperty('padding-right', '0px')
    }
  }, [fixModal])
}
