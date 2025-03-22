import type { Locale } from '@junat/core/types'

import { translate } from '~/i18n'

type StationLike = { stationName: Record<string, string> }
type GetMessage = <T extends StationLike>(p: {
  activeStation: number
  shownStations: T[]
  locale: Locale
}) => string | undefined

export const getMessage: GetMessage = args => {
  const { activeStation, shownStations, locale } = args
  const t = translate(locale)

  if (activeStation >= 0) {
    return shownStations[activeStation]?.stationName[locale]
  }

  if (shownStations.length === 1) {
    return `1 ${t('available')} (${shownStations[0]!.stationName[locale]})`
  }

  return `${shownStations.length} ${t('available')}`
}
export const createListNavHandler =
  (
    ref: React.RefObject<unknown>,
    setActiveStation: React.Dispatch<React.SetStateAction<number>>,
    stations: unknown[],
  ): React.KeyboardEventHandler =>
  event => {
    if (
      !/^(Arrow(Down|Up)|Escape)$/.test(event.key) ||
      ref.current !== document.activeElement
    )
      return

    if (event.key === 'Escape') {
      setActiveStation(-1)
    }

    event.preventDefault()

    if (event.key === 'ArrowDown') {
      setActiveStation(prev => Math.min(prev + 1, stations.length - 1))
    }
    if (event.key === 'ArrowUp') {
      setActiveStation(prev => Math.max(prev - 1, 0))
    }
  }