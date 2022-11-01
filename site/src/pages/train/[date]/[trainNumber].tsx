import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

import React from 'react'

import Head from 'next/head'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import { useQuery } from '@tanstack/react-query'
import { fetchSingleTrain } from '@junat/digitraffic'

import Webmanifest from '@components/common/webmanifest'
import Header from '@components/common/header'

import { useLiveTrainSubscription } from '@hooks/use_live_train_subscription'
import { useStations } from '@hooks/use_stations'

import { motion, AnimatePresence } from 'framer-motion'

import Page from '@layouts/page'

import { getLocale } from '@utils/get_locale'

import constants from 'src/constants'
import translate from '@utils/translate'
import { Code, getTrainType } from '@utils/get_train_type'

import interpolateString from '@utils/interpolate_string'

const DefaultError = dynamic(() => import('next/error'))

const SingleTimetable = dynamic(
  () => import('@components/timetables/single_timetable')
)
const Notification = dynamic(() =>
  import('@components/elements/notification').then(mod => mod.Notification)
)
const PrimaryButton = dynamic(() =>
  import('@components/buttons/primary').then(mod => mod.PrimaryButton)
)

interface TrainPageProps {
  trainNumber: number
  departureDate: string
}

export default function TrainPage({
  trainNumber,
  departureDate
}: TrainPageProps) {
  const dateInPast = (() => {
    if (departureDate === 'latest') {
      return false
    }

    return Date.parse(departureDate) < Date.now()
  })()
  const [date, setDate] = React.useState(!dateInPast ? departureDate : 'latest')

  const { data: initialTrain, refetch } = useQuery(
    ['train', date, trainNumber],
    async () => {
      return fetchSingleTrain({
        trainNumber,
        date
      })
    }
  )

  const [subscriptionTrain, error] = useLiveTrainSubscription({
    initialTrain,
    enabled: initialTrain !== undefined
  })

  const train =
    dateInPast && departureDate !== 'latest'
      ? initialTrain
      : subscriptionTrain || initialTrain

  const router = useRouter()
  const locale = getLocale(router.locale)

  const formattedDate = Intl.DateTimeFormat(locale, {
    dateStyle: 'long'
  }).format(new Date(Date.parse(departureDate)))

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
          <AnimatePresence>
            {trainType && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Header heading={`${trainType} ${trainNumber}`} />
              </motion.div>
            )}
          </AnimatePresence>
          {dateInPast && (
            <Notification css={{ marginBottom: '$m' }}>
              {interpolateString(t('$showingLatest'), { date: formattedDate })}
              <PrimaryButton
                size="xs"
                onClick={() => {
                  setDate(
                    dateInPast && date === 'latest' ? departureDate : 'latest'
                  )

                  refetch()
                }}
              >
                {date !== 'latest' && dateInPast
                  ? t('showLatest')
                  : t('showDeparted')}
              </PrimaryButton>
            </Notification>
          )}
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

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<TrainPageProps> | undefined> {
  const departureDate = String(context.query.date)
  const trainNumber = Number(context.query.trainNumber)

  // If departureDate is not a parseable date or latest
  const unparseableDate = Number.isNaN(Date.parse(departureDate))
  if (unparseableDate && departureDate !== 'latest') {
    return { notFound: true }
  }

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
