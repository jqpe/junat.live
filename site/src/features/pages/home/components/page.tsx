import type { GeolocationButtonProps } from '@features/geolocation'
import type { LocalizedStation } from '@lib/digitraffic'

import React from 'react'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import constants from '~/constants'

import { Head } from '@components/common/head'
import { Header } from '@components/common/header'
import { StationList } from '@components/elements/station_list'
import { SwitchButton } from '~/components/buttons/switch_button'
import HeartFilled from '~/components/icons/heart_filled.svg'
import List from '~/components/icons/list.svg'

import { useClientStore } from '~/hooks/use_client_store'
import { useFavorites } from '~/hooks/use_favorites'

import { SearchBar } from '@features/search'

import Page from '@layouts/page'

import { getLocale } from '@utils/get_locale'
import i from '@utils/interpolate_string'
import translate from '@utils/translate'
import { Notification } from '~/components/elements/notification'

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

  const favorites = useClientStore(useFavorites, state => state.favorites)
  const favoriteStations = initialStations.filter(station => {
    return favorites?.includes(station.stationShortCode)
  })

  const shownStations = React.useMemo<LocalizedStation[]>(() => {
    if (showFavorites && favoriteStations.length > 0) {
      return favoriteStations
    }

    if (stations.length > 0) {
      return stations
    }

    return initialStations
  }, [favoriteStations, initialStations, showFavorites, stations])

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
            <List />
            <HeartFilled />
          </SwitchButton>
        </div>
        {showFavorites && favorites?.length === 0 && (
          <Notification
            title={t('emptyFavoritesHeading')}
            body={t('emptyFavoritesBody')}
          />
        )}
        <nav>
          <GeolocationButton
            label={t('buttons', 'geolocationLabel')}
            locale={locale}
            stations={initialStations}
            setStations={setStations}
          />
        </nav>
        <StationList stations={shownStations} locale={locale} />
      </main>
    </>
  )
}

Home.layout = Page
