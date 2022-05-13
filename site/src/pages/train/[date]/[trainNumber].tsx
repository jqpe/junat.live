import type { TrainLongName } from '@typings/train_long_name'
import type { GetServerSidePropsContext } from 'next'

import Head from 'next/head'
import DefaultError from 'next/error'
import { useRouter } from 'next/router'

import { useMemo } from 'react'

import { getTrainLongNames } from '@junat/cms'

import SingleTimetable from '@components/SingleTimetable'
import useLiveTrain from '@hooks/use_live_train.hook'
import WebmanifestMeta from '@components/WebmanifestMeta'

import Page from '@layouts/Page'

import { getLocaleOrThrow } from '@utils/get_locale_or_throw'

import constants from 'src/constants'

interface TrainPageProps {
  longNames: TrainLongName[]
  trainNumber: number
  departureDate: string
}

export default function TrainPage({
  longNames,
  trainNumber,
  departureDate
}: TrainPageProps) {
  const [train, error] = useLiveTrain({
    trainNumber,
    departureDate
  })
  const router = useRouter()

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

        {train && <SingleTimetable timetableRows={train.timeTableRows} />}
        {error && <DefaultError statusCode={404} />}
      </main>
    </>
  )
}

TrainPage.layout = Page

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const longNames = await getTrainLongNames(getLocaleOrThrow(context.locale))
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
      departureDate
    }
  }
}
