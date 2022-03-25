export interface SubscribeToTrainsOptions {
  /**
   * Date of departure. In yyyy-mm-dd format.
   */
  departureDate?: string
  /**
   * When specified, only listens to a single train.
   * Omit to listen to all trains.
   */
  trainNumber?: number
  /**
   * Comma separated list of trains, e.g. "Long-Distance,Commuter"
   * @see https://rata.digitraffic.fi/api/v1/metadata/train-categories
   */
  trainCategory?: string
  /**
   * @see https://rata.digitraffic.fi/api/v1/metadata/train-types
   * Specifially `name`. You can also use the `trainCategory` option instead.
   */
  trainType?: string
  /**
   * @see https://rata.digitraffic.fi/api/v1/metadata/operators
   * Use `operatorShortCode` as a parameter.
   */
  operator?: string
  /**
   * Same as `commuterLineId`
   * @see
   */
  commuterLine?: string
  runningCurrently?: string
  timetableType?: string
}
