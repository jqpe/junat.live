import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import type { LocalizedStation } from '~digitraffic'

import type { HomePageProps } from 'src/pages'
import type { HomePageTranslations } from '@typings/home_page_translations'

import { camelCaseKeys } from '@utils/camel_case_keys'
import { getLocaleOrThrow } from '@utils/get_locale_or_throw'
import { interpolateString } from '@utils/interpolate_string'
import constants from 'src/constants'
import { getStations } from '~digitraffic'

export const getStaticProps = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<HomePageProps>> => {
  const stations = await getStations<LocalizedStation[]>({
    includeNonPassenger: false,
    locale: getLocaleOrThrow(context.locale)
  })

  const locale = getLocaleOrThrow(context.locale)

  if (!process.env.CMS_TOKEN) {
    throw new Error('CMS_TOKEN environment variable must be a value.')
  }

  const headers = new Headers({
    Authorization: `Bearer ${process.env.CMS_TOKEN}`
  })

  const response = await fetch('https://cms.junat.live/items/home_page', {
    headers
  })
  const json: { data: HomePageTranslations[] } = await response.json()

  const data = json.data.find(translation => translation.language === locale)

  if (!data) {
    throw new Error(`Couldn't get translation for ${locale}`)
  }

  const translations = camelCaseKeys<HomePageTranslations>(data)

  return {
    props: {
      stations,
      translations: Object.assign(translations, {
        metaDescription: interpolateString(translations.metaDescription, {
          siteName: constants.SITE_NAME
        })
      })
    }
  }
}
