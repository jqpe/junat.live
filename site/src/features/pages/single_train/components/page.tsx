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

import Calendar from './calendar.svg'
import { Dialog, DialogButton } from '~/components/elements/dialog'

const DefaultError = dynamic(() => import('next/error'))

const SingleTimetable = dynamic(
  () => import('@components/timetables/single_timetable')
)

export function TrainPage() {
  const router = useRouter()

  const departureDate = router.query.date
    ? String(router.query.date)
    : undefined

  const trainNumber = router.query.trainNumber
    ? Number(router.query.trainNumber)
    : undefined

  const { data: initialTrain, isFetched } = useQuery(
    ['train', departureDate, trainNumber],
    async () => {
      if (!(departureDate && trainNumber)) {
        throw 'departureDate and trainNumber should both be defined'
      }

      return fetchSingleTrain({
        trainNumber,
        date: departureDate
      })
    },
    {
      enabled: Boolean(trainNumber && departureDate)
    }
  )

  const [subscriptionTrain, error] = useLiveTrainSubscription({
    initialTrain,
    enabled: initialTrain !== undefined
  })

  const train = subscriptionTrain || initialTrain

  const locale = getLocale(router.locale)

  const t = translate(locale)

  const { data: stations } = useStations()

  const trainType = React.useMemo(() => {
    if (train) {
      return getTrainType(train.trainType as Code, locale)
    }
  }, [locale, train])

  const formattedDate =
    departureDate === 'latest'
      ? t('today')
      : Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(
          Date.parse(
            `${departureDate === undefined ? new Date() : departureDate}`
          )
        )

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
          <DialogButton
            css={{
              gap: '10px',
              display: 'flex',
              alignItems: 'center',
              '& svg': { fill: '$slateGray700' },
              '&:hover svg': { fill: '$slateGray400' }
            }}
          >
            <Calendar />
            {interpolateString(t('$schedulesFor'), { date: formattedDate })}
          </DialogButton>
          <Dialog
            title={t('chooseDate')}
            description={t('changeDepartureDate')}
          />
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
