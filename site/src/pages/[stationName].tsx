import type {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult
} from 'next'
import type { ParsedUrlQuery } from 'node:querystring'
import type { Station, LocalizedStation } from '~digitraffic'
import type { StationScreenTranslations } from '@typings/station_screen_translations'

import Head from 'next/head'
import { useEffect, useMemo, useRef } from 'react'

import { getStationPath } from '~digitraffic'

import { getStations } from '../../lib/get_stations'

import FetchTrainsButton from '@components/FetchTrainsButton'
import StationPageHeader from '@components/StationPageHeader'
import Timetable from '@components/Timetable'

import StationPageLayout from '@layouts/StationPageLayout'

import { getLocaleOrThrow } from '@utils/get_locale_or_throw'
import { interpolateString } from '@utils/interpolate_string'
import { camelCaseKeys } from '@utils/camel_case_keys'

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

interface StationPageProps {
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
    data: trains = [],
    isFetching,
    isSuccess
  } = useTrainsQuery(
    {
      stationShortCode: station.stationShortCode,
      options: { departingTrains: count > 0 ? count * 100 : 20 },
      stations: stations!
    },
    { skip: !stations || stations?.length === 0 }
  )

  const empty = isSuccess && trains.length === 0

  const visible = useMemo(() => {
    return (
      (isFetching && trains.length > 0) ||
      (trains.length > 19 && !(count > 0 && trains.length % 100 !== 0))
    )
  }, [isFetching, trains.length, count])

  return (
    <>
      <Head>
        <title>{translation.title}</title>
        <meta name="description" content={translation.description} />
      </Head>
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
            className={styles.fetchTrainsButton}
            isLoading={isFetching}
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

StationPage.layout = StationPageLayout

export const getStaticPaths = async (
  context: GetStaticPropsContext
): Promise<GetStaticPathsResult> => {
  let paths: {
    params: ParsedUrlQuery
    locale?: string | undefined
  }[] = []

  if (context.locales) {
    const supportedLocales = context.locales.filter(locale =>
      /(fi)|(en)|(sv)/.test(locale)
    ) as ['fi' | 'en' | 'sv']

    for (const locale of supportedLocales) {
      paths = [
        ...paths,
        ...(
          await getStations<LocalizedStation[]>({ locale, omitInactive: false })
        ).map(station => ({
          params: {
            stationName: getStationPath(station.stationName[locale]!)
          },
          locale
        }))
      ]
    }
  } else {
    paths = (await getStations<Station[]>({ omitInactive: false })).map(
      station => ({
        params: { stationName: getStationPath(station.stationName) },
        locale: context.defaultLocale
      })
    )
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

  const station = stations.find(
    station =>
      getStationPath(station.stationName[locale]!) === params.stationName
  )

  if (!station) {
    return { notFound: true }
  }

  if (!process.env.CMS_TOKEN) {
    throw new Error('CMS_TOKEN environment variable must be a value.')
  }

  const headers = new Headers({
    Authorization: `Bearer ${process.env.CMS_TOKEN}`
  })

  const response = await fetch(
    'https://cms.junat.live/items/station_screen_translations',
    { headers }
  )

  const json: { data: StationScreenTranslations[] } = await response.json()

  const data = json.data.find(translation => translation.language === locale)

  if (!data) {
    throw new Error(`Couldn't get translation for ${locale}`)
  }
  const content = camelCaseKeys<StationScreenTranslations>(data)

  const translation = Object.assign(content, {
    title: interpolateString(content.title, {
      stationName: station.stationName[locale]
    }),
    notFound: interpolateString(content.notFound, {
      stationName: station.stationName[locale]
    }),
    description: interpolateString(content.description, {
      stationName: station.stationName[locale]
    })
  })

  return { props: { station, translation, locale } }
}
