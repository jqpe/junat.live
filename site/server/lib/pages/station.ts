import type { StationScreenTranslations } from '@typings/station_screen_translations'
import type { ParsedUrlQuery } from 'node:querystring'
import type { StationPageProps } from 'src/pages/[stationName]'
import type { LocalizedStation, Station } from '~digitraffic'
import type {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult
} from 'next'

import { getStations, getStationPath } from '~digitraffic'

import { camelCaseKeys } from '@utils/camel_case_keys'
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

  if (!process.env.CMS_TOKEN) {
    throw new Error('CMS_TOKEN environment variable must be a value.')
  }

  const headers = new Headers({
    Authorization: `Bearer ${process.env.CMS_TOKEN}`
  })

  const response = await fetch(
    'https://cms.junat.live/items/station_screen_translations',
    { headers }
  )

  const json: { data: StationScreenTranslations[] } = await response.json()

  const data = json.data.find(translation => translation.language === locale)

  if (!data) {
    throw new Error(`Couldn't get translation for ${locale}`)
  }
  const content = camelCaseKeys<StationScreenTranslations>(data)

  const translation = Object.assign(content, {
    title: interpolateString(content.title, {
      stationName: station.stationName[locale]
    }),
    notFound: interpolateString(content.notFound, {
      stationName: station.stationName[locale]
    }),
    description: interpolateString(content.description, {
      stationName: station.stationName[locale]
    })
  })

  return { props: { station, translation, locale } }
}
