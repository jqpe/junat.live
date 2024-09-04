import type { SingleTimetableRowProps } from '~/components/single_timetable_row'

import { singleTimetableFilter } from '@junat/core/utils/train'
import { useStations } from '@junat/react-hooks/digitraffic/use_stations'

import { SingleTimetableRow } from '~/components/single_timetable_row'
import { hasDeparted } from '~/components/single_timetable_row/helpers'
import { translate } from '~/i18n'

type TimetableRow = SingleTimetableRowProps['timetableRow']

export interface SingleTableTimetableRow extends TimetableRow {
  commercialStop?: boolean | null
}

export interface SingleTimetableProps {
  timetableRows: SingleTableTimetableRow[]
  /**
   * @default DEPARTURE
   */
  type?: 'DEPARTURE' | 'ARRIVAL'
}

export function SingleTimetable({
  timetableRows,
  type = 'DEPARTURE',
}: SingleTimetableProps) {
  const { data: stations = [] } = useStations({ t: translate('all') })

  return (
    <table className="flex flex-col text-gray-800 dark:text-gray-200">
      <thead className="grid grid-cols-[10%_.8fr_2fr_10%] text-sm">
        <tr />
        <tr>
          <td>Departure</td>
        </tr>
        <tr>
          <td>To</td>
        </tr>
        <tr className="text-center">
          <td>Track</td>
        </tr>
      </thead>
      <tbody className="w-full">
        {timetableRows
          .filter(singleTimetableFilter(type, timetableRows))
          .map((timetableRow, index, rows) => {
            const lastDeparted = rows.findLastIndex(row => hasDeparted(row))

            return (
              <SingleTimetableRow
                hasDeparted={hasDeparted(timetableRow)}
                lastHasDeparted={lastDeparted === index}
                totalItems={rows.length}
                nthItem={index}
                key={
                  timetableRow.liveEstimateTime || timetableRow.scheduledTime
                }
                timetableRow={timetableRow}
                stations={stations}
              />
            )
          })}
      </tbody>
    </table>
  )
}

export default SingleTimetable
