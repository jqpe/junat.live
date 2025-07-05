import type { TrafficInfoMessage, TriggerPoint } from '../types'

import { addSeconds, parseISO } from 'date-fns'

export interface Realization {
  realizationTime: string
  messageTime: string
  station: string
  rowType: string
}

export const realizations = (
  triggerPoints: TriggerPoint[],
  messages: TrafficInfoMessage[],
) => {
  const realizations: Realization[] = []

  for (const message of messages) {
    const successes = triggerPoints.filter(trigger => {
      const station =
        trigger.trainRunningMessageStationShortCode === message.station
      const trackSection =
        trigger.trainRunningMessageTrackSection === message.trackSection
      const type = trigger.trainRunningMessageType === message.type
      const next =
        trigger.trainRunningMessageNextStationShortCode === message.nextStation

      return station && next && trackSection && type
    })

    for (const success of successes) {
      const realizationTime = addSeconds(
        parseISO(message.timestamp),
        success.offset,
      )

      realizations.push({
        messageTime: message.timestamp,
        realizationTime: realizationTime.toISOString(),
        station: message.station,
        rowType: success.timeTableRowType,
      })
    }
  }

  return realizations
}
