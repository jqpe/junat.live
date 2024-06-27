import type { Router } from "next/router";
import type { ReactNode } from "react";
import React, { useContext } from "react";

import type { Locale } from "~/types/common";
import { getLocale } from "~/utils/get_locale";
import { translate } from "~/utils/translate";

interface LocaleProviderProps {
  locale: Router["locale"];
  children: ReactNode | ReactNode[];
}

export const LocaleProvider = (props: LocaleProviderProps) => {
  const locale = getLocale(props.locale);

  return (
    <LocaleContext.Provider value={{ locale }}>
      {props.children}
    </LocaleContext.Provider>
  );
};

export function useTranslations() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new TypeError("useTranslations must be used inside LocaleProvider!");
  }

  return translate(context.locale);
}

export function useMessages() {
  return translate("all");
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new TypeError("useTranslations must be used inside LocaleProvider!");
  }

  return context.locale;
}

/**
 * @private
 */
const LocaleContext = React.createContext({ locale: "fi" as Locale });
