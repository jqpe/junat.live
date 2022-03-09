import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { LocalizedStation } from '~digitraffic'
import { getStations } from '../../lib/get_stations'

import { getStationPath } from '~digitraffic'

import Link from 'next/link'
import { useRouter } from 'next/router'
import { getLocaleOrThrow } from '../utils/get_locale_or_throw'

interface HomePageProps {
  stations: LocalizedStation[]
}

export default function HomePage({ stations }: HomePageProps) {
  const router = useRouter()
  const locale = getLocaleOrThrow(router.locale)

  return (
    <main>
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

export const getStaticProps = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<HomePageProps>> => {
  const stations = await getStations<LocalizedStation[]>({
    includeNonPassenger: false,
    locale: getLocaleOrThrow(context.locale)
  })

  return { props: { stations } }
}
