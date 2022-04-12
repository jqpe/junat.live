import type { LocalizedStation } from '~digitraffic'

import type { StationScreenTranslations } from '@typings/station_screen_translations'
import type { SimplifiedTrain } from '@typings/simplified_train'

import TimetableRow from '@components/TimetableRow'
import { sortSimplifiedTrains } from '@utils/sort_simplified_trains'

import styles from './Timetable.module.scss'

interface TimetableProps {
  trains: SimplifiedTrain[]
  stationShortCode: string
  locale: 'fi' | 'en' | 'sv'
  stations: LocalizedStation[]
  translation: StationScreenTranslations
}

export default function Timetable({
  trains,
  translation,
  locale
}: TimetableProps) {
  if (!(trains.length > 1)) {
    return null
  }

  return (
    <table className={styles.timetable}>
      <thead>
        <tr>
          <td>{translation.destination}</td>
          <td>{translation.departureTime}</td>
          <td>{translation.track}</td>
          <td>{translation.train}</td>
        </tr>
      </thead>
      <tbody>
        {sortSimplifiedTrains([...trains]).map(train => {
          return (
            <TimetableRow
              translation={translation}
              locale={locale}
              train={train}
              key={`${train.trainNumber}-${train.version}`}
            />
          )
        })}
      </tbody>
    </table>
  )
}
