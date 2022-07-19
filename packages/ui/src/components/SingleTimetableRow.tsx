import { getFormattedTime } from '../utils/get_formatted_time'

import { styled } from '@junat/stitches'

const StyledTimetableRow = styled('tr', {
  display: 'grid',
  alignItems: 'center',
  gridTemplateColumns: '10% 1fr 1fr',
  marginTop: '$3',
  position: 'relative'
})

const StyledCircle = styled('circle', {
  fill: '$slateGray500',
  '@dark': {
    fill: '$slateGray600'
  },
  '&[data-departed="true"]': {
    fill: '$primary600',
    '@dark': {
      fill: '$primary400'
    }
  }
})

const StyledInfo = styled('time', {
  marginLeft: '1rem',
  color: '$primary700',
  '@dark': {
    color: '$primary500'
  }
})

const TimeDataCell = styled('td', {
  fontVariantNumeric: 'tabular-nums'
})

export interface SingleTimetableRowProps {
  timetableRow: {
    scheduledTime: string
    type: 'ARRIVAL' | 'DEPARTURE'
    cancelled?: boolean
    liveEstimateTime?: string
    stationShortCode: string
  }
  stations: Array<{
    stationShortCode: string
    stationName: Record<'fi' | 'en' | 'sv', string>
  }>
  locale: 'fi' | 'en' | 'sv'
  cancelledText: string
}

/**
 * Use this instead of TimetableRow when called from a single train context.
 */
export function SingleTimetableRow({
  timetableRow,
  stations,
  locale,
  cancelledText
}: SingleTimetableRowProps) {
  const now = new Date()
  const hasDeparted =
    +Date.parse(timetableRow.liveEstimateTime ?? timetableRow.scheduledTime) <
    +now

  const hasLiveEstimate = (() => {
    if (!timetableRow.liveEstimateTime) {
      return false
    }

    // Don't render liveEstimate if hours and minutes are equal
    const [scheduledDate, liveEstimateDate] = [
      timetableRow.scheduledTime,
      timetableRow.liveEstimateTime
    ]
      .map(isoString => new Date(Date.parse(isoString)))
      .map(date => `${date.getHours()}:${date.getMinutes()}`)

    return scheduledDate !== liveEstimateDate
  })()

  return (
    <StyledTimetableRow>
      <td>
        <svg
          height={24}
          width={24}
          viewBox="0 0 100 100"
          style={{ display: 'flex' }}
        >
          <StyledCircle data-departed={hasDeparted} cx="50" cy="50" r="12.5" />
        </svg>
      </td>
      <td>
        {
          stations?.find(
            station =>
              station.stationShortCode === timetableRow.stationShortCode
          )?.stationName[locale]
        }
      </td>
      <TimeDataCell>
        <time dateTime={timetableRow.scheduledTime}>
          {getFormattedTime(timetableRow.scheduledTime)}
        </time>
        {(hasLiveEstimate || timetableRow.cancelled) && (
          <StyledInfo dateTime={timetableRow.liveEstimateTime}>
            {timetableRow.cancelled
              ? cancelledText
              : getFormattedTime(timetableRow.liveEstimateTime!)}
          </StyledInfo>
        )}
      </TimeDataCell>
    </StyledTimetableRow>
  )
}

export default SingleTimetableRow
