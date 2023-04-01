import type { HandlerOptions } from '../base/handler.js'
import type { Train } from '../types/train.js'

import { createFetch } from '../base/create_fetch.js'

interface RouteOptions extends HandlerOptions {
  departureDate?: string
  startDate?: string
  endDate?: string
  limit?: number
  includeNonstopping?: boolean
}

/**
 * Fetch trains that stop at both `departureStation` and `arrivalStation`.
 * Optionally, `options.includeNonstopping` can be used to return trains that travel through these stations without necessarily stopping at them.

 * @param departureStation Station shortcode.
 * @param arrivalStation Station shortcode.
 * @param options Additional parameters that can be used to do some basic filtering of results.
 * @param options.departureDate  [ISO 8601 calendar date](https://en.wikipedia.org/wiki/ISO_8601#Calendar_dates) (`yyyy-mm-dd`), defaults to current date. 
 * @param options.startDate 
 * ISO 8601 datetime, e.g. `new Date().toISOString()`; can be used with `options.endDate` to fetch trains for a range.
 * If `options.endDate` is not specified, `options.endDate` defaults to 24 hours from `options.startDate`.
 * @param options.endDate ISO 8601 datetime, e.g. `new Date().toISOString()`; can be used with `options.startDate` to fetch trains for a range.
 * @param options.includeNonstopping Whether to additionally include trains that don't stop at the departure or arrival stations. Defaults to false.
 * 
*/
export const route = async (
  departureStation: string,
  arrivalStation: string,
  options?: RouteOptions
): Promise<Train[] | undefined> => {
  if (!(departureStation && arrivalStation)) {
    throw new TypeError(
      'departureStation and arrivalStation are mandatory parameters'
    )
  }

  if (options?.limit && (options.limit < 0 || options.limit % 1 !== 0)) {
    throw new TypeError('options.limit should be a positive integer')
  }

  // Digitraffic API uses both camel case and snake case parameters, filter out the snake cased ones and handle them separately.
  // Also filter out the special object `signal`.
  const camelCaseOptions: Record<string, string> | undefined =
    options &&
    Object.fromEntries(
      Object.keys(options)
        .filter(key => !/departureDate|includeNonstopping|signal/.test(key))
        .map(key => [key, String(options[key as keyof typeof options])])
    )

  const parameters = new URLSearchParams(camelCaseOptions)
  if (options?.departureDate) {
    if (!/\d{4}-\d{2}-\d{2}/.test(options.departureDate)) {
      throw new TypeError(
        'options.departureDate needs to be a ISO 8601 calendar date in yyyy-mm-dd format'
      )
    }

    parameters.append('departure_date', options.departureDate)
  }

  if (options?.includeNonstopping) {
    parameters.append('include_nonstopping', String(options.includeNonstopping))
  }

  const path = `/live-trains/station/${departureStation}/${arrivalStation}`

  return createFetch(path, { query: parameters, signal: options?.signal })
}
