import type { Train } from "@junat/digitraffic/types";

import type { Locale } from "~/types/common";

import "core-js/actual/array/at";
import "core-js/actual/array/to-sorted";

import { translate } from "~/utils/translate";

export type Codes = [
  "AE",
  "HDM",
  "HL",
  "HLV",
  "HSM",
  "HV",
  "IC",
  "LIV",
  "MUS",
  "MUV",
  "MV",
  "P",
  "PAI",
  "PVV",
  "PYO",
  "S",
  "SAA",
  "T",
  "TYO",
  "VET",
  "VEV",
  "VLI",
  "V",
];

export type Code = Codes[number];

interface _Train {
  timeTableRows: {
    stationShortCode: string;
    type: "DEPARTURE" | "ARRIVAL";
    liveEstimateTime?: string;
    scheduledTime: string;
    commercialTrack?: string;
    cancelled: boolean;
    commercialStop?: boolean;
  }[];
  commuterLineID?: string;
  trainNumber: number;
  version: number;
  trainType: string;
  departureDate: string;
}

export const getTrainType = (code: Code, locale: Locale): string => {
  type TrainKeys =
    keyof (typeof import("@junat/locales/en.json"))["trainTypes"];

  const tr = translate(locale);
  const t = (train: TrainKeys) => tr(`trainTypes.${train}`);

  const codes: Record<Code, string> = {
    AE: "Allegro",
    IC: "InterCity",
    PVV: "Tolstoi",
    S: "Pendolino",
    MUV: tr("train"),
    HL: t("commuterTrain"),
    HLV: t("commuterTrain"),
    HDM: t("regionalTrain"),
    HSM: t("regionalTrain"),
    HV: t("multipleUnit"),
    MV: t("multipleUnit"),
    V: t("locomotive"),
    VET: t("locomotive"),
    VEV: t("locomotive"),
    LIV: t("trackInspectionTrolley"),
    MUS: t("museumTrain"),
    P: t("expressTrain"),
    PAI: t("onCallTrain"),
    PYO: t("nightExpressTrain"),
    SAA: t("convoyTrain"),
    T: t("cargoTrain"),
    TYO: t("workTrain"),
    VLI: t("additionalLocomotive"),
  };

  return codes[code] || tr("train");
};

export const toCurrentRows = <
  T extends {
    timeTableRows: {
      stationShortCode: string;
      scheduledTime: string;
      type: string;
    }[];
  },
>(
  stationShortCode: string,
  trains: readonly T[],
  type: "DEPARTURE" | "ARRIVAL",
) => {
  return trains.map((train) => {
    const currentRow = getFutureTimetableRow(
      stationShortCode,
      train.timeTableRows,
      type,
    );

    return Object.assign(train, { timetableRows: [currentRow] });
  });
};

/**
 * Sorts trains by their expected arrival or departure time.
 */
export const sortTrains = <
  T extends {
    timeTableRows: Readonly<
      Pick<
        Train["timeTableRows"][number],
        "scheduledTime" | "liveEstimateTime" | "stationShortCode" | "type"
      >[]
    >;
  },
>(
  trains: Readonly<T[]>,
  stationShortCode: string,
  type: "DEPARTURE" | "ARRIVAL",
) => {
  const byRelativeDate = (a: T, b: T) => {
    const aRow = getFutureTimetableRow(stationShortCode, a.timeTableRows, type);
    const bRow = getFutureTimetableRow(stationShortCode, b.timeTableRows, type);

    if (!(aRow && bRow)) {
      console.error("Reached unreachable code (utils@sortTrains)");
      return 0;
    }

    const aDate = Date.parse(aRow.liveEstimateTime || aRow.scheduledTime);
    const bDate = Date.parse(bRow.liveEstimateTime || bRow.scheduledTime);

    return aDate - bDate;
  };

  return trains
    .filter((t) =>
      getFutureTimetableRow(stationShortCode, t.timeTableRows, type),
    )
    .toSorted(byRelativeDate);
};

/**
 * Some trains might depart multiple times from a station. This function gets the timetable row that is closest to departing.
 */
export const getFutureTimetableRow = <
  T extends {
    stationShortCode: string;
    scheduledTime: string;
    type: string;
  },
>(
  stationShortCode: string,
  timetableRows: readonly T[],
  type: "DEPARTURE" | "ARRIVAL",
): T | undefined => {
  const stationTimetableRows = timetableRows.filter(
    (tr) => tr.stationShortCode === stationShortCode && tr.type === type,
  );

  if (stationTimetableRows.length === 0) {
    return;
  }

  const row =
    stationTimetableRows.find(
      ({ scheduledTime }) => Date.parse(scheduledTime) > Date.now(),
    ) || stationTimetableRows.at(-1);

  const cancelledAndInPast =
    row &&
    Date.parse(row.scheduledTime) < Date.now() &&
    "commercialTrack" in row &&
    row.commercialTrack === "";

  return cancelledAndInPast ? undefined : row;
};

/**
 * From a list of trains return only those whose current time is greater than current date.
 */
export const trainsInFuture = <
  T extends {
    departureDate: string;
    timeTableRows: {
      scheduledTime: string;
      stationShortCode: string;
      type: "ARRIVAL" | "DEPARTURE";
    }[];
  },
>(
  newTrains: T[],
  stationShortCode: string,
  type: "ARRIVAL" | "DEPARTURE",
) => {
  return newTrains.filter((train) => {
    const timetableRow = getFutureTimetableRow(
      stationShortCode,
      train.timeTableRows,
      type,
    );

    if (!timetableRow) {
      return false;
    }

    return Date.parse(timetableRow.scheduledTime) > Date.now();
  });
};

export const getNewTrains = <T extends _Train>(
  trains: T[],
  updatedTrain: T,
  stationShortCode: string,
  type: "ARRIVAL" | "DEPARTURE",
) => {
  return trains.map((train) => {
    const updated = getFutureTimetableRow(
      stationShortCode,
      updatedTrain.timeTableRows,
      type,
    );
    const original = getFutureTimetableRow(
      stationShortCode,
      train.timeTableRows,
      type,
    );

    const sameTrainNumber = train.trainNumber === updatedTrain.trainNumber;

    const sameScheduledTime =
      original?.scheduledTime === updated?.scheduledTime;

    if (sameTrainNumber && sameScheduledTime) {
      return { ...train, ...updatedTrain };
    }

    return train;
  });
};
