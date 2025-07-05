import type { Locale } from '~/types/common'

import { cx } from 'cva'
import { differenceInMinutes, isToday } from 'date-fns'

import { getFormattedTime } from '@junat/core/utils/date'
import { useRealizations } from '@junat/react-hooks/digitraffic/use_realizations'

import { useLocale, useTranslations } from '~/i18n'
import * as helpers from './helpers'

export interface SingleTimetableRowProps {
  showTrack?: boolean
  trainNumber: number
  timetableRow: {
    scheduledTime: string
    type: 'ARRIVAL' | 'DEPARTURE'
    cancelled?: boolean
    liveEstimateTime?: string
    stationShortCode: string
    commercialTrack?: string
  }
  stations: Array<{
    stationShortCode: string
    stationName: Record<Locale, string>
  }>
}

/**
 * Use this instead of TimetableRow when called from a single train context.
 */
export function SingleTimetableRow({
  timetableRow,
  trainNumber,
  stations,
}: Readonly<SingleTimetableRowProps>) {
  const locale = useLocale()
  const t = useTranslations()

  const realizations = useRealizations({ trainNumber })

  const realization = realizations.data?.filter(r => {
    return (
      r.station === timetableRow.stationShortCode &&
      isToday(r.realizationTime) &&
      differenceInMinutes(r.realizationTime, timetableRow.scheduledTime) > -5
    )
  })

  const departure = realization?.find(r => r.rowType === 'DEPARTURE')
  const arrival = realization?.find(r => r.rowType === 'ARRIVAL')

  const hasLiveEstimate = helpers.hasLiveEstimate(timetableRow)
  const localizedStationName = helpers.getLocalizedStationName(
    locale,
    stations,
    timetableRow,
  )

  const getCircleProps = () => {
    const props: Record<string, boolean> = { ['data-departed']: false }

    if (arrival) {
      props['data-arrived'] = true
    }

    if (departure) {
      props['data-departed'] = true
    }

    return props
  }

  const LiveEstimate = () => {
    if (!hasLiveEstimate || timetableRow.cancelled) {
      return null
    }

    return timetableRow.liveEstimateTime ? (
      <time
        dateTime={timetableRow.liveEstimateTime}
        className="ml-[1rem] text-primary-700 dark:text-primary-500"
      >
        {getFormattedTime(timetableRow.liveEstimateTime)}
      </time>
    ) : null
  }

  const Cancelled = () => {
    if (!timetableRow.cancelled) {
      return null
    }

    return (
      <span className="ml-[1rem] text-primary-700 dark:text-primary-500">
        {t('cancelled')}
      </span>
    )
  }

  return (
    <div
      className={cx(
        'relative mt-3 grid grid-cols-[24px_1fr_1fr] items-center gap-2 first:mt-0',
      )}
    >
      <svg
        aria-hidden
        role="presentation"
        height={24}
        width={24}
        viewBox="0 0 100 100"
        style={{ display: 'flex' }}
      >
        <circle
          {...getCircleProps()}
          className={cx(
            'fill-gray-500 data-[departed=true]:fill-primary-600 dark:fill-gray-600',
            'data-[departed=true]:dark:fill-primary-400',
            'data-[arrived=true]:data-[departed=false]:animate-pulse',
          )}
          cx="50"
          cy="50"
          r="12.5"
        />
      </svg>

      <div className="flex flex-col leading-6">
        <span>{localizedStationName}</span>

        <span className="text-sm text-gray-600 dark:text-gray-400">
          {t('track')} {timetableRow.commercialTrack}
        </span>
      </div>

      <div className="flex tabular-nums leading-6">
        <time
          data-late={
            departure?.realizationTime &&
            differenceInMinutes(
              departure?.messageTime,
              timetableRow.scheduledTime,
            ) > 1
          }
          dateTime={timetableRow.scheduledTime}
          className="group flex w-fit gap-1"
        >
          <span className="sr-only">{t('departureTime')} </span>
          <span className="group-data-[late=true]:line-through">
            {getFormattedTime(timetableRow.scheduledTime)}
          </span>

          <span className="group-data-[late=true]:visible group-data-[late=false]:hidden">
            {departure?.messageTime && getFormattedTime(departure?.messageTime)}
          </span>
        </time>
        <LiveEstimate />
        <Cancelled />
      </div>
    </div>
  )
}

export default SingleTimetableRow
