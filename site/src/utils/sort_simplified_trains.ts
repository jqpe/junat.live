import type { SimplifiedTrain } from '@typings/simplified_train'

export interface ITrain extends Partial<SimplifiedTrain> {
  scheduledTime: string
}

export const sortSimplifiedTrains = (trains: ITrain[]) => {
  return trains.sort((aTrain, bTrain) => {
    return Date.parse(aTrain.scheduledTime) - Date.parse(bTrain.scheduledTime)
  })
}
