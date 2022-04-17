import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import type { LocalizedStation } from '~digitraffic'
import type { HomePageTranslations } from '@typings/home_page_translations'
import type { SearchBarProps } from '@components/SearchBar'
import type { FormEvent, RefObject } from 'react'

import { getStationPath } from '~digitraffic'

import Link from 'next/link'
import { useRouter } from 'next/router'

import { useState } from 'react'

import { showNotification } from '@lib/notifications'
import {
  handleGeolocationError,
  handleGeolocationPosition
} from '@lib/geolocation'

import { getStations } from '@server/lib/get_stations'

import GeolocationButton from '@components/GeolocationButton'
import SearchBar from '@components/SearchBar'

import useGeolocation from '@hooks/use_geolocation.hook'

import Page from '@layouts/Page'

import { getLocaleOrThrow } from '@utils/get_locale_or_throw'
import { camelCaseKeys } from '@utils/camel_case_keys'
import constants from '../constants'

import styles from './HomePage.module.scss'
import Head from 'next/head'
import { interpolateString } from '@utils/interpolate_string'
import useColorScheme from '@hooks/use_color_scheme.hook'
import { handleSearch } from '@lib/search'

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

  const { colorScheme } = useColorScheme()

  const [isGeolocationButtonDisabled, setIsGeolocationButtonDisabled] =
    useState(false)

  const geolocation = useGeolocation({
    handlePosition: position => {
      handleGeolocationPosition(position)({ stations, locale, router })
    },
    handleError: error => {
      handleGeolocationError(error)({
        errors: {
          permissionDenied: translations.geolocationPositionError,
          timeout: translations.geolocationPositionTimeoutError,
          unavailable: translations.geolocationPositionUnavailableError
        },
        callback: title => {
          setIsGeolocationButtonDisabled(true)

          showNotification({
            title,
            message: '',
            colorScheme,
            onClose: _ => setIsGeolocationButtonDisabled(false)
          })
        }
      })
    }
  })

  const [stations, setStations] = useState(initialStations)

  const handleChange = (
    event: FormEvent<HTMLFormElement>,
    inputRef: RefObject<HTMLInputElement>
  ) => {
    handleSearch(
      event,
      inputRef
    )({
      stations: initialStations,
      locale,
      callback: stations => setStations(stations)
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
            disabled={isGeolocationButtonDisabled}
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
