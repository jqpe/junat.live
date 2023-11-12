import constants from '~/constants'

/**
 * The fetch button should only be visible if there are trains to be fetched or when trains are being fetched.
 * The button will be always visible when `isLoading = true` and there are trains.
 *
 * 1. If there are no trains the button must be hidden.
 * 2. If there are initial trains ({@link constants.DEFAULT_TRAINS_COUNT|view default}) show the button.
 * 3. If there is more trains than {@link constants.DEFAULT_TRAINS_COUNT|default} and the modulo of {@link constants.TRAINS_MULTIPLIER} compared to the length of trains is zero, show the button.
 *
 * Trains are counted as follows:
 *
 * - *0*. default (e.g. 20)
 * - *1*. multiplier * index (e.g. multiplier = 100 => 100)
 * - *2*. when multiplier = 100 => 200
 *
 * If the API responds with 191 trains in the above case, displaying the button is redundant and is hidden when index = 2.
 *
 * The case: `191 % 100 != 0`
 *
 * Additionally, `fetchCount` parameter may be used to deal with an edge case where new trains were fetched but the returned amount of trains is {@link constants.DEFAULT_TRAINS_COUNT}.
 */
export function showFetchButton(
  trains: number,
  isLoading = false,
  fetchCount = 0
) {
  if (trains === 0) {
    return false
  }

  if (isLoading) {
    return true
  }

  const isPrimaryState =
    trains === constants.DEFAULT_TRAINS_COUNT && fetchCount === 0
  const hasMoreTrains = trains % constants.TRAINS_MULTIPLIER === 0

  return isPrimaryState || hasMoreTrains
}
