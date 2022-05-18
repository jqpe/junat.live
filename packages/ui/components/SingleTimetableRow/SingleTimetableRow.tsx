import type { LocalizedStation, TimetableRow } from '~digitraffic'

import { getHhMmTime } from '../../utils/get_hh_mm_time'

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

const StyledTime = styled('time', {
  marginLeft: '1rem',
  color: '$primary700',
  '@dark': {
    color: '$primary500'
  }
})

const TimeDataCell = styled('td', {
  fontVariantNumeric: 'tabular-nums'
})

interface SingleTimetableRowProps {
  timetableRow: TimetableRow
  stations: LocalizedStation[]
  locale: 'fi' | 'en' | 'sv'
}

/**
 * Use this instead of TimetableRow when called from a single train context.
 */
export function SingleTimetableRow({
  timetableRow,
  stations,
  locale
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

    return !(scheduledDate === liveEstimateDate)
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
          {getHhMmTime(timetableRow.scheduledTime)}
        </time>
        {hasLiveEstimate && (
          <StyledTime dateTime={timetableRow.liveEstimateTime}>
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            {getHhMmTime(timetableRow.liveEstimateTime!)}
          </StyledTime>
        )}
      </TimeDataCell>
    </StyledTimetableRow>
  )
}
