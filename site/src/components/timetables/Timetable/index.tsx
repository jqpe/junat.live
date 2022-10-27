import type {
  TimetableRowTrain,
  TimetableRowProps,
  TimetableRowTranslations
} from '@components/timetables/TimetableRow'
import type { Locale } from '@typings/common'

import {
  CenteredTd,
  StyledTimetable,
  StyledTimetableBody,
  StyledTimetableHead,
  StyledTimetableRow
} from './styles'

import { TimetableRow } from '@components/timetables/TimetableRow'
import { getLocale } from '@utils/get_locale'
import { useRouter } from 'next/router'

import translate from '@utils/translate'

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
        {trains.map(train => {
          return (
            <TimetableRow
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
