import type { LocalizedStation } from '@lib/digitraffic'
import type { GeolocationButtonProps } from '@features/geolocation'

import React from 'react'

import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import constants from '~/constants'

import StationList from '@components/elements/station_list'
import Header from '@components/common/header'
import { Head } from '@components/common/head'
import { SwitchButton } from '~/components/buttons/switch_button'
import HeartFilled from '~/components/icons/heart_filled.svg'
import List from '~/components/icons/list.svg'

import useStore from '~/utils/use_store'
import { useFavorites } from '~/hooks/use_favorites'

import { SearchBar } from '@features/search'

import Page from '@layouts/page'

import { getLocale } from '@utils/get_locale'
import translate from '@utils/translate'
import i from '@utils/interpolate_string'

const GeolocationButton = dynamic<GeolocationButtonProps>(() =>
  import('@features/geolocation').then(mod => mod.GeolocationButton)
)

export type HomeProps = {
  initialStations: LocalizedStation[]
}

export function Home({ initialStations }: HomeProps) {
  const router = useRouter()
  const locale = getLocale(router.locale)

  const [stations, setStations] = React.useState(initialStations)
  const [showFavorites, setShowFavorites] = React.useState(false)

  const favorites = useStore(useFavorites, state => state.favorites)

  React.useMemo(() => {
    if (showFavorites && favorites) {
      setStations(
        initialStations.filter(station => {
          return favorites.includes(station.stationShortCode)
        })
      )
    } else {
      setStations(initialStations)
    }
  }, [favorites, initialStations, showFavorites])

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
          changeCallback={stations => {
            setStations(stations)
            setShowFavorites(false)
          }}
          submitCallback={router.push}
          placeholder={t('searchForStation')}
          ariaLabel={t('buttons', 'searchLabel')}
        />
        <div style={{ marginBottom: '10px' }}>
          <SwitchButton
            id="favorite"
            onCheckedChange={setShowFavorites}
            checked={showFavorites}
          >
            <List key="list" />
            <HeartFilled />
          </SwitchButton>
        </div>
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

Home.layout = Page
