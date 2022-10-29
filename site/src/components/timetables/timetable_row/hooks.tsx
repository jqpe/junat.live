import React from 'react'

/**
 * Restores the scroll position from cache and if the cache key and the component's key match scrolls to the component.
 */
export const useRestoreScrollPosition = (
  lastStationId: string,
  stationId: string,
  setIsLastStation: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const renders = React.useRef(0)

  React.useEffect(() => {
    if (lastStationId === stationId && renders.current === 0) {
      const lastStationElem = document.querySelector(`[data-id="${stationId}"]`)
      const rect = lastStationElem?.getBoundingClientRect()

      lastStationElem?.scrollIntoView({
        block: rect && rect.top > window.innerHeight ? 'center' : 'end'
      })
      setIsLastStation(true)
    }
    renders.current += 1
  }, [lastStationId, setIsLastStation, stationId])
}
