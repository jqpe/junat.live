import type { LocalizedStation } from '@lib/digitraffic'

import { getStationPath } from '@junat/digitraffic/utils'

import { Locale } from '@typings/common'

import Link from 'next/link'

interface StationListProps {
  stations: LocalizedStation[]
  locale: Locale
}

import { StyledStationList } from './styles'

export default function StationList({ stations, locale }: StationListProps) {
  return (
    <StyledStationList>
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
