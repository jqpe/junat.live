/**
 * Gets an uri safe path from a station name by removing characters such as ä, ö, dashes and whitespace.
 */
export const getStationPath = (stationName: string) => {
  return stationName
    .toLowerCase()
    .replaceAll('ä', 'a')
    .replaceAll(/[åö]/g, 'o')
    .replaceAll(/\s|-/g, '_')
}
