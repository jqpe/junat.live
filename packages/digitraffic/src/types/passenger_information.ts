export interface PassengerInformationMessage {
  id: string
  version: number
  creationDateTime: string
  startValidity: string
  endValidity: string
  trainNumber?: number
  trainDepartureDate?: string
  /* List of station short codes this message affects */
  stations: string[]
  video?: VideoMessage
  audio?: AudioMessage
}

export interface VideoMessage {
  text: LocalizedText
  deliveryRules: VideoDeliveryRules
}

export interface AudioMessage {
  text: LocalizedText
  deliveryRules: AudioDeliveryRules
  /** x minutes */
  repeatEvery?: number
  repetitions?: number
  eventType?: 'ARRIVING' | 'DEPARTING'
  /** When delivery is DELIVERY_AT */
  deliveryAt?: string
}

export interface DeliveryRules {
  startDateTime?: string
  endDateTime?: string
  startTime?: string
  endTime?: string
  weekDays?: WeekDay[]
}

export interface AudioDeliveryRules extends DeliveryRules {
  deliveryType?: AudioDeliveryType
  repetitions?: number
  repeatEvery?: number
}

export interface LocalizedText {
  fi?: string
  sv?: string
  en?: string
}

export interface VideoDeliveryRules extends DeliveryRules {
  deliveryType?: VideoDeliveryType
}

export type WeekDay =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY'

export type AudioDeliveryType =
  | 'NOW'
  | 'DELIVERY_AT'
  | 'REPEAT_EVERY'
  | 'ON_SCHEDULE'
  | 'ON_EVENT'

export type VideoDeliveryType = 'WHEN' | 'CONTINUOUS_VISUALIZATION'
