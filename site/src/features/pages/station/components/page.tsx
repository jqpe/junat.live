import type { LocalizedStation } from '@lib/digitraffic'
import type { Locale } from '@typings/common'

import React from 'react'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { shallow } from 'zustand/shallow'

import { sortSimplifiedTrains } from '@utils/train'
import translate from '@utils/translate'

import i from '@utils/interpolate_string'

import { Head } from '~/components/head'
import { Header } from '~/components/header'
import { Spinner } from '~/components/spinner'

import { useStationPage } from '@hooks/use_station_page'
import { useTimetableRow } from '@hooks/use_timetable_row'
import {
  useLiveTrains,
  useLiveTrainsSubscription,
  useStations
} from '~/lib/digitraffic'
import { getErrorQuery } from '~/lib/react_query'

import Page from '~/layouts/page'
import { showFetchButton } from '../helpers'

const AnimatedButton = dynamic(() => import('~/components/animated_button'))
const Timetable = dynamic(() => import('~/components/timetable'))

import { From, To } from 'frominto'
import { ErrorMessageWithRetry } from '~/components/error_message'
import { StationDropdownMenu } from '~/components/station_dropdown_menu'
import { useFilters } from '~/hooks/use_filters'

export type StationProps = {
  station: LocalizedStation
  locale: Locale
}

export function Station({ station, locale }: StationProps) {
  const timetableRowId = useTimetableRow(state => state.timetableRowId)

  const router = useRouter()
  const [count, setCount, setCurrentShortCode] = useStationPage(
    state => [
      state.getCount(router.asPath) || 0,
      state.setCount,
      state.setCurrentShortCode
    ],
    shallow
  )

  const { data: stations = [], ...stationsQuery } = useStations()
  const destination = useFilters(state => state.destination)

  React.useEffect(
    () => setCurrentShortCode(station.stationShortCode),
    [setCurrentShortCode, station.stationShortCode]
  )

  const fromStation = station.stationName[locale]
  const toStation = stations.find(
    station => station.stationShortCode === destination
  )?.stationName[locale]

  const from = locale === 'fi' ? From(fromStation) : fromStation
  const to = locale === 'fi' && toStation ? To(toStation) : toStation

  // Keep track of the fetched trains since cache may be changed affecting length, used for `showFetchButton` logic.
  const [actualLength, setActualLength] = React.useState<number>()

  const train = useLiveTrains({
    count,
    filters: {
      destination
    },
    onSuccess: trains => setActualLength(trains.length),
    localizedStations: stations,
    stationShortCode: station.stationShortCode,
    path: router.asPath
  })

  const trains = train.data?.filter(train => train.commercialStop) ?? []

  const empty = train.isSuccess && train.data.length === 0

  useLiveTrainsSubscription({
    stationShortCode: station.stationShortCode,
    stations,
    queryKey: useLiveTrains.queryKey
  })

  const t = translate(locale)

  const errorQuery = getErrorQuery([stationsQuery, train])

  return (
    <>
      <Head
        title={station.stationName[locale]}
        description={i(t('stationPage', 'meta', '$description'), {
          stationName: station.stationName[locale]
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
              ? i(t('stationPage', '$routeNotFound'), {
                  from,
                  to
                })
              : i(t('stationPage', '$notFound'), {
                  stationName: station.stationName[locale]
                })}
          </p>
        )}
        {train.isFetching && trains.length === 0 && <Spinner fixedToCenter />}
        <Timetable
          locale={locale}
          trains={sortSimplifiedTrains(trains)}
          lastStationId={timetableRowId}
        />
        <div className="flex content-center [&>button]:mt-[2rem]">
          <AnimatedButton
            isLoading={train.isFetching}
            loadingText={t('loading')}
            disabled={train.isFetching}
            visible={showFetchButton(
              actualLength ?? trains.length,
              train.isFetching,
              count
            )}
            handleClick={() => setCount(count + 1, router.asPath)}
          >
            {t('buttons', 'fetchTrains')}
          </AnimatedButton>
        </div>
      </main>
    </>
  )
}

Station.layout = Page
