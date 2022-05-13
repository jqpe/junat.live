import type { ParsedUrlQuery } from 'node:querystring'
import type { StationPageProps } from 'src/pages/[stationName]'
import type { LocalizedStation, Station } from '~digitraffic'
import type {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult
} from 'next'

import { getStationPath } from '~digitraffic'
import { getStationScreenTranslations } from '@junat/cms'

import { getStations } from '@server/lib/get_stations'
import { getLocaleOrThrow } from '@utils/get_locale_or_throw'
import { interpolateString } from '@utils/interpolate_string'

export const getStaticPaths = async (
  context: GetStaticPropsContext
): Promise<GetStaticPathsResult> => {
  let paths: {
    params: ParsedUrlQuery
    locale?: string | undefined
  }[] = []

  if (context.locales) {
    const supportedLocales = context.locales.filter(locale =>
      /(fi)|(en)|(sv)/.test(locale)
    ) as ['fi' | 'en' | 'sv']

    for (const locale of supportedLocales) {
      paths = [
        ...paths,
        ...(
          await getStations<LocalizedStation[]>({ locale, omitInactive: false })
        ).map(station => ({
          params: {
            stationName: getStationPath(station.stationName[locale]!)
          },
          locale
        }))
      ]
    }
  } else {
    paths = (await getStations<Station[]>({ omitInactive: false })).map(
      station => ({
        params: { stationName: getStationPath(station.stationName) },
        locale: context.defaultLocale
      })
    )
  }

  return { paths, fallback: false }
}

export const getStaticProps = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<StationPageProps>> => {
  const params = context.params
  const locale = getLocaleOrThrow(context.locale)

  if (
    !params ||
    !(params.stationName && typeof params.stationName === 'string')
  ) {
    return { notFound: true }
  }
  const stations = await getStations<LocalizedStation[]>({
    locale,
    omitInactive: false
  })

  const station = stations.find(
    station =>
      getStationPath(station.stationName[locale]!) === params.stationName
  )

  if (!station) {
    return { notFound: true }
  }

  const stationScreenTranslations = await getStationScreenTranslations(
    getLocaleOrThrow(context.locale)
  )

  const translation = Object.assign(stationScreenTranslations, {
    title: interpolateString(stationScreenTranslations.title, {
      stationName: station.stationName[locale]
    }),
    notFound: interpolateString(stationScreenTranslations.notFound, {
      stationName: station.stationName[locale]
    }),
    description: interpolateString(stationScreenTranslations.description, {
      stationName: station.stationName[locale]
    })
  })

  return { props: { station, translation, locale } }
}
