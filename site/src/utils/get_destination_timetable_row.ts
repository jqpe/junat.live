export interface ITrain {
  commuterLineID?: string
  timeTableRows: {
    stationShortCode: string
    type: 'DEPARTURE' | 'ARRIVAL'
  }[]
}

/**
 * Returns the last timetable row or if `from` unequals to LEN (Helsinki Airport) might return the next timetable row with `LEN` station shortcode.
 *
 * This is done so that stations inside Ring Rail Line have expected destinations.
 */
export const getDestinationTimetableRow = (
  train: ITrain,
  from?: string
): typeof train.timeTableRows[number] => {
  if (
    from &&
    from !== 'LEN' &&
    train.commuterLineID &&
    ['P', 'I'].includes(train.commuterLineID)
  ) {
    const airport = train.timeTableRows.find(
      ({ stationShortCode, type }) =>
        stationShortCode === 'LEN' && type === 'ARRIVAL'
    )
    if (airport) {
      return airport
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return train.timeTableRows.at(-1)!
}
