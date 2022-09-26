import type { SingleTimetableRowProps } from '../components/SingleTimetableRow'
import type { Locale } from '@typings/common'

import { SingleTimetableRow } from '../components/SingleTimetableRow'

import { styled } from '@junat/design'

const StyledSingleTimetable = styled('table', {
  display: 'flex',
  color: '$slateGray800',
  '@dark': {
    color: '$slateGray200'
  },
  '& tbody': {
    width: '100%'
  }
})

type TimetableRow = SingleTimetableRowProps['timetableRow']

export interface SingleTableTimetableRow extends TimetableRow {
  commercialStop?: boolean
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
    <StyledSingleTimetable>
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
    </StyledSingleTimetable>
  )
}

export default SingleTimetable
