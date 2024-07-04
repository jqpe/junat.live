import type { LocalizedStation } from '~/lib/digitraffic'
import type { Locale } from '~/types/common'

import React from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { From, To } from 'frominto'
import { shallow } from 'zustand/shallow'

import { interpolateString as i } from '@junat/core/i18n'
import { sortTrains } from '@junat/core/utils/train'

import { ErrorMessageWithRetry } from '~/components/error_message'
import { Head } from '~/components/head'
import { Header } from '~/components/header'
import { Spinner } from '~/components/spinner'
import { StationDropdownMenu } from '~/components/station_dropdown_menu'
import { useStationFilters } from '~/hooks/use_filters'
import { useStationPage } from '~/hooks/use_station_page'
import { useTimetableRow } from '~/hooks/use_timetable_row'
import { useTimetableType } from '~/hooks/use_timetable_type'
import { translate } from '~/i18n'
import Page from '~/layouts/page'
import {
  useLiveTrains,
  useLiveTrainsSubscription,
  useStations,
} from '~/lib/digitraffic'
import { getErrorQuery } from '~/lib/react_query'
import { showFetchButton } from '../helpers'

const AnimatedButton = dynamic(() => import('~/components/animated_button'))
const Timetable = dynamic(() => import('~/components/timetable'))

export type StationProps = {
  station: LocalizedStation
  locale: Locale
}

export function Station({ station, locale }: StationProps) {
  const timetableRowId = useTimetableRow(state => state.timetableRowId)

  const router = useRouter()
  const { count, setCount, setCurrentShortCode, currentShortCode } =
    useStationPage(
      state => ({
        ...state,
        count: state.getCount(router.asPath) || 0,
      }),
      shallow,
    )
  const type = useTimetableType(state => state.type)

  const { data: stations = [], ...stationsQuery } = useStations()
  const { destination } = useStationFilters(currentShortCode)

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

  useLiveTrainsSubscription({
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
        <meta name="geo.region" content={`${station.countryCode}`} />
        <meta name="geo.placename" content={station.stationName[locale]} />
      </Head>
      <main className="w-[100%]">
        <Header heading={station.stationName[locale]} />
        <div className="flex items-center justify-end mb-9">
          <StationDropdownMenu
            locale={locale}
            currentStation={station.stationShortCode}
            lat={station.latitude}
            long={station.longitude}
          />
        </div>

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
          </p>
        )}
        {train.isFetching && trains.length === 0 && <Spinner fixedToCenter />}
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
