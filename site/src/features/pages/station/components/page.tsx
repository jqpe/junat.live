import type { LocalizedStation } from '~/lib/digitraffic'
import type { Locale } from '~/types/common'

import React from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { cx } from 'cva'
import { From, To } from 'frominto'

import { interpolateString as i } from '@junat/core/i18n'
import { sortTrains } from '@junat/core/utils/train'
import {
  useStationFilters,
  useStationPage,
  useTimetableRow,
  useTimetableType,
} from '@junat/react-hooks'
import {
  useLiveTrains,
  useLiveTrainsSubscription,
  useStations,
} from '@junat/react-hooks/digitraffic'

import { ErrorMessageWithRetry } from '~/components/error_message'
import { Head } from '~/components/head'
import { Spinner } from '~/components/spinner'
import { StationDropdownMenu } from '~/components/station_dropdown_menu'
import { translate } from '~/i18n'
import Page from '~/layouts/page'
import { getErrorQuery } from '~/lib/react_query'
import { showFetchButton } from '../helpers'

const Alerts = dynamic(() => import('./alert').then(mod => mod.Alerts))

const WeatherBadge = dynamic(() =>
  import('./weather_badge').then(mod => mod.WeatherBadge),
)

const AnimatedButton = dynamic(() =>
  import('@junat/ui/components/animated_button').then(
    mod => mod.AnimatedButton,
  ),
)
const Timetable = dynamic(() => import('~/components/timetable'))

export type StationProps = {
  station: LocalizedStation
  locale: Locale
}

export function Station({ station, locale }: StationProps) {
  const timetableRowId = useTimetableRow(state => state.timetableRowId)

  const router = useRouter()
  const { count, setCount, setCurrentShortCode, currentShortCode } =
    useStationPage(state => ({
      ...state,
      count: state.getCount(router.asPath) || 0,
    }))
  const type = useTimetableType(state => state.type)

  const { data: stations = [], ...stationsQuery } = useStations({
    t: translate('all'),
  })
  const { destination, setDestination } = useStationFilters(currentShortCode)

  React.useEffect(
    () => setCurrentShortCode(station.stationShortCode),
    [setCurrentShortCode, station.stationShortCode],
  )

  let fromStation = station.stationName[locale]
  let toStation = stations.find(
    station => station.stationShortCode === destination,
  )?.stationName[locale]

  if (type === 'ARRIVAL' && toStation) {
    ;[fromStation, toStation] = [toStation, fromStation]
  }

  const from = locale === 'fi' ? From(fromStation) : fromStation
  const to = locale === 'fi' && toStation ? To(toStation) : toStation

  const train = useLiveTrains({
    count,
    type,
    filters: {
      destination,
    },
    localizedStations: stations,
    stationShortCode: station.stationShortCode,
  })

  const trains = train.data ?? []

  const empty = train.isSuccess && train.data.length === 0

  void useLiveTrainsSubscription({
    stationShortCode: station.stationShortCode,
    queryKey: useLiveTrains.queryKey,
  })

  const t = translate(locale)

  const errorQuery = getErrorQuery([stationsQuery, train])

  return (
    <>
      <Head
        title={station.stationName[locale]}
        description={i(t('stationPage.meta.description { stationName }'), {
          stationName: station.stationName[locale],
        })}
        path={router.asPath}
      >
        <meta
          name="geo.position"
          content={`${station.latitude};${station.longitude}`}
        />
        <meta name="geo.region" content={station.countryCode} />
        <meta name="geo.placename" content={station.stationName[locale]} />
      </Head>

      <main className="w-full">
        <div className="mb-5 flex items-center justify-end md:mb-8">
          <h1 className="mr-auto">{station.stationName[locale]}</h1>

          <WeatherBadge station={station} />

          <StationDropdownMenu
            locale={locale}
            currentStation={station.stationShortCode}
            lat={station.latitude}
            long={station.longitude}
          />
        </div>
        <Alerts stationShortCode={station.stationName.en} />

        {errorQuery !== undefined && (
          <ErrorMessageWithRetry
            error={errorQuery.error}
            locale={locale}
            onRetryButtonClicked={() => errorQuery.refetch()}
          />
        )}

        {empty && (
          <p>
            {destination && from && to
              ? i(t('stationPage.routeNotFound { from } { to }'), {
                  from,
                  to,
                })
              : i(t('stationPage.notFound { stationName }'), {
                  stationName: station.stationName[locale],
                })}

            {destination && (
              <button
                className={cx(
                  'rounded-sm bg-error-600 p-1 font-ui text-sm leading-4 text-error-200',
                  'cursor-pointer focus-visible:outline-offset-0 focus-visible:outline-error-700',
                )}
                onClick={() => setDestination('')}
              >
                {t('buttons.clearFilters')}
              </button>
            )}
          </p>
        )}
        {train.isFetching && trains.length === 0 && (
          <Spinner variant="fixedToCenter" />
        )}
        <Timetable
          type={type}
          stationShortCode={station.stationShortCode}
          locale={locale}
          trains={sortTrains(trains, station.stationShortCode, type)}
          lastStationId={timetableRowId}
        />
        <div className="flex content-center [&>button]:mt-[2rem]">
          <AnimatedButton
            isLoading={train.isFetching}
            loadingText={t('loading')}
            disabled={train.isFetching}
            visible={showFetchButton(
              train.data?.length || 0,
              train.isFetching,
              count,
            )}
            handleClick={() => setCount(count + 1, router.asPath)}
          >
            {t('buttons.fetchTrains')}
          </AnimatedButton>
        </div>
      </main>
    </>
  )
}

Station.layout = Page
