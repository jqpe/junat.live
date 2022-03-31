import { SimplifiedTrain } from '@typings/simplified_train'

export const sortSimplifiedTrains = (trains: SimplifiedTrain[]) => {
  return trains.sort((aTrain, bTrain) => {
    return (
      +Date.parse(aTrain.liveEstimateTime || aTrain.scheduledTime) -
      +Date.parse(bTrain.liveEstimateTime || bTrain.scheduledTime)
    )
  })
}
