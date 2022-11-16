import type {
  TimetableRowTrain,
  TimetableRowProps,
  TimetableRowTranslations
} from '@components/timetables/timetable_row'
import type { Locale } from '@typings/common'

import {
  CenteredTd,
  StyledTimetable,
  StyledTimetableBody,
  StyledTimetableHead,
  StyledTimetableRow
} from './styles'

import { TimetableRow } from '@components/timetables/timetable_row'
import { getLocale } from '@utils/get_locale'
import { useRouter } from 'next/router'

import translate from '@utils/translate'
import React from 'react'

export interface TimetableTranslations extends TimetableRowTranslations {
  cancelledText: string
  destination: string
  departureTime: string
  track: string
  train: string
}

export interface TimetableProps {
  trains: TimetableRowTrain[]
  locale?: Locale
  lastStationId?: TimetableRowProps['lastStationId']
}
export function Timetable({ trains, ...props }: TimetableProps) {
  const router = useRouter()
  const locale = getLocale(props.locale ?? router.locale)

  const t = translate(locale)

  const previous = React.useRef<number[]>([])

  if (!previous.current.includes(trains.length)) {
    previous.current.push(trains.length)
  }

  if (trains.length === 0) {
    return null
  }

  return (
    <StyledTimetable>
      <StyledTimetableHead>
        <StyledTimetableRow>
          <td>{t('destination')}</td>
          <td>{t('departureTime')}</td>
          <CenteredTd>{t('track')}</CenteredTd>
          <CenteredTd>{t('train')}</CenteredTd>
        </StyledTimetableRow>
      </StyledTimetableHead>
      <StyledTimetableBody>
        {trains.map((train, i) => {
          const difference = i - (previous.current?.at(-2) || 0)

          // x > 1 approach milliseconds. x <= 1 approach seconds.
          const DELAY_DIVIDEND = 250 as const

          return (
            <TimetableRow
              animation={{
                delay: difference / DELAY_DIVIDEND
              }}
              cancelledText={t('cancelled')}
              lastStationId={props.lastStationId ?? ''}
              locale={locale}
              train={train}
              key={`${train.trainNumber}-${train.departureDate}.${train.scheduledTime}`}
            />
          )
        })}
      </StyledTimetableBody>
    </StyledTimetable>
  )
}

export default Timetable
