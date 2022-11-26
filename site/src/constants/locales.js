// @ts-check

/**
 * @type {readonly ["fi", "en", "sv"]}
 */
export const LOCALES = ['fi', 'en', 'sv']

/**
 * @type {Record<typeof LOCALES[number], Record<import("@typings/common").Routes, string>>}
 */
export const ROUTES = {
  fi: {
    train: 'juna'
  },
  en: {
    train: 'train'
  },
  sv: {
    train: 'tog'
  }
}
