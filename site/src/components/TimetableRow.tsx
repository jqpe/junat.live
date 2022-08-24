/* eslint-disable sonarjs/no-duplicate-string */
import type { Locale } from '@typings/common'

import React from 'react'

import Link from 'next/link'

import { motion } from 'framer-motion'

import { getStationPath } from '@junat/digitraffic/utils'

import { getFormattedTime } from '@utils/get_formatted_time'
import { getCalendarDate } from '@utils/date'

import { useColorScheme } from '@hooks/use_color_scheme'
import { styled, config } from '@config/theme'
import { useTimetableRow } from '@hooks/use_timetable_row'

const StyledTimetableRow = styled(motion.tr, {
  display: 'grid',
  gridTemplateColumns: 'min(35%, 30vw) 1fr 0.4fr 0.4fr',
  gap: '0.5vw',
  paddingBlock: '$2',
  position: 'relative',
  fontSize: '$mobile-paragraph',
  '@large': {
    fontSize: '$pc-paragraph'
  },
  '@media (max-width: 20rem)': {
    fontSize: 'calc(.5rem + 1vw)'
  },

  '& a': {
    color: '$slateGray800',
    cursor: 'pointer',
    '@dark': {
      color: '$slateGray200'
    },
    '&:hover, &:focus': {
      color: '$primary600'
    }
  },

  '&:nth-child(1)': {
    paddingBlockStart: '$1'
  },

  '&:not(:nth-child(1))::after': {
    position: 'absolute',
    content: ' ',
    borderBottom: '1px solid $slateGray200',
    '@dark': {
      borderColor: '$slateGray800'
    },
    height: '1px',
    width: '100%'
  },
  '&[data-cancelled="true"]': {
    opacity: 0.5,
    fontSize: '0.8rem'
  }
})

const StyledTimetableRowData = styled('td', {
  display: 'flex',
  overflow: 'hidden',
  whiteSpace: 'pre-line',
  color: '$slateGray800',
  '@dark': {
    color: '$slateGray200'
  },

  '&:nth-child(2)': {
    fontFeatureSettings: 'tnum',
    display: 'flex',
    gap: '5px'
  },

  '&:nth-child(2) > :nth-child(2)': {
    color: '$primary700',
    '@dark': {
      color: '$primary400'
    }
  }
})

const StyledTime = styled('time', {
  fontVariantNumeric: 'tabular-nums'
})

const CenteredTd = styled(StyledTimetableRowData, {
  display: 'flex',
  justifyContent: 'center'
})

export interface TimetableRowTranslations {
  train: string
}

export interface TimetableRowTrain {
  destination: Record<'fi' | 'en' | 'sv', string>
  departureDate: string
  scheduledTime: string
  trainNumber: number
  cancelled: boolean
  trainType: string
  version: number
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
