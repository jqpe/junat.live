import { LOCALES } from './locales'

export const SITE_NAME = 'Junat.live' as const
export const SITE_URL = 'junat.live' as const
// Use JavaScript to avoid transpiling TypeScript for use inside next.config.js
export { LOCALES } from './locales'

const constants = { SITE_NAME, SITE_URL, LOCALES }

export default constants
