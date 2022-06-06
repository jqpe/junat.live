import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import type { LocalizedStation } from '@junat/digitraffic/types'
import type { FormEvent, RefObject } from 'react'

import type { HomePage as HomePageTranslations } from '@junat/cms'
import type { SearchBarProps } from '@components/SearchBar'

import { getStationPath } from '@junat/digitraffic/utils'
import { getHomePage } from '@junat/cms'

import Head from 'next/head'
import { useRouter } from 'next/router'

import { useState } from 'react'

import SearchBar from '@components/SearchBar'
import StationList from '@components/StationList'
import Header from '@components/Header'

import dynamic from 'next/dynamic'

import Page from '@layouts/Page'

const Toast = dynamic(() => import('@components/Toast'))
const GeolocationButton = dynamic(() => import('@components/GeolocationButton'))

import useGeolocation from '@hooks/use_geolocation'

import { handleSearch } from '@utils/search'
import { handleGeolocationPosition } from '@utils/geolocation'
import { getLocaleOrThrow } from '@utils/get_locale_or_throw'

import constants from '../constants'

import { fetchStations } from '@junat/digitraffic'

export interface HomePageProps {
  stations: LocalizedStation[]
  translations: HomePageTranslations
}

// Import fuse.js on focus (e.g. tab or user clicked on input) to reduce delay between input and displaying search results.
// On fast networks this is not that big of a difference, but for slow connection speeds this can result in a few seconds of improvement.
// It's safe to import fuse.js multiple times as imports are automatically cached.
const handleFocus: SearchBarProps['handleFocus'] = () => import('fuse.js')

export default function HomePage({
  stations: initialStations,
  translations
}: HomePageProps) {
  const router = useRouter()
  const locale = getLocaleOrThrow(router.locale)

  const [open, setOpen] = useState(false)
  const [toastTitle, setToastTitle] = useState('')

  const [isGeolocationButtonDisabled, setIsGeolocationButtonDisabled] =
    useState(false)

  const geolocation = useGeolocation({
    handlePosition: position => {
      const maybeSortedStations = handleGeolocationPosition(position, {
        locale,
        stations,
        router
      })

      if (maybeSortedStations) {
        setToastTitle(
          `Bad accuracy. ${maybeSortedStations
            .slice(0, 10)
            .map(s =>
              typeof s.stationName === 'string'
                ? s.stationName
                : s.stationName[locale]
            )
            .join('\n')}`
        )
        setOpen(true)
        setIsGeolocationButtonDisabled(false)
      }
    },
    handleError: error => {
      setIsGeolocationButtonDisabled(true)

      switch (error.code) {
        case error.PERMISSION_DENIED:
          setToastTitle(translations.geolocationPositionError)
          break

        case error.POSITION_UNAVAILABLE:
          setToastTitle(translations.geolocationPositionUnavailableError)
          break

        case error.TIMEOUT:
          setToastTitle(translations.geolocationPositionTimeoutError)
          break

        default:
          setToastTitle(translations.geolocationPositionError)
      }

      setOpen(true)
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

    const inputElement = event.currentTarget.querySelector('input')
    const input = inputElement?.value

    if (stations.length === 0 || input?.length === 0) return

    if (inputElement) inputElement.value = ''
    router.push(`/${getStationPath(stations[0].stationName[locale])}`)
  }

  return (
    <>
      <Head>
        <title>{constants.SITE_NAME}</title>
        <meta name="description" content={translations.metaDescription} />
      </Head>
      <main>
        <Header heading={constants.SITE_NAME} />
        <SearchBar
          handleFocus={handleFocus}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          placeholder={translations.searchInputPlaceholder}
          ariaLabel={translations.searchButtonAriaLabel}
        />
        <nav>
          <GeolocationButton
            label={translations.geolocationButtonLabel}
            disabled={isGeolocationButtonDisabled}
            handleClick={geolocation.getCurrentPosition}
          />
        </nav>
        <StationList stations={stations} locale={locale} />
      </main>
      <Toast
        open={open}
        title={toastTitle}
        handleOpenChange={open => {
          setIsGeolocationButtonDisabled(false)
          setOpen(open)
        }}
      />
    </>
  )
}

HomePage.layout = Page

export const getStaticProps = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<HomePageProps>> => {
  const stations = await fetchStations<LocalizedStation[]>({
    includeNonPassenger: false,
    locale: getLocaleOrThrow(context.locale)
  })

  const homePage = await getHomePage(getLocaleOrThrow(context.locale), {
    siteName: constants.SITE_NAME
  })

  return {
    props: {
      stations,
      translations: homePage
    }
  }
}
