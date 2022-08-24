import type { GetServerSidePropsContext } from 'next'

import React from 'react'

import Head from 'next/head'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import { useQuery } from '@tanstack/react-query'
import { fetchSingleTrain } from '@junat/digitraffic'

import Webmanifest from '@components/common/Webmanifest'
import Header from '@components/common/Header'

import { useLiveTrainSubscription } from '@hooks/use_live_train_subscription'
import { useStations } from '@hooks/use_stations'

import Page from '@layouts/Page'

import { getLocale } from '@utils/get_locale'

import constants from 'src/constants'
import translate from '@utils/translate'
import { Code, getTrainType } from '@utils/get_train_type'

const SingleTimetable = dynamic(() => import('@components/SingleTimetable'))
const DefaultError = dynamic(() => import('next/error'))

interface TrainPageProps {
  trainNumber: number
  departureDate: string
}

export default function TrainPage({
  trainNumber,
  departureDate
}: TrainPageProps) {
  const { data: initialTrain } = useQuery(
    ['train', departureDate, trainNumber],
    async () => {
      return fetchSingleTrain({ trainNumber, date: departureDate })
    }
  )

  const [subscriptionTrain, error] = useLiveTrainSubscription({
    initialTrain,
    enabled: initialTrain !== undefined
  })

  const train = subscriptionTrain || initialTrain

  const router = useRouter()
  const locale = getLocale(router.locale)

  const t = translate(locale)

  const { data: stations } = useStations()

  const trainType = React.useMemo(() => {
    if (train) {
      return getTrainType(train.trainType as Code, locale)
    }
  }, [locale, train])

  return (
    <>
      <Head>
        <title>{trainType && `${trainType} ${trainNumber}`}</title>
      </Head>
      <Webmanifest
        startUrl={router.asPath.replace(/\d{4}-\d{2}-\d{2}/, 'latest')}
        name={`${trainType} ${trainNumber} | ${constants.SITE_NAME}`}
        shortName={`${trainType} ${trainNumber}`}
        shouldRender={trainType !== undefined}
      />
      <main>
        <>
          <Header heading={trainType && `${trainType} ${trainNumber}`} />
          {train && stations && (
            <SingleTimetable
              cancelledText={t('cancelled')}
              timetableRows={train.timeTableRows}
              locale={locale}
              stations={stations}
            />
          )}
          {error && <DefaultError statusCode={404} />}
        </>
      </main>
    </>
  )
}

TrainPage.layout = Page

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const departureDate = context.query.date as unknown as string
  const trainNumber = context.query.trainNumber as unknown as string

  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=31536000, stale-while-revalidate'
  )

  return {
    props: {
      trainNumber,
      departureDate
    }
  }
}
