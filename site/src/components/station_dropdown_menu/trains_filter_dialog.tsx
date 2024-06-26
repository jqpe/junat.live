import React from "react";
import { Combobox } from "@headlessui/react";
import { Formik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import Fuse from "fuse.js";

import { translate } from "@junat/locales";

import type { LocalizedStation } from "~/lib/digitraffic";
import type { Locale } from "~/types/common";
import { useStationFilters } from "~/hooks/use_filters";
import { useStationPage } from "~/hooks/use_station_page";
import { useTimetableType } from "~/hooks/use_timetable_type";
import { useStations } from "~/lib/digitraffic";
import { Dialog } from "../dialog";
import { Form } from "../form";
import { Label } from "../label";
import { PrimaryButton } from "../primary_button";
import { TimetableTypeRadio } from "./timetable_type_radio";

type Props = {
  locale: Locale;
  currentStation: string;
  onSubmit: (values: { destination: string }) => void;
};

export const TrainsFilterDialog = (props: Props) => {
  const { locale, currentStation } = props;
  const timetableTypeRadio = React.useId();

  const { data: stations = [] } = useStations();
  const [selectedStation, setSelectedStation] =
    React.useState<LocalizedStation>();
  const [query, setQuery] = React.useState("");
  const fuse = new Fuse(
    stations.filter((station) => station.stationShortCode !== currentStation),
    {
      keys: [`stationName.${locale}`],
      threshold: 0.3,
    },
  );
  const t = translate(locale);

  const currentShortCode = useStationPage((state) => state.currentShortCode);
  const filters = useStationFilters(currentShortCode);

  const timetableType = useTimetableType((state) => state.actions);

  const filteredStations =
    query === ""
      ? []
      : fuse.search(query, { limit: 1 }).map((result) => result.item);

  const initialValues = {
    destination: selectedStation?.stationShortCode ?? "",
    timetableType: "DEPARTURE" as "ARRIVAL" | "DEPARTURE",
  };

  return (
    <Dialog
      fixModal
      // Allows browsers to adjust dialog to visible viewport when using virtual keyboard.
      onOpenAutoFocus={(event) => event.preventDefault()}
      title={t("filterTrains")}
      description={t("filterTrainsDescription")}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          filters.setDestination(values.destination);

          timetableType.setType(values.timetableType);

          // Reset virtual keyboard scroll
          window.scrollTo(0, 0);

          props.onSubmit({ destination: values.destination });
        }}
      >
        {(props) => {
          const currentStationLocalized = stations.find(
            (station) => station.stationShortCode === currentStation,
          )?.stationName[locale];

          const targetStationLocalized = stations.find(
            (station) =>
              station.stationShortCode === selectedStation?.stationShortCode,
          )?.stationName[locale];

          return (
            <Form className="flex flex-col items-start max-w-[100%]">
              <Label htmlFor="destination">{t("station")}</Label>
              <div className="min-h-[56px] w-full">
                <Combobox
                  nullable
                  value={selectedStation ?? null}
                  onChange={(station) => {
                    setSelectedStation(station ?? undefined);

                    props.setFieldValue(
                      "destination",
                      station?.stationShortCode ?? "",
                    );
                  }}
                >
                  <Combobox.Input
                    onFocus={(event) => {
                      event.currentTarget.select();
                    }}
                    // Allow submitting form even if destination is empty.
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && query === "") {
                        props.setFieldValue("destination", "");
                        props.submitForm();
                      }
                    }}
                    className="w-full relative text-[1rem] border-b-[1px] border-b-gray-200 dark:border-b-gray-700 focus-visible:border-blue-500"
                    autoComplete="off"
                    autoCorrect="off"
                    id="destination"
                    name="destination"
                    onChange={(event) => setQuery(event.target.value)}
                    displayValue={(station: typeof selectedStation) =>
                      station?.stationName[locale] ?? ""
                    }
                  />
                  <Combobox.Options>
                    {filteredStations.map((station) => (
                      <Combobox.Option
                        key={station.stationShortCode}
                        value={station}
                      >
                        {station.stationName[locale]}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                </Combobox>
              </div>

              <AnimatePresence>
                {currentStationLocalized && targetStationLocalized && (
                  <motion.div
                    className="mt-2"
                    initial={{ opacity: 0, translateY: 4 }}
                    animate={{ opacity: 1, translateY: 0 }}
                  >
                    <Label htmlFor={timetableTypeRadio}>{t("trains")}</Label>
                    <TimetableTypeRadio
                      targetStation={targetStationLocalized}
                      currentStation={currentStationLocalized}
                      id={timetableTypeRadio}
                      onValueChange={(type) => {
                        props.setFieldValue("timetableType", type);
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-2 self-end">
                <PrimaryButton type="submit">
                  {t("buttons", "applyFilters")}
                </PrimaryButton>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Dialog>
  );
};
