import type { HandlerOptions } from '../base/handler.js'
import type { PassengerInformationMessage } from '../types/passenger_information.js'

import { createFetch } from '../base/create_fetch.js'

interface GetPassengerInformationOptions extends HandlerOptions {
  stationShortCode?: string
  /** Whether to return alerts that only affect stations, not trains. @default false*/
  onlyGeneral?: true
  /** Return alerts that affect the specified train */
  trainNumber?: number
  /** Return alerts that affect a specified train on the given date */
  departureDate?: string
}

export const fetchPassengerInformationMessages = async ({
  stationShortCode: station,
  onlyGeneral,
  trainNumber,
  departureDate,
  signal,
}: GetPassengerInformationOptions) => {
  const params = new URLSearchParams()

  if (station) {
    params.append('station', station)
  }
  if (onlyGeneral === true) {
    params.append('only_general', 'true')
  }
  if (trainNumber) {
    params.append('train_number', trainNumber.toString())
  }
  if (departureDate) {
    params.append('train_departure_date', departureDate)
  }

  const messages = await createFetch<PassengerInformationMessage[]>(
    '/passenger-information/active',
    {
      query: params.keys().next().value ? params : undefined,
      signal,
    },
  )

  return messages || []
}
