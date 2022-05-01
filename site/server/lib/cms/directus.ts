import type { HomePageTranslations } from '@typings/home_page_translations'
import type { StationScreenTranslations } from '@typings/station_screen_translations'
import { TrainLongName } from '@typings/train_long_name'

export const directus = (() => {
  const headers = new Headers()

  if (process.env.CMS_TOKEN) {
    headers.append('Authorization', `Bearer ${process.env.CMS_TOKEN}`)
  }

  return {
    async getStationScreenTranslations() {
      const response = await fetch(
        'https://cms.junat.live/items/station_screen_translations',
        { headers }
      )

      const json: { data: StationScreenTranslations[] } = await response.json()

      return json
    },
    async getHomePage() {
      const response = await fetch('https://cms.junat.live/items/home_page', {
        headers
      })
      const json: { data: HomePageTranslations[] } = await response.json()

      return json
    },
    async getTrainLongNames(locale: 'fi' | 'en' | 'sv') {
      const response = await fetch(
        `https://cms.junat.live/items/train_long_name?filter[language][_eq]=${locale}`,
        { headers }
      )
      const json: { data: TrainLongName[] } = await response.json()

      return json
    }
  }
})()
