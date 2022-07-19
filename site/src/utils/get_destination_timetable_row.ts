export interface ITrain {
  commuterLineID?: string
  timeTableRows: {
    stationShortCode: string
    type: 'DEPARTURE' | 'ARRIVAL'
  }[]
}

export const getDestinationTimetableRow = (train: ITrain, from?: string) => {
  if (
    from !== 'LEN' &&
    train.commuterLineID &&
    ['P', 'I'].includes(train.commuterLineID)
  ) {
    const fromTr = train.timeTableRows.findIndex(
      station => station.stationShortCode === from
    )
    const timetableRows = train.timeTableRows.slice(fromTr !== -1 ? fromTr : 0)

    const airport = timetableRows.find(
      ({ stationShortCode, type }) =>
        stationShortCode === 'LEN' && type === 'ARRIVAL'
    )
    if (airport) {
      return airport
    }
  }

  return train.timeTableRows.at(-1)
}
