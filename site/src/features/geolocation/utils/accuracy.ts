/**
 * @returns Truncated accuracy with an unit, one of meters or kilometers.
 */
export const getPrettifiedAccuracy = (accuracy: number): string => {
  let [meters, kilometers] = ['meters', 'kilometers']

  if (Math.trunc(accuracy) === 1) {
    meters = 'meter'
  }
  if (Math.trunc(accuracy / 1000) === 1) {
    kilometers = 'kilometer'
  }

  return accuracy < 1000
    ? `${Math.trunc(accuracy)} ${meters}`
    : `${Math.trunc(accuracy / 1000)} ${kilometers}`
}
