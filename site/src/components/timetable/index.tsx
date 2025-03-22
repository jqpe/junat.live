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

const sineIn = (t: number) => Math.sin((t * Math.PI) / 2)

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
    <table className="flex w-[100%] flex-col overflow-ellipsis whitespace-nowrap">
      <thead
        className={cx(
          'text-[0.74rem] leading-[175%] text-gray-700',
          'dark:text-gray-300 lg:text-[0.83rem]',
        )}
      >
        <tr className="grid grid-cols-[min(35%,30vw)_1fr_0.4fr_0.4fr] gap-[0.5vw]">
          <th>
            {t(type === 'DEPARTURE' ? 'destination' : 'departureStation')}
          </th>
          <th>{t(type === 'DEPARTURE' ? 'departureTime' : 'arrivalTime')}</th>
          <th className="flex justify-center">{t('track')}</th>
          <th className="flex justify-center">{t('train')}</th>
        </tr>
      </thead>
      <tbody className="flex flex-col">
        {trains.map((train, index) => {
          const row = getFutureTimetableRow(
            props.stationShortCode,
            train.timeTableRows,
            type,
          )
          if (!row || row.commercialStop === false) return null

          const fadeIn = holdPreviousStationId
            ? undefined
            : {
                opacity: 1,
                transition: {
                  stiffness: 170,
                  damping: 45,
                  mass: 1,
                  delay: sineIn(calculateDelay(index) / 100),
                },
              }

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
      </tbody>
    </table>
  )
}

export default Timetable
