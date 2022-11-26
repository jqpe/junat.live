import type { GeolocationButtonProps } from '@features/geolocation'
import type { GetStaticPropsResult } from 'next'
import type { LocalizedStation } from '@lib/digitraffic'

import React from 'react'

import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import constants from '../constants'

import StationList from '@components/elements/station_list'
import Header from '@components/common/header'
import { Head } from '@components/common/head'

import { SearchBar } from '@features/search'

import Page from '@layouts/page'

import { getLocale } from '@utils/get_locale'
import translate from '@utils/translate'
import i from '@utils/interpolate_string'
import { getStations } from '@utils/get_stations'

const GeolocationButton = dynamic<GeolocationButtonProps>(() =>
  import('@features/geolocation').then(mod => mod.GeolocationButton)
)

interface Props {
  initialStations: LocalizedStation[]
}

export default function HomePage({ initialStations }: Props) {
  const router = useRouter()
  const locale = getLocale(router.locale)

  const [stations, setStations] = React.useState(initialStations)

  const t = translate(locale)

  return (
    <>
      <Head
        path={router.asPath}
        title={constants.SITE_NAME}
        description={i(t('homePage', 'meta', '$description'), {
          siteName: constants.SITE_NAME
        })}
      />
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
        <StationList
          stations={stations.length === 0 ? initialStations : stations}
          locale={locale}
        />
      </main>
    </>
  )
}

HomePage.layout = Page

export const getStaticProps = async (): Promise<
  GetStaticPropsResult<Props>
> => {
  const stations = getStations({ betterNames: true })

  return { props: { initialStations: await stations } }
}
