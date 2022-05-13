import type { StationScreenTranslations } from '@junat/cms'
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
        <Link href={`/${getStationPath(train.destination[locale])}`}>
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
      <td
        style={{
          fontSize:
            !train.commuterLineID &&
            `${train.trainType}${train.trainNumber}`.length > 5
              ? 'min(2.5vw, 80%)'
              : 'inherit'
        }}
      >
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
