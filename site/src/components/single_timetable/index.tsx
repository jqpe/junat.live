import type { SingleTimetableRowProps } from '~/components/single_timetable_row'

import { singleTimetableFilter } from '@junat/core/utils/train'
import { useStations } from '@junat/react-hooks/digitraffic/use_stations'

import { SingleTimetableRow } from '~/components/single_timetable_row'
import { translate } from '~/i18n'

type TimetableRow = SingleTimetableRowProps['timetableRow']

export interface SingleTableTimetableRow extends TimetableRow {
  commercialStop?: boolean | null
}

export interface SingleTimetableProps {
  showTrack?: boolean
  timetableRows: SingleTableTimetableRow[]
  trainNumber: number
  /**
   * @default DEPARTURE
   */
  type?: 'DEPARTURE' | 'ARRIVAL'
}

export function SingleTimetable({
  timetableRows,
  trainNumber,
  type = 'DEPARTURE',
}: Readonly<SingleTimetableProps>) {
  const { data: stations = [] } = useStations({ t: translate('all') })

  return (
    <article className="flex w-full flex-col text-gray-800 dark:text-gray-200">
      {timetableRows
        .filter(singleTimetableFilter(type, timetableRows))
        .map(timetableRow => (
          <SingleTimetableRow
            key={timetableRow.liveEstimateTime || timetableRow.scheduledTime}
            timetableRow={timetableRow}
            stations={stations}
            trainNumber={trainNumber}
          />
        ))}
    </article>
  )
}

export default SingleTimetable
