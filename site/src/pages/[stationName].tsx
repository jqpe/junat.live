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
import { useEffect, useMemo, useRef } from 'react'

import StationPageHeader from '@components/StationPageHeader'
import Timetable from '@components/Timetable'

import Page from '@layouts/Page'

import { useTrainsQuery } from 'src/features/digitraffic/digitraffic_slice'
import { useAppDispatch, useAppSelector } from 'src/app/hooks'

import { useStationsQuery } from '../features/stations/stations_slice'

import styles from './StationPage.module.scss'

import {
  increment,
  set,
  setScroll
} from '../features/station_page/station_page_slice'
import { useRouter } from 'next/router'
import useLiveTrains from '@hooks/use_live_trains.hook'
import dynamic from 'next/dynamic'
import WebmanifestMeta from '@components/WebmanifestMeta'
import constants from 'src/constants'

const FetchTrainsButton = dynamic(() => import('@components/FetchTrainsButton'))

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
  const [count, path, scrollY] = useAppSelector(state => [
    state.stationPage.value,
    state.stationPage.path,
    state.stationPage.scrollY
  ])
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { data: stations } = useStationsQuery()

  const scrollPosition = useRef(0)

  useEffect(() => {
    window.scrollTo({ top: scrollY })

    const updateScrollPosition = () => {
      if (window.scrollY !== 0) {
        scrollPosition.current = window.scrollY
      }
    }

    window.addEventListener('scroll', updateScrollPosition)

    return function cleanup() {
      window.requestAnimationFrame(() => {
        window.removeEventListener('scroll', updateScrollPosition)
        dispatch(setScroll(scrollPosition.current))
      })
    }
  }, [dispatch, scrollY])

  useEffect(() => {
    const localePath = `${router.locale ?? ''}${router.asPath}`

    if (path !== localePath) {
      dispatch(set({ path: localePath, value: 0 }))
      dispatch(setScroll(0))
    }
  }, [dispatch, path, router.asPath, router.locale])

  const {
    data: initialTrains = [],
    isFetching,
    isSuccess
  } = useTrainsQuery(
    {
      stationShortCode: station.stationShortCode,
      options: { departingTrains: count > 0 ? count * 100 : 20 }
    },
    { skip: !stations || stations?.length === 0 }
  )

  const empty = isSuccess && initialTrains.length === 0

  const visible = useMemo(() => {
    return (
      (isFetching && initialTrains.length > 0) ||
      (initialTrains.length > 19 &&
        !(count > 0 && initialTrains.length % 100 !== 0))
    )
  }, [isFetching, initialTrains.length, count])

  const [trains, setTrains] = useLiveTrains({
    stationShortCode: station.stationShortCode,
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
      <main className={styles.stationPage}>
        <StationPageHeader heading={station.stationName[locale]} />
        {empty && <p>{translation.notFound}</p>}
        <Timetable
          locale={locale}
          stations={stations || []}
          trains={trains}
          translation={translation}
          stationShortCode={station.stationShortCode}
        />
        <div className={styles.fetchTrainsButtonWrapper}>
          <FetchTrainsButton
            isLoading={isFetching}
            loadingText={translation.fetchTrainsButtonLoading}
            disabled={isFetching}
            visible={visible}
            text={translation.fetchTrainsButton}
            handleClick={() => dispatch(increment())}
          />
        </div>
      </main>
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
