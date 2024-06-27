import type { AnimationControls } from 'framer-motion'
import type { LinkProps } from 'next/link'
import type { Train } from '@junat/digitraffic/types'
import type { LocalizedStation } from '~/lib/digitraffic'
import type { Locale } from '~/types/common'
import type { Code } from '~/utils/train'

import React from 'react'
import Link from 'next/link'
import { motion, useAnimation } from 'framer-motion'

import { useTimetableRow } from '~/hooks/use_timetable_row'
import { getStationPath } from '~/lib/digitraffic'
import { getFormattedTime } from '~/utils/date'
import {
  getDestinationTimetableRow,
  getFutureTimetableRow,
  getTrainType,
} from '~/utils/train'
import { translate } from '~/utils/translate'
import {
  hasLiveEstimateTime as getHasLiveEstimateTime,
  hasLongTrainType as getHasLongTrainType,
  getTrainHref,
} from './helpers'
import { useRestoreScrollPosition } from './hooks'

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

const Anchor = (props: LinkProps & { children?: React.ReactNode }) => {
  return <Link {...props} />
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
    className={`flex overflow-hidden whitespace-pre-line text-gray-800 dark:text-gray-200`}
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
  // The destination if current row type === DEPARTURE or the departure station if type === ARRIVAL.
  const targetRow =
    type === 'DEPARTURE'
      ? getDestinationTimetableRow(train, stationShortCode)
      : train.timeTableRows[0]

  const timetableRef = React.useRef<HTMLTableRowElement>(null)
  const { scheduledTime, liveEstimateTime } = {
    scheduledTime: getFormattedTime(currentRow.scheduledTime),
    liveEstimateTime: currentRow.liveEstimateTime
      ? getFormattedTime(currentRow.liveEstimateTime)
      : undefined,
  }

  const timetableRowId = `${currentRow.scheduledTime}-${train.trainNumber}`

  const [isLastStation, setIsLastStation] = React.useState(false)

  useRestoreScrollPosition(lastStationId, timetableRowId, setIsLastStation)

  const hasLiveEstimateTime = getHasLiveEstimateTime(currentRow)
  const hasLongTrainType = getHasLongTrainType(train)

  const setTimetableRowId = useTimetableRow(state => state.setTimetableRowId)

  const controls = useAnimation()

  React.useEffect(() => {
    if (!timetableRef.current || !isLastStation) {
      return
    }

    const style = getComputedStyle(timetableRef.current)
    const from = style.getPropertyValue('--tr-animation-from')
    const to = style.getPropertyValue('--tr-animation-to')

    const backgroundAnimation: ControlsAnimationDefinition = {
      background: [from, to],
      transition: { duration: 0.5 },
      transitionEnd: { background: 'transparent' },
    }

    const fadeIn = {
      opacity: [0, 1],
    }

    controls.start(fadeIn).then(() => {
      if (isLastStation) controls.start(backgroundAnimation)
    })
  }, [controls, isLastStation, timetableRef])

  const targetName = stations.find(
    station => station.stationShortCode === targetRow?.stationShortCode,
  )

  return (
    <motion.tr
      ref={timetableRef}
      className="timetable-row-separator grid grid-cols-timetable-row gap-[0.5vw] py-[10px] relative text-[0.88rem] lg:text-[1rem]
      first:pt-[5px] [border-bottom:1px_solid_theme(colors.gray.200)] last:border-none dark:border-gray-800 [--tr-animation-from:theme(colors.primary.200)] [--tr-animation-to:theme(colors.gray.100)]
      dark:[--tr-animation-from:theme(colors.primary.800)] dark:[--tr-animation-to:theme(colors.gray.900)]"
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
      <Td>
        <Anchor
          href={getStationPath(targetName?.stationName[locale] || '')}
          onClick={() => setTimetableRowId(timetableRowId)}
        >
          {targetName?.stationName[locale]}
        </Anchor>
      </Td>

      <Td>
        {train.cancelled ? (
          <span>{`(${scheduledTime}) ${cancelledText}`}</span>
        ) : (
          <div className="[font-feature-settings:tnum] flex gap-[5px] ">
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
          aria-label={getTrainLabel(train, locale)}
          className="w-full text-center"
          href={getTrainHref(locale, train.departureDate, train.trainNumber)}
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

  if (!currentRow) {
    return null
  }

  return <TimetableRowComponent {...props} currentRow={currentRow} />
}

export default TimetableRow

type GetTrainLabelTrain = {
  commuterLineID?: string
  trainType: string
  trainNumber: number
}

const getTrainLabel = (train: GetTrainLabelTrain, locale: Locale): string => {
  if (train.commuterLineID) {
    return `${train.commuterLineID}-${translate(locale)('train')}`
  }

  const type = getTrainType(train.trainType as Code, locale)

  return `${type} ${train.trainNumber}`
}
