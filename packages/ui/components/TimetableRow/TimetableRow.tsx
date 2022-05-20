import Link from 'next/link'
import React from 'react'

import { getHhMmTime } from '../../utils/get_hh_mm_time'

import { motion } from 'framer-motion'
import { styled, config } from '@junat/stitches'
import useColorScheme from '../../hooks/use_color_scheme.hook'

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
    }
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
  /**
   * Function to transform station path into a URI-safe string.
   * Takes the stations name as a parameter.
   */
  getStationPath: (stationName: string) => string
  lastStationId: string
  setLastStationId: (id: string) => void
}

export function TimetableRow({
  locale,
  translation,
  lastStationId,
  setLastStationId,
  getStationPath,
  train
}: TimetableRowProps) {
  const { primary100, primary200, primary800, primary900 } = config.theme.colors

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
    background: [dark ? primary800 : primary200, dark ? primary900 : primary100]
  }

  const hasLiveEstimateTime = (() => {
    return !!(
      train.liveEstimateTime &&
      getHhMmTime(train.liveEstimateTime) !== getHhMmTime(train.scheduledTime)
    )
  })()

  const hasLongTrainType =
    !train.commuterLineID && `${train.trainType}${train.trainNumber}`.length > 5

  return (
    <StyledTimetableRow
      data-id={stationId}
      animate={isLastStation && animate}
      transition={{ stiffness: 1000, mass: 0.05, damping: 1 }}
    >
      <StyledTimetableRowData>
        <Link href={`/${getStationPath(train.destination[locale])}`}>
          <a onClick={() => setLastStationId(stationId)}>
            {train.destination[locale]}
          </a>
        </Link>
      </StyledTimetableRowData>

      <StyledTimetableRowData>
        <StyledTime dateTime={train.scheduledTime}>{scheduledTime}</StyledTime>
        {hasLiveEstimateTime && (
          <StyledTime dateTime={train.liveEstimateTime}>
            {liveEstimateTime}
          </StyledTime>
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
