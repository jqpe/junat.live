import type { TimetableRow } from './timetable_row'
import type { TrainCategory } from './train_category'

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
