export interface TriggerPoint {
  id: number
  trainRunningMessageTrackSection: string
  trainRunningMessageStationShortCode: string
  trainRunningMessageNextStationShortCode: string
  trainRunningMessageType: string
  timeTableRowStationShortCode: string
  timeTableRowType: 'RELEASE' | 'OCCUPY'
  /** Number of seconds to add to the train running message timestamp to get the timetable row actual time */
  offset: number
}
