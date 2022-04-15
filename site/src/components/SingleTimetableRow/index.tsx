import type { TimetableRow } from '~digitraffic'

import { useRouter } from 'next/router'

import { formatTrainTime } from '@utils/format_train_time'
import { getLocaleOrThrow } from '@utils/get_locale_or_throw'
import { useStationsQuery } from '../../features/stations/stations_slice'

import styles from './SingleTimetableRow.module.scss'

interface SingleTimetableRowProps {
  timetableRow: TimetableRow
}

/**
 * Use this instead of TimetableRow when called from a single train context.
 */
export default function SingleTimetableRow({
  timetableRow
}: SingleTimetableRowProps) {
  const { data: stations } = useStationsQuery()
  const router = useRouter()
  const locale = getLocaleOrThrow(router.locale)

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
      <td>
        <span>
          <svg
            height={24}
            width={24}
            viewBox="0 0 100 100"
            data-departed={hasDeparted}
            className={styles.circle}
          >
            <circle cx="50" cy="50" r="12.5" />
          </svg>
        </span>
      </td>
      <td>
        {
          stations?.find(
            station =>
              station.stationShortCode === timetableRow.stationShortCode
          )?.stationName[locale]
        }
      </td>
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
