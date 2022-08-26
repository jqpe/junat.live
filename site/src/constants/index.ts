import { LOCALES } from './locales'
import { INACTIVE_STATIONS as INACTIVE } from '@junat/digitraffic/handlers/stations'

export const SITE_NAME = 'Junat.live' as const
export const SITE_URL = 'junat.live' as const
// Use JavaScript to avoid transpiling TypeScript for use inside next.config.js
export { LOCALES } from './locales'
export const INACTIVE_STATIONS = [...INACTIVE, 'MVA']

const constants = { SITE_NAME, SITE_URL, LOCALES }

export default constants
