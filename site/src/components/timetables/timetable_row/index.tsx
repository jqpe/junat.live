import type { Locale } from '@typings/common'
import type { LinkProps } from 'next/link'

import React from 'react'

import Link from 'next/link'

import { getStationPath } from '~/lib/digitraffic'

import { getFormattedTime } from '@utils/date'

import { useColorScheme } from '@hooks/use_color_scheme'
import { useTimetableRow } from '@hooks/use_timetable_row'
import { theme } from '~/lib/tailwind.css'

import { motion } from 'framer-motion'

import { useAnimation } from 'framer-motion'
import {
  hasLiveEstimateTime as getHasLiveEstimateTime,
  hasLongTrainType as getHasLongTrainType,
  getTrainHref
} from './helpers'
import { useRestoreScrollPosition } from './hooks'

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
  return (
    <Link
      {...props}
      className="text-gray-800 cursor-pointer dark:text-gray-200 hover:text-primary-600 focus:text-primary-600"
    />
  )
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
  const { '100': gray100, '900': gray900 } = theme.colors.gray
  const { '200': primary200, '800': primary800 } = theme.colors.primary

  const { scheduledTime, liveEstimateTime } = {
    scheduledTime: getFormattedTime(train.scheduledTime),
    liveEstimateTime: train.liveEstimateTime
      ? getFormattedTime(train.liveEstimateTime)
      : undefined
  }

  const timetableRowId = `${train.scheduledTime}-${train.trainNumber}`

  const [isLastStation, setIsLastStation] = React.useState(false)

  useRestoreScrollPosition(lastStationId, timetableRowId, setIsLastStation)

  const { colorScheme } = useColorScheme()
  const dark = colorScheme === 'dark'

  const hasLiveEstimateTime = getHasLiveEstimateTime(train)
  const hasLongTrainType = getHasLongTrainType(train)

  const setTimetableRowId = useTimetableRow(state => state.setTimetableRowId)

  const controls = useAnimation()

  React.useEffect(() => {
    const backgroundAnimation = {
      background: [dark ? primary800 : primary200, dark ? gray900 : gray100]
    }

    const fadeIn = {
      opacity: [0, 1]
    }

    controls.start(fadeIn)

    if (isLastStation) {
      controls.start(backgroundAnimation, { duration: 0.5 })
    }
  }, [controls, dark, isLastStation, primary200, primary800, gray100, gray900])

  return (
    <motion.tr
      className="timetable-row-separator grid grid-cols-timetable-row gap-[0.5vw] py-[10px] relative text-[0.88rem] lg:text-[1rem]
      first:pt-[5px] [border-bottom:1px_solid_theme(colors.gray.200)] last:border-none dark:border-gray-800"
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
