import type { Locale } from '~/types/common'

import { Link } from '@tanstack/react-router'

import { getStationPath } from '~/lib/digitraffic'

interface StationListProps {
  stations: { stationShortCode: string; stationName: Record<Locale, string> }[]
  locale: Locale
}

export function StationList({ stations, locale }: StationListProps) {
  return (
    <ul id={'stations-list'} className="flex flex-col gap-[0.725rem]">
      {stations.map(station => (
        <li key={station.stationShortCode}>
          <Link to={`/${getStationPath(station.stationName.en)}`}>
            {station.stationName[locale]}
          </Link>
        </li>
      ))}
    </ul>
  )
}
