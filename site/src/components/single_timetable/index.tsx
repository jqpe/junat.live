import type { SingleTimetableRowProps } from '~/components/single_timetable_row'

import { useReducer } from 'react'

import { interpolateString as i } from '@junat/core'
import { TimeTableRowType } from '@junat/graphql/digitraffic'
import { useStations } from '@junat/react-hooks/digitraffic/use_stations'
import { Button } from '@junat/ui/components/button'
import ArrowsCollapse from '@junat/ui/icons/arrows_collapse.svg'
import ArrowsExpand from '@junat/ui/icons/arrows_expand.svg'

import { SingleTimetableRow } from '~/components/single_timetable_row'
import { translate, useTranslations } from '~/i18n'
import { hasDeparted } from '../single_timetable_row/helpers'

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
  /** @default false */
  hideDeparted?: boolean
}

export function SingleTimetable({
  timetableRows,
  hideDeparted,
}: Readonly<SingleTimetableProps>) {
  const { data: stations = [] } = useStations({ t: translate('all') })
  const t = useTranslations()
  const [toggledHideDeparted, toggleHideDeparted] = useReducer(
    prev => !prev,
    hideDeparted,
  )

  let departedCount = 0
  const lastDepartedIndex = timetableRows.reduce((acc, row, index) => {
    if (
      row.type === TimeTableRowType.Departure &&
      row.commercialStop &&
      hasDeparted(row)
    ) {
      departedCount++
      return index
    }
    return acc
  }, -1)

  return (
    <>
      {departedCount > 1 && (
        <Button
          className="mb-2 flex gap-2"
          onClick={toggleHideDeparted}
          variant="secondary-accordion"
        >
          {toggledHideDeparted ? (
            <ArrowsCollapse height={16} />
          ) : (
            <ArrowsExpand height={16} />
          )}

          {toggledHideDeparted
            ? // Subtract the last departed row since it's always shown
              i(t('showDeparted {count}'), { count: departedCount - 1 })
            : i(t('hideDeparted {count}'), { count: departedCount - 1 })}
        </Button>
      )}

      <ol className="flex flex-col text-gray-800 dark:text-gray-200">
        {timetableRows.map((row, index) => {
          const key = row.liveEstimateTime || row.scheduledTime
          const isLastDeparted = index === lastDepartedIndex
          const shouldShow =
            row.type !== TimeTableRowType.Arrival &&
            row.commercialStop &&
            (toggledHideDeparted ? !hasDeparted(row) || isLastDeparted : true)

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
    </>
  )
}

export default SingleTimetable
