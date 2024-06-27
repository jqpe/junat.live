import type { Locale } from '~/types/common'

import { useLocale, useTranslations } from '~/i18n'
import { getFormattedTime } from '~/utils/date'
import * as helpers from './helpers'

export interface SingleTimetableRowProps {
  showTrack?: boolean
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
  stations,
  showTrack,
}: SingleTimetableRowProps) {
  const locale = useLocale()
  const t = useTranslations()

  const hasDeparted = helpers.hasDeparted(timetableRow)
  const hasLiveEstimate = helpers.hasLiveEstimate(timetableRow)
  const localizedStationName = helpers.getLocalizedStationName(
    locale,
    stations,
    timetableRow,
  )

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
    <tr className="grid items-center grid-cols-[10%_1fr_1fr] mt-[15px] first:mt-0 relative">
      <td>
        <svg
          height={24}
          width={24}
          viewBox="0 0 100 100"
          style={{ display: 'flex' }}
        >
          <circle
            {...(hasDeparted ? { ['data-departed']: true } : {})}
            className="fill-gray-500 dark:fill-gray-600 data-[departed=true]:fill-primary-600 data-[departed=true]:dark:fill-primary-400"
            cx="50"
            cy="50"
            r="12.5"
          />
        </svg>
      </td>
      <td className="flex flex-col leading-6">
        <span>{localizedStationName}</span>
        {showTrack ? (
          <span className="text-sm dark:text-gray-400 text-gray-600">
            {t('track')} {timetableRow.commercialTrack}
          </span>
        ) : null}
      </td>
      <td className="[font-variant-numeric:tabular-nums]">
        <time dateTime={timetableRow.scheduledTime}>
          {getFormattedTime(timetableRow.scheduledTime)}
        </time>
        <LiveEstimate />
        <Cancelled />
      </td>
    </tr>
  )
}

export default SingleTimetableRow
