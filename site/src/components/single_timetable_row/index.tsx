import type { Locale } from '~/types/common'

import { cx } from 'cva'

import { getFormattedTime } from '@junat/core/utils/date'

import { useLocale, useTranslations } from '~/i18n'
import * as helpers from './helpers'

export interface SingleTimetableRowProps {
  hasDeparted: boolean
  lastHasDeparted: boolean
  nthItem: number
  totalItems: number
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
  lastHasDeparted,
  hasDeparted,
  nthItem,
  totalItems,
  timetableRow,
  stations,
}: SingleTimetableRowProps) {
  const locale = useLocale()
  const t = useTranslations()

  const hasLiveEstimate = helpers.hasLiveEstimate(timetableRow)
  const localizedStationName = helpers.getLocalizedStationName(
    locale,
    stations,
    timetableRow,
  )
  const lastRow = totalItems - 1 === nthItem
  const firstRow = nthItem === 0

  const LiveEstimate = () => {
    if (!hasLiveEstimate || timetableRow.cancelled) {
      return null
    }

    return timetableRow.liveEstimateTime ? (
      <time
        dateTime={timetableRow.liveEstimateTime}
        className="text-primary-700 dark:text-primary-500"
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
      <span className="text-primary-700 dark:text-primary-500">
        {t('cancelled')}
      </span>
    )
  }

  return (
    <tr
      {...(hasDeparted ? { ['data-departed']: true } : {})}
      className={cx(
        'relative grid grid-cols-[10%_.8fr_2fr_10%] items-center first:mt-0',
        'min-h-12 after:absolute after:inset-x-0 after:bottom-0 after:border-b',
        'group h-16 items-stretch pb-2 pt-0.5 after:border-gray-200 last:after:hidden',
        'dark:after:border-gray-800',
      )}
    >
      <style jsx>
        {`
          tr[data-departed='true']
            ~ tr:not([data-departed='true']):first-of-type {
            background-color: 'red';
          }
        `}
      </style>
      <td className="relative -mb-2 -mt-0.5">
        {lastHasDeparted ? (
          <svg
            preserveAspectRatio="xMinYMin slice"
            className={cx(
              'absolute inset-0 z-10 h-full w-full fill-gray-500 dark:fill-gray-600',
            )}
            viewBox="0 0 100 100"
          >
            <rect
              x={10}
              height={lastRow ? 50 : 200}
              width={8}
              y={firstRow ? 15 : 0}
            />
          </svg>
        ) : null}

        <svg
          preserveAspectRatio="xMinYMin slice"
          className={cx(
            'absolute inset-0 z-10 h-full w-full fill-gray-500 dark:fill-gray-600',
            'last:data-[departed=true]:h-min group-data-[departed=true]:fill-primary-600',
          )}
          viewBox="0 0 100 100"
        >
          <rect
            x={10}
            height={lastHasDeparted ? 30 : lastRow ? 50 : 200}
            width={8}
            y={firstRow ? 15 : 0}
          />
        </svg>

        <svg
          preserveAspectRatio="xMinYMin slice"
          className="absolute inset-0 z-20 h-full w-full"
          viewBox="0 0 100 100"
        >
          <circle
            className={cx(
              'fill-gray-500 group-data-[departed=true]:fill-primary-600 dark:fill-gray-600',
              'data-[departed=true]:dark:fill-primary-400',
            )}
            cx="14"
            cy={lastRow ? 50 : 25}
            r="13"
          />
        </svg>
      </td>

      <td className="flex flex-col [font-variant-numeric:tabular-nums]">
        <time dateTime={timetableRow.scheduledTime}>
          {getFormattedTime(timetableRow.scheduledTime)}
        </time>
        <LiveEstimate />
        <Cancelled />
      </td>

      <td className="flex flex-col leading-6">{localizedStationName}</td>

      <td aria-label="TODO: descriptive label" className="text-center">
        {timetableRow.commercialTrack}
      </td>
    </tr>
  )
}

export default SingleTimetableRow
