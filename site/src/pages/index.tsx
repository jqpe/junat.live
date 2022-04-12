import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import type { LocalizedStation } from '~digitraffic'
import type { HomePageTranslations } from '@typings/home_page_translations'

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
import { camelCaseKeys } from '@utils/camel_case_keys'
import constants from '../constants'

import styles from './HomePage.module.scss'

interface HomePageProps {
  stations: LocalizedStation[]
  translations: HomePageTranslations
}

export default function HomePage({ stations, translations }: HomePageProps) {
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
      <header>
        <h1>{constants.SITE_NAME}</h1>
      </header>
      <nav className={styles.nav}>
        <GeolocationButton
          label={translations.geolocationButtonLabel}
          error={geolocation.error}
          handleClick={geolocation.getCurrentPosition}
        />
      </nav>
      <ul className={styles.stations}>
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

  return { props: { stations, translations } }
}
