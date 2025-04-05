import type { LocalizedStation } from '@junat/core/types'

import { useRouter } from 'next/router'
import { formatDate } from 'date-fns'

import { interpolateString as i } from '@junat/core'
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

  // Set the id after navigation is complete to avoid unnecessarily mutating the global store
  // before necessary, causing extraneous rerenders.
  const onRequestNavigate = async () => {
    await new Promise<void>(resolve => {
      const handleRouteChange = () => {
        setTimetableRowId(timetableRowId)
        router.events.off('routeChangeComplete', handleRouteChange)
        resolve()
      }

      router.events.on('routeChangeComplete', handleRouteChange)
    })
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
    onClick: onRequestNavigate,
  }
}
