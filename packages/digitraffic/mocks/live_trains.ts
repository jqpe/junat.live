import { Train } from '../src/types/train'

export const liveTrains: Train[] = [
  /** non stopping */
  {
    trainNumber: 8739,
    departureDate: '2022-05-23',
    operatorUICCode: 10,
    operatorShortCode: 'vr',
    trainType: 'HL',
    trainCategory: 'Commuter',
    commuterLineID: 'P',
    runningCurrently: false,
    cancelled: false,
    version: 282_744_552_290,
    timetableType: 'REGULAR',
    timetableAcceptanceDate: '2021-11-05T10:07:11.000Z',
    timeTableRows: [
      {
        stationShortCode: 'HKI',
        stationUICCode: 1,
        countryCode: 'FI',
        type: 'DEPARTURE',
        trainStopping: true,
        commercialStop: true,
        commercialTrack: '9',
        cancelled: false,
        scheduledTime: '2022-05-23T20:23:00.000Z',
        actualTime: '2022-05-23T20:22:58.000Z',
        differenceInMinutes: 0,
        causes: [],
        trainReady: {
          source: 'KUPLA',
          accepted: true,
          timestamp: '2022-05-23T20:20:21.000Z'
        }
      }
    ]
  },
  /** Stopping */
  {
    trainNumber: 8530,
    departureDate: '2022-05-24',
    operatorUICCode: 10,
    operatorShortCode: 'vr',
    trainType: 'HL',
    trainCategory: 'Commuter',
    commuterLineID: 'L',
    runningCurrently: true,
    cancelled: false,
    version: 282_744_655_485,
    timetableType: 'ADHOC',
    timetableAcceptanceDate: '2022-05-06T05:21:34.000Z',
    timeTableRows: [
      {
        stationShortCode: 'KHK',
        stationUICCode: 1028,
        countryCode: 'FI',
        type: 'ARRIVAL',
        trainStopping: false,
        commercialTrack: '',
        cancelled: false,
        scheduledTime: '2022-05-23T22:14:30.000Z',
        liveEstimateTime: '2022-05-23T22:14:30.000Z',
        estimateSource: 'COMBOCALC',
        differenceInMinutes: 0,
        causes: []
      }
    ]
  }
]
