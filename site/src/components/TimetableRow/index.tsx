import type { StationScreenTranslations } from '@typings/station_screen_translations'
import type { SimplifiedTrain } from '@typings/simplified_train'

import { getStationPath } from '~digitraffic'
import Link from 'next/link'

import { formatTrainTime } from '@utils/format_train_time'

export interface TimetableRowProps {
  train: SimplifiedTrain
  locale: 'fi' | 'en' | 'sv'
  translation: StationScreenTranslations
}

export default function TimetableRow({
  locale,
  translation,
  train
}: TimetableRowProps) {
  const { scheduledTime, liveEstimateTime } = {
    scheduledTime: formatTrainTime(train.scheduledTime),
    liveEstimateTime: train.liveEstimateTime
      ? formatTrainTime(train.liveEstimateTime)
      : undefined
  }

  return (
    <tr>
      <td>
        <Link href={`/${getStationPath(train.destination[locale]!)}`}>
          {train.destination[locale]}
        </Link>
      </td>

      <td>
        <time dateTime={train.scheduledTime}>{scheduledTime}</time>
        {train.liveEstimateTime &&
          train.liveEstimateTime > train.scheduledTime && (
            <time dateTime={train.liveEstimateTime}>{liveEstimateTime}</time>
          )}
      </td>
      <td>{train.track}</td>
      <td>
        <Link
          href={`/${translation.train.toLowerCase()}/${train.departureDate}/${
            train.trainNumber
          }`}
        >
          {train.commuterLineID || `${train.trainType}${train.trainNumber}`}
        </Link>
      </td>
    </tr>
  )
}
