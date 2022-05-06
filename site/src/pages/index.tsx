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

import GeolocationButton from '@components/GeolocationButton'
import SearchBar from '@components/SearchBar'

import useGeolocation from '@hooks/use_geolocation.hook'

import Page from '@layouts/Page'

import { getLocaleOrThrow } from '@utils/get_locale_or_throw'
import constants from '../constants'

import styles from './HomePage.module.scss'
import Head from 'next/head'
import useColorScheme from '@hooks/use_color_scheme.hook'
import { handleSearch } from '@lib/search'

export interface HomePageProps {
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

  // Import fuse.js on focus (e.g. tab or user clicked on input) to reduce delay between input and displaying search results.
  // On fast networks this is not that big of a difference, but for slow connection speeds this can result in a few seconds of improvement.
  // It's safe to import fuse.js multiple times as imports are automatically cached.
  const handleFocus: SearchBarProps['handleFocus'] = _ => import('fuse.js')

  const handleSubmit: SearchBarProps['handleSubmit'] = event => {
    event.preventDefault()

    const inputElement = event.currentTarget.querySelector('input')
    const input = inputElement?.value

    if (stations.length === 0 || input?.length === 0) return

    router
      .push(`/${getStationPath(stations[0].stationName[locale]!)}`)
      .then(_ => {
        if (inputElement) inputElement.value = ''
      })
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
        <SearchBar
          handleFocus={handleFocus}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          placeholder={translations.searchInputPlaceholder}
          ariaLabel={translations.searchButtonAriaLabel}
        />
        <nav className={styles.nav}>
          <GeolocationButton
            label={translations.geolocationButtonLabel}
            disabled={isGeolocationButtonDisabled}
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
    </>
  )
}

HomePage.layout = Page

export { getStaticProps } from '@server/lib/pages'
