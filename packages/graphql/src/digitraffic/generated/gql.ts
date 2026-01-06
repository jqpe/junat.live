/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  fragment LiveTrain on Train {\n    commuterLineid\n    version\n    trainNumber\n    departureDate\n    cancelled\n    trainType {\n      name\n    }\n    timeTableRows {\n      ...Row\n    }\n  }\n": typeof types.LiveTrainFragmentDoc,
    "\n  fragment TrainLocation on TrainLocation {\n    speed\n    accuracy\n    timestamp\n    location\n    train {\n      trainNumber\n      trainType {\n        name\n      }\n      operator {\n        uicCode\n      }\n      commuterLineId: commuterLineid\n      compositions {\n        journeySections {\n          startTimeTableRow {\n            station {\n              shortCode\n            }\n          }\n          endTimeTableRow {\n            station {\n              shortCode\n            }\n          }\n        }\n      }\n    }\n  }\n": typeof types.TrainLocationFragmentDoc,
    "\n  fragment Row on TimeTableRow {\n    commercialTrack\n    commercialStop\n    scheduledTime\n    type\n    commercialTrack\n    cancelled\n    liveEstimateTime\n    actualTime\n    station {\n      shortCode\n    }\n  }\n": typeof types.RowFragmentDoc,
    "\n  fragment SingleTrain on Train {\n    commuterLineid\n    version\n    trainNumber\n    departureDate\n    cancelled\n    trainType {\n      name\n    }\n    timeTableRows {\n      ...Row\n    }\n  }\n": typeof types.SingleTrainFragmentDoc,
    "\n  query trains(\n    $station: String!\n    $includeNonStopping: Boolean = false\n    $arrivedTrains: Int = 0\n    $arrivingTrains: Int = 0\n    $departingTrains: Int = 0\n    $departedTrains: Int = 0\n    $trainCategories: [String] = [\"Commuter\", \"Long-Distance\"]\n  ) {\n    trainsByStationAndQuantity(\n      arrivedTrains: $arrivedTrains\n      arrivingTrains: $arrivingTrains\n      departedTrains: $departedTrains\n      departingTrains: $departingTrains\n      includeNonStopping: $includeNonStopping\n      station: $station\n      trainCategories: $trainCategories\n    ) {\n      ...LiveTrain\n    }\n  }\n": typeof types.TrainsDocument,
    "\n  query location {\n    latestTrainLocations(\n      where: {\n        train: {\n          runningCurrently: { equals: true }\n          trainType: {\n            trainCategory: {\n              or: [\n                { name: { equals: \"Commuter\" } }\n                { name: { equals: \"Long-distance\" } }\n              ]\n            }\n          }\n        }\n      }\n    ) {\n      ...TrainLocation\n    }\n  }\n": typeof types.LocationDocument,
    "\n  query singleTrain($departureDate: Date!, $trainNumber: Int!) {\n    train(departureDate: $departureDate, trainNumber: $trainNumber) {\n      ...SingleTrain\n    }\n  }\n": typeof types.SingleTrainDocument,
};
const documents: Documents = {
    "\n  fragment LiveTrain on Train {\n    commuterLineid\n    version\n    trainNumber\n    departureDate\n    cancelled\n    trainType {\n      name\n    }\n    timeTableRows {\n      ...Row\n    }\n  }\n": types.LiveTrainFragmentDoc,
    "\n  fragment TrainLocation on TrainLocation {\n    speed\n    accuracy\n    timestamp\n    location\n    train {\n      trainNumber\n      trainType {\n        name\n      }\n      operator {\n        uicCode\n      }\n      commuterLineId: commuterLineid\n      compositions {\n        journeySections {\n          startTimeTableRow {\n            station {\n              shortCode\n            }\n          }\n          endTimeTableRow {\n            station {\n              shortCode\n            }\n          }\n        }\n      }\n    }\n  }\n": types.TrainLocationFragmentDoc,
    "\n  fragment Row on TimeTableRow {\n    commercialTrack\n    commercialStop\n    scheduledTime\n    type\n    commercialTrack\n    cancelled\n    liveEstimateTime\n    actualTime\n    station {\n      shortCode\n    }\n  }\n": types.RowFragmentDoc,
    "\n  fragment SingleTrain on Train {\n    commuterLineid\n    version\n    trainNumber\n    departureDate\n    cancelled\n    trainType {\n      name\n    }\n    timeTableRows {\n      ...Row\n    }\n  }\n": types.SingleTrainFragmentDoc,
    "\n  query trains(\n    $station: String!\n    $includeNonStopping: Boolean = false\n    $arrivedTrains: Int = 0\n    $arrivingTrains: Int = 0\n    $departingTrains: Int = 0\n    $departedTrains: Int = 0\n    $trainCategories: [String] = [\"Commuter\", \"Long-Distance\"]\n  ) {\n    trainsByStationAndQuantity(\n      arrivedTrains: $arrivedTrains\n      arrivingTrains: $arrivingTrains\n      departedTrains: $departedTrains\n      departingTrains: $departingTrains\n      includeNonStopping: $includeNonStopping\n      station: $station\n      trainCategories: $trainCategories\n    ) {\n      ...LiveTrain\n    }\n  }\n": types.TrainsDocument,
    "\n  query location {\n    latestTrainLocations(\n      where: {\n        train: {\n          runningCurrently: { equals: true }\n          trainType: {\n            trainCategory: {\n              or: [\n                { name: { equals: \"Commuter\" } }\n                { name: { equals: \"Long-distance\" } }\n              ]\n            }\n          }\n        }\n      }\n    ) {\n      ...TrainLocation\n    }\n  }\n": types.LocationDocument,
    "\n  query singleTrain($departureDate: Date!, $trainNumber: Int!) {\n    train(departureDate: $departureDate, trainNumber: $trainNumber) {\n      ...SingleTrain\n    }\n  }\n": types.SingleTrainDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment LiveTrain on Train {\n    commuterLineid\n    version\n    trainNumber\n    departureDate\n    cancelled\n    trainType {\n      name\n    }\n    timeTableRows {\n      ...Row\n    }\n  }\n"): (typeof documents)["\n  fragment LiveTrain on Train {\n    commuterLineid\n    version\n    trainNumber\n    departureDate\n    cancelled\n    trainType {\n      name\n    }\n    timeTableRows {\n      ...Row\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TrainLocation on TrainLocation {\n    speed\n    accuracy\n    timestamp\n    location\n    train {\n      trainNumber\n      trainType {\n        name\n      }\n      operator {\n        uicCode\n      }\n      commuterLineId: commuterLineid\n      compositions {\n        journeySections {\n          startTimeTableRow {\n            station {\n              shortCode\n            }\n          }\n          endTimeTableRow {\n            station {\n              shortCode\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment TrainLocation on TrainLocation {\n    speed\n    accuracy\n    timestamp\n    location\n    train {\n      trainNumber\n      trainType {\n        name\n      }\n      operator {\n        uicCode\n      }\n      commuterLineId: commuterLineid\n      compositions {\n        journeySections {\n          startTimeTableRow {\n            station {\n              shortCode\n            }\n          }\n          endTimeTableRow {\n            station {\n              shortCode\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment Row on TimeTableRow {\n    commercialTrack\n    commercialStop\n    scheduledTime\n    type\n    commercialTrack\n    cancelled\n    liveEstimateTime\n    actualTime\n    station {\n      shortCode\n    }\n  }\n"): (typeof documents)["\n  fragment Row on TimeTableRow {\n    commercialTrack\n    commercialStop\n    scheduledTime\n    type\n    commercialTrack\n    cancelled\n    liveEstimateTime\n    actualTime\n    station {\n      shortCode\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment SingleTrain on Train {\n    commuterLineid\n    version\n    trainNumber\n    departureDate\n    cancelled\n    trainType {\n      name\n    }\n    timeTableRows {\n      ...Row\n    }\n  }\n"): (typeof documents)["\n  fragment SingleTrain on Train {\n    commuterLineid\n    version\n    trainNumber\n    departureDate\n    cancelled\n    trainType {\n      name\n    }\n    timeTableRows {\n      ...Row\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query trains(\n    $station: String!\n    $includeNonStopping: Boolean = false\n    $arrivedTrains: Int = 0\n    $arrivingTrains: Int = 0\n    $departingTrains: Int = 0\n    $departedTrains: Int = 0\n    $trainCategories: [String] = [\"Commuter\", \"Long-Distance\"]\n  ) {\n    trainsByStationAndQuantity(\n      arrivedTrains: $arrivedTrains\n      arrivingTrains: $arrivingTrains\n      departedTrains: $departedTrains\n      departingTrains: $departingTrains\n      includeNonStopping: $includeNonStopping\n      station: $station\n      trainCategories: $trainCategories\n    ) {\n      ...LiveTrain\n    }\n  }\n"): (typeof documents)["\n  query trains(\n    $station: String!\n    $includeNonStopping: Boolean = false\n    $arrivedTrains: Int = 0\n    $arrivingTrains: Int = 0\n    $departingTrains: Int = 0\n    $departedTrains: Int = 0\n    $trainCategories: [String] = [\"Commuter\", \"Long-Distance\"]\n  ) {\n    trainsByStationAndQuantity(\n      arrivedTrains: $arrivedTrains\n      arrivingTrains: $arrivingTrains\n      departedTrains: $departedTrains\n      departingTrains: $departingTrains\n      includeNonStopping: $includeNonStopping\n      station: $station\n      trainCategories: $trainCategories\n    ) {\n      ...LiveTrain\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query location {\n    latestTrainLocations(\n      where: {\n        train: {\n          runningCurrently: { equals: true }\n          trainType: {\n            trainCategory: {\n              or: [\n                { name: { equals: \"Commuter\" } }\n                { name: { equals: \"Long-distance\" } }\n              ]\n            }\n          }\n        }\n      }\n    ) {\n      ...TrainLocation\n    }\n  }\n"): (typeof documents)["\n  query location {\n    latestTrainLocations(\n      where: {\n        train: {\n          runningCurrently: { equals: true }\n          trainType: {\n            trainCategory: {\n              or: [\n                { name: { equals: \"Commuter\" } }\n                { name: { equals: \"Long-distance\" } }\n              ]\n            }\n          }\n        }\n      }\n    ) {\n      ...TrainLocation\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query singleTrain($departureDate: Date!, $trainNumber: Int!) {\n    train(departureDate: $departureDate, trainNumber: $trainNumber) {\n      ...SingleTrain\n    }\n  }\n"): (typeof documents)["\n  query singleTrain($departureDate: Date!, $trainNumber: Int!) {\n    train(departureDate: $departureDate, trainNumber: $trainNumber) {\n      ...SingleTrain\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;