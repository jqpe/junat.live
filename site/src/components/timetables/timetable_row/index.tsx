import type { Locale } from '@typings/common'

import React from 'react'

import { NextLink } from '@components/elements/link/next'

import { getStationPath } from '@junat/digitraffic'

import { getFormattedTime } from '@utils/date'

import { useColorScheme } from '@hooks/use_color_scheme'
import { config } from '@junat/design'
import { useTimetableRow } from '@hooks/use_timetable_row'

import {
  CenteredTd,
  StyledTime,
  StyledTimetableRow,
  StyledTimetableRowData
} from './styles'

import {
  getTrainHref,
  hasLongTrainType as getHasLongTrainType,
  hasLiveEstimateTime as getHasLiveEstimateTime
} from './helpers'
import { useRestoreScrollPosition } from './hooks'
import { useAnimation } from 'framer-motion'

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

export function TimetableRow({
  locale,
  lastStationId,
  train,
  cancelledText,

  animation
}: TimetableRowProps) {
  const { slateGray100, primary200, primary800, slateGray900 } =
    config.theme.colors

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
      background: [
        dark ? primary800 : primary200,
        dark ? slateGray900 : slateGray100
      ]
    }

    const fadeIn = {
      opacity: [0, 1]
    }

    controls.start(fadeIn)

    if (isLastStation) {
      controls.start(backgroundAnimation, { duration: 0.5 })
    }
  }, [
    controls,
    dark,
    isLastStation,
    primary200,
    primary800,
    slateGray100,
    slateGray900
  ])

  return (
    <StyledTimetableRow
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
      <StyledTimetableRowData>
        <NextLink
          href={getStationPath(train.destination[locale])}
          onClick={() => setTimetableRowId(timetableRowId)}
        >
          {train.destination[locale]}
        </NextLink>
      </StyledTimetableRowData>

      <StyledTimetableRowData>
        {train.cancelled ? (
          <span>{`(${scheduledTime}) ${cancelledText}`}</span>
        ) : (
          <>
            <StyledTime dateTime={train.scheduledTime}>
              {scheduledTime}
            </StyledTime>
            {hasLiveEstimateTime && (
              <StyledTime dateTime={train.liveEstimateTime}>
                {liveEstimateTime}
              </StyledTime>
            )}
          </>
        )}
      </StyledTimetableRowData>
      <CenteredTd>{train.track || '-'}</CenteredTd>
      <CenteredTd
        css={{
          fontSize: hasLongTrainType ? 'min(2.5vw, 80%)' : 'inherit'
        }}
      >
        <NextLink
          href={getTrainHref(locale, train.departureDate, train.trainNumber)}
          onClick={() => setTimetableRowId(timetableRowId)}
        >
          {train.commuterLineID || `${train.trainType}${train.trainNumber}`}
        </NextLink>
      </CenteredTd>
    </StyledTimetableRow>
  )
}

export default TimetableRow
