import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import type { LocalizedStation } from '@junat/digitraffic/types'

import type { GeolocationButtonProps } from '@features/geolocation'
import type { ToastProps } from '@features/toast'

import type { HomePage as HomePageTranslations } from '@junat/cms'

import { getHomePage } from '@junat/cms'

import React from 'react'

import Head from 'next/head'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import constants from '../constants'

import { fetchStations } from '@junat/digitraffic'

import StationList from '@components/StationList'
import Header from '@components/common/Header'

import { SearchBar } from '@features/search'

import Page from '@layouts/Page'

import { getLocale } from '@utils/get_locale'

const Toast = dynamic<ToastProps>(() =>
  import('@features/toast').then(mod => mod.Toast)
)
const GeolocationButton = dynamic<GeolocationButtonProps>(() =>
  import('@features/geolocation').then(mod => mod.GeolocationButton)
)

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
          initialStations={initialStations}
          stations={stations}
          locale={locale}
          changeCallback={setStations}
          submitCallback={router.push}
          placeholder={translations.searchInputPlaceholder}
          ariaLabel={translations.searchButtonAriaLabel}
        />
        <nav>
          <GeolocationButton
            label={translations.geolocationButtonLabel}
            locale={locale}
            setStations={setStations}
            translations={translations}
          />
        </nav>
        <StationList stations={stations} locale={locale} />
      </main>
      <Toast />
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
