import type { LocalizedStation } from '~/lib/digitraffic'

import React from 'react'
import { useLocation } from '@tanstack/react-router'
import { From, To } from 'frominto'
import { shallow } from 'zustand/shallow'

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
import { AnimatedButton } from '@junat/ui/components/animated_button'
import { Header } from '@junat/ui/components/header'

import { ErrorMessageWithRetry } from '~/components/error_message'
import { Spinner } from '~/components/spinner'
import { StationDropdownMenu } from '~/components/station_dropdown_menu'
import { translate, useI18nStore } from '~/i18n'
import { getErrorQuery } from '~/lib/react_query'
import { showFetchButton } from '../helpers'

const { Timetable } = await import('~/components/timetable')
const { PassengerInformation } = await import('./passenger_information')

export type StationProps = {
  station: LocalizedStation
}

export function Station({ station }: StationProps) {
  const timetableRowId = useTimetableRow(state => state.timetableRowId)
  const locale = useI18nStore(state => state.locale)

  const location = useLocation()
  const { count, setCount, setCurrentShortCode, currentShortCode } =
    useStationPage(
      state => ({
        ...state,
        count: state.getCount(location.pathname) || 0,
      }),
      shallow,
    )
  const type = useTimetableType(state => state.type)

  const { data: stations = [], ...stationsQuery } = useStations({
    t: translate('all'),
  })
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

  void useLiveTrainsSubscription({
    stationShortCode: station.stationShortCode,
    queryKey: useLiveTrains.queryKey,
  })

  const t = translate(locale)

  const errorQuery = getErrorQuery([stationsQuery, train])

  return (
    <main className="w-[100%]">
      <Header heading={station.stationName[locale]} />
      <div className="mb-9 flex items-center justify-end">
        <PassengerInformation stationShortCode={station.stationShortCode} />

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
          handleClick={() => setCount(count + 1, location.pathname)}
        >
          {t('buttons.fetchTrains')}
        </AnimatedButton>
      </div>
    </main>
  )
}
