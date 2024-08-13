import type { GetTranslatedValue } from '@junat/core/i18n'
import type { LocalizedStation } from '~/lib/digitraffic'
import type { Locale } from '~/types/common'

import React, { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { cx } from 'cva'

import { INACTIVE_STATIONS, SITE_NAME } from '@junat/core/constants'
import {
  getAccuracyWithUnit,
  normalizeRelativeTimestampMs,
} from '@junat/core/geolocation'
import { interpolateString as i } from '@junat/core/i18n'
import { fetchStations } from '@junat/digitraffic'
import { Header } from '@junat/ui/components/header'
import { ToggleButton } from '@junat/ui/components/toggle_button'
import HeartFilled from '@junat/ui/icons/heart_filled.svg?react'
import List from '@junat/ui/icons/list.svg?react'

import { Notification } from '~/components/notification'
import { SearchBar } from '~/components/search_bar'
import { StationList } from '~/components/station_list'
import { useToast } from '~/components/toast'
import { useClientStore } from '~/hooks/use_client_store'
import { useFavorites } from '~/hooks/use_favorites'
import { translate, useI18nStore, useTranslations } from '~/i18n'
import { getStationPath, useStations } from '~/lib/digitraffic'

const { GeolocationButton } = await import('~/components/geolocation_button')

const { BottomSheet } = await import('@junat/ui/components/bottom_sheet')

const initialStations = await fetchStations({
  inactiveStations: INACTIVE_STATIONS,
  betterNames: true,
  i18n: translate('all')('stations'),
  proxy: true,
  keepNonPassenger: true,
})

export function Home() {
  const navigate = useNavigate()
  const locale = useI18nStore(state => state.locale)
  const t = useTranslations()

  const { toast } = useToast()
  const [stations, setStations] = useState(initialStations)

  const [position, setPosition] = React.useState<GeolocationPosition>()
  const [nearbyStations, setNearbyStations] = React.useState<
    LocalizedStation[]
  >([])
  const [open, setOpen] = React.useState(false)

  const [showFavorites, setShowFavorites] = React.useState(false)

  const favorites = useClientStore(useFavorites, state => state.favorites)
  const favoriteStations = initialStations?.filter(station => {
    return favorites?.includes(station.stationShortCode)
  })

  const shownStations = React.useMemo<LocalizedStation[] | undefined>(() => {
    if (showFavorites && (favoriteStations?.length ?? 0) > 0) {
      return favoriteStations
    }

    if ((stations?.length ?? 0) > 0) {
      return stations
    }

    return initialStations
  }, [favoriteStations, initialStations, showFavorites, stations])

  if (!stations || !shownStations) {
    console.log('no stations', stations)

    return null
  }

  return (
    <>
      <main>
        <Header heading={SITE_NAME} visuallyHidden />
        <SearchBar
          stations={stations}
          locale={locale}
          changeCallback={stations => {
            setStations(stations)
            setShowFavorites(false)
          }}
          submitCallback={route => navigate({ to: route })}
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
      </main>
    </>
  )
}

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
