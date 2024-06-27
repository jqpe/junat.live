import { LOCALES } from './locales'

export const SITE_NAME = 'Junat.live' as const
export const SITE_DOMAIN = 'junat.live' as const
export const SITE_URL = 'https://junat.live' as const

export const DEFAULT_LOCALE = 'fi' as const

// Use JavaScript to avoid transpiling TypeScript for use inside next.config.js
export { LOCALES } from './locales'
export const INACTIVE_STATIONS = [
  'HSI',
  'HH',
  'KIA',
  'KÖ',
  'LVT',
  'NLÄ',
  'PRV',
  'MVA',
] as const
export const DEFAULT_TRAINS_COUNT = 20 as const
export const TRAINS_MULTIPLIER = 100 as const

export const FINTRAFFIC = {
  URL: 'https://www.fintraffic.fi/',
  LICENSE_URL: 'https://creativecommons.org/licenses/by/4.0/deed.',
  LICENSE: 'CC 4.0 BY',
  LOCALE_PATHS: { fi: 'fi', sv: 'sv', en: 'en' },
} as const

const constants = {
  SITE_NAME,
  SITE_URL,
  LOCALES,
  DEFAULT_TRAINS_COUNT,
  TRAINS_MULTIPLIER,
  FINTRAFFIC,
} as const

export default constants
