import type {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult
} from 'next'
import { useRouter } from 'next/router'
import type { ParsedUrlQuery } from 'node:querystring'
import type { LocalizedStation } from '~digitraffic'
import type { Translation } from '../types/station_screen_translations'

import { getStationPath } from '~digitraffic'
import Head from 'next/head'

import { getLocaleOrThrow } from '../utils/get_locale_or_throw'
import { getStationsFromCache } from '../utils/get_station_from_cache'
import { interpolateString } from '../utils/interpolate_string'

interface StationPageProps {
  station: LocalizedStation
  translation: Translation
}

export default function StationPage({
  station,
  translation
}: StationPageProps) {
  const router = useRouter()
  const locale = getLocaleOrThrow(router.locale)

  return (
    <>
      <Head>
        <title>{translation.title}</title>
        <meta name="description" content={translation.description} />
      </Head>
      <main>
        <header>
          <h1>{station.stationName[locale]}</h1>
        </header>
      </main>
    </>
  )
}

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
        ...(await getStationsFromCache<LocalizedStation[]>({ locale })).map(
          station => ({
            params: {
              stationName: getStationPath(station.stationName[locale]!)
            },
            locale
          })
        )
      ]
    }
  } else {
    paths = (await getStationsFromCache()).map(station => ({
      params: { stationName: getStationPath(station.stationName) },
      locale: context.defaultLocale
    }))
  }

  return { paths, fallback: false }
}

export const getStaticProps = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<StationPageProps>> => {
  const locale = getLocaleOrThrow(context.locale)

  const stations = await getStationsFromCache<LocalizedStation[]>({ locale })

  const params = context.params

  if (!params) {
    return { notFound: true }
  }

  if (!(params.stationName && typeof params.stationName === 'string')) {
    return { notFound: true }
  }

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

  const headers = new Headers()
  headers.set('Authorization', `Bearer ${process.env.CMS_TOKEN}`)

  const response = await fetch(
    'https://cms.junat.live/items/station_screen_translations',
    { headers }
  )

  const json: { data: Translation[] } = await response.json()

  const content = json.data.find(translation => translation.language === locale)

  if (!content) {
    throw new Error(`Couldn't get translation for ${locale}`)
  }

  const translation = Object.assign(content, {
    title: interpolateString(content.title, {
      stationName: station.stationName[locale]
    }),
    description: interpolateString(content.description, {
      stationName: station.stationName[locale]
    })
  })

  return { props: { station, translation } }
}
