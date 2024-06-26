import type { Locale } from "./index.js";
import { LOCALES } from ".";

type Base = typeof import("./en.json");
type Rcrd = Record<string, unknown>;

/**
 * @returns a function that can be used to get translated values for `locale`
 */
export const translate = (locale: Locale | "all") => {
  /**
   * By convention all values requiring interpolation are prefixed with $,
   * see `@junat/locales/src/en.json` for whats interpolated. Interpolation happens with the `interpolateString`
   * utility from `@junat/locales/utils`:
   *
   *
   * @example
   * ```ts
   * import { interpolateString, translate } from "@junat/locales"
   *
   * // $timetablesFor = "Train schedules for {{ train }}."
   * const timetableDetails = interpolateString(translate("en")("$timetablesFor"), { train: "R train" });
   *
   * console.log(timetableDetails) // -> Train schedules for R train
   * ```
   */
  return function depth<
    Key extends keyof Base,
    D1 extends Base[Key] extends Rcrd ? keyof Base[Key] : never,
    D2 extends Base[Key][D1] extends Rcrd
      ? Base[Key][D1] extends Rcrd
        ? keyof Base[Key][D1]
        : never
      : never,
  >(key: Key, depth1?: D1, depth2?: D2) {
    const getLocale = (localeName: string = locale) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires, unicorn/prefer-module
      const json = require(`@junat/locales/${localeName}.json`);

      if (depth2) {
        return json[key][depth1][depth2];
      }

      return depth1 ? json[key][depth1] : json[key];
    };

    if (locale === "all") {
      return Object.fromEntries(LOCALES.map((l) => [l, getLocale(l)]));
    }

    return getLocale();
  };
};
