import type { LocalizedStation } from '@lib/digitraffic'

import { getStationPath } from '~/lib/digitraffic'

import { Locale } from '@typings/common'

import Link from 'next/link'

interface StationListProps {
  stations: LocalizedStation[]
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
