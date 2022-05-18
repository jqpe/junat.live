import type {
  SingleTimetableRowStation,
  SingleTimetableRowType
} from '../SingleTimetableRow'

import { SingleTimetableRow } from '../SingleTimetableRow'

import { styled } from '@junat/stitches'

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

export interface SingleTimetableProps {
  timetableRows: SingleTimetableRowType[]
  stations: SingleTimetableRowStation[]
  /**
   * @default DEPARTURE
   */
  type?: 'DEPARTURE' | 'ARRIVAL'
  locale: 'fi' | 'en' | 'sv'
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
