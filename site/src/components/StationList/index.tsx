import type { LocalizedStation } from '@junat/digitraffic'

import { getStationPath } from '@junat/digitraffic'

import Link from 'next/link'

interface StationListProps {
  stations: LocalizedStation[]
  locale: 'fi' | 'en' | 'sv'
}

import styles from './StationList.module.scss'

export default function StationList({ stations, locale }: StationListProps) {
  return (
    <ul className={styles.stations}>
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
