import type { Locale } from '@typings/common'
import type { LocalizedStation } from '@lib/digitraffic'
import type { ParsedUrlQuery } from 'node:querystring'
import type {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult
} from 'next'

import { useEffect, useMemo } from 'react'

import { Head } from '@components/common/head'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import { getStationPath } from '@junat/digitraffic'
import { styled } from '@junat/design'

import { getStations } from '@utils/get_stations'
import { getLocale } from '@utils/get_locale'
import { sortSimplifiedTrains } from '@utils/sort_simplified_trains'
import translate from '@utils/translate'

import i from '@utils/interpolate_string'

import constants from 'src/constants'

import { useStations } from '@hooks/use_stations'

import Header from '@components/common/header'
import Webmanifest from '@components/common/webmanifest'

import { useStationTrains } from '@hooks/use_station_trains'
import { useTimetableRow } from '@hooks/use_timetable_row'
import { useStationPage } from '@hooks/use_station_page'
import { useLiveTrains } from '@hooks/use_live_trains'

import Page from '@layouts/page'
import { DigitrafficError } from '@components/errors/digitraffic'
import { Spinner } from '@components/elements/spinner'

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

export interface StationPageProps {
  station: LocalizedStation
  locale: Locale
}

export default function StationPage({ station, locale }: StationPageProps) {
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
      />

      <Webmanifest
        startUrl={router.asPath}
        name={`${station.stationName[locale]} | ${constants.SITE_NAME}`}
        shortName={station.stationName[locale]}
      />
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

StationPage.layout = Page

export const getStaticPaths = async (
  context: GetStaticPropsContext
): Promise<GetStaticPathsResult> => {
  let paths: {
    params: ParsedUrlQuery
    locale?: string
  }[] = []

  if (!context.locales) {
    throw new TypeError('Expected context.locales to be defined.')
  }

  for (const locale of context.locales) {
    const stations = await getStations({
      betterNames: true
    })

    paths = [
      ...paths,
      ...stations.map(station => ({
        params: {
          stationName: getStationPath(station.stationName[getLocale(locale)])
        },
        locale
      }))
    ]
  }

  return { paths, fallback: false }
}

export const getStaticProps = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<StationPageProps>> => {
  const params = context.params
  const locale = getLocale(context.locale)

  if (
    !params ||
    !(params.stationName && typeof params.stationName === 'string')
  ) {
    return { notFound: true }
  }
  const stations = await getStations({
    betterNames: true
  })

  const station = stations.find(
    s => getStationPath(s.stationName[locale]) === params.stationName
  )

  if (!station) {
    return { notFound: true }
  }

  return {
    props: { station, locale }
  }
}

/**
 * The fetch button should only be visible if there are trains to be fetched.
 *
 * 1. If there are no trains the button must be hidden.
 * 2. If there are initial trains ({@link constants.DEFAULT_TRAINS_COUNT|view default}) show the button.
 * 3. If there is more trains than {@link constants.DEFAULT_TRAINS_COUNT|default} and the modulo of {@link constants.TRAINS_MULTIPLIER} compared to the length of trains is zero, show the button.
 *
 * Trains are counted as follows:
 *
 * - *0*. default (e.g. 20)
 * - *1*. multiplier * index (e.g. multiplier = 100 => 100)
 * - *2*. when multiplier = 100 => 200
 *
 * If the API responds with 191 trains in the above case, displaying the button is redundant and is hidden when index = 2.
 *
 * The case: `191 % 100 != 0`
 */
function showFetchButton(trains?: unknown[]) {
  if (!trains || trains.length === 0) {
    return false
  }

  const isPrimaryState = trains.length === constants.DEFAULT_TRAINS_COUNT
  const hasMoreTrains = trains.length % constants.TRAINS_MULTIPLIER === 0

  return isPrimaryState || hasMoreTrains
}
