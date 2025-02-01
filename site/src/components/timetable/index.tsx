import type { TimetableRowTrain } from '~/components/timetable_row'
import type { Locale } from '~/types/common'

import { cx } from 'cva'

import { TimetableRow } from '~/components/timetable_row'
import { useTranslations } from '~/i18n'

export interface TimetableProps {
  type: 'DEPARTURE' | 'ARRIVAL'
  trains: TimetableRowTrain[]
  stationShortCode: string
  locale?: Locale
}
export function Timetable({ trains, ...props }: TimetableProps) {
  const t = useTranslations()

  if (trains.length === 0) {
    return null
  }

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
          <th className="flex justify-center">{t('track')}</th>
          <th className="flex justify-center">{t('train')}</th>
        </tr>
      </thead>
      <tbody className="flex flex-col">
        {trains.map(train => (
          <TimetableRow
            stationShortCode={props.stationShortCode}
            train={train}
            key={`${train.departureDate}-${train.trainNumber}-${train.version}`}
          />
        ))}
      </tbody>
    </table>
  )
}

export default Timetable
