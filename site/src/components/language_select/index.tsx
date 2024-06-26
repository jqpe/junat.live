import type { NextRouter } from "next/router";

import { translate } from "@junat/locales";

import Globe from "~/components/icons/globe.svg";
import { Select } from "~/components/select";
import { useStationPage } from "~/hooks/use_station_page";
import { getLocale } from "~/utils/get_locale";
import { handleValueChange } from "./helpers";

export function LanguageSelect({
  router,
  stations,
}: {
  router: NextRouter;
  stations: Parameters<typeof handleValueChange>[0]["stations"];
}) {
  const currentShortCode = useStationPage((state) => state.currentShortCode);

  const locale = getLocale(router.locale);

  return (
    <Select
      Icon={<Globe className="fill-gray-200" />}
      items={translate("all")("locale")}
      defaultValue={router.locale}
      label={translate(locale)("changeLanguage")}
      onValueChange={(value) => {
        handleValueChange({ currentShortCode, router, stations, value });
      }}
    />
  );
}

export default LanguageSelect;
