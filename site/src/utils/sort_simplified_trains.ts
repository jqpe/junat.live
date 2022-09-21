import type { SimplifiedTrain } from '@typings/simplified_train'

export interface ITrain extends Partial<SimplifiedTrain> {
  scheduledTime: string
}

export const sortSimplifiedTrains = <T extends ITrain>(trains: Readonly<T[]>) => {
  return [...trains].sort((aTrain, bTrain) => {
    return Date.parse(aTrain.scheduledTime) - Date.parse(bTrain.scheduledTime)
  })
}
