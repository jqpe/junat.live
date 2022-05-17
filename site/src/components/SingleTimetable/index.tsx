import type { Train } from '~digitraffic'

import SingleTimetableRow from '@components/SingleTimetableRow'

import { styled } from 'stitches.config'

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

export default function SingleTimetable({
  timetableRows
}: {
  timetableRows: Train['timeTableRows']
}) {
  return (
    <StyledSingleTimetable>
      <tbody>
        {timetableRows
          .filter(
            (tr, i) =>
              (tr.type === 'DEPARTURE' || i === timetableRows.length - 1) &&
              tr.commercialStop
          )
          .map(timetableRow => (
            <SingleTimetableRow
              key={timetableRow.liveEstimateTime || timetableRow.scheduledTime}
              timetableRow={timetableRow}
            />
          ))}
      </tbody>
    </StyledSingleTimetable>
  )
}
