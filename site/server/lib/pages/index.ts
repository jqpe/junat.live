import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import type { LocalizedStation } from '~digitraffic'

import type { HomePageProps } from 'src/pages'

import { getStations } from '~digitraffic'

import { getHomePage } from '@junat/cms'
import { getLocaleOrThrow } from '@utils/get_locale_or_throw'
import { interpolateString } from '@utils/interpolate_string'
import constants from 'src/constants'

export const getStaticProps = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<HomePageProps>> => {
  const stations = await getStations<LocalizedStation[]>({
    includeNonPassenger: false,
    locale: getLocaleOrThrow(context.locale)
  })

  const homePage = await getHomePage(getLocaleOrThrow(context.locale))

  return {
    props: {
      stations,
      translations: Object.assign(homePage, {
        metaDescription: interpolateString(homePage.metaDescription, {
          siteName: constants.SITE_NAME
        })
      })
    }
  }
}
