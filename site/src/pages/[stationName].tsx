import type { LocalizedStation } from '@junat/digitraffic/types'
import type { i18nTuple } from '@junat/digitraffic'
import type { StationScreenTranslations } from '@junat/cms'
import type { ParsedUrlQuery } from 'node:querystring'
import type {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult
} from 'next'
import type { TimetableProps } from '@junat/ui'

import { useMemo } from 'react'

import Head from 'next/head'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Link from 'next/link'

import { useQuery } from 'react-query'

import { getStationPath } from '@junat/digitraffic/utils'
import { getStationScreenTranslations } from '@junat/cms'
import { styled } from '@junat/stitches'

import { getStations } from '@utils/get_stations'
import { getLocale } from '@utils/get_locale'
import { sortSimplifiedTrains } from '@utils/sort_simplified_trains'
import { getCalendarDate } from '@utils/date'

import constants from 'src/constants'

import { fetchLiveTrains, fetchStations } from '@services/digitraffic.service'

import Header from '@components/common/Header'
import Webmanifest from '@components/common/Webmanifest'

import useStationTrains from '@hooks/use_station_trains'
import { useTimetableRow } from '@hooks/use_timetable_row'
import { useStationPage } from '@hooks/use_station_page'

import Page from '@layouts/Page'

const getTrainPath = (locale: 'fi' | 'en' | 'sv'): string => {
  switch (locale) {
    case 'fi':
      return 'juna'
    case 'en':
      return 'train'
    case 'sv':
      return 'tog'
  }
}

const FetchTrainsButton = dynamic(() => import('@components/FetchTrainsButton'))
const Timetable = dynamic(() => import('@junat/ui/components/Timetable'))

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
  translation: StationScreenTranslations
  locale: 'fi' | 'en' | 'sv'
}

export default function StationPage({
  station,
  translation,
  locale
}: StationPageProps) {
  const [timetableRowId, setTimetableRowId] = useTimetableRow(state => [
    state.timetableRowId,
    state.setTimetableRowId
  ])

  const router = useRouter()
  const [count, setCount] = useStationPage(state => [
    state.getCount(router.asPath) || 0,
    state.setCount
  ])

  const { data: stations = [] } = useQuery('stations', fetchStations)

  const {
    data: initialTrains = [],
    isFetching,
    isSuccess
  } = useQuery(
    [`trains/${router.asPath}`, count],
    async () =>
      await fetchLiveTrains({
        stationShortCode: station.stationShortCode,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        localizedStations: stations!,
        departing: count > 0 ? count * 100 : 20
      }),
    {
      enabled: stations.length > 0,
      keepPreviousData: true
    }
  )

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

  useMemo(() => {
    if (initialTrains.length > 0) setTrains(initialTrains)
  }, [initialTrains, setTrains])

  return (
    <>
      <Head>
        <title>{translation.title}</title>
        <meta name="description" content={translation.description} />
      </Head>
      <Webmanifest
        startUrl={router.asPath}
        name={`${station.stationName[locale]} | ${constants.SITE_NAME}`}
        shortName={station.stationName[locale]}
      />
      <StyledStationPage>
        <Header heading={station.stationName[locale]} />
        {empty && <p>{translation.notFound}</p>}
        <Timetable
          StationAnchor={props => (
            <TimetableStationAnchor
              setTimetableRowId={setTimetableRowId}
              {...props}
            />
          )}
          TrainAnchor={props => (
            <TimetableTrainAnchor
              locale={locale}
              setTimetableRowId={setTimetableRowId}
              {...props}
            />
          )}
          locale={locale}
          trains={sortSimplifiedTrains(trains)}
          translation={translation}
          lastStationId={timetableRowId}
          setLastStationId={setTimetableRowId}
        />
        <FetchTrainsButtonWrapper>
          <FetchTrainsButton
            isLoading={isFetching}
            loadingText={translation.fetchTrainsButtonLoading}
            disabled={isFetching}
            visible={visible}
            text={translation.fetchTrainsButton}
            handleClick={() => setCount(count + 1, router.asPath)}
          />
        </FetchTrainsButtonWrapper>
      </StyledStationPage>
    </>
  )
}

StationPage.layout = Page

function TimetableTrainAnchor({
  trainNumber,
  type,
  commuterLineId,
  locale,
  departureDate,
  timetableRowId,
  setTimetableRowId
}: Parameters<TimetableProps['TrainAnchor']>[number] & {
  locale: 'fi' | 'en' | 'sv'
  setTimetableRowId: (id: string) => void
}) {
  return (
    <Link
      passHref
      href={`/${getTrainPath(locale)}/${getCalendarDate(
        departureDate
      )}/${trainNumber}`}
    >
      <a onClick={() => setTimetableRowId(timetableRowId)}>
        {commuterLineId || `${type}${trainNumber}`}
      </a>
    </Link>
  )
}

function TimetableStationAnchor({
  stationName,
  timetableRowId,
  setTimetableRowId
}: Parameters<TimetableProps['StationAnchor']>[number] & {
  setTimetableRowId: (id: string) => void
}) {
  return (
    <Link passHref href={getStationPath(stationName)}>
      <a onClick={() => setTimetableRowId(timetableRowId)}>{stationName}</a>
    </Link>
  )
}

export const getStaticPaths = async (
  context: GetStaticPropsContext
): Promise<GetStaticPathsResult> => {
  let paths: {
    params: ParsedUrlQuery
    locale?: string | undefined
  }[] = []

  if (!context.locales) {
    throw new TypeError('Expected context.locales to be defined.')
  }

  for (const locale of context.locales as Required<i18nTuple>) {
    const stations = await getStations({
      locale,
      betterNames: true,
      includeNonPassenger: false,
      omitInactive: true
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
    locale,
    betterNames: true,
    includeNonPassenger: false,
    omitInactive: true
  })

  const station = stations.find(station => {
    return getStationPath(station.stationName[locale]) === params.stationName
  })

  if (!station) {
    return { notFound: true }
  }

  const translation = await getStationScreenTranslations(
    getLocale(context.locale),
    {
      stationName: station.stationName[locale]
    }
  )

  return {
    props: { station, translation, locale }
  }
}
