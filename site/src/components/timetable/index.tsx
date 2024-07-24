import type {
  TimetableRowProps,
  TimetableRowTrain,
  TimetableRowTranslations,
} from '~/components/timetable_row'
import type { Locale } from '~/types/common'

import React from 'react'
import { cx } from 'cva'

import { TimetableRow } from '~/components/timetable_row'
import { useLocale, useTranslations } from '~/i18n'
import { useStations } from '~/lib/digitraffic'

export interface TimetableTranslations extends TimetableRowTranslations {
  cancelledText: string
  destination: string
  departureTime: string
  track: string
  train: string
}

export interface TimetableProps {
  type: 'DEPARTURE' | 'ARRIVAL'
  trains: TimetableRowTrain[]
  stationShortCode: string
  locale?: Locale
  lastStationId?: TimetableRowProps['lastStationId']
}
export function Timetable({ trains, ...props }: TimetableProps) {
  const locale = useLocale()
  const { data: stations = [] } = useStations()

  const t = useTranslations()

  const previous = React.useRef<number[]>([])

  if (!previous.current.includes(trains.length)) {
    previous.current.push(trains.length)
  }

  if (trains.length === 0) {
    return null
  }

  const Centered: React.FC<React.PropsWithChildren> = props => (
    <th className="flex justify-center">{props.children}</th>
  )

  return (
    <table className="flex w-[100%] flex-col overflow-ellipsis whitespace-nowrap">
      <thead
        className={cx(
          'text-[0.74rem] leading-[175%] text-gray-700',
          'dark:text-gray-300 lg:text-[0.83rem]',
        )}
      >
        <tr className="grid grid-cols-[min(35%,30vw)_1fr_0.4fr_0.4fr] gap-[0.5vw]">
          <th>
            {t(props.type === 'DEPARTURE' ? 'destination' : 'departureStation')}
          </th>
          <th>
            {t(props.type === 'DEPARTURE' ? 'departureTime' : 'arrivalTime')}
          </th>
          <Centered>{t('track')}</Centered>
          <Centered>{t('train')}</Centered>
        </tr>
      </thead>
      <tbody className="flex flex-col">
        {trains.map((train, i) => {
          const difference = i - (previous.current?.at(-2) || 0)

          // x > 1 approach milliseconds. x <= 1 approach seconds.
          const DELAY_DIVIDEND = 250 as const

          return (
            <TimetableRow
              type={props.type}
              animation={{
                delay: difference / DELAY_DIVIDEND,
              }}
              stations={stations}
              cancelledText={t('cancelled')}
              lastStationId={props.lastStationId ?? ''}
              stationShortCode={props.stationShortCode}
              locale={locale}
              train={train}
              key={`${train.departureDate}-${train.trainNumber}-${train.version}`}
            />
          )
        })}
      </tbody>
    </table>
  )
}

export default Timetable
