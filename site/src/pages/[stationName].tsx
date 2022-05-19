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
import Timetable from '@components/Timetable'

import Page from '@layouts/Page'

import { useQuery } from 'react-query'
import { useAppDispatch, useAppSelector } from 'src/app/hooks'

import { styled } from '@junat/stitches'

import { increment } from '../features/station_page/station_page_slice'
import { useRouter } from 'next/router'
import useLiveTrains from '@hooks/use_live_trains.hook'
import dynamic from 'next/dynamic'
import WebmanifestMeta from '@components/WebmanifestMeta'
import constants from 'src/constants'
import { fetchLiveTrains, fetchStations } from '@services/digitraffic.service'

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
  const count = useAppSelector(({ stationPage }) => stationPage.count)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { data: stations = [] } = useQuery('stations', fetchStations)

  const {
    data: initialTrains = [],
    isLoading,
    isSuccess
  } = useQuery(
    `trains/${count}${router.asPath}`,
    async () =>
      await fetchLiveTrains({
        stationShortCode: station.stationShortCode,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        localizedStations: stations!,
        departingTrains: count > 0 ? count * 100 : 20
      }),
    {
      enabled: stations.length > 0
    }
  )

  const empty = isSuccess && initialTrains.length === 0

  const visible = useMemo(() => {
    return (
      (isLoading && initialTrains.length > 0) ||
      (initialTrains.length > 19 &&
        !(count > 0 && initialTrains.length % 100 !== 0))
    )
  }, [isLoading, initialTrains.length, count])

  const [trains, setTrains] = useLiveTrains({
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
      <WebmanifestMeta
        startUrl={router.asPath}
        name={`${station.stationName[locale]} | ${constants.SITE_NAME}`}
        shortName={station.stationName[locale]}
      />
      <StyledStationPage>
        <StationPageHeader heading={station.stationName[locale]} />
        {empty && <p>{translation.notFound}</p>}
        <Timetable
          locale={locale}
          stations={stations || []}
          trains={trains}
          translation={translation}
          stationShortCode={station.stationShortCode}
        />
        <FetchTrainsButtonWrapper>
          <FetchTrainsButton
            isLoading={isLoading}
            loadingText={translation.fetchTrainsButtonLoading}
            disabled={isLoading}
            visible={visible}
            text={translation.fetchTrainsButton}
            handleClick={() => dispatch(increment())}
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
      omitInactive: false
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
    omitInactive: false
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

  return { props: { station, translation, locale } }
}
