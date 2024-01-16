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

import { Marker } from 'react-map-gl/maplibre'
import { ErrorMessageWithRetry } from '~/components/error_message'
import { Spinner } from '~/components/spinner'
import { ROUTES } from '~/constants/locales'
import { useLiveTrainLocations } from '~/lib/digitraffic/hooks/use_live_train_locations'
import { getDepartureDate } from '../helpers'
import { RouteLayer } from '~/features/map/components/route_layer'

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

  const trainMarkerLabel: string | undefined = React.useMemo(() => {
    if (!train) {
      return
    }

    if (train.commuterLineId) {
      return `${train.commuterLineId}`
    }

    return `${train.trainNumber}`
  }, [train])

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

          <Map longitude={longitude} latitude={latitude} followCoords>
            <Marker latitude={latitude} longitude={longitude}>
              <div className="h-[32px] w-[32px] flex text-center justify-center items-center bg-gray-800 border-primary-500 rounded-full">
                <span>{trainMarkerLabel}</span>
              </div>
            </Marker>
            <RouteLayer train={initialTrain} />
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
