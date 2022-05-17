import type { StationScreenTranslations } from '@junat/cms'
import type { SimplifiedTrain } from '@typings/simplified_train'

import { getStationPath } from '~digitraffic'
import Link from 'next/link'
import React from 'react'

import { formatTrainTime } from '@utils/format_train_time'

import useColorScheme from '@hooks/use_color_scheme.hook'

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

  const { colorScheme } = useColorScheme()
  const dark = colorScheme === 'dark'

  const animate = {
    background: [
      dark ? 'hsla(275, 100%, 22.2%, 1)' : 'hsla(274, 100%, 95.9%, 1)',
      dark ? 'hsla(276, 100%, 2.9%, 0)' : 'hsla(276, 100%, 99%, 0)'
    ]
  }

  return (
    <motion.tr
      data-id={stationId}
      animate={isLastStation && animate}
      transition={{ stiffness: 1000, mass: 0.05, damping: 1 }}
    >
      <td>
        <Link href={`/${getStationPath(train.destination[locale])}`}>
          <a onClick={() => dispatch(setLastStationId(stationId))}>
            {train.destination[locale]}
          </a>
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
