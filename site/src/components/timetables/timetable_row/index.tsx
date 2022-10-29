import type { Locale } from '@typings/common'

import React from 'react'

import Link from 'next/link'

import { getStationPath } from '@junat/digitraffic/utils'

import { getFormattedTime } from '@utils/get_formatted_time'
import { getCalendarDate } from '@utils/date'

import { useColorScheme } from '@hooks/use_color_scheme'
import { config } from '@junat/design'
import { useTimetableRow } from '@hooks/use_timetable_row'

import {
  CenteredTd,
  StyledTime,
  StyledTimetableRow,
  StyledTimetableRowData
} from './styles'

export interface TimetableRowTranslations {
  train: string
}

export interface TimetableRowTrain {
  destination: Record<'fi' | 'en' | 'sv', string>
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

const getTrainPath = (locale: Locale): string => {
  switch (locale) {
    case 'fi':
      return 'juna'
    case 'en':
      return 'train'
    case 'sv':
      return 'tog'
  }
}

const getTrainHref = (locale: Locale, date: string, trainNumber: number) => {
  const departureDate = new Date(Date.parse(date))
  const now = new Date()

  // The Digitraffic service returns trains 24 hours into the future and thus there's no risk of
  // mistakingly using 'latest' for a train a week from now.
  if (departureDate.getDay() === now.getDay()) {
    return `/${getTrainPath(locale)}/${trainNumber}`
  }

  return `/${getTrainPath(locale)}/${getCalendarDate(date)}/${trainNumber}`
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
}

export function TimetableRow({
  locale,
  lastStationId,
  train,
  cancelledText
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

  const animate = {
    background: [
      dark ? primary800 : primary200,
      dark ? slateGray900 : slateGray100
    ]
  }

  const hasLiveEstimateTime = (() => {
    return !!(
      train.liveEstimateTime &&
      getFormattedTime(train.liveEstimateTime) !==
        getFormattedTime(train.scheduledTime)
    )
  })()

  const hasLongTrainType =
    !train.commuterLineID && `${train.trainType}${train.trainNumber}`.length > 5

  const setTimetableRowId = useTimetableRow(state => state.setTimetableRowId)

  return (
    <StyledTimetableRow
      data-cancelled={train.cancelled}
      title={train.cancelled ? cancelledText : ''}
      data-id={timetableRowId}
      animate={isLastStation && animate}
      transition={{ stiffness: 1000, mass: 0.05, damping: 1 }}
    >
      <StyledTimetableRowData>
        <Link
          href={getStationPath(train.destination[locale])}
          onClick={() => setTimetableRowId(timetableRowId)}
        >
          {train.destination[locale]}
        </Link>
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
        <Link
          href={getTrainHref(locale, train.departureDate, train.trainNumber)}
          onClick={() => setTimetableRowId(timetableRowId)}
        >
          {train.commuterLineID || `${train.trainType}${train.trainNumber}`}
        </Link>
      </CenteredTd>
    </StyledTimetableRow>
  )
}

/**
 * Restores the scroll position from cache and if the cache key and the component's key match scrolls to the component.
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

export default TimetableRow