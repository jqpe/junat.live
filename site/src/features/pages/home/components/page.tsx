import type { GeolocationButtonProps } from '@features/geolocation'
import { getStationPath, type LocalizedStation } from '@lib/digitraffic'

import React from 'react'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import constants from '~/constants'

import { Head } from '~/components/head'
import { Header } from '~/components/header'
import { Notification } from '~/components/notification'
import { StationList } from '~/components/station_list'
import { ToggleButton } from '~/components/toggle_button'

import { useClientStore } from '~/hooks/use_client_store'
import { useFavorites } from '~/hooks/use_favorites'

import { SearchBar } from '@features/search'

import Page from '@layouts/page'

import { getLocale } from '@utils/get_locale'
import i from '@utils/interpolate_string'
import translate from '@utils/translate'

import HeartFilled from '~/components/icons/heart_filled.svg'
import List from '~/components/icons/list.svg'

import { useToast } from '~/features/toast'

const GeolocationButton = dynamic<GeolocationButtonProps>(() =>
  import('@features/geolocation').then(mod => mod.GeolocationButton)
)

const BottomSheet = dynamic(() =>
  import('~/components/bottom_sheet').then(mod => mod.BottomSheet)
)

export type HomeProps = {
  initialStations: LocalizedStation[]
}

export function Home({ initialStations }: HomeProps) {
  const router = useRouter()
  const locale = getLocale(router.locale)

  const { toast } = useToast()

  const [nearbyStations, setNearbyStations] = React.useState<
    LocalizedStation[]
  >([])
  const [open, setOpen] = React.useState(false)

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
          <ToggleButton
            id="favorite"
            onCheckedChange={setShowFavorites}
            checked={showFavorites}
          >
            <List className="dark:fill-gray-300" />
            <HeartFilled className="dark:fill-gray-300" />
          </ToggleButton>
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
            onError={error => toast(error.localizedErrorMessage)}
            onStations={stations => {
              setOpen(true)
              setNearbyStations(stations)
            }}
          />
        </nav>
        <StationList stations={shownStations} locale={locale} />
        <BottomSheet
          open={open}
          snapPoints={({ minHeight }) => minHeight}
          onDismiss={() => setOpen(false)}
          header={<span>Nearby stations</span>}
        >
          <div className="px-[30px] py-5 flex flex-col gap-1">
            {nearbyStations.slice(0, 10).map(station => (
              <a
                key={station.stationShortCode}
                href={getStationPath(station.stationName[locale])}
              >
                {station.stationName[locale]}
              </a>
            ))}
          </div>
        </BottomSheet>
      </main>
    </>
  )
}

Home.layout = Page
