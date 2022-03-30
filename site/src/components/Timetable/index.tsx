import type { Translation } from '@typings/station_screen_translations'
import type { LocalizedStation, Train } from '~digitraffic'

import { sortTrains } from '~digitraffic'

import TimetableRow from '@components/TimetableRow'

interface TimetableProps {
  trains: Train[]
  stationShortCode: string
  locale: 'fi' | 'en' | 'sv'
  stations: LocalizedStation[]
  translation: Translation
}

export default function Timetable({
  trains,
  stationShortCode,
  translation,
  stations,
  locale
}: TimetableProps) {
  if (!(trains.length > 1)) {
    return null
  }

  return (
    <table>
      <thead>
        <tr>
          <td>{translation.destination}</td>
          <td>{translation.departureTime}</td>
          <td>{translation.track}</td>
          <td>{translation.train}</td>
        </tr>
      </thead>
      <tbody>
        {sortTrains([...trains], stationShortCode, 'DEPARTURE').map(train => {
          return (
            <TimetableRow
              translation={translation}
              stations={stations}
              locale={locale}
              train={train}
              stationShortCode={stationShortCode}
              key={`${train.trainNumber}-${train.version}`}
            />
          )
        })}
      </tbody>
    </table>
  )
}
