import type { TimetableRow } from '~digitraffic'

import { formatTrainTime } from '@utils/format_train_time'

interface SingleTimetableRowProps {
  timetableRow: TimetableRow
}

/**
 * Use this instead of TimetableRow when called from a single train context.
 */
export default function SingleTimetableRow({
  timetableRow
}: SingleTimetableRowProps) {
  const now = new Date()
  const hasDeparted =
    +Date.parse(timetableRow.liveEstimateTime ?? timetableRow.scheduledTime) <
    +now

  const hasLiveEstimate = (() => {
    if (!timetableRow.liveEstimateTime) {
      return false
    }

    const [scheduledDate, liveEstimateDate] = [
      formatTrainTime(timetableRow.scheduledTime),
      formatTrainTime(timetableRow.liveEstimateTime)
    ]

    if (scheduledDate === liveEstimateDate) {
      return false
    }

    return true
  })()

  return (
    <tr>
      <td>{hasDeparted && <span>*</span>}</td>
      <td>{timetableRow.stationShortCode}</td>
      <td>
        <time dateTime={timetableRow.scheduledTime}>
          {formatTrainTime(timetableRow.scheduledTime)}
        </time>
        {hasLiveEstimate && (
          <time dateTime={timetableRow.liveEstimateTime}>
            {formatTrainTime(timetableRow.liveEstimateTime!)}
          </time>
        )}
      </td>
    </tr>
  )
}
