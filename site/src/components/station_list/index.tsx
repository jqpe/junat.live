import { getStationPath } from '~/lib/digitraffic'

import type { Locale } from '@typings/common'

import Link from 'next/link'

interface StationListProps {
  stations: { stationShortCode: string; stationName: Record<Locale, string> }[]
  locale: Locale
}

export function StationList({ stations, locale }: StationListProps) {
  return (
    <ul id={'stations-list'} className="flex flex-col gap-[0.725rem]">
      {stations.map(station => (
        <li key={station.stationShortCode}>
          <Link
            href={`/${getStationPath(station.stationName[locale])}`}
            locale={locale}
          >
            {station.stationName[locale]}
          </Link>
        </li>
      ))}
    </ul>
  )
}
