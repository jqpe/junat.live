import type { GetTranslatedValue } from '@junat/core/i18n'
import type { Code } from '@junat/core/utils/train'
import type { TimetableRowTrain } from '~/components/timetable_row'
import type { LocalizedStation } from '~/lib/digitraffic'
import type { Locale } from '~/types/common'

import { To } from 'frominto'

import { getTrainType } from '@junat/core/utils/train'

type GetTrainLabelTrain = {
  commuterLineID?: string
  trainType: string
  trainNumber: number
}

/** If the train has a commuter line id, e.g. R-train, otherwise train number e.g. Train 3020 */
export const getTrainDescription = (
  train: TimetableRowTrain,
  t: GetTranslatedValue,
): string => {
  return 'commuterLineID' in train
    ? `${train.commuterLineID}-${t('train')}`
    : `${t('train')} ${train.trainNumber}`
}

/** If locale is Finnish return illative, e.g. Helsinki -> Helsinkiin */
export const getStationNameIllative = (
  locale: Locale,
  targetName: LocalizedStation | undefined,
): string | undefined => {
  return locale === 'fi' && targetName
    ? To(targetName.stationName.fi)
    : targetName?.stationName[locale]
}

export const getTrainLabel = (
  train: GetTrainLabelTrain,
  t: GetTranslatedValue,
): string => {
  if (train.commuterLineID) {
    return `${train.commuterLineID}-${t('train')}`
  }

  const type = getTrainType(train.trainType as Code, {
    train: t('train'),
    trainTypes: t('trainTypes'),
  })

  return `${type} ${train.trainNumber}`
}
