import type { Locale } from "./index.js";
import { LOCALES } from ".";

type Base = typeof import("./en.json");

type DeepKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? K | `${K}.${DeepKeyOf<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

type DeepValueOf<T, P extends string> = P extends keyof T
  ? T[P]
  : P extends `${infer K}.${infer Rest}`
    ? K extends keyof T
      ? DeepValueOf<T[K], Rest>
      : never
    : never;

/**
 * @returns a function that can be used to get translated values for `locale`
 */
export function translate(
  locale: "all",
): <P extends DeepKeyOf<Base>>(
  path: P,
) => Promise<Record<Locale, DeepValueOf<Base, P>>>;
export function translate(
  locale: Exclude<Locale, "all">,
): <P extends DeepKeyOf<Base>>(path: P) => Promise<DeepValueOf<Base, P>>;
export function translate(locale: Locale | "all") {
  /**
   * By convention all values requiring interpolation are prefixed with $,
   * see `@junat/locales/src/en.json` for whats interpolated. Interpolation happens with the `interpolateString`
   * utility from `@junat/locales/utils`:
   *
   *
   * @example
   *
   * import { interpolateString, translate } from "@junat/locales"
   *
   * // $timetablesFor = "Train schedules for {{ train }}."
   * const timetableDetails = interpolateString(translate("en")("$timetablesFor"), { train: "R train" });
   *
   * console.log(timetableDetails) // -> Train schedules for R train
   *
   */
  return async function depth<P extends DeepKeyOf<Base>>(path: P) {
    const getLocale = async (
      localeName: Omit<Locale, "all"> = locale,
    ): Promise<DeepValueOf<Base, P>> => {
      const json = await import(`@junat/locales/${localeName}.json`);
      return path.split(".").reduce((obj, key) => obj[key], json);
    };

    if (locale === "all") {
      const x = await Promise.all(
        LOCALES.map(async (l) => [l, await getLocale(l)]),
      );

      return Object.fromEntries(x) as Record<Locale, DeepValueOf<Base, P>>;
    }

    return getLocale();
  };
}
