import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import type { LocalizedStation } from '@junat/digitraffic/types'

import type { GeolocationButtonProps } from '@features/geolocation'
import type { ToastProps } from '@features/toast'

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
import translate from '@utils/translation'
import i from '@utils/interpolate_string'

const Toast = dynamic<ToastProps>(() =>
  import('@features/toast').then(mod => mod.Toast)
)
const GeolocationButton = dynamic<GeolocationButtonProps>(() =>
  import('@features/geolocation').then(mod => mod.GeolocationButton)
)

export interface HomePageProps {
  stations: LocalizedStation[]
}

export default function HomePage({ stations: initialStations }: HomePageProps) {
  const router = useRouter()
  const locale = getLocale(router.locale)

  const [stations, setStations] = React.useState(initialStations)

  const t = translate(locale)

  return (
    <>
      <Head>
        <title>{constants.SITE_NAME}</title>
        <meta
          name="description"
          content={i(t('homePage', 'meta', '$description'), {
            siteName: constants.SITE_NAME
          })}
        />
      </Head>
      <main>
        <Header heading={constants.SITE_NAME} />
        <SearchBar
          initialStations={initialStations}
          stations={stations}
          locale={locale}
          changeCallback={setStations}
          submitCallback={router.push}
          placeholder={t('searchForStation')}
          ariaLabel={t('buttons', 'searchLabel')}
        />
        <nav>
          <GeolocationButton
            label={t('buttons', 'geolocationLabel')}
            locale={locale}
            setStations={setStations}
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

  return {
    props: {
      stations
    }
  }
}
