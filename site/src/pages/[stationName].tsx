import type {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult
} from 'next'
import type { ParsedUrlQuery } from 'node:querystring'
import type { LocalizedStation, Station, Train } from '~digitraffic'
import type { Translation } from '../types/station_screen_translations'

import { useEffect, useRef, useState } from 'react'

import { getStationPath, getLiveTrains, sortTrains } from '~digitraffic'

import { useRouter } from 'next/router'
import Head from 'next/head'

import { getStations } from '../../lib/get_stations'

import { getLocaleOrThrow } from '../utils/get_locale_or_throw'
import { interpolateString } from '../utils/interpolate_string'
import { camelCaseKeys } from '../utils/camel_case_keys'

import TimetableRow from '../components/TimetableRow'
import FetchTrainsButton from '../components/FetchTrainsButton'

interface StationPageProps {
  station: LocalizedStation
  stations: LocalizedStation[]
  translation: Translation
}

export default function StationPage({
  station,
  stations,
  translation
}: StationPageProps) {
  const router = useRouter()
  const locale = getLocaleOrThrow(router.locale)

  const [{ trains, empty }, setTrains] = useState<{
    trains: Train[]
    empty: boolean
  }>({
    trains: [],
    empty: false
  })

  const [isDisabled, setIsDisabled] = useState(false)
  const clickedTimes = useRef(0)

  useEffect(() => {
    getLiveTrains(station.stationShortCode).then(trains => {
      setTrains({ trains, empty: trains.length === 0 })
    })
  }, [station.stationShortCode])

  const fetchTrains = async () => {
    setIsDisabled(true)

    const departingTrains = ++clickedTimes.current * 100

    // Digitraffic has a hard limit of 600 departing trains.
    if (departingTrains > 600) {
      return
    }

    const trains = await getLiveTrains(station.stationShortCode, {
      departingTrains
    })

    setTrains({ trains, empty: trains.length < 1 })
    setIsDisabled(false)
  }

  return (
    <>
      <Head>
        <title>{translation.title}</title>
        <meta name="description" content={translation.description} />
      </Head>
      <main>
        <header>
          <h1>{station.stationName[locale]}</h1>
          {empty && <p>{translation.notFound}</p>}
          <table>
            <thead>
              {trains.length > 1 && (
                <tr>
                  <td>{translation.destination}</td>
                  <td>{translation.departureTime}</td>
                  <td>{translation.track}</td>
                  <td>{translation.train}</td>
                </tr>
              )}
            </thead>
            <tbody>
              {trains.length > 1 &&
                sortTrains(trains, station.stationShortCode, 'DEPARTURE').map(
                  train => {
                    return (
                      <TimetableRow
                        stations={stations}
                        locale={locale}
                        train={train}
                        stationShortCode={station.stationShortCode}
                        key={`${train.trainNumber}-${train.version}`}
                      />
                    )
                  }
                )}
            </tbody>
          </table>
          <FetchTrainsButton
            disabled={isDisabled}
            visible={trains.length > 1 && clickedTimes.current < 6}
            handleClick={fetchTrains}
          />
        </header>
      </main>
    </>
  )
}

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

  return { props: { station, stations, translation } }
}
