import type { i18nTuple, LocalizedStation } from '~digitraffic'
import type { StationScreenTranslations } from '@junat/cms'
import type { ParsedUrlQuery } from 'node:querystring'
import type {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult
} from 'next'

import { getStationPath } from '~digitraffic'
import { getStationScreenTranslations } from '@junat/cms'

import { getStations } from '@utils/get_stations'
import { getLocaleOrThrow } from '@utils/get_locale_or_throw'
import { interpolateString } from '@utils/interpolate_string'

import Head from 'next/head'
import { useMemo } from 'react'

import StationPageHeader from '@components/StationPageHeader'

import { Timetable } from '@junat/ui'

import Page from '@layouts/Page'

import { useQuery } from 'react-query'

import { styled } from '@junat/stitches'

import { useRouter } from 'next/router'
import useLiveTrains from '@hooks/use_live_trains.hook'
import dynamic from 'next/dynamic'
import WebmanifestMeta from '@components/WebmanifestMeta'
import constants from 'src/constants'
import { fetchLiveTrains, fetchStations } from '@services/digitraffic.service'
import { useEffect } from 'react'
import { useState } from 'react'
import { sortSimplifiedTrains } from '@utils/sort_simplified_trains'
import { useStore } from 'src/store'
import Link from 'next/link'

const prefix = (n: string) => (n.length === 1 ? `0${n}` : n)

const getYyyyMmDd = () => {
  const [day, month, year] = new Date().toLocaleDateString('fi').split('.')

  return `${year}-${prefix(month)}-${prefix(day)}`
}

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
  const [count, setCount] = useState(0)
  const [lastStationId, setLastStationId] = useStore(state => [
    state.lastStationId,
    state.setLastStationId
  ])

  const router = useRouter()

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
        departingTrains: count > 0 ? count * 100 : 20
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

  const [trains, setTrains] = useLiveTrains({
    stationShortCode: station.stationShortCode,
    stations,
    initialTrains
  })

  useMemo(() => {
    if (initialTrains.length > 0) setTrains(initialTrains)
  }, [initialTrains, setTrains])

  // Reset count on route change.
  useEffect(() => {
    return () => {
      setCount(0)
    }
  }, [router.asPath])

  return (
    <>
      <Head>
        <title>{translation.title}</title>
        <meta name="description" content={translation.description} />
      </Head>
      <WebmanifestMeta
        startUrl={router.asPath}
        name={`${station.stationName[locale]} | ${constants.SITE_NAME}`}
        shortName={station.stationName[locale]}
      />
      <StyledStationPage>
        <StationPageHeader heading={station.stationName[locale]} />
        {empty && <p>{translation.notFound}</p>}
        <Timetable
          StationAnchor={({ stationName }) => (
            <Link
              href={getStationPath(stationName)}
              onClick={() => setLastStationId('')}
            >
              {stationName}
            </Link>
          )}
          TrainAnchor={({ trainNumber, type, commuterLineId }) => (
            <Link
              href={`/${getTrainPath(locale)}/${getYyyyMmDd()}/${trainNumber}`}
            >
              {commuterLineId || `${type}${trainNumber}`}
            </Link>
          )}
          locale={locale}
          trains={sortSimplifiedTrains(trains)}
          translation={translation}
          lastStationId={lastStationId}
          setLastStationId={setLastStationId}
        />
        <FetchTrainsButtonWrapper>
          <FetchTrainsButton
            isLoading={isFetching}
            loadingText={translation.fetchTrainsButtonLoading}
            disabled={isFetching}
            visible={visible}
            text={translation.fetchTrainsButton}
            handleClick={() => setCount(count => count + 1)}
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
    locale?: string | undefined
  }[] = []

  if (!context.locales) {
    throw new TypeError('Expected context.locales to be defined.')
  }

  for (const locale of context.locales as Required<i18nTuple>) {
    const stations = await getStations<LocalizedStation[]>({
      locale,
      betterNames: true,
      includeNonPassenger: false,
      omitInactive: true
    })

    paths = [
      ...paths,
      ...stations.map(station => ({
        params: {
          stationName: getStationPath(
            station.stationName[getLocaleOrThrow(locale)]
          )
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
  const locale = getLocaleOrThrow(context.locale)

  if (
    !params ||
    !(params.stationName && typeof params.stationName === 'string')
  ) {
    return { notFound: true }
  }
  const stations = await getStations<LocalizedStation[]>({
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

  const stationScreenTranslations = await getStationScreenTranslations(
    getLocaleOrThrow(context.locale)
  )

  const translation = Object.assign(stationScreenTranslations, {
    title: interpolateString(stationScreenTranslations.title, {
      stationName: station.stationName[locale]
    }),
    notFound: interpolateString(stationScreenTranslations.notFound, {
      stationName: station.stationName[locale]
    }),
    description: interpolateString(stationScreenTranslations.description, {
      stationName: station.stationName[locale]
    })
  })

  return {
    props: { station, translation, locale }
  }
}
