export type Locales = readonly ["fi", "en", "sv"];
export type Locale = Locales[number];

export const LOCALES = ["fi", "en", "sv"] as const satisfies Locales;

export * from "./utils.js";
