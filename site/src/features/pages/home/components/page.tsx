import type { GetTranslatedValue } from '@junat/core/i18n'
import type { LocalizedStation } from '~/lib/digitraffic'
import type { Locale } from '~/types/common'

import React from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { SITE_NAME } from '@junat/core/constants'
import {
  getAccuracyWithUnit,
  normalizeRelativeTimestampMs,
} from '@junat/core/geolocation'
import { interpolateString as i } from '@junat/core/i18n'

import { Head } from '~/components/head'
import { Header } from '~/components/header'
import HeartFilled from '~/components/icons/heart_filled.svg'
import List from '~/components/icons/list.svg'
import { Notification } from '~/components/notification'
import { SearchBar } from '~/components/search_bar'
import { StationList } from '~/components/station_list'
import { useToast } from '~/components/toast'
import { ToggleButton } from '~/components/toggle_button'
import { useClientStore } from '~/hooks/use_client_store'
import { useFavorites } from '~/hooks/use_favorites'
import { useLocale, useTranslations } from '~/i18n'
import Page from '~/layouts/page'
import { getStationPath } from '~/lib/digitraffic'

const GeolocationButton = dynamic(() =>
  import('~/components/geolocation_button').then(mod => mod.GeolocationButton),
)

const BottomSheet = dynamic(() =>
  import('~/components/bottom_sheet').then(mod => mod.BottomSheet),
)

export type HomeProps = {
  initialStations: LocalizedStation[]
}

export function Home({ initialStations }: HomeProps) {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations()

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
        <Header heading={SITE_NAME} visuallyHidden />
        <SearchBar
          stations={stations}
          locale={locale}
          changeCallback={stations => {
            setStations(stations)
            setShowFavorites(false)
          }}
          submitCallback={router.push}
          placeholder={t('searchForStation')}
          ariaLabel={t('buttons.searchLabel')}
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
              {position ? getLocalizedAccuracy({ locale, position, t }) : null}
            </span>
          }
        >
          <div className="flex max-h-48 snap-y snap-mandatory flex-col items-start gap-[25px] overflow-y-scroll scroll-smooth px-[30px] py-5">
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
    seconds: rtf.format(-seconds, 'seconds'),
  }[timeunit]

  return i(t('locationAccurateTo { metres }; Updated { ago }'), { metres, ago })
}
