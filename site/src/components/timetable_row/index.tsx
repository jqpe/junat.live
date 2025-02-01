import type { AnimationControls } from 'motion/react'
import type { Train } from '@junat/digitraffic/types'
import type { LocalizedStation } from '~/lib/digitraffic'
import type { Locale } from '~/types/common'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { cx } from 'cva'
import { motion, useAnimation } from 'motion/react'

import { interpolateString as i } from '@junat/core/i18n'
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
  getStationNameIllative,
  getTrainDescription,
  getTrainLabel,
} from '~/components/timetable_row/helpers'
import { useTranslations } from '~/i18n'

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

const Time = (props: React.HTMLProps<HTMLTimeElement>) => (
  <time
    {...props}
    className={`[font-variant-numeric:tabular-nums] ${props.className}`}
  />
)

const Centered = (props: React.HTMLProps<HTMLTableCellElement>) => (
  <td {...props} className={`flex justify-center ${props.className}`} />
)

const Td = (props: React.HTMLProps<HTMLTableCellElement>) => (
  <td
    {...props}
    className={
      'flex overflow-hidden whitespace-pre-line text-gray-800 dark:text-gray-200'
    }
  />
)

function TimetableRowComponent({
  locale,
  lastStationId,
  train,
  cancelledText,
  stationShortCode,
  stations,
  currentRow,
  type,

  animation,
}: TimetableRowProps & { currentRow: Train['timeTableRows'][number] }) {
  const router = useRouter()
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

  const timetableRowId = `${currentRow.scheduledTime}-${train.trainNumber}`

  const hasLiveEstimateTime = getHasLiveEstimateTime(currentRow)
  const hasLongTrainType = getHasLongTrainType(train)

  const setTimetableRowId = useTimetableRow(state => state.setTimetableRowId)

  const controls = useAnimation()

  const targetStation = stations.find(
    station => station.stationShortCode === targetRow?.stationShortCode,
  )

  const onRequestNavigate = () => {
    router.push(getTrainHref(t, train.departureDate, train.trainNumber))
    setTimetableRowId(timetableRowId)
  }

  const getRowAriaLabel = (): string => {
    const { commercialTrack: track } = currentRow

    const trainArgs = {
      train: getTrainDescription(train, t),
      track,
      station: getStationNameIllative(locale, targetStation),
    }

    const timeArgs = {
      time: scheduledTime,
      estimate:
        liveEstimateTime === scheduledTime ? undefined : liveEstimateTime,
    }

    const trainDescription = i(
      t('{ train } from { track } to { station }'),
      trainArgs,
    )
    const rowType = type === 'ARRIVAL' ? 'arrival' : 'departure'
    const timeDescription = i(
      t(`scheduled ${rowType} { time } estimated { estimate }`),
      timeArgs,
    )

    return `${trainDescription}. ${timeDescription}`
  }

  React.useEffect(() => {
    if (backgroundAnimation) {
      controls.start(backgroundAnimation)
    }
  }, [backgroundAnimation])

  return (
    <motion.tr
      aria-label={getRowAriaLabel()}
      role="button"
      tabIndex={0}
      onKeyDown={event => {
        // Space or Enter key
        if (/\u0020|Enter/u.test(event.key)) {
          // Prevent scrolling caused by Space
          event.preventDefault()
          onRequestNavigate()
        }
      }}
      data-testid={TIMETABLE_ROW_TEST_ID}
      onClick={onRequestNavigate}
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
      title={train.cancelled ? cancelledText : ''}
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
      <Td>{targetStation?.stationName[locale]}</Td>

      <Td>
        {train.cancelled ? (
          <span>{`(${scheduledTime}) ${cancelledText}`}</span>
        ) : (
          <div className="flex gap-[5px] [font-feature-settings:tnum]">
            <Time dateTime={currentRow.scheduledTime}>{scheduledTime}</Time>
            {hasLiveEstimateTime && (
              <Time
                dateTime={currentRow.liveEstimateTime}
                className="text-primary-700 dark:text-primary-400"
              >
                {liveEstimateTime}
              </Time>
            )}
          </div>
        )}
      </Td>
      <Centered>{currentRow.commercialTrack || '-'}</Centered>
      <Centered
        className={hasLongTrainType ? 'text-[min(2.5vw,80%)]' : undefined}
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
      </Centered>
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
