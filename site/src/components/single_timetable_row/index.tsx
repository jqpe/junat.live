import type { Locale } from '~/types/common'

import { cx } from 'cva'

import { getFormattedTime } from '@junat/core/utils/date'

import { useLocale, useTranslations } from '~/i18n'
import * as helpers from './helpers'
import { Timeline } from './timeline'

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
        'after:ml-2 dark:after:border-gray-800',
      )}
    >
      <Timeline
        firstRow={firstRow}
        lastHasDeparted={lastHasDeparted}
        lastRow={lastRow}
      />

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
