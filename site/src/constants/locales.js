// @ts-check

/**
 * @type {readonly ["fi", "en", "sv"]}
 */
export const LOCALES = ['fi', 'en', 'sv']

/**
 * @type {Record<typeof LOCALES[number], Record<import("~/types/common").Routes, string>>}
 */
export const ROUTES = {
  fi: {
    train: 'juna',
    settings: 'asetukset',
  },
  en: {
    train: 'train',
    settings: 'settings',
  },
  sv: {
    train: 'tog',
    settings: 'installningar',
  },
}
