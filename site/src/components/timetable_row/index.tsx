import type { Locale } from '@typings/common'
import type { LinkProps } from 'next/link'
import type { AnimationControls } from 'framer-motion'

import React from 'react'

import Link from 'next/link'

import { getStationPath } from '~/lib/digitraffic'

import { getFormattedTime } from '@utils/date'

import { useTimetableRow } from '@hooks/use_timetable_row'

import { motion } from 'framer-motion'

import { useAnimation } from 'framer-motion'
import {
  hasLiveEstimateTime as getHasLiveEstimateTime,
  hasLongTrainType as getHasLongTrainType,
  getTrainHref
} from './helpers'
import { useRestoreScrollPosition } from './hooks'
import translate from '~/utils/translate'
import { Code, getTrainType } from '~/utils/train'

type ControlsAnimationDefinition = Parameters<AnimationControls['start']>['0']

export interface TimetableRowTranslations {
  train: string
}

export interface TimetableRowTrain {
  destination: Record<Locale, string>
  departureDate: string
  scheduledTime: string
  trainNumber: number
  trainType: string

  cancelled?: boolean
  version?: number
  liveEstimateTime?: string
  track?: string
  commuterLineID?: string
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

export function TimetableRow({
  locale,
  lastStationId,
  train,
  cancelledText,

  animation
}: TimetableRowProps) {
  const timetableRef = React.useRef<HTMLTableRowElement>(null)
  const { scheduledTime, liveEstimateTime } = {
    scheduledTime: getFormattedTime(train.scheduledTime),
    liveEstimateTime: train.liveEstimateTime
      ? getFormattedTime(train.liveEstimateTime)
      : undefined
  }

  const timetableRowId = `${train.scheduledTime}-${train.trainNumber}`

  const [isLastStation, setIsLastStation] = React.useState(false)

  useRestoreScrollPosition(lastStationId, timetableRowId, setIsLastStation)

  const hasLiveEstimateTime = getHasLiveEstimateTime(train)
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
      transitionEnd: { background: 'transparent' }
    }

    const fadeIn = {
      opacity: [0, 1]
    }

    controls.start(fadeIn).then(() => {
      if (isLastStation) controls.start(backgroundAnimation)
    })
  }, [controls, isLastStation, timetableRef])

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
        delay: animation?.delay
      }}
    >
      <Td>
        <Anchor
          href={getStationPath(train.destination[locale])}
          onClick={() => setTimetableRowId(timetableRowId)}
        >
          {train.destination[locale]}
        </Anchor>
      </Td>

      <Td>
        {train.cancelled ? (
          <span>{`(${scheduledTime}) ${cancelledText}`}</span>
        ) : (
          <div className="[font-feature-settings:tnum] flex gap-[5px] ">
            <Time dateTime={train.scheduledTime}>{scheduledTime}</Time>
            {hasLiveEstimateTime && (
              <Time
                dateTime={train.liveEstimateTime}
                className="text-primary-700 dark:text-primary-400"
              >
                {liveEstimateTime}
              </Time>
            )}
          </div>
        )}
      </Td>
      <Centered>{train.track || '-'}</Centered>
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
