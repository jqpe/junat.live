import type { HandlerOptions } from '../base/handler.js'
import type { PassengerInformationMessage } from '../types/passenger_information.js'

import { createFetch } from '../base/create_fetch.js'

interface GetPassengerInformationOptions extends HandlerOptions {
  stationShortCode?: string
}

export const fetchPassengerInformationMessages = async ({
  stationShortCode: station,
  signal,
}: GetPassengerInformationOptions) => {
  const params = new URLSearchParams()

  if (station) {
    params.append('station', station)
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
