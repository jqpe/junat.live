import type { Variant } from 'motion/react'
import type { TimetableRowTrain } from '~/components/timetable_row'

import React from 'react'
import { cx } from 'cva'

import {
  DEFAULT_TRAINS_COUNT,
  getFutureTimetableRow,
  TRAINS_MULTIPLIER,
} from '@junat/core'
import { useTimetableRow, useTimetableType } from '@junat/react-hooks'

import { TimetableRow } from '~/components/timetable_row'
import { useTranslations } from '~/i18n'

export interface TimetableProps {
  trains: TimetableRowTrain[]
  stationShortCode: string
}
export function Timetable({ trains, ...props }: Readonly<TimetableProps>) {
  const type = useTimetableType(store => store.type)
  const t = useTranslations()
  const previousStationId = useTimetableRow(store => store.timetableRowId)

  const holdPreviousStationId = React.useMemo(() => {
    return trains.find(train => {
      const row = getFutureTimetableRow(
        props.stationShortCode,
        train.timeTableRows,
        type,
      )

      if (!row || row.commercialStop === false) return false

      return `${row.scheduledTime}-${train.trainNumber}` === previousStationId
    })
  }, [previousStationId, trains, type])

  if (trains.length === 0) {
    return null
  }

  return (
    <div className="flex w-full flex-col overflow-ellipsis whitespace-nowrap">
      <div
        aria-hidden
        className={cx(
          'text-[0.74rem] leading-[175%] text-gray-700',
          'dark:text-gray-300 lg:text-[0.83rem]',
        )}
      >
        <div className="grid grid-cols-[min(35%,30vw)_1fr_0.4fr_0.4fr] gap-[0.5vw]">
          <p>{t(type === 'DEPARTURE' ? 'destination' : 'departureStation')}</p>
          <p>{t(type === 'DEPARTURE' ? 'departureTime' : 'arrivalTime')}</p>
          <p className="flex justify-center">{t('track')}</p>
          <p className="flex justify-center">{t('train')}</p>
        </div>
      </div>
      <ul
        className="flex flex-col"
        aria-label={t(
          type === 'ARRIVAL' ? 'arrivingTrains' : 'departingTrains',
        )}
      >
        {trains.map((train, index) => {
          const row = getFutureTimetableRow(
            props.stationShortCode,
            train.timeTableRows,
            type,
          )
          if (!row || row.commercialStop === false) return null

          const fadeIn = holdPreviousStationId ? undefined : animation(index)

          return (
            <TimetableRow
              fadeIn={fadeIn}
              stationShortCode={props.stationShortCode}
              row={row}
              train={train}
              key={`${train.departureDate}-${train.trainNumber}-${train.version}`}
            />
          )
        })}
      </ul>
    </div>
  )
}

export default Timetable

/**
 * Given a number `index` returns a number 0..99
 * - If `index` < {@link DEFAULT_TRAINS_COUNT} (e.g. 20) => 0..19
 * - If `index` < {@link TRAINS_MULTIPLIER} (e.g. 100) => 0..79
 * - Otherwise 0..99
 */
export const calculateDelay = (index: number) => {
  if (index < DEFAULT_TRAINS_COUNT) {
    return index
  }

  if (index < TRAINS_MULTIPLIER) {
    return index - DEFAULT_TRAINS_COUNT
  }

  const group = Math.floor(index / TRAINS_MULTIPLIER)
  return index - group * TRAINS_MULTIPLIER
}

export const animation = (index: number) =>
  ({
    opacity: 1,
    transition: {
      stiffness: 170,
      damping: 45,
      mass: 1,
      delay: sineIn(calculateDelay(index) / 100),
    },
  }) as const satisfies Variant

const sineIn = (t: number) => Math.sin((t * Math.PI) / 2)
