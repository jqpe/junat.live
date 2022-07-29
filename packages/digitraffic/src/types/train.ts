import type { TimetableRow } from './timetable_row.js'
import type { TrainCategory } from './train_category.js'

export interface Train {
  trainNumber: number
  departureDate: string
  operatorUICCode: number
  operatorShortCode: string
  trainType: string
  trainCategory: TrainCategory
  commuterLineID?: string
  runningCurrently: boolean
  cancelled: boolean
  version: number
  timetableType: 'REGULAR' | 'ADHOC'
  timetableAcceptanceDate: string
  deleted?: boolean
  timeTableRows: TimetableRow[]
}
