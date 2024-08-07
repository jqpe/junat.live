import type {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import type { ParsedUrlQuery } from 'node:querystring'
import type { StationProps } from '~/features/pages/station'

import { getSupportedLocale } from '~/i18n'
import { getStationPath } from '~/lib/digitraffic'
import { getStations } from '~/lib/digitraffic/server'

export { Station as default } from '~/features/pages/station'

export const getStaticPaths = async (
  context: GetStaticPropsContext,
): Promise<GetStaticPathsResult> => {
  let paths: {
    params: ParsedUrlQuery
    locale?: string
  }[] = []

  if (!context.locales) {
    throw new TypeError('Expected context.locales to be defined.')
  }

  for (const locale of context.locales) {
    const stations = await getStations({
      betterNames: true,
      keepInactive: true,
      keepNonPassenger: true,
    })

    paths = [
      ...paths,
      ...stations.map(station => ({
        params: {
          stationName: getStationPath(
            station.stationName[getSupportedLocale(locale)],
          ),
        },
        locale,
      })),
    ]
  }

  return { paths, fallback: false }
}

export const getStaticProps = async (
  context: GetStaticPropsContext,
): Promise<GetStaticPropsResult<StationProps>> => {
  const params = context.params
  const locale = getSupportedLocale(context.locale)

  if (
    !params ||
    !(params.stationName && typeof params.stationName === 'string')
  ) {
    return { notFound: true }
  }
  const stations = await getStations({
    betterNames: true,
    keepInactive: true,
    keepNonPassenger: true,
  })

  const station = stations.find(
    s => getStationPath(s.stationName[locale]) === params.stationName,
  )

  if (!station) {
    return { notFound: true }
  }

  return {
    props: { station, locale },
  }
}
