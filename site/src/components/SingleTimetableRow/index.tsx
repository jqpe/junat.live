import type { TimetableRow } from '~digitraffic'

import { useRouter } from 'next/router'

import { formatTrainTime } from '@utils/format_train_time'
import { getLocaleOrThrow } from '@utils/get_locale_or_throw'
import { useStationsQuery } from '../../features/stations/stations_slice'

import { styled } from '@junat/stitches'

interface SingleTimetableRowProps {
  timetableRow: TimetableRow
}

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
    <tr>
      <td>
        <span>
          <svg height={24} width={24} viewBox="0 0 100 100">
            <StyledCircle
              data-departed={hasDeparted}
              cx="50"
              cy="50"
              r="12.5"
            />
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
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            {formatTrainTime(timetableRow.liveEstimateTime!)}
          </time>
        )}
      </td>
    </tr>
  )
}
