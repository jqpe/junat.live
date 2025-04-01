import type React from 'react'
import type { LocalizedStation } from '@junat/core/types'

import { useRouter } from 'next/router'
import { formatDate } from 'date-fns'

import { getTrainHref, interpolateString as i } from '@junat/core'
import { useTimetableRow, useTimetableType } from '@junat/react-hooks'

import {
  getStationNameIllative,
  getTrainDescription,
} from '~/components/timetable_row/helpers'
import { useLocale, useTranslations } from '~/i18n'

interface UseTimetableRowA11yProps {
  train: Parameters<typeof getTrainDescription>[0] & { departureDate: string }
  track?: string
  targetStation?: LocalizedStation
  scheduledTime: string
  liveEstimateTime?: string
}

export const useTimetableRowA11y = (props: UseTimetableRowA11yProps) => {
  const { train, track, targetStation, scheduledTime, liveEstimateTime } = props

  const locale = useLocale()
  const t = useTranslations()
  const type = useTimetableType(store => store.type)
  const router = useRouter()
  const setTimetableRowId = useTimetableRow(state => state.setTimetableRowId)

  const timetableRowId = `${scheduledTime}-${train.trainNumber}`

  const onRequestNavigate = () => {
    setTimetableRowId(timetableRowId)
    router.push(getTrainHref(t, train.departureDate, train.trainNumber))
  }

  const getRowAriaLabel = (): string => {
    const trainDescription = i(t('{ train } from { track } to { station }'), {
      train: getTrainDescription(train, t),
      track,
      station: getStationNameIllative(locale, targetStation),
    })
    const rowType = type === 'ARRIVAL' ? 'arrival' : 'departure'
    const timeDescription = i(
      t(`scheduled ${rowType} { time } estimated { estimate }`),
      {
        time: formatDate(scheduledTime, 'H:m'),
        estimate:
          !liveEstimateTime || liveEstimateTime === scheduledTime
            ? undefined
            : formatDate(liveEstimateTime, 'H:m'),
      },
    )

    return `${trainDescription}. ${timeDescription}`
  }

  return {
    ['aria-label']: getRowAriaLabel(),
    role: 'button',
    tabIndex: 0,
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key === '\u0020' || event.key === 'Enter') {
        event.preventDefault()
        event.stopPropagation()

        onRequestNavigate()
      }
    },
    onClick: onRequestNavigate,
  }
}
