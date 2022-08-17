import type {
  TimetableRowTrain,
  TimetableRowProps,
  TimetableRowTranslations
} from '../components/TimetableRow'

import { styled } from '@config/theme'

import { TimetableRow } from '../components/TimetableRow'

export interface TimetableTranslations extends TimetableRowTranslations {
  cancelledText: string
  destination: string
  departureTime: string
  track: string
  train: string
}

export interface TimetableProps {
  trains: TimetableRowTrain[]
  locale: 'fi' | 'en' | 'sv'
  translation: TimetableTranslations
  lastStationId: TimetableRowProps['lastStationId']
}

const StyledTimetable = styled('table', {
  textDecoration: 'none',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
})

const StyledTimetableBody = styled('tbody', {
  display: 'flex',
  flexDirection: 'column'
})

const StyledTimetableHead = styled('thead', {
  fontSize: '$mobile-caption',
  lineHeight: '$md',
  '@large': {
    fontSize: '$pc-caption'
  },
  color: '$slateGray700',
  '@dark': {
    color: '$slateGray300'
  },
  '@media (max-width: 20rem)': {
    fontSize: 'calc(.5rem + 1vw)'
  }
})

const StyledTimetableRow = styled('tr', {
  display: 'grid',
  gridTemplateColumns: 'min(35%, 30vw) 1fr 0.4fr 0.4fr',
  gap: '0.5vw'
})

const CenteredTd = styled('td', {
  display: 'flex',
  justifyContent: 'center'
})

export function Timetable({
  trains,
  translation,
  locale,
  ...id
}: TimetableProps) {
  if (trains.length === 0) {
    return <></>
  }

  return (
    <StyledTimetable>
      <StyledTimetableHead>
        <StyledTimetableRow>
          <td>{translation.destination}</td>
          <td>{translation.departureTime}</td>
          <CenteredTd>{translation.track}</CenteredTd>
          <CenteredTd>{translation.train}</CenteredTd>
        </StyledTimetableRow>
      </StyledTimetableHead>
      <StyledTimetableBody>
        {trains.map(train => {
          return (
            <TimetableRow
              cancelledText={translation.cancelledText}
              lastStationId={id.lastStationId}
              locale={locale}
              train={train}
              key={`${train.trainNumber}-${train.departureDate}.${train.scheduledTime}`}
            />
          )
        })}
      </StyledTimetableBody>
    </StyledTimetable>
  )
}

export default Timetable
