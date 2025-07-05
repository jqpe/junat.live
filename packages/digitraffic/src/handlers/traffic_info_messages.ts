import type { HandlerOptions } from '../base/handler.js'
import type { TrafficInfoMessage } from '../types/traffic_info_message.js'

import { createFetch } from '../base/create_fetch.js'

interface GetTrafficInformationMessagesOptions extends HandlerOptions {
  /**
   * Date in yyyy-mm-dd format. Can also be set to 'latest'.
   *
   * @see https://www.digitraffic.fi/rautatieliikenne/#yhden-junan-tiedot
   */
  date?: string | 'latest'
  trainNumber: number
  version?: number | string
}

export const fetchTrafficInfoMessages = async ({
  date,
  trainNumber,
  version,
  signal,
}: GetTrafficInformationMessagesOptions) => {
  const params = new URLSearchParams()

  if (version !== undefined) {
    params.append('version', `${version}`)
  }

  const actualDate = date || 'latest'

  const trafficInfoMessages = await createFetch<TrafficInfoMessage[]>(
    `/train-tracking/${actualDate}/${trainNumber}`,
    {
      query: params,
      signal,
    },
  )

  if (!trafficInfoMessages || trafficInfoMessages.length === 0) {
    return
  }

  return trafficInfoMessages
}
