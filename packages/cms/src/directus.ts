import type { Locale } from '../types/common'
import type { HomePage } from '../types/home_page'
import type { StationScreenTranslations } from '../types/station_screen_translations'
import type { TrainLongName } from '../types/train_long_name'
import type { TrainPage } from '../types/train_page'

import { camelCaseKeys } from './utils/camel_case_keys'

import './fetch_polyfill'
import { interpolateObject } from './utils/interpolate_object'

export const BASE_URL = 'https://cms.junat.live'

export const getStationScreenTranslations = async (
  locale: Locale,
  { stationName }: { stationName: string }
) => {
  const params = new URLSearchParams({
    ['filter[language][_eq]']: locale
  })

  const response = await fetch(
    `${BASE_URL}/items/station_screen_translations?${params}`
  )

  const json = await response.json()

  return interpolateObject(camelCaseKeys(json.data[0]), {
    stationName
  }) as StationScreenTranslations
}

export const getHomePage = async (
  locale: Locale,
  { siteName }: { siteName: string }
) => {
  const params = new URLSearchParams({
    ['filter[language][_eq]']: locale
  })

  const response = await fetch(`${BASE_URL}/items/home_page?${params}`)
  const json = await response.json()

  return interpolateObject(camelCaseKeys(json.data[0]), {
    siteName
  }) as HomePage
}

export const getTrainLongNames = async (
  locale: Locale
): Promise<TrainLongName[]> => {
  const params = new URLSearchParams({
    ['filter[language][_eq]']: locale
  })

  const response = await fetch(`${BASE_URL}/items/train_long_name?${params}`)
  const json = await response.json()

  return json.data.map((longName: TrainLongName) => camelCaseKeys(longName))
}

export const getTrainPage = async (locale: Locale): Promise<TrainPage> => {
  const response = await fetch(`${BASE_URL}/items/train_page/${locale}`)
  const json = await response.json()

  return camelCaseKeys(json.data)
}

export const directus = {
  getHomePage,
  getStationScreenTranslations,
  getTrainLongNames,
  getTrainPage
}
