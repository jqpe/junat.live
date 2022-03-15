import type { Train } from '../types/train'

const findTimetableRow = (
  train: Train,
  stationShortCode: string,
  type: 'DEPARTURE' | 'ARRIVAL'
) => {
  return train.timeTableRows.find(
    tr => tr.stationShortCode === stationShortCode && tr.type === type
  )
}

export const sortTrains = (
  trains: Train[],
  stationShortCode: string,
  type: 'ARRIVAL' | 'DEPARTURE'
) => {
  return trains.sort((aTrain, bTrain) => {
    const aRow = findTimetableRow(aTrain, stationShortCode, type)
    const bRow = findTimetableRow(bTrain, stationShortCode, type)

    if (!(aRow && bRow)) {
      return 0
    }

    return (
      +Date.parse(aRow.liveEstimateTime || aRow.scheduledTime) -
      +Date.parse(bRow.liveEstimateTime || bRow.scheduledTime)
    )
  })
}
