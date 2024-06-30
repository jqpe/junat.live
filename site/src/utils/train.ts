import 'core-js/actual/array/at'
import 'core-js/actual/array/to-sorted'

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
  'V',
]

export type Code = Codes[number]

type TrainType = (typeof import('@junat/i18n/en.json'))['trainTypes']

type TranslationsRecord = {
  train: string
  trainTypes: TrainType
}

export const getTrainType = (code: Code, i18n: TranslationsRecord): string => {
  const t = <T extends keyof TrainType>(key: T) => i18n.trainTypes[key]

  const codes: Record<Code, string> = {
    AE: 'Allegro',
    IC: 'InterCity',
    PVV: 'Tolstoi',
    S: 'Pendolino',
    MUV: i18n.train,
    HL: t('commuterTrain'),
    HLV: t('commuterTrain'),
    HDM: t('regionalTrain'),
    HSM: t('regionalTrain'),
    HV: t('multipleUnit'),
    MV: t('multipleUnit'),
    V: t('locomotive'),
    VET: t('locomotive'),
    VEV: t('locomotive'),
    LIV: t('trackInspectionTrolley'),
    MUS: t('museumTrain'),
    P: t('expressTrain'),
    PAI: t('onCallTrain'),
    PYO: t('nightExpressTrain'),
    SAA: t('convoyTrain'),
    T: t('cargoTrain'),
    TYO: t('workTrain'),
    VLI: t('additionalLocomotive'),
  }

  return codes?.[code] || i18n.train
}
