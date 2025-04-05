import type { GetTranslatedValue } from '@junat/core/i18n'
import type { LocalizedStation } from '~/lib/digitraffic'
import type { Locale } from '~/types/common'

import React from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { cx } from 'cva'

import { SITE_NAME } from '@junat/core/constants'
import {
  getAccuracyWithUnit,
  normalizeRelativeTimestampMs,
} from '@junat/core/geolocation'
import { interpolateString as i } from '@junat/core/i18n'
import { useAnnounce } from '@junat/react-hooks/use_announce'
import { useClientStore } from '@junat/react-hooks/use_client_store'
import { useFavorites } from '@junat/react-hooks/use_favorites'
import { useToast } from '@junat/ui/components/toast/index'
import { ToggleButton } from '@junat/ui/components/toggle_button'
import HeartFilled from '@junat/ui/icons/heart_filled.svg'
import List from '@junat/ui/icons/list.svg'

import { Head } from '~/components/head'
import { Notification } from '~/components/notification'
import { SearchBar } from '~/components/search_bar'
import { StationList } from '~/components/station_list'
import { useLocale, useTranslations } from '~/i18n'
import Page from '~/layouts/page'
import { getStationPath } from '~/lib/digitraffic'
import { createListNavHandler, getMessage } from '../helpers/a11y'

const GeolocationButton = dynamic(() =>
  import('~/components/geolocation_button').then(mod => mod.GeolocationButton),
)

const BottomSheet = dynamic(() =>
  import('@junat/ui/components/bottom_sheet').then(mod => mod.BottomSheet),
)

export type HomeProps = {
  initialStations: LocalizedStation[]
}

export function Home({ initialStations }: Readonly<HomeProps>) {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations()

  const { toast } = useToast()
  const announce = useAnnounce({})

  const [position, setPosition] = React.useState<GeolocationPosition>()
  const [nearbyStations, setNearbyStations] = React.useState<
    LocalizedStation[]
  >([])
  const [open, setOpen] = React.useState(false)

  const [stations, setStations] = React.useState(initialStations)
  const [activeStation, setActiveStation] = React.useState(-1)
  const searchInputRef = React.useRef<HTMLInputElement>(null!)
  const [showFavorites, setShowFavorites] = React.useState(false)

  const favoritesStore = useClientStore(
    // Zustand moment
    // eslint-disable-next-line react-compiler/react-compiler
    useFavorites,
    state => state,
  )
  const favorites = favoritesStore?.favorites

  const favoriteStations = initialStations.filter(station => {
    return favorites?.includes(station.stationShortCode)
  })

  React.useLayoutEffect(() => {
    const setActive = () => setActiveStation(-1)

    searchInputRef.current.addEventListener('blur', setActive)

    if (favoritesStore?.homePageDefaultList && (favorites?.length ?? 0) > 0) {
      setShowFavorites(true)
    }

    return () => searchInputRef.current.removeEventListener('blur', setActive)
  }, [favoritesStore?.homePageDefaultList, favorites?.length])

  const shownStations = React.useMemo<LocalizedStation[]>(() => {
    if (showFavorites && favoriteStations.length > 0) {
      return favoriteStations
    }

    if (stations.length > 0) {
      return stations
    }

    return initialStations
  }, [favoriteStations, initialStations, showFavorites, stations])

  const message = getMessage({ activeStation, shownStations, locale })
  const handleListNavigation = createListNavHandler(
    searchInputRef,
    setActiveStation,
    stations,
  )

  if (
    message &&
    typeof document !== 'undefined' &&
    searchInputRef.current === document.activeElement
  ) {
    announce(message)
  }

  return (
    <>
      <Head
        path={router.asPath}
        title={SITE_NAME}
        description={i(t('homePage.meta.description { siteName }'), {
          siteName: SITE_NAME,
        })}
      />
      <main>
        <div onKeyDown={handleListNavigation} role="presentation">
          <h1 className="sr-only">{SITE_NAME}</h1>

          <SearchBar
            ref={searchInputRef}
            stations={stations}
            locale={locale}
            changeCallback={stations => {
              setActiveStation(-1)
              setStations(stations)
              setShowFavorites(false)
            }}
            onSubmit={event => {
              event.preventDefault()

              const activeOrFirst = Math.max(0, activeStation)
              const path = getStationPath(
                shownStations[activeOrFirst]!.stationName[locale],
              )

              router.push(`/${router.locale}/${path}`)
            }}
            placeholder={t('searchForStation')}
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

          <StationList
            tabFocusable={showFavorites && favoriteStations.length > 0}
            activeStation={activeStation}
            stations={shownStations}
          />

          <GeolocationButton
            translations={t('errors')}
            label={t('buttons.geolocationLabel')}
            locale={locale}
            stations={initialStations}
            onSuccess={setPosition}
            onError={error => toast(error.localizedErrorMessage)}
            onStations={stations => {
              setOpen(true)
              setNearbyStations(stations)
            }}
          />

          <BottomSheet
            initialFocusRef={false}
            open={open}
            snapPoints={({ minHeight }) => minHeight}
            onDismiss={() => setOpen(false)}
            header={<span>{t('nearbyStations')}</span>}
            footer={
              <span className="text-[10px] text-gray-600">
                {position
                  ? getLocalizedAccuracy({ locale, position, t })
                  : null}
              </span>
            }
          >
            <div
              className={cx(
                'flex max-h-48 snap-y snap-mandatory flex-col',
                'items-start gap-[25px] overflow-y-scroll scroll-smooth px-[30px] py-5',
              )}
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex w-full snap-center flex-col gap-2"
                  data-body-scroll-lock-ignore="true"
                >
                  {nearbyStations.slice(i * 5, i * 5 + 5).map(station => (
                    <Link
                      className="w-full text-base no-underline"
                      key={station.stationShortCode}
                      href={getStationPath(station.stationName[locale])}
                    >
                      {station.stationName[locale]}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </BottomSheet>
        </div>
      </main>
    </>
  )
}

Home.layout = Page

interface GetLocalizedAccuracyOptions {
  locale: Locale
  position: { coords: { accuracy: number }; timestamp: number }
  t: GetTranslatedValue
}

function getLocalizedAccuracy(options: GetLocalizedAccuracyOptions) {
  const { locale, position, t } = options

  const metres = getAccuracyWithUnit({
    accuracy: position?.coords.accuracy,
    locale,
    t,
  })
  const rtf = new Intl.RelativeTimeFormat(locale, { style: 'long' })

  const seconds = Math.floor(
    normalizeRelativeTimestampMs(position.timestamp) / 1000,
  )

  let timeunit = 'seconds'

  switch (true) {
    case seconds == 0: {
      timeunit = 'now'
      break
    }
    case seconds == 1: {
      timeunit = 'second'
      break
    }
    case seconds >= 60: {
      timeunit = 'minutes'
    }
  }

  const ago = {
    now: t('justNow'),
    minute: rtf.format(-1, 'minute'),
    minutes: rtf.format(-Math.floor(seconds / 60), 'minutes'),
    second: rtf.format(-1, 'second'),
    seconds: rtf.format(-seconds, 'seconds'),
  }[timeunit]

  return i(t('locationAccurateTo { metres }; Updated { ago }'), { metres, ago })
}
