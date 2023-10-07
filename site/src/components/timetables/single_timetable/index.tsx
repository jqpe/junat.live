import type { SingleTimetableRowProps } from '@components/timetables/single_timetable_row'
import type { Locale } from '@typings/common'

import { SingleTimetableRow } from '@components/timetables/single_timetable_row'

type TimetableRow = SingleTimetableRowProps['timetableRow']

export interface SingleTableTimetableRow extends TimetableRow {
  commercialStop?: boolean | null
}

export interface SingleTimetableProps {
  timetableRows: SingleTableTimetableRow[]
  stations: SingleTimetableRowProps['stations']
  /**
   * @default DEPARTURE
   */
  type?: 'DEPARTURE' | 'ARRIVAL'
  locale: Locale
  cancelledText: string
}

export function SingleTimetable({
  timetableRows,
  stations,
  type = 'DEPARTURE',
  locale,
  cancelledText
}: SingleTimetableProps) {
  return (
    <table className="flex text-gray-800 dark:text-gray-200 [&_tbody]:w-[100%]">
      <tbody>
        {timetableRows
          .filter(
            (tr, i) =>
              (tr.type === type || i === timetableRows.length - 1) &&
              tr.commercialStop
          )
          .map(timetableRow => (
            <SingleTimetableRow
              cancelledText={cancelledText}
              key={timetableRow.liveEstimateTime || timetableRow.scheduledTime}
              timetableRow={timetableRow}
              stations={stations}
              locale={locale}
            />
          ))}
      </tbody>
    </table>
  )
}

export default SingleTimetable
