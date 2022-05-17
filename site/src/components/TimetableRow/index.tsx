import type { StationScreenTranslations } from '@junat/cms'
import type { SimplifiedTrain } from '@typings/simplified_train'

import { getStationPath } from '~digitraffic'
import Link from 'next/link'
import React from 'react'

import { formatTrainTime } from '@utils/format_train_time'
import { useAppDispatch, useAppSelector } from 'src/app/hooks'
import { setLastStationId } from 'src/features/station_page/station_page_slice'

import { motion } from 'framer-motion'

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

  const stationId = `${train.scheduledTime}-${train.trainNumber}`
  const dispatch = useAppDispatch()
  const lastStationId = useAppSelector(
    ({ stationPage }) => stationPage.lastStationId
  )

  const [isLastStation, setIsLastStation] = React.useState(false)

  useRestoreScrollPosition(lastStationId, stationId, setIsLastStation)

  const animate = isLastStation
    ? {
        background: ['#c779ff', 'hsla(0, 0%, 0%, 0)']
      }
    : {}

  return (
    <motion.tr
      data-id={stationId}
      animate={animate}
      transition={{ type: 'spring' }}
    >
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
          <a onClick={() => dispatch(setLastStationId(stationId))}>
            {train.commuterLineID || `${train.trainType}${train.trainNumber}`}
          </a>
        </Link>
      </td>
    </motion.tr>
  )
}

/**
 * Restores the scroll position from cache and if the cache key and the components key match scrolls to the component.
 */
function useRestoreScrollPosition(
  lastStationId: string,
  stationId: string,
  setIsLastStation: React.Dispatch<React.SetStateAction<boolean>>
) {
  const renders = React.useRef(0)

  React.useEffect(() => {
    if (lastStationId === stationId && renders.current === 0) {
      const lastStationElem = document.querySelector(`[data-id="${stationId}"]`)
      const rect = lastStationElem?.getBoundingClientRect()

      lastStationElem?.scrollIntoView({
        block: rect && rect.top > window.innerHeight ? 'center' : 'end'
      })
      setIsLastStation(true)
    }
    renders.current += 1
  }, [lastStationId, setIsLastStation, stationId])
}
