import type { SingleTimetableRowProps } from '~/components/single_timetable_row'

import { TimeTableRowType } from '@junat/graphql/digitraffic'
import { useStations } from '@junat/react-hooks/digitraffic/use_stations'

import { SingleTimetableRow } from '~/components/single_timetable_row'
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
}: Readonly<SingleTimetableProps>) {
  const { data: stations = [] } = useStations({ t: translate('all') })

  return (
    <ol className="flex flex-col text-gray-800 dark:text-gray-200">
      {timetableRows.map((row, index) => {
        const key = row.liveEstimateTime || row.scheduledTime
        const shouldShow =
          row.type !== TimeTableRowType.Arrival && row.commercialStop

        if (!shouldShow && index !== timetableRows.length - 1) {
          return null
        }

        return (
          <>
            {row.commercialStop && (
              <SingleTimetableRow
                key={key}
                timetableRow={row}
                stations={stations}
              />
            )}
          </>
        )
      })}
    </ol>
  )
}

export default SingleTimetable
