import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LOCALES } from "../src";
import { translate } from "../src/utils";

describe("translate function", () => {
  beforeEach(() => {
    vi.mock("@junat/locales/en.json", () => ({
      searchForStation: "Search for a station",
      locale: "English",
      cancelled: "Cancelled",
      train: "Train",
      destination: "Destination",
      departureTime: "Departure time",
      track: "Track",
      loading: "Loading...",
      or: "or",
      today: "today",
    }));
    vi.mock("@junat/locales/fi.json", () => ({
      searchForStation: "Etsi asemaa",
      locale: "Suomi",
      cancelled: "Peruttu",
      train: "Juna",
      destination: "Määränpää",
      departureTime: "Lähtöaika",
      track: "Raide",
      loading: "Ladataan...",
      or: "tai",
      today: "tänään",
    }));
    vi.mock("@junat/locales/sv.json", () => ({
      searchForStation: "Sök efter en station",
      locale: "Svenska",
      cancelled: "Inställd",
      train: "Tåg",
      destination: "Destination",
      departureTime: "Avgångstid",
      track: "Spår",
      loading: "Laddar...",
      or: "eller",
      today: "idag",
    }));
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("returns a function when called with a locale", () => {
    const t = translate("en");
    expect(typeof t).toBe("function");
  });

  it("returns correct translation for a simple key", async () => {
    const t = translate("en");
    const result = await t("searchForStation");
    expect(result).toBe("Search for a station");
  });

  it("returns correct translation for another key", async () => {
    const t = translate("fi");
    const result = await t("cancelled");
    expect(result).toBe("Peruttu");
  });

  it('returns translations for all locales when called with "all"', async () => {
    const t = translate("all");
    const result = await t("train");
    expect(result).toEqual({
      en: "Train",
      fi: "Juna",
      sv: "Tåg",
    });
  });

  it("returns translations for all locales with another key", async () => {
    const t = translate("all");
    const result = await t("or");
    expect(result).toEqual({
      en: "or",
      fi: "tai",
      sv: "eller",
    });
  });

  it("throws an error for non-existent key", async () => {
    const t = translate("en");
    await expect(t("nonexistent" as never)).rejects.toThrow();
  });

  it("handles all defined locales", async () => {
    const allTranslator = translate("all");
    const result = await allTranslator("today");
    expect(Object.keys(result)).toEqual(LOCALES);
  });
});
