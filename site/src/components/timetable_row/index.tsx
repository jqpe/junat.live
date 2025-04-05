import type { Variant, Variants } from 'motion/react'
import type { Train } from '@junat/digitraffic/types'

import React from 'react'
import Link from 'next/link'
import { cx } from 'cva'
import { motion } from 'motion/react'

import { getFormattedTime } from '@junat/core/utils/date'
import {
  getDestinationTimetableRow,
  hasLiveEstimateTime as getHasLiveEstimateTime,
  hasLongTrainType as getHasLongTrainType,
  getTrainHref,
} from '@junat/core/utils/train'
import { useTimetableType } from '@junat/react-hooks'
import { useStations } from '@junat/react-hooks/digitraffic/use_stations'
import { useTimetableRow } from '@junat/react-hooks/use_timetable_row'

import { getPreviousStationAnimation } from '~/components/timetable_row/helpers'
import { useTimetableRowA11y } from '~/components/timetable_row/hooks'
import { translate, useLocale, useTranslations } from '~/i18n'

export const TIMETABLE_ROW_TEST_ID = 'timetable-row'

export interface TimetableRowTranslations {
  train: string
}

export type TimetableRowTrain = Partial<Train> & {
  timeTableRows: Readonly<Train['timeTableRows']>
  departureDate: string
  trainNumber: number
  trainType: string
}

export interface TimetableRowProps {
  train: TimetableRowTrain
  stationShortCode: string
  fadeIn?: Variant
  row: Train['timeTableRows'][number]
}

export function TimetableRow(props: Readonly<TimetableRowProps>) {
  const { train, fadeIn, stationShortCode, row } = props

  const { data: stations = [] } = useStations({ t: translate('all') })
  const lastStationId = useTimetableRow(store => store.timetableRowId)
  const locale = useLocale()
  const type = useTimetableType(store => store.type)
  const t = useTranslations()
  const [bgAnimation, setBgAnimation] = React.useState<Variant>()

  // The destination if current row type === DEPARTURE or the departure station if type === ARRIVAL.
  const targetRow =
    type === 'DEPARTURE'
      ? getDestinationTimetableRow(train, stationShortCode)
      : train.timeTableRows[0]

  const { scheduledTime, liveEstimateTime } = {
    scheduledTime: getFormattedTime(row.scheduledTime),
    liveEstimateTime: row.liveEstimateTime
      ? getFormattedTime(row.liveEstimateTime)
      : undefined,
  }

  const tdStyle = cx(
    'flex overflow-hidden whitespace-pre-line text-gray-800 dark:text-gray-200',
  )
  const timeStyle = cx('[font-variant-numeric:tabular-nums]')

  const timetableRowId = `${row.scheduledTime}-${train.trainNumber}`

  const hasLiveEstimateTime = getHasLiveEstimateTime(row)
  const hasLongTrainType = getHasLongTrainType(train)

  const targetStation = stations.find(
    station => station.stationShortCode === targetRow?.stationShortCode,
  )

  const a11y = useTimetableRowA11y({
    train,
    targetStation,
    track: row.commercialTrack,
    ...row,
  })

  const variants: Variants = {
    previous: bgAnimation || {},
    fadeIn: fadeIn || { opacity: 1 },
  }

  return (
    <motion.li
      className={cx(
        'timetable-row-separator relative',
        'text-[0.88rem] [--tr-animation-from:theme(colors.primary.200)] first:pt-[5px]',
        'border-b-[1px] border-gray-200 last:border-none dark:border-gray-800',
        'dark:[--tr-animation-from:theme(colors.primary.800)]',
        'dark:[--tr-animation-to:theme(colors.gray.900)] lg:text-[1rem]',
        'py-[10px] [--tr-animation-to:theme(colors.gray.100)]',
        'cursor-default dark:hover:bg-white/5',
        'hover:bg-white/50',
      )}
      animate={['fadeIn', 'previous']}
      initial={{ opacity: fadeIn ? 0 : 1 }}
      variants={variants}
    >
      <Link
        href={getTrainHref(t, train.departureDate, train.trainNumber)}
        className={cx(
          'grid w-full grid-cols-timetable-row gap-[0.5vw] no-underline focus-visible:outline',
          'outline-offset-8 outline-secondary-400',
        )}
        {...a11y}
        data-testid={TIMETABLE_ROW_TEST_ID}
        ref={getPreviousStationAnimation({
          lastStationId,
          onCalculateAnimation: setBgAnimation,
        })}
        data-cancelled={train.cancelled}
        title={train.cancelled ? t('cancelled') : undefined}
        data-id={timetableRowId}
      >
        <p className={tdStyle}>{targetStation?.stationName[locale]}</p>

        <p className={tdStyle}>
          {train.cancelled ? (
            <span>{`(${scheduledTime}) ${t('cancelled')}`}</span>
          ) : (
            <span className="flex gap-[5px] [font-feature-settings:tnum]">
              <time className={timeStyle} dateTime={row.scheduledTime}>
                {scheduledTime}
              </time>
              {hasLiveEstimateTime && (
                <time
                  dateTime={row.liveEstimateTime}
                  className={cx(
                    timeStyle,
                    'text-primary-700 dark:text-primary-400',
                  )}
                >
                  {liveEstimateTime}
                </time>
              )}
            </span>
          )}
        </p>
        <p className={cx(tdStyle, 'flex justify-center')}>
          {row.commercialTrack || '-'}
        </p>
        <p
          className={cx(
            tdStyle,
            'flex justify-center',
            hasLongTrainType && 'text-[min(2.5vw,80%)]',
          )}
        >
          <span className="w-full cursor-default text-center">
            {train.commuterLineID || `${train.trainType}${train.trainNumber}`}
          </span>
        </p>
      </Link>
    </motion.li>
  )
}

export default TimetableRow
