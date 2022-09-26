import type { Locale } from '@typings/common'
import type { LocalizedStation } from '@lib/digitraffic'
import type { ParsedUrlQuery } from 'node:querystring'
import type {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult
} from 'next'

import { useEffect, useMemo } from 'react'

import Head from 'next/head'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import { getStationPath } from '@junat/digitraffic/utils'
import { styled } from '@junat/design'

import { getStations } from '@utils/get_stations'
import { getLocale } from '@utils/get_locale'
import { sortSimplifiedTrains } from '@utils/sort_simplified_trains'
import translate from '@utils/translate'

import i from '@utils/interpolate_string'

import constants from 'src/constants'

import { useStations } from '@hooks/use_stations'

import Header from '@components/common/Header'
import Webmanifest from '@components/common/Webmanifest'

import { useStationTrains } from '@hooks/use_station_trains'
import { useTimetableRow } from '@hooks/use_timetable_row'
import { useStationPage } from '@hooks/use_station_page'
import { useLiveTrains } from '@hooks/use_live_trains'

import Page from '@layouts/Page'

const FetchTrainsButton = dynamic(() => import('@components/FetchTrainsButton'))
const Timetable = dynamic(() => import('@components/Timetable'))

const FetchTrainsButtonWrapper = styled('div', {
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

  const {
    data: initialTrains = [],
    isFetching,
    isSuccess
  } = useLiveTrains({
    count,
    localizedStations: stations,
    stationShortCode: station.stationShortCode,
    path: router.asPath
  })

  const empty = isSuccess && initialTrains.length === 0

  const visible = useMemo(() => {
    return (
      (isFetching && initialTrains.length > 0) ||
      (initialTrains.length > 19 &&
        !(count > 0 && initialTrains.length % 100 !== 0))
    )
  }, [isFetching, initialTrains, count])

  const [trains, setTrains] = useStationTrains({
    stationShortCode: station.stationShortCode,
    stations,
    initialTrains
  })

  const t = translate(locale)

  useMemo(() => {
    if (initialTrains.length > 0) setTrains(initialTrains)
  }, [initialTrains, setTrains])

  return (
    <>
      <Head>
        <title>{station.stationName[locale]}</title>
        <meta
          name="description"
          content={i(t('stationPage', 'meta', '$description'), {
            stationName: station.stationName[locale]
          })}
        />
      </Head>
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
        <Timetable
          locale={locale}
          trains={sortSimplifiedTrains(trains)}
          translation={{
            cancelledText: t('cancelled'),
            departureTime: t('departureTime'),
            destination: t('destination'),
            track: t('track'),
            train: t('train')
          }}
          lastStationId={timetableRowId}
        />
        <FetchTrainsButtonWrapper>
          <FetchTrainsButton
            isLoading={isFetching}
            loadingText={t('loading')}
            disabled={isFetching}
            visible={visible}
            text={t('buttons', 'fetchTrains')}
            handleClick={() => setCount(count + 1, router.asPath)}
          />
        </FetchTrainsButtonWrapper>
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
