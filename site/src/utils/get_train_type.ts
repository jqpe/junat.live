import type { Locale } from '@typings/common'
import translate from './translate'

export type Codes = [
  'AE',
  'HDM',
  'HL',
  'HLV',
  'HSM',
  'HV',
  'IC',
  'LIV',
  'MUS',
  'MUV',
  'MV',
  'P',
  'PAI',
  'PVV',
  'PYO',
  'S',
  'SAA',
  'T',
  'TYO',
  'VET',
  'VEV',
  'VLI',
  'V'
]

export type Code = Codes[number]

export const getTrainType = (code: Code, locale: Locale): string => {
  const t = translate(locale)

  if (['HL', 'HLV'].includes(code)) {
    return t('trainTypes', 'commuterTrain')
  }

  if (['HDM', 'HSM'].includes(code)) {
    return t('trainTypes', 'regionalTrain')
  }

  if (['HV', 'MV'].includes(code)) {
    return t('trainTypes', 'multipleUnit')
  }

  if (['V', 'VET', 'VEV'].includes(code)) {
    return t('trainTypes', 'locomotive')
  }

  switch (code) {
    case 'AE':
      return 'Allegro'

    case 'IC':
      return 'InterCity'

    case 'LIV':
      return t('trainTypes', 'trackInspectionTrolley')

    case 'MUS':
      return t('trainTypes', 'museumTrain')

    case 'P':
      return t('trainTypes', 'expressTrain')

    case 'PAI':
      return t('trainTypes', 'onCallTrain')

    case 'PVV':
      return 'Tolstoi'

    case 'PYO':
      return t('trainTypes', 'nightExpressTrain')

    case 'S':
      return 'Pendolino'

    case 'SAA':
      return t('trainTypes', 'convoyTrain')

    case 'T':
      return t('trainTypes', 'cargoTrain')

    case 'TYO':
      return t('trainTypes', 'workTrain')

    case 'VLI':
      return t('trainTypes', 'additionalLocomotive')

    default:
      return t('train')
  }
}
