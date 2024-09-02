/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** An RFC-3339 compliant Full Date Scalar */
  Date: { input: string; output: string; }
  /** A slightly refined version of RFC-3339 compliant DateTime Scalar */
  DateTime: { input: string; output: string; }
};

/** # PRIMITIVE FILTERS */
export type BooleanWhere = {
  equals: InputMaybe<Scalars['Boolean']['input']>;
  unequals: InputMaybe<Scalars['Boolean']['input']>;
};

export type CategoryCode = {
  __typename?: 'CategoryCode';
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  validFrom: Scalars['Date']['output'];
  validTo: Maybe<Scalars['Date']['output']>;
};

export type CategoryCodeCollectionWhere = {
  contains: InputMaybe<CategoryCodeWhere>;
};

export type CategoryCodeOrderBy = {
  code: InputMaybe<OrderDirection>;
  name: InputMaybe<OrderDirection>;
  validFrom: InputMaybe<OrderDirection>;
  validTo: InputMaybe<OrderDirection>;
};

export type CategoryCodeWhere = {
  and: InputMaybe<Array<InputMaybe<CategoryCodeWhere>>>;
  code: InputMaybe<StringWhere>;
  name: InputMaybe<StringWhere>;
  or: InputMaybe<Array<InputMaybe<CategoryCodeWhere>>>;
  validFrom: InputMaybe<DateWhere>;
  validTo: InputMaybe<DateWhere>;
};

export type Cause = {
  __typename?: 'Cause';
  categoryCode: CategoryCode;
  detailedCategoryCode: Maybe<DetailedCategoryCode>;
  thirdCategoryCode: Maybe<ThirdCategoryCode>;
};

export type CauseCollectionWhere = {
  contains: InputMaybe<CauseWhere>;
};

export type CauseOrderBy = {
  categoryCode: InputMaybe<CategoryCodeOrderBy>;
  detailedCategoryCode: InputMaybe<DetailedCategoryCodeOrderBy>;
  thirdCategoryCode: InputMaybe<ThirdCategoryCodeOrderBy>;
};

export type CauseWhere = {
  and: InputMaybe<Array<InputMaybe<CauseWhere>>>;
  categoryCode: InputMaybe<CategoryCodeWhere>;
  detailedCategoryCode: InputMaybe<DetailedCategoryCodeWhere>;
  or: InputMaybe<Array<InputMaybe<CauseWhere>>>;
  thirdCategoryCode: InputMaybe<ThirdCategoryCodeWhere>;
};

export type Composition = {
  __typename?: 'Composition';
  journeySections: Maybe<Array<Maybe<JourneySection>>>;
  train: Maybe<Train>;
  version: Scalars['String']['output'];
};


export type CompositionJourneySectionsArgs = {
  orderBy: InputMaybe<Array<InputMaybe<JourneySectionOrderBy>>>;
  skip: InputMaybe<Scalars['Int']['input']>;
  take: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<JourneySectionWhere>;
};

export type CompositionCollectionWhere = {
  contains: InputMaybe<CompositionWhere>;
};

export type CompositionOrderBy = {
  train: InputMaybe<TrainOrderBy>;
  version: InputMaybe<OrderDirection>;
};

export type CompositionWhere = {
  and: InputMaybe<Array<InputMaybe<CompositionWhere>>>;
  journeySections: InputMaybe<JourneySectionCollectionWhere>;
  or: InputMaybe<Array<InputMaybe<CompositionWhere>>>;
  train: InputMaybe<TrainWhere>;
  version: InputMaybe<StringWhere>;
};

