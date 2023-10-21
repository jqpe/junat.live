import type { Locale } from '@typings/common'

import { getFormattedTime } from '@utils/date'

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

  const LiveEstimate = () => {
    if (!hasLiveEstimate || timetableRow.cancelled) {
      return null
    }

    return timetableRow.liveEstimateTime ? (
      <time
        dateTime={timetableRow.liveEstimateTime}
        className="ml-[1rem] text-primary-700 dark:text-primary-500"
      >
        {getFormattedTime(timetableRow.liveEstimateTime)}
      </time>
    ) : null
  }

  const Cancelled = () => {
    if (!timetableRow.cancelled) {
      return null
    }

    return (
      <span className="ml-[1rem] text-primary-700 dark:text-primary-500">
        {cancelledText}
      </span>
    )
  }

  return (
    <tr className="grid items-center grid-cols-[10%_1fr_1fr] mt-[15px] relative">
      <td>
        <svg
          height={24}
          width={24}
          viewBox="0 0 100 100"
          style={{ display: 'flex' }}
        >
          <circle
            {...(hasDeparted ? { ['data-departed']: true } : {})}
            className="fill-gray-500 dark:fill-gray-600 data-[departed=true]:fill-primary-600 data-[departed=true]:dark:fill-primary-400"
            cx="50"
            cy="50"
            r="12.5"
          />
        </svg>
      </td>
      <td>{localizedStationName}</td>
      <td className="[font-variant-numeric:tabular-nums]">
        <time dateTime={timetableRow.scheduledTime}>
          {getFormattedTime(timetableRow.scheduledTime)}
        </time>
        <LiveEstimate />
        <Cancelled />
      </td>
    </tr>
  )
}

export default SingleTimetableRow
