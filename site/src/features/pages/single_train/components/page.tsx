import React from 'react'

import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import { useQuery } from '@tanstack/react-query'
import { fetchSingleTrain } from '@junat/digitraffic'

import Header from '@components/common/header'
import { Head } from '@components/common/head'

import { useLiveTrainSubscription } from '@hooks/use_live_train_subscription'
import { useStations } from '@hooks/use_stations'

import { motion, AnimatePresence } from 'framer-motion'

import Page from '@layouts/page'

import { getLocale } from '@utils/get_locale'

import translate from '@utils/translate'
import { Code, getTrainType } from '@utils/get_train_type'

import interpolateString from '@utils/interpolate_string'

import { ROUTES } from '~/constants/locales'
import { getFormattedDate } from '../helpers'

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

export interface TrainPageProps {
  trainNumber: number
  departureDate: string
}

export function TrainPage({ trainNumber, departureDate }: TrainPageProps) {
  const dateInPast = (() => {
    if (departureDate === 'latest') {
      return false
    }

    return Date.parse(departureDate) < Date.now()
  })()
  const [date, setDate] = React.useState(dateInPast ? 'latest' : departureDate)

  const {
    data: initialTrain,
    refetch,
    isFetched
  } = useQuery(['train', date, trainNumber], async () => {
    return fetchSingleTrain({
      trainNumber,
      date
    })
  })

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

  const formattedDate = getFormattedDate(departureDate)

  const t = translate(locale)

  const { data: stations } = useStations()

  const trainType = React.useMemo(() => {
    if (train) {
      return getTrainType(train.trainType as Code, locale)
    }
  }, [locale, train])

  return (
    <>
      <Head
        title={trainType ? `${trainType} ${trainNumber}` : ''}
        description={interpolateString(t('trainPage', 'meta', '$description'), {
          trainType,
          trainNumber
        })}
        path={router.asPath}
        locale={getLocale(router.locale)}
        replace={ROUTES}
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
          {(error || (!initialTrain && isFetched)) && (
            <DefaultError statusCode={404} />
          )}
        </>
      </main>
    </>
  )
}

TrainPage.layout = Page
