export interface TimetableRow {
  trainStopping: boolean
  stationShortCode: string
  stationcUICCode: number
  countryCode: 'FI' | 'RU'
  type: 'ARRIVAL' | 'DEPARTURE'
  commercialStop?: boolean
  commercialTrack?: boolean
  cancelled: boolean
  scheduledTime: string
  liveEstimateTime?: string
  /**
   * @see https://rata.digitraffic.fi/api/v1/doc/resources/estimate-sources.html
   */
  estimateSource?: 'MIKU_USER' | 'LIIKE_USER' | 'LIIKE_AUTOMATIC' | 'COMBOCALC'
  unknownDelay?: boolean
  actualTime?: string
  differenceInMinutes?: number
  causes: {
    /**
     * @see https://rata.digitraffic.fi/api/v1/metadata/cause-category-codes
     */
    categoryCodeId: number
    categoryCode: string
    /**
     * @see https://rata.digitraffic.fi/api/v1/metadata/detailed-cause-category-codes
     */
    detailedCategoryCodeId?: number
    detailedCategoryCode?: string
    /**
     * @see https://rata.digitraffic.fi/api/v1/metadata/third-cause-category-codes
     */
    thirdCategoryCodeId?: number
    thirdCategoryCode?: string
  }
  trainReady?: {
    source: string
    accepted: boolean
    timestamp: string
  }
}
