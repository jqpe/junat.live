import constants from 'src/constants'

export type Locale = typeof constants.LOCALES[number]
export type LocaleTuple = typeof constants.LOCALES

/**
 * All localized routes in the application
 */
export type Routes = 'train'
