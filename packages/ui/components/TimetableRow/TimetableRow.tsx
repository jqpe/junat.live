// import { getStationPath } from '~digitraffic'
import Link from 'next/link'
import React from 'react'

import { getHhMmTime } from '../../utils/get_hh_mm_time'

import { motion } from 'framer-motion'
import { styled } from '@junat/stitches'
import useColorScheme from '../../hooks/use_color_scheme.hook'

const StyledTimetableRow = styled(motion.tr, {
  display: 'grid',
  gridTemplateColumns: 'min(35%, 30vw) 1fr 0.4fr 0.4fr',
  gap: '0.5vw',
  paddingBlock: '$2',
  position: 'relative',
  '& a': {
    color: '$slateGray800',
    cursor: 'pointer'
  },
  '& a:hover': {
    color: '$primary600'
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
  }
})

const StyledTimetableRowData = styled('td', {
  display: 'flex',
  overflow: 'hidden',
  whiteSpace: 'pre-line',
  fontSize: '$mobile-paragraph',
  '@large': {
    fontSize: '$pc-paragraph'
  },
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
  trainType: string
  version: number
  liveEstimateTime?: string
  track?: string
  commuterLineID?: string
}

export interface TimetableRowProps {
  train: TimetableRowTrain
  locale: 'fi' | 'en' | 'sv'
  translation: TimetableRowTranslations
  lastStationId: string
  setLastStationId: (id: string) => void
}

export function TimetableRow({
  locale,
  translation,
  lastStationId,
  setLastStationId,
  train
}: TimetableRowProps) {
  const { scheduledTime, liveEstimateTime } = {
    scheduledTime: getHhMmTime(train.scheduledTime),
    liveEstimateTime: train.liveEstimateTime
      ? getHhMmTime(train.liveEstimateTime)
      : undefined
  }

  const stationId = `${train.scheduledTime}-${train.trainNumber}`

  const [isLastStation, setIsLastStation] = React.useState(false)

  useRestoreScrollPosition(lastStationId, stationId, setIsLastStation)

  const { colorScheme } = useColorScheme()
  const dark = colorScheme === 'dark'

  const animate = {
    background: [
      dark ? 'hsla(275, 100%, 22.2%, 1)' : 'hsla(274, 100%, 95.9%, 1)',
      dark ? 'hsla(276, 100%, 2.9%, 0)' : 'hsla(276, 100%, 99%, 0)'
    ]
  }

  const hasLongTrainType =
    !train.commuterLineID && `${train.trainType}${train.trainNumber}`.length > 5

  return (
    <StyledTimetableRow
      data-id={stationId}
      animate={isLastStation && animate}
      transition={{ stiffness: 1000, mass: 0.05, damping: 1 }}
    >
      <StyledTimetableRowData>
        <Link href={`/${train.destination[locale]}`}>
          <a onClick={() => setLastStationId(stationId)}>
            {train.destination[locale]}
          </a>
        </Link>
      </StyledTimetableRowData>

      <StyledTimetableRowData>
        <time dateTime={train.scheduledTime}>{scheduledTime}</time>
        {train.liveEstimateTime &&
          train.liveEstimateTime > train.scheduledTime && (
            <time dateTime={train.liveEstimateTime}>{liveEstimateTime}</time>
          )}
      </StyledTimetableRowData>
      <CenteredTd>{train.track}</CenteredTd>
      <CenteredTd
        css={{
          fontSize: hasLongTrainType ? 'min(2.5vw, 80%)' : 'inherit'
        }}
      >
        <Link
          href={`/${translation.train.toLowerCase()}/${train.departureDate}/${
            train.trainNumber
          }`}
        >
          <a onClick={() => setLastStationId(stationId)}>
            {train.commuterLineID || `${train.trainType}${train.trainNumber}`}
          </a>
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
