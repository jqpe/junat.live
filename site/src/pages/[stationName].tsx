import type {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult
} from 'next'
import type { ParsedUrlQuery } from 'node:querystring'
import type { Station, LocalizedStation } from '~digitraffic'
import type { Translation } from '@typings/station_screen_translations'

import Head from 'next/head'
import { useMemo, useRef, useState } from 'react'

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

interface StationPageProps {
  station: LocalizedStation
  stations: LocalizedStation[]
  translation: Translation
  locale: 'fi' | 'en' | 'sv'
}

export default function StationPage({
  station,
  stations,
  translation,
  locale
}: StationPageProps) {
  const [departingTrains, setDepartingTrains] = useState(20)

  const {
    data: trains = [],
    isLoading,
    isSuccess
  } = useTrainsQuery({
    stationShortCode: station.stationShortCode,
    options: { departingTrains }
  })

  const empty = isSuccess && trains.length === 0
  const clickedTimes = useRef(0)

  const handleClick = () => {
    setDepartingTrains(++clickedTimes.current * 100)
  }
  const visible = useMemo(() => {
    return (
      isLoading ||
      (trains.length > 19 &&
        !(clickedTimes.current > 0 && trains.length % 100 !== 0))
    )
  }, [isLoading, trains.length])

  return (
    <>
      <Head>
        <title>{translation.title}</title>
        <meta name="description" content={translation.description} />
      </Head>
      <main>
        <StationPageHeader heading={station.stationName[locale]} />
        {empty && <p>{translation.notFound}</p>}
        <Timetable
          locale={locale}
          stations={stations}
          trains={trains}
          translation={translation}
          stationShortCode={station.stationShortCode}
        />
        <FetchTrainsButton
          isLoading={isLoading}
          disabled={isLoading}
          visible={visible}
          text={translation.fetchTrainsButton}
          handleClick={handleClick}
        />
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

  const json: { data: Translation[] } = await response.json()

  const data = json.data.find(translation => translation.language === locale)

  if (!data) {
    throw new Error(`Couldn't get translation for ${locale}`)
  }
  const content = camelCaseKeys<Translation>(data)

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

  return { props: { station, stations, translation, locale } }
}
