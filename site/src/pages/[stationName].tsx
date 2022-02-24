import type {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult
} from 'next'
import { useRouter } from 'next/router'
import type { ParsedUrlQuery } from 'node:querystring'
import type { LocalizedStation } from '~digitraffic'

import { getStationPath, getStations } from '~digitraffic'

import { getLocaleOrThrow } from '../utils/get_locale_or_throw'
import { getStationsFromCache } from '../utils/get_station_from_cache'

interface StationPageProps {
  station: LocalizedStation
}

export default function StationPage({ station }: StationPageProps) {
  const router = useRouter()
  const locale = getLocaleOrThrow(router.locale)

  return <div>{station.stationName[locale]}</div>
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
        ...(await getStationsFromCache<LocalizedStation[]>({ locale })).map(station => ({
          params: { stationName: getStationPath(station.stationName[locale]!) },
          locale
        }))
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

  return { props: { station } }
}
