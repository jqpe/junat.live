import type { AnimationControls } from 'motion/react'
import type { Train } from '@junat/digitraffic/types'
import type { LocalizedStation } from '~/lib/digitraffic'
import type { Locale } from '~/types/common'

import React from 'react'
import Link from 'next/link'
import { cx } from 'cva'
import { motion, useAnimation } from 'motion/react'

import { getFormattedTime } from '@junat/core/utils/date'
import {
  getDestinationTimetableRow,
  getFutureTimetableRow,
  hasLiveEstimateTime as getHasLiveEstimateTime,
  hasLongTrainType as getHasLongTrainType,
  getTrainHref,
} from '@junat/core/utils/train'
import { useTimetableRow } from '@junat/react-hooks/use_timetable_row'

import {
  getPreviousStationAnimation,
  getTrainLabel,
} from '~/components/timetable_row/helpers'
import { useTimetableRowA11y } from '~/components/timetable_row/hooks'
import { useLocale, useTranslations } from '~/i18n'

export const TIMETABLE_ROW_TEST_ID = 'timetable-row'

type ControlsAnimationDefinition = Parameters<AnimationControls['start']>['0']

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
  locale: Locale
  cancelledText: string
  /**
   * Function to transform station path into a URI-safe string.
   * Takes the station's name as a parameter.
   */
  lastStationId: string
  stationShortCode: string
  stations: LocalizedStation[]
  type: 'DEPARTURE' | 'ARRIVAL'

  animation?: {
    duration?: number
    delay?: number
  }
}

function TimetableRowComponent({
  lastStationId,
  train,

  stationShortCode,
  stations,
  currentRow,
  type,

  animation,
}: TimetableRowProps & { currentRow: Train['timeTableRows'][number] }) {
  const locale = useLocale()
  const t = useTranslations()
  const [backgroundAnimation, setBackgroundAnimation] =
    React.useState<ControlsAnimationDefinition>()
  // The destination if current row type === DEPARTURE or the departure station if type === ARRIVAL.
  const targetRow =
    type === 'DEPARTURE'
      ? getDestinationTimetableRow(train, stationShortCode)
      : train.timeTableRows[0]

  const { scheduledTime, liveEstimateTime } = {
    scheduledTime: getFormattedTime(currentRow.scheduledTime),
    liveEstimateTime: currentRow.liveEstimateTime
      ? getFormattedTime(currentRow.liveEstimateTime)
      : undefined,
  }

  const tdStyle = cx(
    'flex overflow-hidden whitespace-pre-line text-gray-800 dark:text-gray-200',
  )
  const timeStyle = cx('[font-variant-numeric:tabular-nums]')

  const timetableRowId = `${currentRow.scheduledTime}-${train.trainNumber}`

  const hasLiveEstimateTime = getHasLiveEstimateTime(currentRow)
  const hasLongTrainType = getHasLongTrainType(train)

  const setTimetableRowId = useTimetableRow(state => state.setTimetableRowId)

  const controls = useAnimation()

  const targetStation = stations.find(
    station => station.stationShortCode === targetRow?.stationShortCode,
  )

  const a11y = useTimetableRowA11y({
    train,
    targetStation,
    ...currentRow,
  })

  React.useLayoutEffect(() => {
    if (backgroundAnimation) {
      controls.start(backgroundAnimation)
    }

    return controls.stop
  }, [backgroundAnimation])

  return (
    <motion.tr
      {...a11y}
      data-testid={TIMETABLE_ROW_TEST_ID}
      ref={getPreviousStationAnimation({
        lastStationId,
        onCalculateAnimation: setBackgroundAnimation,
      })}
      className={cx(
        'timetable-row-separator relative grid grid-cols-timetable-row gap-[0.5vw]',
        'text-[0.88rem] [--tr-animation-from:theme(colors.primary.200)] first:pt-[5px]',
        '[border-bottom:1px_solid_theme(colors.gray.200)] dark:border-gray-800',
        'last:border-none dark:[--tr-animation-from:theme(colors.primary.800)]',
        'dark:[--tr-animation-to:theme(colors.gray.900)] lg:text-[1rem]',
        'py-[10px] [--tr-animation-to:theme(colors.gray.100)] focus-visible:ring-1',
        'cursor-default dark:hover:bg-white/5 dark:focus-visible:ring-offset-transparent',
        'hover:bg-white/50 focus-visible:ring-offset-1',
      )}
      data-cancelled={train.cancelled}
      title={train.cancelled ? t('cancelled') : undefined}
      data-id={timetableRowId}
      animate={controls}
      transition={{
        stiffness: 1000,
        mass: 0.05,
        damping: 1,
        duration: animation?.duration ?? 0.2,
        delay: animation?.delay,
      }}
    >
      <td className={tdStyle}>{targetStation?.stationName[locale]}</td>

      <td className={tdStyle}>
        {train.cancelled ? (
          <span>{`(${scheduledTime}) ${t('cancelled')}`}</span>
        ) : (
          <div className="flex gap-[5px] [font-feature-settings:tnum]">
            <time className={timeStyle} dateTime={currentRow.scheduledTime}>
              {scheduledTime}
            </time>
            {hasLiveEstimateTime && (
              <time
                dateTime={currentRow.liveEstimateTime}
                className={cx(
                  timeStyle,
                  'text-primary-700 dark:text-primary-400',
                )}
              >
                {liveEstimateTime}
              </time>
            )}
          </div>
        )}
      </td>
      <td className={cx(tdStyle, 'flex justify-center')}>
        {currentRow.commercialTrack || '-'}
      </td>
      <td
        className={cx(
          tdStyle,
          'flex justify-center',
          hasLongTrainType && 'text-[min(2.5vw,80%)]',
        )}
      >
        <Link
          /* The parent row is keyboard focusable and acts as a button */
          tabIndex={-1}
          aria-label={getTrainLabel(train, t)}
          className="w-full cursor-default text-center"
          href={getTrainHref(t, train.departureDate, train.trainNumber)}
          onClick={() => setTimetableRowId(timetableRowId)}
        >
          {train.commuterLineID || `${train.trainType}${train.trainNumber}`}
        </Link>
      </td>
    </motion.tr>
  )
}

export const TimetableRow = (props: TimetableRowProps) => {
  const currentRow = getFutureTimetableRow(
    props.stationShortCode,
    props.train.timeTableRows,
    props.type,
  )

  if (!currentRow || currentRow.commercialStop === false) {
    return null
  }

  return <TimetableRowComponent {...props} currentRow={currentRow} />
}

export default TimetableRow
