import type { Locale } from '@typings/common'
import type { LocalizedStation as ILocalizedStation } from '@junat/digitraffic/types'

export type LocalizedStation = ILocalizedStation<Locale, true>
export type { DigitrafficError as ErrorType } from '@junat/digitraffic'
