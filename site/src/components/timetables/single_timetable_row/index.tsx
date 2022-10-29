import type { Locale } from '@typings/common'

import { getFormattedTime } from '@utils/get_formatted_time'

import {
  StyledCircle,
  StyledInfo,
  StyledTimetableRow,
  TimeDataCell
} from './styles'

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
    stationName: Record<Locale, string>
  }>
  locale: Locale
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
              : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                getFormattedTime(timetableRow.liveEstimateTime!)}
          </StyledInfo>
        )}
      </TimeDataCell>
    </StyledTimetableRow>
  )
}

export default SingleTimetableRow