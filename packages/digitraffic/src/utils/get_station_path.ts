/**
 * Gets an uri safe path from a station name by removing characters such as ä, ö, dashes and whitespace.
 */
export const getStationPath = (stationName: string) => {
  return stationName
    .toLowerCase()
    .replace(/ä/g, 'a')
    .replace(/ö|å/g, 'o')
    .replace(/\s|-/g, '_')
}
