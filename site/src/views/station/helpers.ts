import {
  DEFAULT_TRAINS_COUNT,
  TRAINS_MULTIPLIER,
  TRAINS_OVERSHOOT,
} from '@junat/core/constants'

/**
 * The fetch button should only be visible if there are trains to be fetched or when trains are being fetched.
 * The button will be always visible when `isLoading = true` and there are trains.
 *
 * 1. If there are no trains the button must be hidden.
 * 2. If there are initial trains ({@link DEFAULT_TRAINS_COUNT|view default}) show the button.
 * 3. If there is more trains than {@link DEFAULT_TRAINS_COUNT|default} and the modulo of {@link TRAINS_MULTIPLIER} compared to the length of trains is zero, show the button.
 *
 * Trains are counted as follows:
 *
 * - *0*. default (e.g. 20) + overshoot (e.g. 5) = 20-25 trains in primary state
 * - *1*. multiplier * index (e.g. multiplier = 100 => 100) + overshoot
 * - *2*. when multiplier = 100 => 200 + overshoot
 *
 * If the API responds with 191 trains in the above case, displaying the button is redundant and is hidden when index = 2.
 *
 * The case: `191 % 100 != 0`
 *
 * The {@link TRAINS_OVERSHOOT} parameter helps handle real-time connections that may reduce train counts
 * (e.g., primary state 20 -> 19) by providing a buffer range where the fetch button remains visible.
 *
 * Additionally, `fetchCount` parameter may be used to deal with an edge case where new trains were fetched but the returned amount of trains is {@link DEFAULT_TRAINS_COUNT}.
 */
export function showFetchButton(
  trains: number,
  isLoading = false,
  fetchCount = 0,
) {
  if (trains === 0) {
    return false
  }

  if (isLoading) {
    return true
  }

  const isPrimaryState =
    fetchCount === 0 &&
    trains >= DEFAULT_TRAINS_COUNT &&
    trains <= DEFAULT_TRAINS_COUNT + TRAINS_OVERSHOOT

  const adjustedTrains = trains - TRAINS_OVERSHOOT
  const hasMoreTrains =
    adjustedTrains > 0 && adjustedTrains % TRAINS_MULTIPLIER === 0

  return isPrimaryState || hasMoreTrains
}
