import type { LocalizedStation } from '@junat/digitraffic/types'

import { getStationPath } from '@junat/digitraffic/utils'
import { styled } from '@junat/stitches'

import Link from 'next/link'

interface StationListProps {
  stations: LocalizedStation[]
  locale: 'fi' | 'en' | 'sv'
}

const StyledStationList = styled('ul', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.725rem'
})

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
