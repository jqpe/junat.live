import type { LocalizedStation, TimetableRow } from '~digitraffic'

import SingleTimetableRow from '../SingleTimetableRow'

import { styled } from '@junat/stitches'

const StyledSingleTimetable = styled('table', {
  display: 'flex',
  color: '$slateGray800',
  fontVariantNumeric: 'tabular-nums',
  '@dark': {
    color: '$slateGray200'
  },
  '& tbody': {
    width: '100%'
  },
  '& tr': {
    display: 'grid',
    gridTemplateColumns: '10% 1fr 1fr',
    marginTop: '1rem',
    position: 'relative'
  },
  '& td > *:nth-child(2)': {
    marginLeft: '1rem',
    color: '$primary700',
    '@dark': {
      color: '$primary500'
    }
  }
})

interface SingleTimetableProps {
  timetableRows: TimetableRow[]
  stations: LocalizedStation[]
  type: 'DEPARTURE' | 'ARRIVAL'
  locale: 'fi' | 'en' | 'sv'
}

export default function SingleTimetable({
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
