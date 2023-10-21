import React from 'react'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { Header } from '@components/common/header'
import { Head } from '~/components/head'

import {
  useSingleTrain,
  useSingleTrainSubscription,
  useStations
} from '~/lib/digitraffic'
import { getErrorQuery } from '~/lib/react_query'

import Page from '@layouts/page'

import { getLocale } from '@utils/get_locale'

import { Code, getTrainType } from '@utils/train'
import translate from '@utils/translate'

import interpolateString from '@utils/interpolate_string'

import { Spinner } from '~/components/elements/spinner'
import { ErrorMessageWithRetry } from '~/components/error_message'
import { ROUTES } from '~/constants/locales'
import { getDepartureDate } from '../helpers'

const DefaultError = dynamic(() => import('next/error'))

const DatePicker = dynamic(() =>
  import('./date_picker').then(mod => mod.DatePicker)
)

const SingleTimetable = dynamic(
  () => import('@components/timetables/single_timetable')
)

export function TrainPage() {
  const router = useRouter()
  const [dialogIsOpen, setDialogIsOpen] = React.useState(false)
  const [userDate, setUserDate] = React.useState<string>()

  const locale = getLocale(router.locale)
  const t = translate(locale)

  const departureDate = getDepartureDate({
    userProvided: userDate,
    default: router.query.date
  })

  const trainNumber = router.query.trainNumber
    ? Number(router.query.trainNumber)
    : undefined

  const {
    data: initialTrain,
    isFetched,
    ...singleTrainQuery
  } = useSingleTrain({
    trainNumber,
    departureDate
  })

  const [subscriptionTrain, error] = useSingleTrainSubscription({
    initialTrain: initialTrain === null ? undefined : initialTrain,
    enabled: initialTrain !== undefined && initialTrain !== null
  })

  const train = subscriptionTrain || initialTrain

  const { data: stations, ...stationsQuery } = useStations()

  const trainType = train && getTrainType(train?.trainType as Code, locale)

  if (isFetched && train === null) {
    return <DefaultError statusCode={404} />
  }

  if (!(trainNumber && trainType && departureDate)) {
    return <Spinner fixedToCenter />
  }

  const errorQuery = getErrorQuery([stationsQuery, singleTrainQuery])

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
          <Header heading={`${trainType} ${trainNumber}`} />

          <DatePicker
            departureDate={departureDate}
            open={dialogIsOpen}
            locale={locale}
            onOpenChange={setDialogIsOpen}
            handleChoice={setUserDate}
          />

          {errorQuery !== undefined && (
            <ErrorMessageWithRetry
              error={errorQuery.error}
              locale={locale}
              onRetryButtonClicked={() => errorQuery.refetch()}
            />
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
