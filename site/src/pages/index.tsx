import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import type { LocalizedStation } from '~digitraffic'
import type { HomePageTranslations } from '@typings/home_page_translations'
import type { SearchBarProps } from '@components/SearchBar'

import { getStationPath } from '~digitraffic'

import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'

import { getStations } from '../../lib/get_stations'

import GeolocationButton from '@components/GeolocationButton'
import SearchBar from '@components/SearchBar'

import useGeolocation from '@hooks/use_geolocation.hook'

import Page from '@layouts/Page'

import { getLocaleOrThrow } from '@utils/get_locale_or_throw'
import getNearestStation from '@utils/get_nearest_station'
import { camelCaseKeys } from '@utils/camel_case_keys'
import constants from '../constants'

import styles from './HomePage.module.scss'
import Head from 'next/head'
import { interpolateString } from '@utils/interpolate_string'

interface HomePageProps {
  stations: LocalizedStation[]
  translations: HomePageTranslations
}

export default function HomePage({
  stations: initialStations,
  translations
}: HomePageProps) {
  const router = useRouter()
  const locale = getLocaleOrThrow(router.locale)

  const geolocation = useGeolocation()

  useMemo(() => {
    if (!(geolocation.position && locale)) {
      return
    }

    const nearestStation = getNearestStation(
      initialStations,
      geolocation.position
    )

    const stationPath = getStationPath(
      nearestStation.stationName[locale] as string
    )

    router.push(`/${stationPath}`)
  }, [geolocation.position, locale, initialStations, router])

  const [stations, setStations] = useState(initialStations)

  const handleChange: SearchBarProps['handleChange'] = (_event, inputRef) => {
    const searchQuery = inputRef.current?.value

    if (searchQuery === undefined) return

    import('fuse.js').then(({ default: fusejs }) => {
      const fuse = new fusejs(initialStations, {
        keys: [`stationName.${locale}`],
        threshold: 0.3
      })

      const result = fuse.search(searchQuery)

      if (searchQuery === '' && result.length === 0) {
        setStations(initialStations)
        return
      }

      setStations(result.map(({ item }) => item))
    })
  }

  const handleSubmit: SearchBarProps['handleSubmit'] = event => {
    event.preventDefault()

    if (stations.length === 0) return

    router.push(`/${getStationPath(stations[0].stationName[locale]!)}`)
  }

  return (
    <>
      <Head>
        <title>{constants.SITE_NAME}</title>
        <meta name="description" content={translations.metaDescription} />
      </Head>
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
        <SearchBar
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          placeholder={translations.searchInputPlaceholder}
        />
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
    </>
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
