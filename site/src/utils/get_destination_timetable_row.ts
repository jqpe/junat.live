import type { Train } from '~digitraffic'

export const getDestinationTimetableRow = (train: Train, from?: string) => {
  if (
    from !== 'LEN' &&
    train.commuterLineID &&
    ['P', 'I'].includes(train.commuterLineID)
  ) {
    const airport = train.timeTableRows.find(
      ({ stationShortCode, type }) =>
        stationShortCode === 'LEN' && type === 'DEPARTURE'
    )
    if (airport) {
      return airport
    }
  }

  return train.timeTableRows.at(-1)
}
