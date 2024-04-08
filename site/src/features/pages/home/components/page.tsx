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
import i, { interpolateString } from '@utils/interpolate_string'
import translate from '@utils/translate'

import HeartFilled from '~/components/icons/heart_filled.svg'
import List from '~/components/icons/list.svg'

import { useToast } from '~/features/toast'
import { getPrettifiedAccuracy } from '~/features/geolocation/utils/accuracy'
import { Locale } from '~/types/common'

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

  const [position, setPosition] = React.useState<GeolocationPosition>()
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
        <Header heading={constants.SITE_NAME} visuallyHidden />
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
            aria-label={
              showFavorites ? t('showAllStations') : t('showFavorites')
            }
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
            onSuccess={setPosition}
            onError={error => toast(error.localizedErrorMessage)}
            onStations={stations => {
              setOpen(true)
              setNearbyStations(stations)
            }}
          />
        </nav>
        <StationList stations={shownStations} locale={locale} />
        <BottomSheet
          initialFocusRef={false}
          open={open}
          snapPoints={({ minHeight }) => minHeight}
          onDismiss={() => setOpen(false)}
          header={<span>{t('nearbyStations')}</span>}
          footer={
            <span className="text-[10px] text-gray-600">
              {position ? getLocalizedAccuracy(locale, position) : null}
            </span>
          }
        >
          <div className="px-[30px] py-5 flex flex-col max-h-48 gap-[25px] overflow-y-scroll snap-y snap-mandatory items-start scroll-smooth">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col snap-center gap-2  w-full"
                data-body-scroll-lock-ignore="true"
              >
                {nearbyStations.slice(i * 5, i * 5 + 5).map(station => (
                  <a
                    className="w-full text-base no-underline"
                    key={station.stationShortCode}
                    href={getStationPath(station.stationName[locale])}
                  >
                    {station.stationName[locale]}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </BottomSheet>
      </main>
    </>
  )
}

Home.layout = Page

function getLocalizedAccuracy(locale: Locale, position: GeolocationPosition) {
  const metres = getPrettifiedAccuracy(position?.coords.accuracy, locale)
  const rtf = new Intl.RelativeTimeFormat(locale, { style: 'long' })

  const t = translate(locale)

  let locationTimestamp = position.timestamp

  const isDesktopSafari =
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent) &&
    /Macintosh|MacIntel/.test(navigator.platform)

  // Adjust for Safari Desktop's non-standard Epoch (January 1, 2001) see https://openradar.appspot.com/9246279
  if (isDesktopSafari) {
    const safariEpochOffset = new Date('2001-01-01T00:00:00Z').getTime()
    locationTimestamp = position.timestamp + safariEpochOffset
  }

  const seconds = Math.floor((Date.now() - locationTimestamp) / 1000)

  const timeunit =
    seconds === 0
      ? 'now'
      : seconds === 1
      ? 'second'
      : seconds >= 60
      ? 'minutes'
      : 'seconds'

  const ago = {
    now: t('justNow'),
    minute: rtf.format(-1, 'minute'),
    minutes: rtf.format(-Math.floor(seconds / 60), 'minutes'),
    second: rtf.format(-1, 'second'),
    seconds: rtf.format(-seconds, 'seconds')
  }[timeunit]

  return interpolateString(t('$nearbyStationsFooter'), { metres, ago })
}
