import type { Locale } from '@typings/common'
import type { LocalizedStation } from '@lib/digitraffic'

import { useEffect, useMemo } from 'react'

import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import { styled } from '@junat/design'

import { sortSimplifiedTrains } from '@utils/train'
import translate from '@utils/translate'

import i from '@utils/interpolate_string'

import { useStations } from '@hooks/use_stations'

import Header from '@components/common/header'
import { Head } from '@components/common/head'

import { useStationTrains } from '@hooks/use_station_trains'
import { useTimetableRow } from '@hooks/use_timetable_row'
import { useStationPage } from '@hooks/use_station_page'
import { useLiveTrains } from '@hooks/use_live_trains'

import Page from '@layouts/page'
import { DigitrafficError } from '@components/errors/digitraffic'
import { Spinner } from '@components/elements/spinner'
import { showFetchButton } from '../helpers'

const AnimatedButton = dynamic(
  () => import('@components/buttons/animated_background')
)
const Timetable = dynamic(() => import('@components/timetables/timetable'))

const PrimaryButtonWrapper = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  '> button': {
    marginTop: '2rem'
  }
})

const StyledStationPage = styled('main', {
  width: '100%'
})

export type StationProps = {
  station: LocalizedStation
  locale: Locale
}

export function Station({ station, locale }: StationProps) {
  const timetableRowId = useTimetableRow(state => state.timetableRowId)

  const router = useRouter()
  const [count, setCount, setCurrentShortCode] = useStationPage(state => [
    state.getCount(router.asPath) || 0,
    state.setCount,
    state.setCurrentShortCode
  ])

  const { data: stations = [] } = useStations()

  useEffect(
    () => setCurrentShortCode(station.stationShortCode),
    [setCurrentShortCode, station.stationShortCode]
  )

  const train = useLiveTrains({
    count,
    localizedStations: stations,
    stationShortCode: station.stationShortCode,
    path: router.asPath
  })

  const empty = train.isSuccess && train.data.length === 0

  const [trains, setTrains] = useStationTrains({
    stationShortCode: station.stationShortCode,
    stations,
    initialTrains: train.data ?? []
  })

  const t = translate(locale)

  useMemo(() => {
    if (train.data && train.data.length > 0) setTrains(train.data)
  }, [train.data, setTrains])

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
      <StyledStationPage>
        <Header heading={station.stationName[locale]} />
        {empty && (
          <p>
            {i(t('stationPage', '$notFound'), {
              stationName: station.stationName[locale]
            })}
          </p>
        )}
        <DigitrafficError {...train} locale={locale} />
        {train.isFetching && (
          <Spinner
            css={{
              backgroundColor: '$secondary300',
              position: 'fixed',
              left: '50%',
              top: '50%'
            }}
          />
        )}
        <Timetable
          locale={locale}
          trains={sortSimplifiedTrains(trains)}
          lastStationId={timetableRowId}
        />
        <PrimaryButtonWrapper>
          <AnimatedButton
            isLoading={train.isFetching}
            loadingText={t('loading')}
            disabled={train.isFetching}
            visible={showFetchButton(train.data)}
            handleClick={() => setCount(count + 1, router.asPath)}
          >
            {t('buttons', 'fetchTrains')}
          </AnimatedButton>
        </PrimaryButtonWrapper>
      </StyledStationPage>
    </>
  )
}

Station.layout = Page