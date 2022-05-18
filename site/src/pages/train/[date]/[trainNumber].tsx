import type { TrainLongName } from '@junat/cms'
import type { GetServerSidePropsContext } from 'next'

import Head from 'next/head'
import DefaultError from 'next/error'
import { useRouter } from 'next/router'

import { useMemo } from 'react'

import { getTrainLongNames, getTrainPage } from '@junat/cms'

import { SingleTimetable } from '@junat/ui'
import useLiveTrain from '@hooks/use_live_train.hook'
import WebmanifestMeta from '@components/WebmanifestMeta'

import Page from '@layouts/Page'

import { getLocaleOrThrow } from '@utils/get_locale_or_throw'

import constants from 'src/constants'
import { useStationsQuery } from 'src/features/stations/stations_slice'

interface TrainPageProps {
  longNames: TrainLongName[]
  trainNumber: number
  departureDate: string
  cancelled: string
}

export default function TrainPage({
  longNames,
  trainNumber,
  departureDate,
  cancelled
}: TrainPageProps) {
  const [train, error] = useLiveTrain({
    trainNumber,
    departureDate
  })
  const router = useRouter()
  const locale = getLocaleOrThrow(router.locale)

  const { data: stations } = useStationsQuery()

  const longName = useMemo(() => {
    if (train) {
      return longNames.find(longName => longName.code === train.trainType)?.name
    }
  }, [longNames, train])

  return (
    <>
      <Head>
        <title>{longName && `${longName} ${trainNumber}`}</title>
      </Head>
      <WebmanifestMeta
        startUrl={router.asPath.replace(/\d{4}-\d{2}-\d{2}/, 'latest')}
        name={`${longName} ${trainNumber} | ${constants.SITE_NAME}`}
        shortName={`${longName} ${trainNumber}`}
        shouldRender={longName !== undefined}
      />
      <main>
        <header>
          <h1>{longName && `${longName} ${trainNumber}`}</h1>
        </header>

        {train && stations && (
          <SingleTimetable
            cancelledText={cancelled}
            timetableRows={train.timeTableRows}
            locale={locale}
            stations={stations}
          />
        )}
        {error && <DefaultError statusCode={404} />}
      </main>
    </>
  )
}

TrainPage.layout = Page

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const locale = getLocaleOrThrow(context.locale)

  const longNames = await getTrainLongNames(locale)
  const { cancelled } = await getTrainPage(locale)

  const departureDate = context.query.date as unknown as string
  const trainNumber = context.query.trainNumber as unknown as string

  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=31536000, stale-while-revalidate'
  )

  return {
    props: {
      longNames,
      trainNumber,
      departureDate,
      cancelled
    }
  }
}