export type CoordinateWhere = {
  inside: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type DateTimeWhere = {
  equals: InputMaybe<Scalars['DateTime']['input']>;
  greaterThan: InputMaybe<Scalars['DateTime']['input']>;
  lessThan: InputMaybe<Scalars['DateTime']['input']>;
  unequals: InputMaybe<Scalars['DateTime']['input']>;
};

export type DateWhere = {
  equals: InputMaybe<Scalars['Date']['input']>;
  greaterThan: InputMaybe<Scalars['Date']['input']>;
  lessThan: InputMaybe<Scalars['Date']['input']>;
  unequals: InputMaybe<Scalars['Date']['input']>;
};

export enum DayOfWeek {
  Friday = 'FRIDAY',
  Monday = 'MONDAY',
  Saturday = 'SATURDAY',
  Sunday = 'SUNDAY',
  Thursday = 'THURSDAY',
  Tuesday = 'TUESDAY',
  Wednesday = 'WEDNESDAY'
}

export type DayOfWeekCollectionWhere = {
  equals: InputMaybe<Array<InputMaybe<DayOfWeek>>>;
  notEquals: InputMaybe<Array<InputMaybe<DayOfWeek>>>;
};

export type DayOfWeekOrderBy = {
  direction: OrderDirection;
};

export type DayOfWeekWhere = {
  equals: InputMaybe<Scalars['String']['input']>;
  unequals: InputMaybe<Scalars['String']['input']>;
};

export type DetailedCategoryCode = {
  __typename?: 'DetailedCategoryCode';
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  validFrom: Scalars['Date']['output'];
  validTo: Maybe<Scalars['Date']['output']>;
};

export type DetailedCategoryCodeCollectionWhere = {
  contains: InputMaybe<DetailedCategoryCodeWhere>;
};

export type DetailedCategoryCodeOrderBy = {
  code: InputMaybe<OrderDirection>;
  name: InputMaybe<OrderDirection>;
  validFrom: InputMaybe<OrderDirection>;
  validTo: InputMaybe<OrderDirection>;
};

export type DetailedCategoryCodeWhere = {
  and: InputMaybe<Array<InputMaybe<DetailedCategoryCodeWhere>>>;
  code: InputMaybe<StringWhere>;
  name: InputMaybe<StringWhere>;
  or: InputMaybe<Array<InputMaybe<DetailedCategoryCodeWhere>>>;
  validFrom: InputMaybe<DateWhere>;
  validTo: InputMaybe<DateWhere>;
};

export type EnumWhere = {
  equals: InputMaybe<Scalars['String']['input']>;
  unequals: InputMaybe<Scalars['String']['input']>;
};

export enum EstimateSourceType {
  Combocalc = 'COMBOCALC',
  LiikeAutomatic = 'LIIKE_AUTOMATIC',
  LiikeUser = 'LIIKE_USER',
  MikuUser = 'MIKU_USER',
  Unknown = 'UNKNOWN'
}

export type IntWhere = {
  equals: InputMaybe<Scalars['Int']['input']>;
  greaterThan: InputMaybe<Scalars['Int']['input']>;
  lessThan: InputMaybe<Scalars['Int']['input']>;
  unequals: InputMaybe<Scalars['Int']['input']>;
};

export type JourneySection = {
  __typename?: 'JourneySection';
  endTimeTableRow: Maybe<TimeTableRow>;
  locomotives: Maybe<Array<Maybe<Locomotive>>>;
  maximumSpeed: Scalars['Int']['output'];
  startTimeTableRow: Maybe<TimeTableRow>;
  totalLength: Scalars['Int']['output'];
  wagons: Maybe<Array<Maybe<Wagon>>>;
};


export type JourneySectionLocomotivesArgs = {
  orderBy: InputMaybe<Array<InputMaybe<LocomotiveOrderBy>>>;
  skip: InputMaybe<Scalars['Int']['input']>;
  take: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<LocomotiveWhere>;
};


export type JourneySectionWagonsArgs = {
  orderBy: InputMaybe<Array<InputMaybe<WagonOrderBy>>>;
  skip: InputMaybe<Scalars['Int']['input']>;
  take: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<WagonWhere>;
};

export type JourneySectionCollectionWhere = {
  contains: InputMaybe<JourneySectionWhere>;
};

export type JourneySectionOrderBy = {
  endTimeTableRow: InputMaybe<TimeTableRowOrderBy>;
  maximumSpeed: InputMaybe<OrderDirection>;
  startTimeTableRow: InputMaybe<TimeTableRowOrderBy>;
  totalLength: InputMaybe<OrderDirection>;
};

export type JourneySectionWhere = {
  and: InputMaybe<Array<InputMaybe<JourneySectionWhere>>>;
  endTimeTableRow: InputMaybe<TimeTableRowWhere>;
  locomotives: InputMaybe<LocomotiveCollectionWhere>;
  maximumSpeed: InputMaybe<IntWhere>;
  or: InputMaybe<Array<InputMaybe<JourneySectionWhere>>>;
  startTimeTableRow: InputMaybe<TimeTableRowWhere>;
  totalLength: InputMaybe<IntWhere>;
  wagons: InputMaybe<WagonCollectionWhere>;
};

export type Locomotive = {
  __typename?: 'Locomotive';
  location: Scalars['Int']['output'];
  locomotiveType: Scalars['String']['output'];
  powerTypeAbbreviation: Scalars['String']['output'];
  vehicleNumber: Maybe<Scalars['String']['output']>;
};

export type LocomotiveCollectionWhere = {
  contains: InputMaybe<LocomotiveWhere>;
};

export type LocomotiveOrderBy = {
  location: InputMaybe<OrderDirection>;
  locomotiveType: InputMaybe<OrderDirection>;
  powerTypeAbbreviation: InputMaybe<OrderDirection>;
  vehicleNumber: InputMaybe<OrderDirection>;
};

export type LocomotiveWhere = {
  and: InputMaybe<Array<InputMaybe<LocomotiveWhere>>>;
  location: InputMaybe<IntWhere>;
  locomotiveType: InputMaybe<StringWhere>;
  or: InputMaybe<Array<InputMaybe<LocomotiveWhere>>>;
  powerTypeAbbreviation: InputMaybe<StringWhere>;
  vehicleNumber: InputMaybe<StringWhere>;
};

export type Operator = {
  __typename?: 'Operator';
  name: Scalars['String']['output'];
  shortCode: Scalars['String']['output'];
  uicCode: Scalars['Int']['output'];
};

export type OperatorCollectionWhere = {
  contains: InputMaybe<OperatorWhere>;
};

export type OperatorOrderBy = {
  name: InputMaybe<OrderDirection>;
  shortCode: InputMaybe<OrderDirection>;
  uicCode: InputMaybe<OrderDirection>;
};

export type OperatorWhere = {
  and: InputMaybe<Array<InputMaybe<OperatorWhere>>>;
  name: InputMaybe<StringWhere>;
  or: InputMaybe<Array<InputMaybe<OperatorWhere>>>;
  shortCode: InputMaybe<StringWhere>;
  uicCode: InputMaybe<IntWhere>;
};

export enum OrderDirection {
  Ascending = 'ASCENDING',
  Descending = 'DESCENDING'
}

export type PassengerInformationAudio = {
  __typename?: 'PassengerInformationAudio';
  deliveryRules: PassengerInformationAudioDeliveryRules;
  messageId: Scalars['String']['output'];
  messageVersion: Scalars['Int']['output'];
  text: PassengerInformationTextContent;
};

export type PassengerInformationAudioCollectionWhere = {
  contains: InputMaybe<PassengerInformationAudioWhere>;
};

export type PassengerInformationAudioDeliveryRules = {
  __typename?: 'PassengerInformationAudioDeliveryRules';
  deliveryAt: Maybe<Scalars['DateTime']['output']>;
  deliveryType: Maybe<Scalars['String']['output']>;
  endDateTime: Maybe<Scalars['DateTime']['output']>;
  endTime: Maybe<Scalars['String']['output']>;
  eventType: Maybe<Scalars['String']['output']>;
  repeatEvery: Maybe<Scalars['Int']['output']>;
  repetitions: Maybe<Scalars['Int']['output']>;
  startDateTime: Maybe<Scalars['DateTime']['output']>;
  startTime: Maybe<Scalars['String']['output']>;
  weekDays: Maybe<Array<Maybe<DayOfWeek>>>;
};


export type PassengerInformationAudioDeliveryRulesWeekDaysArgs = {
  orderBy: InputMaybe<Array<InputMaybe<DayOfWeekOrderBy>>>;
  skip: InputMaybe<Scalars['Int']['input']>;
  take: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<DayOfWeekWhere>;
};

export type PassengerInformationAudioDeliveryRulesCollectionWhere = {
  contains: InputMaybe<PassengerInformationAudioDeliveryRulesWhere>;
};

export type PassengerInformationAudioDeliveryRulesOrderBy = {
  deliveryAt: InputMaybe<OrderDirection>;
  deliveryType: InputMaybe<OrderDirection>;
  endDateTime: InputMaybe<OrderDirection>;
  endTime: InputMaybe<OrderDirection>;
  eventType: InputMaybe<OrderDirection>;
  repeatEvery: InputMaybe<OrderDirection>;
  repetitions: InputMaybe<OrderDirection>;
  startDateTime: InputMaybe<OrderDirection>;
  startTime: InputMaybe<OrderDirection>;
};

export type PassengerInformationAudioDeliveryRulesWhere = {
  and: InputMaybe<Array<InputMaybe<PassengerInformationAudioDeliveryRulesWhere>>>;
  deliveryAt: InputMaybe<DateTimeWhere>;
  deliveryType: InputMaybe<StringWhere>;
  endDateTime: InputMaybe<DateTimeWhere>;
  endTime: InputMaybe<StringWhere>;
  eventType: InputMaybe<StringWhere>;
  or: InputMaybe<Array<InputMaybe<PassengerInformationAudioDeliveryRulesWhere>>>;
  repeatEvery: InputMaybe<IntWhere>;
  repetitions: InputMaybe<IntWhere>;
  startDateTime: InputMaybe<DateTimeWhere>;
  startTime: InputMaybe<StringWhere>;
  weekDays: InputMaybe<DayOfWeekCollectionWhere>;
};

export type PassengerInformationAudioOrderBy = {
  deliveryRules: InputMaybe<PassengerInformationAudioDeliveryRulesOrderBy>;
  messageId: InputMaybe<OrderDirection>;
  messageVersion: InputMaybe<OrderDirection>;
  text: InputMaybe<PassengerInformationTextContentOrderBy>;
};

export type PassengerInformationAudioWhere = {
  and: InputMaybe<Array<InputMaybe<PassengerInformationAudioWhere>>>;
  deliveryRules: InputMaybe<PassengerInformationAudioDeliveryRulesWhere>;
  messageId: InputMaybe<StringWhere>;
  messageVersion: InputMaybe<IntWhere>;
  or: InputMaybe<Array<InputMaybe<PassengerInformationAudioWhere>>>;
  text: InputMaybe<PassengerInformationTextContentWhere>;
};

export type PassengerInformationMessage = {
  __typename?: 'PassengerInformationMessage';
  audio: Maybe<PassengerInformationAudio>;
  creationDateTime: Scalars['DateTime']['output'];
  endValidity: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  messageStations: Maybe<Array<Maybe<PassengerInformationMessageStation>>>;
  startValidity: Scalars['DateTime']['output'];
  train: Maybe<Train>;
  trainDepartureDate: Maybe<Scalars['Date']['output']>;
  trainNumber: Maybe<Scalars['Int']['output']>;
  version: Scalars['Int']['output'];
  video: Maybe<PassengerInformationVideo>;
};


export type PassengerInformationMessageMessageStationsArgs = {
  orderBy: InputMaybe<Array<InputMaybe<PassengerInformationMessageStationOrderBy>>>;
  skip: InputMaybe<Scalars['Int']['input']>;
  take: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<PassengerInformationMessageStationWhere>;
};

export type PassengerInformationMessageCollectionWhere = {
  contains: InputMaybe<PassengerInformationMessageWhere>;
};

export type PassengerInformationMessageOrderBy = {
  audio: InputMaybe<PassengerInformationAudioOrderBy>;
  creationDateTime: InputMaybe<OrderDirection>;
  endValidity: InputMaybe<OrderDirection>;
  id: InputMaybe<OrderDirection>;
  startValidity: InputMaybe<OrderDirection>;
  train: InputMaybe<TrainOrderBy>;
  trainDepartureDate: InputMaybe<OrderDirection>;
  trainNumber: InputMaybe<OrderDirection>;
  version: InputMaybe<OrderDirection>;
  video: InputMaybe<PassengerInformationVideoOrderBy>;
};

export type PassengerInformationMessageStation = {
  __typename?: 'PassengerInformationMessageStation';
  message: PassengerInformationMessage;
  messageId: Scalars['String']['output'];
  messageVersion: Scalars['Int']['output'];
  station: Station;
  stationShortCode: Scalars['String']['output'];
};

export type PassengerInformationMessageStationCollectionWhere = {
  contains: InputMaybe<PassengerInformationMessageStationWhere>;
};

export type PassengerInformationMessageStationOrderBy = {
  message: InputMaybe<PassengerInformationMessageOrderBy>;
  messageId: InputMaybe<OrderDirection>;
  messageVersion: InputMaybe<OrderDirection>;
  station: InputMaybe<StationOrderBy>;
  stationShortCode: InputMaybe<OrderDirection>;
};

export type PassengerInformationMessageStationWhere = {
  and: InputMaybe<Array<InputMaybe<PassengerInformationMessageStationWhere>>>;
  message: InputMaybe<PassengerInformationMessageWhere>;
  messageId: InputMaybe<StringWhere>;
  messageVersion: InputMaybe<IntWhere>;
  or: InputMaybe<Array<InputMaybe<PassengerInformationMessageStationWhere>>>;
  station: InputMaybe<StationWhere>;
  stationShortCode: InputMaybe<StringWhere>;
};

export type PassengerInformationMessageWhere = {
  and: InputMaybe<Array<InputMaybe<PassengerInformationMessageWhere>>>;
  audio: InputMaybe<PassengerInformationAudioWhere>;
  creationDateTime: InputMaybe<DateTimeWhere>;
  endValidity: InputMaybe<DateTimeWhere>;
  id: InputMaybe<StringWhere>;
  messageStations: InputMaybe<PassengerInformationMessageStationCollectionWhere>;
  or: InputMaybe<Array<InputMaybe<PassengerInformationMessageWhere>>>;
  startValidity: InputMaybe<DateTimeWhere>;
  train: InputMaybe<TrainWhere>;
  trainDepartureDate: InputMaybe<DateWhere>;
  trainNumber: InputMaybe<IntWhere>;
  version: InputMaybe<IntWhere>;
  video: InputMaybe<PassengerInformationVideoWhere>;
};

export type PassengerInformationTextContent = {
  __typename?: 'PassengerInformationTextContent';
  en: Maybe<Scalars['String']['output']>;
  fi: Maybe<Scalars['String']['output']>;
  sv: Maybe<Scalars['String']['output']>;
};

export type PassengerInformationTextContentCollectionWhere = {
  contains: InputMaybe<PassengerInformationTextContentWhere>;
};

export type PassengerInformationTextContentOrderBy = {
  en: InputMaybe<OrderDirection>;
  fi: InputMaybe<OrderDirection>;
  sv: InputMaybe<OrderDirection>;
};

export type PassengerInformationTextContentWhere = {
  and: InputMaybe<Array<InputMaybe<PassengerInformationTextContentWhere>>>;
  en: InputMaybe<StringWhere>;
  fi: InputMaybe<StringWhere>;
  or: InputMaybe<Array<InputMaybe<PassengerInformationTextContentWhere>>>;
  sv: InputMaybe<StringWhere>;
};

export type PassengerInformationVideo = {
  __typename?: 'PassengerInformationVideo';
  deliveryRules: PassengerInformationVideoDeliveryRules;
  messageId: Scalars['String']['output'];
  messageVersion: Scalars['Int']['output'];
  text: PassengerInformationTextContent;
};

export type PassengerInformationVideoCollectionWhere = {
  contains: InputMaybe<PassengerInformationVideoWhere>;
};

export type PassengerInformationVideoDeliveryRules = {
  __typename?: 'PassengerInformationVideoDeliveryRules';
  deliveryType: Maybe<Scalars['String']['output']>;
  endDateTime: Maybe<Scalars['DateTime']['output']>;
  endTime: Maybe<Scalars['String']['output']>;
  startDateTime: Maybe<Scalars['DateTime']['output']>;
  startTime: Maybe<Scalars['String']['output']>;
  weekDays: Maybe<Array<Maybe<DayOfWeek>>>;
};


export type PassengerInformationVideoDeliveryRulesWeekDaysArgs = {
  orderBy: InputMaybe<Array<InputMaybe<DayOfWeekOrderBy>>>;
  skip: InputMaybe<Scalars['Int']['input']>;
  take: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<DayOfWeekWhere>;
};

export type PassengerInformationVideoDeliveryRulesCollectionWhere = {
  contains: InputMaybe<PassengerInformationVideoDeliveryRulesWhere>;
};

export type PassengerInformationVideoDeliveryRulesOrderBy = {
  deliveryType: InputMaybe<OrderDirection>;
  endDateTime: InputMaybe<OrderDirection>;
  endTime: InputMaybe<OrderDirection>;
  startDateTime: InputMaybe<OrderDirection>;
  startTime: InputMaybe<OrderDirection>;
};

export type PassengerInformationVideoDeliveryRulesWhere = {
  and: InputMaybe<Array<InputMaybe<PassengerInformationVideoDeliveryRulesWhere>>>;
  deliveryType: InputMaybe<StringWhere>;
  endDateTime: InputMaybe<DateTimeWhere>;
  endTime: InputMaybe<StringWhere>;
  or: InputMaybe<Array<InputMaybe<PassengerInformationVideoDeliveryRulesWhere>>>;
  startDateTime: InputMaybe<DateTimeWhere>;
  startTime: InputMaybe<StringWhere>;
  weekDays: InputMaybe<DayOfWeekCollectionWhere>;
};

export type PassengerInformationVideoOrderBy = {
  deliveryRules: InputMaybe<PassengerInformationVideoDeliveryRulesOrderBy>;
  messageId: InputMaybe<OrderDirection>;
  messageVersion: InputMaybe<OrderDirection>;
  text: InputMaybe<PassengerInformationTextContentOrderBy>;
};

export type PassengerInformationVideoWhere = {
  and: InputMaybe<Array<InputMaybe<PassengerInformationVideoWhere>>>;
  deliveryRules: InputMaybe<PassengerInformationVideoDeliveryRulesWhere>;
  messageId: InputMaybe<StringWhere>;
  messageVersion: InputMaybe<IntWhere>;
  or: InputMaybe<Array<InputMaybe<PassengerInformationVideoWhere>>>;
  text: InputMaybe<PassengerInformationTextContentWhere>;
};

export type Query = {
  __typename?: 'Query';
  compositionsGreaterThanVersion: Maybe<Array<Maybe<Composition>>>;
  currentlyRunningTrains: Maybe<Array<Maybe<Train>>>;
  latestTrainLocations: Maybe<Array<Maybe<TrainLocation>>>;
  passengerInformationMessages: Maybe<Array<Maybe<PassengerInformationMessage>>>;
  passengerInformationMessagesByStation: Maybe<Array<Maybe<PassengerInformationMessage>>>;
  passengerInformationMessagesByTrain: Maybe<Array<Maybe<PassengerInformationMessage>>>;
  routesetMessagesByVersionGreaterThan: Maybe<Array<Maybe<RoutesetMessage>>>;
  stations: Maybe<Array<Maybe<Station>>>;
  train: Maybe<Array<Maybe<Train>>>;
  trainTrackingMessagesByVersionGreaterThan: Maybe<Array<Maybe<TrainTrackingMessage>>>;
  trainsByDepartureDate: Maybe<Array<Maybe<Train>>>;
  trainsByStationAndQuantity: Maybe<Array<Maybe<Train>>>;
  trainsByVersionGreaterThan: Maybe<Array<Maybe<Train>>>;
};


export type QueryCompositionsGreaterThanVersionArgs = {
  orderBy: InputMaybe<Array<InputMaybe<CompositionOrderBy>>>;
  skip: InputMaybe<Scalars['Int']['input']>;
  take: InputMaybe<Scalars['Int']['input']>;
  version: Scalars['String']['input'];
  where: InputMaybe<CompositionWhere>;
};


export type QueryCurrentlyRunningTrainsArgs = {
  orderBy: InputMaybe<Array<InputMaybe<TrainOrderBy>>>;
  skip: InputMaybe<Scalars['Int']['input']>;
  take: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<TrainWhere>;
};


export type QueryLatestTrainLocationsArgs = {
  orderBy: InputMaybe<Array<InputMaybe<TrainLocationOrderBy>>>;
  skip: InputMaybe<Scalars['Int']['input']>;
  take: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<TrainLocationWhere>;
};


export type QueryPassengerInformationMessagesArgs = {
  orderBy: InputMaybe<Array<InputMaybe<PassengerInformationMessageOrderBy>>>;
  skip: InputMaybe<Scalars['Int']['input']>;
  take: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<PassengerInformationMessageWhere>;
};


export type QueryPassengerInformationMessagesByStationArgs = {
  onlyGeneral: InputMaybe<Scalars['Boolean']['input']>;
  orderBy: InputMaybe<Array<InputMaybe<PassengerInformationMessageOrderBy>>>;
  skip: InputMaybe<Scalars['Int']['input']>;
  stationShortCode: Scalars['String']['input'];
  take: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<PassengerInformationMessageWhere>;
};


export type QueryPassengerInformationMessagesByTrainArgs = {
  departureDate: Scalars['Date']['input'];
  orderBy: InputMaybe<Array<InputMaybe<PassengerInformationMessageOrderBy>>>;
  skip: InputMaybe<Scalars['Int']['input']>;
  take: InputMaybe<Scalars['Int']['input']>;
  trainNumber: Scalars['Int']['input'];
  where: InputMaybe<PassengerInformationMessageWhere>;
};


export type QueryRoutesetMessagesByVersionGreaterThanArgs = {
  orderBy: InputMaybe<Array<InputMaybe<RoutesetMessageOrderBy>>>;
  skip: InputMaybe<Scalars['Int']['input']>;
  take: InputMaybe<Scalars['Int']['input']>;
  version: Scalars['String']['input'];
  where: InputMaybe<RoutesetMessageWhere>;
};


export type QueryStationsArgs = {
  orderBy: InputMaybe<Array<InputMaybe<StationOrderBy>>>;
  skip: InputMaybe<Scalars['Int']['input']>;
  take: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<StationWhere>;
};


export type QueryTrainArgs = {
  departureDate: Scalars['Date']['input'];
  orderBy: InputMaybe<Array<InputMaybe<TrainOrderBy>>>;
  skip: InputMaybe<Scalars['Int']['input']>;
  take: InputMaybe<Scalars['Int']['input']>;
  trainNumber: Scalars['Int']['input'];
  where: InputMaybe<TrainWhere>;
};


export type QueryTrainTrackingMessagesByVersionGreaterThanArgs = {
  orderBy: InputMaybe<Array<InputMaybe<TrainTrackingMessageOrderBy>>>;
  skip: InputMaybe<Scalars['Int']['input']>;
  take: InputMaybe<Scalars['Int']['input']>;
  version: Scalars['String']['input'];
  where: InputMaybe<TrainTrackingMessageWhere>;
};


export type QueryTrainsByDepartureDateArgs = {
  departureDate: Scalars['Date']['input'];
  orderBy: InputMaybe<Array<InputMaybe<TrainOrderBy>>>;
  skip: InputMaybe<Scalars['Int']['input']>;
  take: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<TrainWhere>;
};


export type QueryTrainsByStationAndQuantityArgs = {
  arrivedTrains: InputMaybe<Scalars['Int']['input']>;
  arrivingTrains: InputMaybe<Scalars['Int']['input']>;
  departedTrains: InputMaybe<Scalars['Int']['input']>;
  departingTrains: InputMaybe<Scalars['Int']['input']>;
  includeNonStopping: InputMaybe<Scalars['Boolean']['input']>;
  orderBy: InputMaybe<Array<InputMaybe<TrainOrderBy>>>;
  skip: InputMaybe<Scalars['Int']['input']>;
  station: Scalars['String']['input'];
  take: InputMaybe<Scalars['Int']['input']>;
  trainCategories: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  where: InputMaybe<TrainWhere>;
};


export type QueryTrainsByVersionGreaterThanArgs = {
  orderBy: InputMaybe<Array<InputMaybe<TrainOrderBy>>>;
  skip: InputMaybe<Scalars['Int']['input']>;
  take: InputMaybe<Scalars['Int']['input']>;
  version: Scalars['String']['input'];
  where: InputMaybe<TrainWhere>;
};

export type Routesection = {
  __typename?: 'Routesection';
  commercialTrackId: Scalars['String']['output'];
  routesetId: Scalars['Int']['output'];
  sectionId: Scalars['String']['output'];
  station: Station;
};

export type RoutesectionCollectionWhere = {
  contains: InputMaybe<RoutesectionWhere>;
};

export type RoutesectionOrderBy = {
  commercialTrackId: InputMaybe<OrderDirection>;
  routesetId: InputMaybe<OrderDirection>;
  sectionId: InputMaybe<OrderDirection>;
  station: InputMaybe<StationOrderBy>;
};

export type RoutesectionWhere = {
  and: InputMaybe<Array<InputMaybe<RoutesectionWhere>>>;
  commercialTrackId: InputMaybe<StringWhere>;
  or: InputMaybe<Array<InputMaybe<RoutesectionWhere>>>;
  routesetId: InputMaybe<IntWhere>;
  sectionId: InputMaybe<StringWhere>;
  station: InputMaybe<StationWhere>;
};

export type RoutesetMessage = {
  __typename?: 'RoutesetMessage';
  clientSystem: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  messageTime: Scalars['DateTime']['output'];
  routeType: Scalars['String']['output'];
  routesections: Maybe<Array<Maybe<Routesection>>>;
  train: Maybe<Train>;
  version: Scalars['String']['output'];
};


export type RoutesetMessageRoutesectionsArgs = {
  orderBy: InputMaybe<Array<InputMaybe<RoutesectionOrderBy>>>;
  skip: InputMaybe<Scalars['Int']['input']>;
  take: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<RoutesectionWhere>;
};

export type RoutesetMessageCollectionWhere = {
  contains: InputMaybe<RoutesetMessageWhere>;
};

export type RoutesetMessageOrderBy = {
  clientSystem: InputMaybe<OrderDirection>;
  id: InputMaybe<OrderDirection>;
  messageTime: InputMaybe<OrderDirection>;
  routeType: InputMaybe<OrderDirection>;
  train: InputMaybe<TrainOrderBy>;
  version: InputMaybe<OrderDirection>;
};

export type RoutesetMessageWhere = {
  and: InputMaybe<Array<InputMaybe<RoutesetMessageWhere>>>;
  clientSystem: InputMaybe<StringWhere>;
  id: InputMaybe<IntWhere>;
  messageTime: InputMaybe<DateTimeWhere>;
  or: InputMaybe<Array<InputMaybe<RoutesetMessageWhere>>>;
  routeType: InputMaybe<StringWhere>;
  routesections: InputMaybe<RoutesectionCollectionWhere>;
  train: InputMaybe<TrainWhere>;
  version: InputMaybe<StringWhere>;
};

export type Station = {
  __typename?: 'Station';
  countryCode: Scalars['String']['output'];
  location: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  name: Scalars['String']['output'];
  passengerTraffic: Scalars['Boolean']['output'];
  shortCode: Scalars['String']['output'];
  stationMessages: Maybe<Array<Maybe<PassengerInformationMessageStation>>>;
  timeTableRows: Maybe<Array<Maybe<TimeTableRow>>>;
  type: StationType;
  uicCode: Scalars['Int']['output'];
};


export type StationStationMessagesArgs = {
  orderBy: InputMaybe<Array<InputMaybe<PassengerInformationMessageStationOrderBy>>>;
  skip: InputMaybe<Scalars['Int']['input']>;
  take: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<PassengerInformationMessageStationWhere>;
};


export type StationTimeTableRowsArgs = {
  orderBy: InputMaybe<Array<InputMaybe<TimeTableRowOrderBy>>>;
  skip: InputMaybe<Scalars['Int']['input']>;
  take: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<TimeTableRowWhere>;
};

export type StationCollectionWhere = {
  contains: InputMaybe<StationWhere>;
};

export type StationOrderBy = {
  countryCode: InputMaybe<OrderDirection>;
  name: InputMaybe<OrderDirection>;
  passengerTraffic: InputMaybe<OrderDirection>;
  shortCode: InputMaybe<OrderDirection>;
  type: InputMaybe<OrderDirection>;
  uicCode: InputMaybe<OrderDirection>;
};

export enum StationType {
  Station = 'STATION',
  StoppingPoint = 'STOPPING_POINT',
  TurnoutInTheOpenLine = 'TURNOUT_IN_THE_OPEN_LINE'
}

export type StationWhere = {
  and: InputMaybe<Array<InputMaybe<StationWhere>>>;
  countryCode: InputMaybe<StringWhere>;
  name: InputMaybe<StringWhere>;
  or: InputMaybe<Array<InputMaybe<StationWhere>>>;
  passengerTraffic: InputMaybe<BooleanWhere>;
  shortCode: InputMaybe<StringWhere>;
  stationMessages: InputMaybe<PassengerInformationMessageStationCollectionWhere>;
  timeTableRows: InputMaybe<TimeTableRowCollectionWhere>;
  type: InputMaybe<EnumWhere>;
  uicCode: InputMaybe<IntWhere>;
};

export type StringWhere = {
  equals: InputMaybe<Scalars['String']['input']>;
  greaterThan: InputMaybe<Scalars['String']['input']>;
  lessThan: InputMaybe<Scalars['String']['input']>;
  unequals: InputMaybe<Scalars['String']['input']>;
};

export type ThirdCategoryCode = {
  __typename?: 'ThirdCategoryCode';
  code: Scalars['String']['output'];
  description: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  validFrom: Scalars['Date']['output'];
  validTo: Maybe<Scalars['Date']['output']>;
};

export type ThirdCategoryCodeCollectionWhere = {
  contains: InputMaybe<ThirdCategoryCodeWhere>;
};

export type ThirdCategoryCodeOrderBy = {
  code: InputMaybe<OrderDirection>;
  description: InputMaybe<OrderDirection>;
  name: InputMaybe<OrderDirection>;
  validFrom: InputMaybe<OrderDirection>;
  validTo: InputMaybe<OrderDirection>;
};

export type ThirdCategoryCodeWhere = {
  and: InputMaybe<Array<InputMaybe<ThirdCategoryCodeWhere>>>;
  code: InputMaybe<StringWhere>;
  description: InputMaybe<StringWhere>;
  name: InputMaybe<StringWhere>;
  or: InputMaybe<Array<InputMaybe<ThirdCategoryCodeWhere>>>;
  validFrom: InputMaybe<DateWhere>;
  validTo: InputMaybe<DateWhere>;
};

export type TimeTableRow = {
  __typename?: 'TimeTableRow';
  actualTime: Maybe<Scalars['DateTime']['output']>;
  cancelled: Scalars['Boolean']['output'];
  causes: Maybe<Array<Maybe<Cause>>>;
  commercialStop: Maybe<Scalars['Boolean']['output']>;
  commercialTrack: Maybe<Scalars['String']['output']>;
  differenceInMinutes: Maybe<Scalars['Int']['output']>;
  estimateSourceType: Maybe<EstimateSourceType>;
  liveEstimateTime: Maybe<Scalars['DateTime']['output']>;
  scheduledTime: Scalars['DateTime']['output'];
  station: Station;
  train: Train;
  trainStopping: Scalars['Boolean']['output'];
  type: TimeTableRowType;
  unknownDelay: Maybe<Scalars['Boolean']['output']>;
};


export type TimeTableRowCausesArgs = {
  orderBy: InputMaybe<Array<InputMaybe<CauseOrderBy>>>;
  skip: InputMaybe<Scalars['Int']['input']>;
  take: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<CauseWhere>;
};

export type TimeTableRowCollectionWhere = {
  contains: InputMaybe<TimeTableRowWhere>;
};

export type TimeTableRowOrderBy = {
  actualTime: InputMaybe<OrderDirection>;
  cancelled: InputMaybe<OrderDirection>;
  commercialStop: InputMaybe<OrderDirection>;
  commercialTrack: InputMaybe<OrderDirection>;
  differenceInMinutes: InputMaybe<OrderDirection>;
  estimateSourceType: InputMaybe<OrderDirection>;
  liveEstimateTime: InputMaybe<OrderDirection>;
  scheduledTime: InputMaybe<OrderDirection>;
  station: InputMaybe<StationOrderBy>;
  train: InputMaybe<TrainOrderBy>;
  trainStopping: InputMaybe<OrderDirection>;
  type: InputMaybe<OrderDirection>;
  unknownDelay: InputMaybe<OrderDirection>;
};

export enum TimeTableRowType {
  Arrival = 'ARRIVAL',
  Departure = 'DEPARTURE'
}

export type TimeTableRowWhere = {
  actualTime: InputMaybe<DateTimeWhere>;
  and: InputMaybe<Array<InputMaybe<TimeTableRowWhere>>>;
  cancelled: InputMaybe<BooleanWhere>;
  causes: InputMaybe<CauseCollectionWhere>;
  commercialStop: InputMaybe<BooleanWhere>;
  commercialTrack: InputMaybe<StringWhere>;
  differenceInMinutes: InputMaybe<IntWhere>;
  estimateSourceType: InputMaybe<EnumWhere>;
  liveEstimateTime: InputMaybe<DateTimeWhere>;
  or: InputMaybe<Array<InputMaybe<TimeTableRowWhere>>>;
  scheduledTime: InputMaybe<DateTimeWhere>;
  station: InputMaybe<StationWhere>;
  train: InputMaybe<TrainWhere>;
  trainStopping: InputMaybe<BooleanWhere>;
  type: InputMaybe<EnumWhere>;
  unknownDelay: InputMaybe<BooleanWhere>;
};

/** # ENUMS */
export enum TimetableType {
  Adhoc = 'ADHOC',
  Regular = 'REGULAR'
}

export type TrackRange = {
  __typename?: 'TrackRange';
  endKilometres: Scalars['Int']['output'];
  endMetres: Scalars['Int']['output'];
  endTrack: Scalars['String']['output'];
  startKilometres: Scalars['Int']['output'];
  startMetres: Scalars['Int']['output'];
  startTrack: Scalars['String']['output'];
};

export type TrackRangeCollectionWhere = {
  contains: InputMaybe<TrackRangeWhere>;
};

export type TrackRangeOrderBy = {
  endKilometres: InputMaybe<OrderDirection>;
  endMetres: InputMaybe<OrderDirection>;
  endTrack: InputMaybe<OrderDirection>;
  startKilometres: InputMaybe<OrderDirection>;
  startMetres: InputMaybe<OrderDirection>;
  startTrack: InputMaybe<OrderDirection>;
};

export type TrackRangeWhere = {
  and: InputMaybe<Array<InputMaybe<TrackRangeWhere>>>;
  endKilometres: InputMaybe<IntWhere>;
  endMetres: InputMaybe<IntWhere>;
  endTrack: InputMaybe<StringWhere>;
  or: InputMaybe<Array<InputMaybe<TrackRangeWhere>>>;
  startKilometres: InputMaybe<IntWhere>;
  startMetres: InputMaybe<IntWhere>;
  startTrack: InputMaybe<StringWhere>;
};

export type TrackSection = {
  __typename?: 'TrackSection';
  id: Scalars['Int']['output'];
  ranges: Array<Maybe<TrackRange>>;
  station: Maybe<Station>;
  stationShortCode: Scalars['String']['output'];
  trackSectionCode: Scalars['String']['output'];
};

export type TrackSectionCollectionWhere = {
  contains: InputMaybe<TrackSectionWhere>;
};

export type TrackSectionOrderBy = {
  id: InputMaybe<OrderDirection>;
  station: InputMaybe<StationOrderBy>;
  stationShortCode: InputMaybe<OrderDirection>;
  trackSectionCode: InputMaybe<OrderDirection>;
};

export type TrackSectionWhere = {
  and: InputMaybe<Array<InputMaybe<TrackSectionWhere>>>;
  id: InputMaybe<IntWhere>;
  or: InputMaybe<Array<InputMaybe<TrackSectionWhere>>>;
  station: InputMaybe<StationWhere>;
  stationShortCode: InputMaybe<StringWhere>;
  trackSectionCode: InputMaybe<StringWhere>;
};

export type Train = {
  __typename?: 'Train';
  cancelled: Scalars['Boolean']['output'];
  commuterLineid: Maybe<Scalars['String']['output']>;
  compositions: Maybe<Array<Maybe<Composition>>>;
  deleted: Maybe<Scalars['Boolean']['output']>;
  departureDate: Scalars['Date']['output'];
  operator: Operator;
  passengerInformationMessages: Maybe<Array<Maybe<PassengerInformationMessage>>>;
  routesetMessages: Maybe<Array<Maybe<RoutesetMessage>>>;
  runningCurrently: Scalars['Boolean']['output'];
  timeTableRows: Maybe<Array<Maybe<TimeTableRow>>>;
  timetableAcceptanceDate: Scalars['DateTime']['output'];
  timetableType: TimetableType;
  trainLocations: Maybe<Array<Maybe<TrainLocation>>>;
  trainNumber: Scalars['Int']['output'];
  trainTrackingMessages: Maybe<Array<Maybe<TrainTrackingMessage>>>;
  trainType: TrainType;
  /**  Represents the version number of a train. Will be parsed as a number in where clauses. */
  version: Scalars['String']['output'];
};


export type TrainCompositionsArgs = {
  orderBy: InputMaybe<Array<InputMaybe<CompositionOrderBy>>>;
  skip: InputMaybe<Scalars['Int']['input']>;
  take: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<CompositionWhere>;
};


export type TrainPassengerInformationMessagesArgs = {
  orderBy: InputMaybe<Array<InputMaybe<PassengerInformationMessageOrderBy>>>;
  skip: InputMaybe<Scalars['Int']['input']>;
  take: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<PassengerInformationMessageWhere>;
};


export type TrainRoutesetMessagesArgs = {
  orderBy: InputMaybe<Array<InputMaybe<RoutesetMessageOrderBy>>>;
  skip: InputMaybe<Scalars['Int']['input']>;
  take: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<RoutesetMessageWhere>;
};


export type TrainTimeTableRowsArgs = {
  orderBy: InputMaybe<Array<InputMaybe<TimeTableRowOrderBy>>>;
  skip: InputMaybe<Scalars['Int']['input']>;
  take: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<TimeTableRowWhere>;
};


export type TrainTrainLocationsArgs = {
  orderBy: InputMaybe<Array<InputMaybe<TrainLocationOrderBy>>>;
  skip: InputMaybe<Scalars['Int']['input']>;
  take: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<TrainLocationWhere>;
};


export type TrainTrainTrackingMessagesArgs = {
  orderBy: InputMaybe<Array<InputMaybe<TrainTrackingMessageOrderBy>>>;
  skip: InputMaybe<Scalars['Int']['input']>;
  take: InputMaybe<Scalars['Int']['input']>;
  where: InputMaybe<TrainTrackingMessageWhere>;
};

export type TrainCategory = {
  __typename?: 'TrainCategory';
  name: Scalars['String']['output'];
};

export type TrainCategoryCollectionWhere = {
  contains: InputMaybe<TrainCategoryWhere>;
};

export type TrainCategoryOrderBy = {
  name: InputMaybe<OrderDirection>;
};

export type TrainCategoryWhere = {
  and: InputMaybe<Array<InputMaybe<TrainCategoryWhere>>>;
  name: InputMaybe<StringWhere>;
  or: InputMaybe<Array<InputMaybe<TrainCategoryWhere>>>;
};

export type TrainCollectionWhere = {
  contains: InputMaybe<TrainWhere>;
};

export type TrainLocation = {
  __typename?: 'TrainLocation';
  accuracy: Maybe<Scalars['Int']['output']>;
  location: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  speed: Scalars['Int']['output'];
  timestamp: Scalars['DateTime']['output'];
  train: Maybe<Train>;
};

export type TrainLocationCollectionWhere = {
  contains: InputMaybe<TrainLocationWhere>;
};

export type TrainLocationOrderBy = {
  accuracy: InputMaybe<OrderDirection>;
  speed: InputMaybe<OrderDirection>;
  timestamp: InputMaybe<OrderDirection>;
  train: InputMaybe<TrainOrderBy>;
};

export type TrainLocationWhere = {
  accuracy: InputMaybe<IntWhere>;
  and: InputMaybe<Array<InputMaybe<TrainLocationWhere>>>;
  or: InputMaybe<Array<InputMaybe<TrainLocationWhere>>>;
  speed: InputMaybe<IntWhere>;
  timestamp: InputMaybe<DateTimeWhere>;
  train: InputMaybe<TrainWhere>;
};

export type TrainOrderBy = {
  cancelled: InputMaybe<OrderDirection>;
  commuterLineid: InputMaybe<OrderDirection>;
  deleted: InputMaybe<OrderDirection>;
  departureDate: InputMaybe<OrderDirection>;
  operator: InputMaybe<OperatorOrderBy>;
  runningCurrently: InputMaybe<OrderDirection>;
  timetableAcceptanceDate: InputMaybe<OrderDirection>;
  timetableType: InputMaybe<OrderDirection>;
  trainNumber: InputMaybe<OrderDirection>;
  trainType: InputMaybe<TrainTypeOrderBy>;
  version: InputMaybe<OrderDirection>;
};

export type TrainTrackingMessage = {
  __typename?: 'TrainTrackingMessage';
  id: Scalars['Int']['output'];
  nextStation: Maybe<Station>;
  nextTrackSectionCode: Maybe<Scalars['String']['output']>;
  previousStation: Maybe<Station>;
  previousTrackSectionCode: Maybe<Scalars['String']['output']>;
  station: Station;
  timestamp: Scalars['DateTime']['output'];
  trackSection: Maybe<TrackSection>;
  trackSectionCode: Scalars['String']['output'];
  train: Maybe<Train>;
  type: TrainTrackingMessageType;
  version: Scalars['String']['output'];
};

export type TrainTrackingMessageCollectionWhere = {
  contains: InputMaybe<TrainTrackingMessageWhere>;
};

export type TrainTrackingMessageOrderBy = {
  id: InputMaybe<OrderDirection>;
  nextStation: InputMaybe<StationOrderBy>;
  nextTrackSectionCode: InputMaybe<OrderDirection>;
  previousStation: InputMaybe<StationOrderBy>;
  previousTrackSectionCode: InputMaybe<OrderDirection>;
  station: InputMaybe<StationOrderBy>;
  timestamp: InputMaybe<OrderDirection>;
  trackSection: InputMaybe<TrackSectionOrderBy>;
  trackSectionCode: InputMaybe<OrderDirection>;
  train: InputMaybe<TrainOrderBy>;
  type: InputMaybe<OrderDirection>;
  version: InputMaybe<OrderDirection>;
};

export enum TrainTrackingMessageType {
  Occupy = 'OCCUPY',
  Release = 'RELEASE'
}

export type TrainTrackingMessageWhere = {
  and: InputMaybe<Array<InputMaybe<TrainTrackingMessageWhere>>>;
  id: InputMaybe<IntWhere>;
  nextStation: InputMaybe<StationWhere>;
  nextTrackSectionCode: InputMaybe<StringWhere>;
  or: InputMaybe<Array<InputMaybe<TrainTrackingMessageWhere>>>;
  previousStation: InputMaybe<StationWhere>;
  previousTrackSectionCode: InputMaybe<StringWhere>;
  station: InputMaybe<StationWhere>;
  timestamp: InputMaybe<DateTimeWhere>;
  trackSection: InputMaybe<TrackSectionWhere>;
  trackSectionCode: InputMaybe<StringWhere>;
  train: InputMaybe<TrainWhere>;
  type: InputMaybe<EnumWhere>;
  version: InputMaybe<StringWhere>;
};

export type TrainType = {
  __typename?: 'TrainType';
  name: Scalars['String']['output'];
  trainCategory: TrainCategory;
};

export type TrainTypeCollectionWhere = {
  contains: InputMaybe<TrainTypeWhere>;
};

export type TrainTypeOrderBy = {
  name: InputMaybe<OrderDirection>;
  trainCategory: InputMaybe<TrainCategoryOrderBy>;
};

export type TrainTypeWhere = {
  and: InputMaybe<Array<InputMaybe<TrainTypeWhere>>>;
  name: InputMaybe<StringWhere>;
  or: InputMaybe<Array<InputMaybe<TrainTypeWhere>>>;
  trainCategory: InputMaybe<TrainCategoryWhere>;
};

export type TrainWhere = {
  and: InputMaybe<Array<InputMaybe<TrainWhere>>>;
  cancelled: InputMaybe<BooleanWhere>;
  commuterLineid: InputMaybe<StringWhere>;
  compositions: InputMaybe<CompositionCollectionWhere>;
  deleted: InputMaybe<BooleanWhere>;
  departureDate: InputMaybe<DateWhere>;
  operator: InputMaybe<OperatorWhere>;
  or: InputMaybe<Array<InputMaybe<TrainWhere>>>;
  passengerInformationMessages: InputMaybe<PassengerInformationMessageCollectionWhere>;
  routesetMessages: InputMaybe<RoutesetMessageCollectionWhere>;
  runningCurrently: InputMaybe<BooleanWhere>;
  timeTableRows: InputMaybe<TimeTableRowCollectionWhere>;
  timetableAcceptanceDate: InputMaybe<DateTimeWhere>;
  timetableType: InputMaybe<EnumWhere>;
  trainLocations: InputMaybe<TrainLocationCollectionWhere>;
  trainNumber: InputMaybe<IntWhere>;
  trainTrackingMessages: InputMaybe<TrainTrackingMessageCollectionWhere>;
  trainType: InputMaybe<TrainTypeWhere>;
  version: InputMaybe<StringWhere>;
};

export type VersionWhere = {
  equals: InputMaybe<Scalars['String']['input']>;
  greaterThan: InputMaybe<Scalars['String']['input']>;
  lessThan: InputMaybe<Scalars['String']['input']>;
  unequals: InputMaybe<Scalars['String']['input']>;
};

export type Wagon = {
  __typename?: 'Wagon';
  catering: Maybe<Scalars['Boolean']['output']>;
  disabled: Maybe<Scalars['Boolean']['output']>;
  length: Scalars['Int']['output'];
  location: Scalars['Int']['output'];
  luggage: Maybe<Scalars['Boolean']['output']>;
  pet: Maybe<Scalars['Boolean']['output']>;
  playground: Maybe<Scalars['Boolean']['output']>;
  salesNumber: Scalars['Int']['output'];
  smoking: Maybe<Scalars['Boolean']['output']>;
  vehicleNumber: Maybe<Scalars['String']['output']>;
  video: Maybe<Scalars['Boolean']['output']>;
  wagonType: Maybe<Scalars['String']['output']>;
};

export type WagonCollectionWhere = {
  contains: InputMaybe<WagonWhere>;
};

export type WagonOrderBy = {
  catering: InputMaybe<OrderDirection>;
  disabled: InputMaybe<OrderDirection>;
  length: InputMaybe<OrderDirection>;
  location: InputMaybe<OrderDirection>;
  luggage: InputMaybe<OrderDirection>;
  pet: InputMaybe<OrderDirection>;
  playground: InputMaybe<OrderDirection>;
  salesNumber: InputMaybe<OrderDirection>;
  smoking: InputMaybe<OrderDirection>;
  vehicleNumber: InputMaybe<OrderDirection>;
  video: InputMaybe<OrderDirection>;
  wagonType: InputMaybe<OrderDirection>;
};

export type WagonWhere = {
  and: InputMaybe<Array<InputMaybe<WagonWhere>>>;
  catering: InputMaybe<BooleanWhere>;
  disabled: InputMaybe<BooleanWhere>;
  length: InputMaybe<IntWhere>;
  location: InputMaybe<IntWhere>;
  luggage: InputMaybe<BooleanWhere>;
  or: InputMaybe<Array<InputMaybe<WagonWhere>>>;
  pet: InputMaybe<BooleanWhere>;
  playground: InputMaybe<BooleanWhere>;
  salesNumber: InputMaybe<IntWhere>;
  smoking: InputMaybe<BooleanWhere>;
  vehicleNumber: InputMaybe<StringWhere>;
  video: InputMaybe<BooleanWhere>;
  wagonType: InputMaybe<StringWhere>;
};

export type LiveTrainFragment = { __typename?: 'Train', commuterLineid: string | null, version: string, trainNumber: number, departureDate: string, cancelled: boolean, trainType: { __typename?: 'TrainType', name: string }, timeTableRows: Array<{ __typename?: 'TimeTableRow', commercialTrack: string | null, commercialStop: boolean | null, scheduledTime: string, type: TimeTableRowType, cancelled: boolean, liveEstimateTime: string | null, station: { __typename?: 'Station', shortCode: string, passengerTraffic: boolean } } | null> | null, compositions: Array<{ __typename?: 'Composition', journeySections: Array<{ __typename?: 'JourneySection', startTimeTableRow: { __typename?: 'TimeTableRow', station: { __typename?: 'Station', shortCode: string, location: Array<number | null> | null } } | null, endTimeTableRow: { __typename?: 'TimeTableRow', station: { __typename?: 'Station', shortCode: string, location: Array<number | null> | null } } | null } | null> | null } | null> | null, operator: { __typename?: 'Operator', uicCode: number, shortCode: string }, trainLocations: Array<{ __typename?: 'TrainLocation', timestamp: string, location: Array<number | null> | null } | null> | null };

export type StationPassengerInfoFragment = { __typename?: 'PassengerInformationMessage', id: string, trainNumber: number | null, startValidity: string, endValidity: string, trainDepartureDate: string | null, video: { __typename?: 'PassengerInformationVideo', text: { __typename?: 'PassengerInformationTextContent', fi: string | null, en: string | null, sv: string | null }, deliveryRules: { __typename?: 'PassengerInformationVideoDeliveryRules', deliveryType: string | null, startDateTime: string | null, endDateTime: string | null, endTime: string | null, startTime: string | null, weekDays: Array<DayOfWeek | null> | null } } | null };

export type SingleTrainFragment = { __typename?: 'Train', commuterLineid: string | null, version: string, trainNumber: number, departureDate: string, cancelled: boolean, trainType: { __typename?: 'TrainType', name: string }, timeTableRows: Array<{ __typename?: 'TimeTableRow', commercialTrack: string | null, commercialStop: boolean | null, scheduledTime: string, type: TimeTableRowType, cancelled: boolean, liveEstimateTime: string | null, station: { __typename?: 'Station', shortCode: string, passengerTraffic: boolean } } | null> | null, compositions: Array<{ __typename?: 'Composition', journeySections: Array<{ __typename?: 'JourneySection', startTimeTableRow: { __typename?: 'TimeTableRow', station: { __typename?: 'Station', shortCode: string, location: Array<number | null> | null } } | null, endTimeTableRow: { __typename?: 'TimeTableRow', station: { __typename?: 'Station', shortCode: string, location: Array<number | null> | null } } | null } | null> | null } | null> | null, operator: { __typename?: 'Operator', uicCode: number, shortCode: string }, trainLocations: Array<{ __typename?: 'TrainLocation', timestamp: string, location: Array<number | null> | null } | null> | null };

export type TrainsQueryVariables = Exact<{
  station: Scalars['String']['input'];
  includeNonStopping?: InputMaybe<Scalars['Boolean']['input']>;
  arrivedTrains?: InputMaybe<Scalars['Int']['input']>;
  arrivingTrains?: InputMaybe<Scalars['Int']['input']>;
  departingTrains?: InputMaybe<Scalars['Int']['input']>;
  departedTrains?: InputMaybe<Scalars['Int']['input']>;
  trainCategories?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
}>;


export type TrainsQuery = { __typename?: 'Query', trainsByStationAndQuantity: Array<{ __typename?: 'Train', commuterLineid: string | null, version: string, trainNumber: number, departureDate: string, cancelled: boolean, trainType: { __typename?: 'TrainType', name: string }, timeTableRows: Array<{ __typename?: 'TimeTableRow', commercialTrack: string | null, commercialStop: boolean | null, scheduledTime: string, type: TimeTableRowType, cancelled: boolean, liveEstimateTime: string | null, station: { __typename?: 'Station', shortCode: string, passengerTraffic: boolean } } | null> | null, compositions: Array<{ __typename?: 'Composition', journeySections: Array<{ __typename?: 'JourneySection', startTimeTableRow: { __typename?: 'TimeTableRow', station: { __typename?: 'Station', shortCode: string, location: Array<number | null> | null } } | null, endTimeTableRow: { __typename?: 'TimeTableRow', station: { __typename?: 'Station', shortCode: string, location: Array<number | null> | null } } | null } | null> | null } | null> | null, operator: { __typename?: 'Operator', uicCode: number, shortCode: string }, trainLocations: Array<{ __typename?: 'TrainLocation', timestamp: string, location: Array<number | null> | null } | null> | null } | null> | null };

export type StationPassengerInfoQueryVariables = Exact<{
  stationShortCode: Scalars['String']['input'];
  onlyGeneral?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type StationPassengerInfoQuery = { __typename?: 'Query', passengerInformationMessagesByStation: Array<{ __typename?: 'PassengerInformationMessage', id: string, trainNumber: number | null, startValidity: string, endValidity: string, trainDepartureDate: string | null, video: { __typename?: 'PassengerInformationVideo', text: { __typename?: 'PassengerInformationTextContent', fi: string | null, en: string | null, sv: string | null }, deliveryRules: { __typename?: 'PassengerInformationVideoDeliveryRules', deliveryType: string | null, startDateTime: string | null, endDateTime: string | null, endTime: string | null, startTime: string | null, weekDays: Array<DayOfWeek | null> | null } } | null } | null> | null };

export type SingleTrainQueryVariables = Exact<{
  departureDate: Scalars['Date']['input'];
  trainNumber: Scalars['Int']['input'];
}>;


export type SingleTrainQuery = { __typename?: 'Query', train: Array<{ __typename?: 'Train', commuterLineid: string | null, version: string, trainNumber: number, departureDate: string, cancelled: boolean, trainType: { __typename?: 'TrainType', name: string }, timeTableRows: Array<{ __typename?: 'TimeTableRow', commercialTrack: string | null, commercialStop: boolean | null, scheduledTime: string, type: TimeTableRowType, cancelled: boolean, liveEstimateTime: string | null, station: { __typename?: 'Station', shortCode: string, passengerTraffic: boolean } } | null> | null, compositions: Array<{ __typename?: 'Composition', journeySections: Array<{ __typename?: 'JourneySection', startTimeTableRow: { __typename?: 'TimeTableRow', station: { __typename?: 'Station', shortCode: string, location: Array<number | null> | null } } | null, endTimeTableRow: { __typename?: 'TimeTableRow', station: { __typename?: 'Station', shortCode: string, location: Array<number | null> | null } } | null } | null> | null } | null> | null, operator: { __typename?: 'Operator', uicCode: number, shortCode: string }, trainLocations: Array<{ __typename?: 'TrainLocation', timestamp: string, location: Array<number | null> | null } | null> | null } | null> | null };

export const LiveTrainFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LiveTrain"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Train"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commuterLineid"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"trainNumber"}},{"kind":"Field","name":{"kind":"Name","value":"departureDate"}},{"kind":"Field","name":{"kind":"Name","value":"cancelled"}},{"kind":"Field","name":{"kind":"Name","value":"trainType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeTableRows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commercialTrack"}},{"kind":"Field","name":{"kind":"Name","value":"commercialStop"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledTime"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"commercialTrack"}},{"kind":"Field","name":{"kind":"Name","value":"cancelled"}},{"kind":"Field","name":{"kind":"Name","value":"liveEstimateTime"}},{"kind":"Field","name":{"kind":"Name","value":"station"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shortCode"}},{"kind":"Field","name":{"kind":"Name","value":"passengerTraffic"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"compositions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"journeySections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startTimeTableRow"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"station"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shortCode"}},{"kind":"Field","name":{"kind":"Name","value":"location"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"endTimeTableRow"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"station"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shortCode"}},{"kind":"Field","name":{"kind":"Name","value":"location"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"operator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uicCode"}},{"kind":"Field","name":{"kind":"Name","value":"shortCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"trainLocations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"timestamp"},"value":{"kind":"EnumValue","value":"DESCENDING"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"location"}}]}}]}}]} as unknown as DocumentNode<LiveTrainFragment, unknown>;
export const StationPassengerInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StationPassengerInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PassengerInformationMessage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"trainNumber"}},{"kind":"Field","name":{"kind":"Name","value":"startValidity"}},{"kind":"Field","name":{"kind":"Name","value":"endValidity"}},{"kind":"Field","name":{"kind":"Name","value":"trainNumber"}},{"kind":"Field","name":{"kind":"Name","value":"trainDepartureDate"}},{"kind":"Field","name":{"kind":"Name","value":"video"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fi"}},{"kind":"Field","name":{"kind":"Name","value":"en"}},{"kind":"Field","name":{"kind":"Name","value":"sv"}}]}},{"kind":"Field","name":{"kind":"Name","value":"deliveryRules"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deliveryType"}},{"kind":"Field","name":{"kind":"Name","value":"startDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"endDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"weekDays"}}]}}]}}]}}]} as unknown as DocumentNode<StationPassengerInfoFragment, unknown>;
export const SingleTrainFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SingleTrain"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Train"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commuterLineid"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"trainNumber"}},{"kind":"Field","name":{"kind":"Name","value":"departureDate"}},{"kind":"Field","name":{"kind":"Name","value":"cancelled"}},{"kind":"Field","name":{"kind":"Name","value":"trainType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeTableRows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commercialTrack"}},{"kind":"Field","name":{"kind":"Name","value":"commercialStop"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledTime"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"commercialTrack"}},{"kind":"Field","name":{"kind":"Name","value":"cancelled"}},{"kind":"Field","name":{"kind":"Name","value":"liveEstimateTime"}},{"kind":"Field","name":{"kind":"Name","value":"station"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shortCode"}},{"kind":"Field","name":{"kind":"Name","value":"passengerTraffic"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"compositions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"journeySections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startTimeTableRow"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"station"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shortCode"}},{"kind":"Field","name":{"kind":"Name","value":"location"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"endTimeTableRow"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"station"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shortCode"}},{"kind":"Field","name":{"kind":"Name","value":"location"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"operator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uicCode"}},{"kind":"Field","name":{"kind":"Name","value":"shortCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"trainLocations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"timestamp"},"value":{"kind":"EnumValue","value":"DESCENDING"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"location"}}]}}]}}]} as unknown as DocumentNode<SingleTrainFragment, unknown>;
export const TrainsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"trains"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"station"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeNonStopping"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":{"kind":"BooleanValue","value":false}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"arrivedTrains"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"arrivingTrains"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"departingTrains"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"departedTrains"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"trainCategories"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"defaultValue":{"kind":"ListValue","values":[{"kind":"StringValue","value":"Commuter","block":false},{"kind":"StringValue","value":"Long-Distance","block":false}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trainsByStationAndQuantity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"arrivedTrains"},"value":{"kind":"Variable","name":{"kind":"Name","value":"arrivedTrains"}}},{"kind":"Argument","name":{"kind":"Name","value":"arrivingTrains"},"value":{"kind":"Variable","name":{"kind":"Name","value":"arrivingTrains"}}},{"kind":"Argument","name":{"kind":"Name","value":"departedTrains"},"value":{"kind":"Variable","name":{"kind":"Name","value":"departedTrains"}}},{"kind":"Argument","name":{"kind":"Name","value":"departingTrains"},"value":{"kind":"Variable","name":{"kind":"Name","value":"departingTrains"}}},{"kind":"Argument","name":{"kind":"Name","value":"includeNonStopping"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeNonStopping"}}},{"kind":"Argument","name":{"kind":"Name","value":"station"},"value":{"kind":"Variable","name":{"kind":"Name","value":"station"}}},{"kind":"Argument","name":{"kind":"Name","value":"trainCategories"},"value":{"kind":"Variable","name":{"kind":"Name","value":"trainCategories"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LiveTrain"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LiveTrain"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Train"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commuterLineid"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"trainNumber"}},{"kind":"Field","name":{"kind":"Name","value":"departureDate"}},{"kind":"Field","name":{"kind":"Name","value":"cancelled"}},{"kind":"Field","name":{"kind":"Name","value":"trainType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeTableRows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commercialTrack"}},{"kind":"Field","name":{"kind":"Name","value":"commercialStop"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledTime"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"commercialTrack"}},{"kind":"Field","name":{"kind":"Name","value":"cancelled"}},{"kind":"Field","name":{"kind":"Name","value":"liveEstimateTime"}},{"kind":"Field","name":{"kind":"Name","value":"station"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shortCode"}},{"kind":"Field","name":{"kind":"Name","value":"passengerTraffic"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"compositions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"journeySections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startTimeTableRow"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"station"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shortCode"}},{"kind":"Field","name":{"kind":"Name","value":"location"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"endTimeTableRow"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"station"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shortCode"}},{"kind":"Field","name":{"kind":"Name","value":"location"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"operator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uicCode"}},{"kind":"Field","name":{"kind":"Name","value":"shortCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"trainLocations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"timestamp"},"value":{"kind":"EnumValue","value":"DESCENDING"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"location"}}]}}]}}]} as unknown as DocumentNode<TrainsQuery, TrainsQueryVariables>;
export const StationPassengerInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"stationPassengerInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stationShortCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"onlyGeneral"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":{"kind":"BooleanValue","value":true}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"passengerInformationMessagesByStation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stationShortCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stationShortCode"}}},{"kind":"Argument","name":{"kind":"Name","value":"onlyGeneral"},"value":{"kind":"Variable","name":{"kind":"Name","value":"onlyGeneral"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StationPassengerInfo"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StationPassengerInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PassengerInformationMessage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"trainNumber"}},{"kind":"Field","name":{"kind":"Name","value":"startValidity"}},{"kind":"Field","name":{"kind":"Name","value":"endValidity"}},{"kind":"Field","name":{"kind":"Name","value":"trainNumber"}},{"kind":"Field","name":{"kind":"Name","value":"trainDepartureDate"}},{"kind":"Field","name":{"kind":"Name","value":"video"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fi"}},{"kind":"Field","name":{"kind":"Name","value":"en"}},{"kind":"Field","name":{"kind":"Name","value":"sv"}}]}},{"kind":"Field","name":{"kind":"Name","value":"deliveryRules"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deliveryType"}},{"kind":"Field","name":{"kind":"Name","value":"startDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"endDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"weekDays"}}]}}]}}]}}]} as unknown as DocumentNode<StationPassengerInfoQuery, StationPassengerInfoQueryVariables>;
export const SingleTrainDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"singleTrain"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"departureDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"trainNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"train"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"departureDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"departureDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"trainNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"trainNumber"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SingleTrain"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SingleTrain"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Train"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commuterLineid"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"trainNumber"}},{"kind":"Field","name":{"kind":"Name","value":"departureDate"}},{"kind":"Field","name":{"kind":"Name","value":"cancelled"}},{"kind":"Field","name":{"kind":"Name","value":"trainType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeTableRows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commercialTrack"}},{"kind":"Field","name":{"kind":"Name","value":"commercialStop"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledTime"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"commercialTrack"}},{"kind":"Field","name":{"kind":"Name","value":"cancelled"}},{"kind":"Field","name":{"kind":"Name","value":"liveEstimateTime"}},{"kind":"Field","name":{"kind":"Name","value":"station"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shortCode"}},{"kind":"Field","name":{"kind":"Name","value":"passengerTraffic"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"compositions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"journeySections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startTimeTableRow"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"station"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shortCode"}},{"kind":"Field","name":{"kind":"Name","value":"location"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"endTimeTableRow"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"station"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shortCode"}},{"kind":"Field","name":{"kind":"Name","value":"location"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"operator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uicCode"}},{"kind":"Field","name":{"kind":"Name","value":"shortCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"trainLocations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"timestamp"},"value":{"kind":"EnumValue","value":"DESCENDING"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"location"}}]}}]}}]} as unknown as DocumentNode<SingleTrainQuery, SingleTrainQueryVariables>;