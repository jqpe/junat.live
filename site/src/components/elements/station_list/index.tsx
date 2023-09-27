import { getStationPath } from '~/lib/digitraffic'

import { Locale } from '@typings/common'

import Link from 'next/link'

interface StationListProps {
  stations: { stationShortCode: string; stationName: Record<Locale, string> }[]
  locale: Locale
}

import { StyledStationList } from './styles'

export function StationList({ stations, locale }: StationListProps) {
  return (
    <StyledStationList id={'stations-list'}>
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
    </StyledStationList>
  )
}
