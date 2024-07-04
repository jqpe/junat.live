import type { SingleTimetableRowProps } from '~/components/single_timetable_row'

import { singleTimetableFilter } from '@junat/core/utils/train'

import { SingleTimetableRow } from '~/components/single_timetable_row'
import { useStations } from '~/lib/digitraffic'

type TimetableRow = SingleTimetableRowProps['timetableRow']

export interface SingleTableTimetableRow extends TimetableRow {
  commercialStop?: boolean | null
}

export interface SingleTimetableProps {
  showTrack?: boolean
  timetableRows: SingleTableTimetableRow[]
  /**
   * @default DEPARTURE
   */
  type?: 'DEPARTURE' | 'ARRIVAL'
}

export function SingleTimetable({
  showTrack,
  timetableRows,
  type = 'DEPARTURE',
}: SingleTimetableProps) {
  const { data: stations = [] } = useStations()

  return (
    <table className="flex text-gray-800 dark:text-gray-200 ">
      <tbody className="w-full">
        {timetableRows
          .filter(singleTimetableFilter(type, timetableRows))
          .map(timetableRow => (
            <SingleTimetableRow
              showTrack={showTrack}
              key={timetableRow.liveEstimateTime || timetableRow.scheduledTime}
              timetableRow={timetableRow}
              stations={stations}
            />
          ))}
      </tbody>
    </table>
  )
}

export default SingleTimetable
