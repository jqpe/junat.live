import type { Locale } from '@typings/common'
import translate from './translation'

export type Code =
  | 'AE'
  | 'HDM'
  | 'HL'
  | 'HLV'
  | 'HSM'
  | 'HV'
  | 'IC'
  | 'LIV'
  | 'MUS'
  | 'MUV'
  | 'MV'
  | 'P'
  | 'PAI'
  | 'PVV'
  | 'PYO'
  | 'S'
  | 'SAA'
  | 'T'
  | 'TYO'
  | 'VET'
  | 'VEV'
  | 'VLI'
  | 'V'

export const getTrainType = (code: Code, locale: Locale): string => {
  const t = translate(locale)

  switch (code) {
    case 'AE':
      return 'Allegro'

    case 'HL' || 'HLV':
      return t('trainTypes', 'commuterTrain')

    case 'HDM' || 'HSM':
      return t('trainTypes', 'regionalTrain')

    case 'HV' || 'MV':
      return t('trainTypes', 'multipleUnit')

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

    case 'V' || 'VET' || 'VEV':
      return t('trainTypes', 'locomotive')

    case 'VLI':
      return t('trainTypes', 'additionalLocomotive')

    default:
      return t('train')
  }
}
