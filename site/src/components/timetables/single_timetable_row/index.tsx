import type { Locale } from '@typings/common'

import { getFormattedTime } from '@utils/get_formatted_time'

import {
  StyledCircle,
  StyledInfo,
  StyledTimetableRow,
  TimeDataCell
} from './styles'

import * as helpers from './helpers'

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
  const hasDeparted = helpers.hasDeparted(timetableRow)
  const hasLiveEstimate = helpers.hasLiveEstimate(timetableRow)
  const localizedStationName = helpers.getLocalizedStationName(
    locale,
    stations,
    timetableRow
  )

  return (
    <StyledTimetableRow>
      <td>
        <svg
          height={24}
          width={24}
          viewBox="0 0 100 100"
          style={{ display: 'flex' }}
        >
          <StyledCircle
            {...(hasDeparted ? { ['data-departed']: true } : {})}
            cx="50"
            cy="50"
            r="12.5"
          />
        </svg>
      </td>
      <td>{localizedStationName}</td>
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
