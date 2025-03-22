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
  /**
   * @default DEPARTURE
   */
  type?: 'DEPARTURE' | 'ARRIVAL'
}

export function SingleTimetable({
  showTrack,
  timetableRows,
  type = 'DEPARTURE',
}: Readonly<SingleTimetableProps>) {
  const { data: stations = [] } = useStations({ t: translate('all') })

  return (
    <table className="flex text-gray-800 dark:text-gray-200">
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
