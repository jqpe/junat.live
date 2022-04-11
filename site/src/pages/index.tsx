import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import type { LocalizedStation } from '~digitraffic'

import { getStationPath } from '~digitraffic'

import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

import { getStations } from '../../lib/get_stations'

import GeolocationButton from '@components/GeolocationButton'

import useGeolocation from '@hooks/use_geolocation.hook'

import Page from '@layouts/Page'

import { getLocaleOrThrow } from '@utils/get_locale_or_throw'
import getNearestStation from '@utils/get_nearest_station'

interface HomePageProps {
  stations: LocalizedStation[]
}

export default function HomePage({ stations }: HomePageProps) {
  const router = useRouter()
  const locale = getLocaleOrThrow(router.locale)

  const geolocation = useGeolocation()

  useMemo(() => {
    if (!(geolocation.position && locale)) {
      return
    }

    const nearestStation = getNearestStation(stations, geolocation.position)

    const stationPath = getStationPath(
      nearestStation.stationName[locale] as string
    )

    router.push(`/${stationPath}`)
  }, [geolocation.position, locale, stations, router])

  return (
    <main>
      <nav>
        <GeolocationButton handleClick={geolocation.getCurrentPosition} />
      </nav>
      <ul>
        {stations.map(station => (
          <li key={station.stationShortCode}>
            <Link
              href={`/${getStationPath(station.stationName[locale]!)}`}
              locale={locale}
            >
              {station.stationName[locale]}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}

HomePage.layout = Page

export const getStaticProps = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<HomePageProps>> => {
  const stations = await getStations<LocalizedStation[]>({
    includeNonPassenger: false,
    locale: getLocaleOrThrow(context.locale)
  })

  return { props: { stations } }
}
