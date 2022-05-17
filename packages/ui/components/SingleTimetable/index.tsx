import type { LocalizedStation, TimetableRow } from '~digitraffic'

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

interface SingleTimetableProps {
  timetableRows: TimetableRow[]
  stations: LocalizedStation[]
  type?: 'DEPARTURE' | 'ARRIVAL'
  locale: 'fi' | 'en' | 'sv'
}

export function SingleTimetable({
  timetableRows,
  stations,
  type = 'DEPARTURE',
  locale
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
