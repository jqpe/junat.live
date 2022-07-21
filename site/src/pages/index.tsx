import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import type { LocalizedStation } from '@junat/digitraffic/types'

import type { GeolocationButtonProps } from '@features/geolocation'

import type { HomePage as HomePageTranslations } from '@junat/cms'
import { getHomePage } from '@junat/cms'

import React from 'react'

import Head from 'next/head'
import { useRouter } from 'next/router'

import { SearchBar } from '@features/search'
import StationList from '@components/StationList'
import Header from '@components/common/Header'

import dynamic from 'next/dynamic'

import Page from '@layouts/Page'

const Toast = dynamic(() => import('@components/Toast'))
const GeolocationButton = dynamic<GeolocationButtonProps>(() =>
  import('@features/geolocation').then(mod => mod.GeolocationButton)
)

import { useGeolocation, getNearbyStations } from '@features/geolocation'

import { getLocale } from '@utils/get_locale'

import constants from '../constants'

import { fetchStations } from '@junat/digitraffic'
import { getStationPath } from '@junat/digitraffic/utils'

export interface HomePageProps {
  stations: LocalizedStation[]
  translations: HomePageTranslations
}

export default function HomePage({
  stations: initialStations,
  translations
}: HomePageProps) {
  const router = useRouter()
  const locale = getLocale(router.locale)

  const [isOpen, setOpen] = React.useState(false)
  const [toastTitle, setToastTitle] = React.useState('')

  const [geolocationButton, setGeolocationButton] = React.useState({
    clicked: false,
    disabled: false
  })

  const geolocation = useGeolocation({
    handlePosition: position => {
      const station = getNearbyStations(position, {
        locale,
        stations
      })

      if (Array.isArray(station)) {
        setStations(station)

        setToastTitle(translations.badGeolocationAccuracy)
        setOpen(true)
        setGeolocationButton({ disabled: false, clicked: false })
      } else {
        router.push(getStationPath(station.stationName[locale]))
      }
    },
    handleError: error => {
      setGeolocationButton({ disabled: false, clicked: false })

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

  const [stations, setStations] = React.useState(initialStations)

  return (
    <>
      <Head>
        <title>{constants.SITE_NAME}</title>
        <meta name="description" content={translations.metaDescription} />
      </Head>
      <main>
        <Header heading={constants.SITE_NAME} />
        <SearchBar
          stations={initialStations}
          changeCallback={setStations}
          submitCallback={router.push}
          placeholder={translations.searchInputPlaceholder}
          ariaLabel={translations.searchButtonAriaLabel}
        />
        <nav>
          <GeolocationButton
            label={translations.geolocationButtonLabel}
            disabled={geolocationButton.disabled}
            clicked={geolocationButton.clicked}
            handleClick={geolocation.getCurrentPosition}
          />
        </nav>
        <StationList stations={stations} locale={locale} />
      </main>
      <Toast
        open={isOpen}
        title={toastTitle}
        handleOpenChange={open => {
          setGeolocationButton({ disabled: open, clicked: false })
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
    locale: getLocale(context.locale)
  })

  const homePage = await getHomePage(getLocale(context.locale), {
    siteName: constants.SITE_NAME
  })

  return {
    props: {
      stations,
      translations: homePage
    }
  }
}
