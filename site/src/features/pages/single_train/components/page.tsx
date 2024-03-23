import React from 'react'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { Head } from '~/components/head'
import { Header } from '~/components/header'

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

import { ErrorMessageWithRetry } from '~/components/error_message'
import { Spinner } from '~/components/spinner'
import { ROUTES } from '~/constants/locales'
import { useLiveTrainLocations } from '~/lib/digitraffic/hooks/use_live_train_locations'
import { getDepartureDate } from '../helpers'
import { RouteLayer } from '~/features/map/components/route_layer'
import { TrainLayer } from '~/features/map/components/train_layer'

const DefaultError = dynamic(() => import('next/error'))

const DatePicker = dynamic(() =>
  import('./date_picker').then(mod => mod.DatePicker)
)

const SingleTimetable = dynamic(() => import('~/components/single_timetable'))
const Map = dynamic(() => import('@features/map').then(mod => mod.Map), {
  ssr: false
})

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
    // Is initial train truthy? ie. defined.
    enabled: Boolean(initialTrain)
  })

  const train = subscriptionTrain || initialTrain

  const { data: stations, ...stationsQuery } = useStations()

  const trainType = train && getTrainType(train?.trainType as Code, locale)

  const realtimeLocation = useLiveTrainLocations({
    trainNumber: initialTrain?.trainNumber
  })

  if (isFetched && train === null) {
    return <DefaultError statusCode={404} />
  }

  if (!(trainNumber && trainType && departureDate)) {
    return <Spinner fixedToCenter />
  }

  const errorQuery = getErrorQuery([stationsQuery, singleTrainQuery])

  let [longitude, latitude] = train.trainLocation?.location ?? [0, 0]
  if (realtimeLocation) {
    ;[longitude, latitude] = realtimeLocation.location.coordinates
  }

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

          <Map longitude={longitude} latitude={latitude}>
            <RouteLayer train={initialTrain} />
            <TrainLayer longitude={longitude} latitude={latitude} />
          </Map>

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
