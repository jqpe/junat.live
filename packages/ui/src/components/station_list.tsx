import type { Locale } from '@junat/core/types'

import { getStationPath } from '@junat/digitraffic'
import { useUi } from '@junat/react-hooks/ui'

interface StationListProps {
  tabFocusable: boolean
  activeStation: number
  stations: { stationShortCode: string; stationName: Record<Locale, string> }[]
}

export const STATION_LIST_ID = 'stations-list'

export function StationList({
  tabFocusable,
  stations,
  activeStation,
}: Readonly<StationListProps>) {
  const { Link, locale } = useUi()

  return (
    <ul id={STATION_LIST_ID} className="flex flex-col gap-[0.725rem]">
      {stations.map((station, i) => (
        <li
          {...(activeStation === i ? { 'aria-current': true } : {})}
          key={station.stationShortCode}
          className={'aria-[current]:outline'}
        >
          <Link
            tabIndex={tabFocusable ? undefined : -1}
            href={`/${getStationPath(station.stationName[locale]!)}`}
            locale={locale}
          >
            {station.stationName[locale]}
          </Link>
        </li>
      ))}
    </ul>
  )
}
